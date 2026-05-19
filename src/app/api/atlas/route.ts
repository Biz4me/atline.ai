import { NextRequest } from "next/server"

export const runtime = "nodejs"

export async function POST(req: NextRequest) {
  const { message, sessionId } = await req.json()

  if (!message?.trim()) {
    return new Response("Message requis", { status: 400 })
  }

  const flowiseUrl = process.env.FLOWISE_URL
  const flowiseFlowId = process.env.FLOWISE_FLOW_ID

  if (!flowiseUrl || !flowiseFlowId) {
    return new Response("Flowise non configuré", { status: 503 })
  }

  try {
    const flowiseRes = await fetch(
      `${flowiseUrl}/api/v1/prediction/${flowiseFlowId}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: message,
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

    // Proxy the SSE stream directly to the client
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
