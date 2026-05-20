import { NextRequest, NextResponse } from "next/server"
import { getPayload } from "payload"
import configPromise from "@payload-config"

export const runtime = "nodejs"

const ALLOWED_FIELDS = ["firstName", "lastName", "phone", "mlmCompany", "mlmLevel"] as const

async function getUser(req: NextRequest) {
  const payload = await getPayload({ config: configPromise })

  // Try 1: native headers (Payload reads payload-token cookie directly)
  try {
    const { user } = await payload.auth({ headers: req.headers })
    if (user) return { payload, user }
  } catch {}

  // Try 2: manually extract JWT from cookie and set Authorization header
  try {
    const cookie = req.headers.get("cookie") ?? ""
    const match = cookie.match(/payload-token=([^;]+)/)
    if (match?.[1]) {
      const headers = new Headers(req.headers)
      headers.set("Authorization", `JWT ${decodeURIComponent(match[1])}`)
      const { user } = await payload.auth({ headers })
      if (user) return { payload, user }
    }
  } catch {}

  // Try 3: read Authorization header directly if client sent it
  try {
    const auth = req.headers.get("authorization")
    if (auth) {
      const headers = new Headers(req.headers)
      headers.set("Authorization", auth)
      const { user } = await payload.auth({ headers })
      if (user) return { payload, user }
    }
  } catch {}

  return { payload, user: null }
}

export async function PATCH(req: NextRequest) {
  try {
    const { payload, user } = await getUser(req)

    if (!user) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 })
    }

    const body = await req.json()
    const data: Record<string, unknown> = {}
    for (const key of ALLOWED_FIELDS) {
      if (key in body) data[key] = body[key] || null
    }

    const updated = await payload.update({
      collection: "users",
      id: user.id,
      data,
      overrideAccess: true,
    })

    return NextResponse.json({
      user: {
        id: updated.id,
        email: updated.email,
        firstName: updated.firstName,
        lastName: updated.lastName,
        phone: (updated as any).phone,
        mlmCompany: updated.mlmCompany,
        mlmLevel: updated.mlmLevel,
        plan: updated.plan,
      },
    })
  } catch (err) {
    console.error("[PATCH /api/user/me]", err)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
