import { AccessToken } from 'livekit-server-sdk'
import { NextResponse } from 'next/server'
import { randomUUID } from 'crypto'

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}))
  const color = body.color ?? 'bleu'
  const scenario = body.scenario ?? 'objection_pyramide'

  const roomName = `aria-${randomUUID()}`
  const identity = `user-${randomUUID().slice(0, 8)}`

  const at = new AccessToken(
    process.env.LIVEKIT_API_KEY!,
    process.env.LIVEKIT_API_SECRET!,
    { identity, metadata: JSON.stringify({ color, scenario }) }
  )
  at.addGrant({ roomJoin: true, room: roomName, canPublish: true, canSubscribe: true })

  return NextResponse.json({
    token: await at.toJwt(),
    url: process.env.LIVEKIT_URL!,
  })
}
