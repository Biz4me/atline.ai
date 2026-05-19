import { NextRequest, NextResponse } from "next/server"
import { getPayload } from "payload"
import configPromise from "@payload-config"

export const runtime = "nodejs"

const ALLOWED_FIELDS = ["firstName", "lastName", "phone", "mlmCompany", "mlmLevel"] as const

function getAuthHeaders(req: NextRequest): Headers {
  const headers = new Headers(req.headers)
  const cookie = req.headers.get("cookie") ?? ""
  const match = cookie.match(/payload-token=([^;]+)/)
  if (match?.[1]) {
    headers.set("Authorization", `JWT ${decodeURIComponent(match[1])}`)
  }
  return headers
}

export async function PATCH(req: NextRequest) {
  try {
    const payload = await getPayload({ config: configPromise })
    const { user } = await payload.auth({ headers: getAuthHeaders(req) })

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
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
