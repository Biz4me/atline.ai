import { NextRequest } from "next/server"
import { getPayload } from "payload"
import configPromise from "@payload-config"

export const runtime = "nodejs"

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

export async function POST(req: NextRequest) {
  const { message, sessionId, userId } = await req.json()

  if (!message?.trim()) {
    return new Response("Message requis", { status: 400 })
  }

  const flowiseUrl = process.env.FLOWISE_URL
  const flowiseFlowId = process.env.FLOWISE_FLOW_ID
  const flowiseApiKey = process.env.FLOWISE_API_KEY

  if (!flowiseUrl || !flowiseFlowId) {
    return new Response("Flowise non configuré", { status: 503 })
  }

  // Inject user memory if user is authenticated
  let memoryContext = ""
  if (userId) {
    try {
      const payload = await getPayload({ config: configPromise })
      const user = await payload.findByID({
        collection: "users",
        id: userId,
        depth: 0,
      })
      if (user?.userMemory) {
        memoryContext = buildMemoryContext(user.userMemory as UserMemory)
      }
    } catch {
      // Memory injection is non-blocking
    }
  }

  const enrichedMessage = memoryContext
    ? `${memoryContext}\n\n[Message utilisateur]\n${message}`
    : message

  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    }
    if (flowiseApiKey) {
      headers["Authorization"] = `Bearer ${flowiseApiKey}`
    }

    const flowiseRes = await fetch(
      `${flowiseUrl}/api/v1/prediction/${flowiseFlowId}`,
      {
        method: "POST",
        headers,
        body: JSON.stringify({
          question: enrichedMessage,
          sessionId: sessionId || "default",
          streaming: true,
        }),
      }
    )

    if (!flowiseRes.ok) {
      const err = await flowiseRes.text()
      console.error("Flowise error:", err)
      return new Response("Erreur Flowise", { status: 502 })
    }

    return new Response(flowiseRes.body, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache, no-transform",
        Connection: "keep-alive",
        "X-Accel-Buffering": "no",
      },
    })
  } catch (err) {
    console.error("Atlas API error:", err)
    return new Response("Erreur réseau", { status: 500 })
  }
}
