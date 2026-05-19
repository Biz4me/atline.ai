import { NextRequest } from "next/server"

export const runtime = "nodejs"

export async function POST(req: NextRequest) {
  const { text } = await req.json()

  if (!text?.trim()) {
    return new Response("Texte requis", { status: 400 })
  }

  const apiKey = process.env.ELEVENLABS_API_KEY
  const voiceId = process.env.ELEVENLABS_VOICE_ID || "OIvXxYJnRaBOJS1Rm2Vd"

  if (!apiKey) {
    return new Response("ElevenLabs non configuré", { status: 503 })
  }

  try {
    const res = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "xi-api-key": apiKey,
        },
        body: JSON.stringify({
          text,
          model_id: "eleven_flash_v2_5",
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75,
          },
        }),
      }
    )

    if (!res.ok) {
      const err = await res.text()
      console.error("ElevenLabs error:", err)
      return new Response("Erreur TTS", { status: 502 })
    }

    return new Response(res.body, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Cache-Control": "no-store",
      },
    })
  } catch (err) {
    console.error("TTS API error:", err)
    return new Response("Erreur réseau", { status: 500 })
  }
}
