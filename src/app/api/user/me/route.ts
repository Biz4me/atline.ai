import { NextRequest, NextResponse } from "next/server"
import { getPayload } from "payload"
import configPromise from "@payload-config"
import { sql } from "@payloadcms/db-postgres"

export const runtime = "nodejs"

function getUserIdFromCookie(req: NextRequest): number | null {
  try {
    const cookie = req.headers.get("cookie") ?? ""
    const match = cookie.match(/payload-token=([^;]+)/)
    if (!match?.[1]) return null

    const token = decodeURIComponent(match[1])
    const parts = token.split(".")
    if (parts.length !== 3) return null

    // Decode JWT payload (middle section) — base64url
    const pad = parts[1].length % 4
    const b64 = parts[1] + (pad ? "=".repeat(4 - pad) : "")
    const payload = JSON.parse(Buffer.from(b64, "base64").toString("utf8"))
    return typeof payload.id === "number" ? payload.id : null
  } catch {
    return null
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const userId = getUserIdFromCookie(req)
    if (!userId) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 })
    }

    const body = await req.json()
    const firstName = body.firstName?.trim() || null
    const lastName = body.lastName?.trim() || null
    const phone = body.phone?.trim() || null
    const mlmCompany = body.mlmCompany?.trim() || null
    const mlmLevel = body.mlmLevel || null

    const payload = await getPayload({ config: configPromise })
    const db = (payload.db as any).drizzle

    await db.execute(sql`
      UPDATE users
      SET
        "first_name" = ${firstName},
        "last_name"  = ${lastName},
        "phone"      = ${phone},
        "mlm_company" = ${mlmCompany},
        "mlm_level"  = ${mlmLevel},
        "updated_at" = now()
      WHERE id = ${userId}
    `)

    // Fetch updated row
    const result = await db.execute(sql`
      SELECT id, email, "first_name", "last_name", phone, "mlm_company", "mlm_level", plan, "avatar_url"
      FROM users WHERE id = ${userId}
    `)
    const row = result.rows?.[0] ?? result?.[0]

    return NextResponse.json({
      user: {
        id: row.id,
        email: row.email,
        firstName: row.first_name,
        lastName: row.last_name,
        phone: row.phone,
        mlmCompany: row.mlm_company,
        mlmLevel: row.mlm_level,
        plan: row.plan,
        avatarUrl: row.avatar_url,
      },
    })
  } catch (err) {
    console.error("[PATCH /api/user/me]", err)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
