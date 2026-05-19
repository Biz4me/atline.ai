import { NextRequest } from "next/server"
import { getPayload } from "payload"
import configPromise from "@payload-config"
import Anthropic from "@anthropic-ai/sdk"

export const runtime = "nodejs"

const ATLAS_SYSTEM = `Tu es Atlas, un coach MLM expert, chaleureux et orienté résultats.
Tu accompagnes les distributeurs MLM à performer dans leur business, quelle que soit leur société.

Règles de réponse :
- Utilise toujours le prénom si connu
- Max 3 points par message — va à l'essentiel
- Réponds toujours en français
- Fixe des objectifs concrets et mesurables
- Célèbre chaque victoire
- Termine TOUJOURS par une question concrète courte
- Structure tes réponses avec des sauts de ligne entre les idées
- Pour les actions : commence la ligne par →
- Pour les titres de section : utilise **Titre**
- Jamais de listes à puces (- item) — utilise des paragraphes
- Adapte ton conseil à la personnalité du prospect (4 couleurs Schreiter)`

interface UserMemory {
  prenom?: string
  societe?: string
  niveau?: string
  objectif_revenu?: number
  points_forts?: string[]
  axes_travail?: string[]
  last_session_summary?: string
}

function buildMemoryContext(memory: UserMemory): string {
  if (!memory || Object.keys(memory).length === 0) return ""
  const lines: string[] = ["[Profil utilisateur]"]
  if (memory.prenom) lines.push(`Prénom : ${memory.prenom}`)
  if (memory.societe) lines.push(`Société MLM : ${memory.societe}`)
  if (memory.niveau) lines.push(`Niveau : ${memory.niveau}`)
  if (memory.objectif_revenu) lines.push(`Objectif revenu mensuel : ${memory.objectif_revenu}€`)
  if (memory.points_forts?.length) lines.push(`Points forts : ${memory.points_forts.join(", ")}`)
  if (memory.axes_travail?.length) lines.push(`Axes de travail : ${memory.axes_travail.join(", ")}`)
  if (memory.last_session_summary) lines.push(`Dernière session : ${memory.last_session_summary}`)
  return lines.join("\n")
}

async function getRagContext(query: string): Promise<string> {
  const vpsUrl = process.env.VPS_INGEST_URL
  const vpsKey = process.env.VPS_INGEST_KEY
  if (!vpsUrl || !vpsKey) return ""

  try {
    const form = new FormData()
    form.append("query", query)
    form.append("agent", "atlas")
    form.append("top_k", "4")

    const res = await fetch(`${vpsUrl}/search`, {
      method: "POST",
      headers: { Authorization: `Bearer ${vpsKey}` },
      body: form,
      signal: AbortSignal.timeout(10000),
    })
    if (!res.ok) return ""
    const json = await res.json()
    const chunks: string[] = json.chunks ?? []
    if (!chunks.length) return ""
    return `[Base de connaissances]\n${chunks.join("\n\n---\n\n")}`
  } catch {
    return ""
  }
}

export async function POST(req: NextRequest) {
  const { message, sessionId, userId } = await req.json()

  if (!message?.trim()) {
    return new Response("Message requis", { status: 400 })
  }

  // Load user memory
  let memoryContext = ""
  if (userId) {
    try {
      const payload = await getPayload({ config: configPromise })
      const user = await payload.findByID({ collection: "users", id: userId, depth: 0 })
      const u = user as any
      if (u?.userMemory) memoryContext = buildMemoryContext(u.userMemory as UserMemory)
      // Enrich system with user first name if available
      if (u?.firstName) memoryContext = `Prénom utilisateur : ${u.firstName}\n` + memoryContext
    } catch {
      // non-blocking
    }
  }

  // RAG context
  const ragContext = await getRagContext(message)

  // Build user message with context
  const contextParts: string[] = []
  if (memoryContext) contextParts.push(memoryContext)
  if (ragContext) contextParts.push(ragContext)
  contextParts.push(`[Message]\n${message}`)
  const enrichedMessage = contextParts.join("\n\n")

  // Stream from Anthropic
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

  const encoder = new TextEncoder()
  const stream = new ReadableStream({
    async start(controller) {
      try {
        const anthropicStream = await client.messages.stream({
          model: "claude-sonnet-4-6",
          max_tokens: 1024,
          system: ATLAS_SYSTEM,
          messages: [{ role: "user", content: enrichedMessage }],
        })

        for await (const chunk of anthropicStream) {
          if (
            chunk.type === "content_block_delta" &&
            chunk.delta.type === "text_delta"
          ) {
            const token = chunk.delta.text
            const line = `data:${JSON.stringify({ event: "token", data: token })}\n\n`
            controller.enqueue(encoder.encode(line))
          }
        }

        controller.enqueue(encoder.encode("data:[DONE]\n\n"))
      } catch (err) {
        console.error("Atlas stream error:", err)
        controller.enqueue(encoder.encode(`data:${JSON.stringify({ event: "error", data: "Erreur" })}\n\n`))
      } finally {
        controller.close()
      }
    },
  })

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  })
}
