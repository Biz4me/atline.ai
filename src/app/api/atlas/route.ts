import { after, NextRequest } from "next/server"
import { getPayload } from "payload"
import configPromise from "@payload-config"
import Anthropic from "@anthropic-ai/sdk"

export const runtime = "nodejs"

const ATLAS_SYSTEM = `Tu es Atlas, un coach MLM expert, chaleureux et orienté résultats.
Tu accompagnes les distributeurs MLM à performer dans leur business, quelle que soit leur société.

Tu as accès à des bases de connaissances spécialisées :
- [Base Atlas] : coaching MLM général, mindset, prospection, leadership
- [Proline — Plan de rémunération] : détails des plans de compensation, rangs, qualifications, bonus
- [Markline — Compétences] : formations, scripts, techniques de vente et recrutement
Utilise ces informations quand elles sont présentes dans le contexte, sans jamais mentionner leur source.

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

async function searchAgent(
  vpsUrl: string,
  vpsKey: string,
  query: string,
  agent: string,
  topK: number,
  userId?: string
): Promise<string[]> {
  try {
    const form = new FormData()
    form.append("query", query)
    form.append("agent", agent)
    form.append("top_k", String(topK))
    if (userId && agent === "atlas") form.append("user_id", userId)

    const res = await fetch(`${vpsUrl}/search`, {
      method: "POST",
      headers: { Authorization: `Bearer ${vpsKey}` },
      body: form,
      signal: AbortSignal.timeout(10000),
    })
    if (!res.ok) return []
    const json = await res.json()
    return (json.chunks as string[]) ?? []
  } catch {
    return []
  }
}

async function getRagContext(query: string, userId?: string): Promise<string> {
  const vpsUrl = process.env.VPS_INGEST_URL
  const vpsKey = process.env.VPS_INGEST_KEY
  if (!vpsUrl || !vpsKey) return ""

  const [atlasChunks, prolineChunks, marklineChunks] = await Promise.all([
    searchAgent(vpsUrl, vpsKey, query, "atlas", 4, userId),
    searchAgent(vpsUrl, vpsKey, query, "proline", 3),
    searchAgent(vpsUrl, vpsKey, query, "markline", 3),
  ])

  const sections: string[] = []
  if (atlasChunks.length)
    sections.push(`[Base Atlas]\n${atlasChunks.join("\n\n---\n\n")}`)
  if (prolineChunks.length)
    sections.push(`[Proline — Plan de rémunération]\n${prolineChunks.join("\n\n---\n\n")}`)
  if (marklineChunks.length)
    sections.push(`[Markline — Compétences]\n${marklineChunks.join("\n\n---\n\n")}`)

  return sections.join("\n\n")
}

async function updateUserMemory(
  userId: string,
  userMessage: string,
  assistantText: string
): Promise<void> {
  const vpsUrl = process.env.VPS_INGEST_URL
  const vpsKey = process.env.VPS_INGEST_KEY
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

  // Extract structured info from the exchange
  let extracted: Partial<UserMemory> = {}
  try {
    const extraction = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 512,
      messages: [
        {
          role: "user",
          content: `Analyse cet échange de coaching MLM et extrait les informations sur l'utilisateur.
Retourne UNIQUEMENT un JSON valide (pas de markdown, pas d'explication).
N'inclus que les champs pour lesquels tu as des informations claires.

Champs possibles :
{
  "prenom": "string",
  "societe": "string (nom de sa société MLM)",
  "niveau": "string (débutant | intermédiaire | avancé)",
  "objectif_revenu": number (mensuel en euros),
  "points_forts": ["string"],
  "axes_travail": ["string"],
  "last_session_summary": "string (1-2 phrases résumant ce dont on a parlé)"
}

Message utilisateur : ${userMessage}
Réponse Atlas : ${assistantText}`,
        },
      ],
    })

    const raw =
      extraction.content[0].type === "text" ? extraction.content[0].text : ""
    const match = raw.match(/\{[\s\S]*\}/)
    if (match) extracted = JSON.parse(match[0])
  } catch {
    // extraction failed — skip profile update
  }

  // Update Payload userMemory (merge, don't replace)
  if (Object.keys(extracted).length > 0) {
    try {
      const payload = await getPayload({ config: configPromise })
      const user = await payload.findByID({
        collection: "users",
        id: userId,
        depth: 0,
      })
      const existing: UserMemory = (user as any)?.userMemory ?? {}
      const merged: UserMemory = { ...existing, ...extracted }

      // Merge arrays without duplicates
      if (extracted.points_forts && existing.points_forts) {
        merged.points_forts = [
          ...new Set([...existing.points_forts, ...extracted.points_forts]),
        ]
      }
      if (extracted.axes_travail && existing.axes_travail) {
        merged.axes_travail = [
          ...new Set([...existing.axes_travail, ...extracted.axes_travail]),
        ]
      }

      await payload.update({
        collection: "users",
        id: userId,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        data: { userMemory: merged } as any,
      })
    } catch {
      // non-blocking
    }
  }

  // Store conversation summary in Qdrant via VPS
  if (vpsUrl && vpsKey) {
    try {
      const form = new FormData()
      form.append("user_id", userId)
      form.append("agent", "atlas")
      form.append(
        "text",
        `Utilisateur: ${userMessage}\n\nAtlas: ${assistantText}`
      )
      await fetch(`${vpsUrl}/store`, {
        method: "POST",
        headers: { Authorization: `Bearer ${vpsKey}` },
        body: form,
        signal: AbortSignal.timeout(15000),
      })
    } catch {
      // non-blocking
    }
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
      if (u?.firstName) memoryContext = `Prénom utilisateur : ${u.firstName}\n` + memoryContext
    } catch {
      // non-blocking
    }
  }

  // RAG context (general docs + user memories)
  const ragContext = await getRagContext(message, userId)

  // Build enriched message
  const contextParts: string[] = []
  if (memoryContext) contextParts.push(memoryContext)
  if (ragContext) contextParts.push(ragContext)
  contextParts.push(`[Message]\n${message}`)
  const enrichedMessage = contextParts.join("\n\n")

  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

  const encoder = new TextEncoder()
  let capturedFullText = ""

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
            capturedFullText += token
            const line = `data:${JSON.stringify({ event: "token", data: token })}\n\n`
            controller.enqueue(encoder.encode(line))
          }
        }

        controller.enqueue(encoder.encode("data:[DONE]\n\n"))
      } catch (err) {
        console.error("Atlas stream error:", err)
        controller.enqueue(
          encoder.encode(
            `data:${JSON.stringify({ event: "error", data: "Erreur" })}\n\n`
          )
        )
      } finally {
        controller.close()
      }
    },
  })

  // After response is sent — update user memory in background
  if (userId) {
    after(async () => {
      if (capturedFullText) {
        await updateUserMemory(userId, message, capturedFullText)
      }
    })
  }

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  })
}
