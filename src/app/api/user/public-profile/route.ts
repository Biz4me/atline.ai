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
    const pad = parts[1].length % 4
    const b64 = parts[1] + (pad ? "=".repeat(4 - pad) : "")
    const p = JSON.parse(Buffer.from(b64, "base64").toString("utf8"))
    return typeof p.id === "number" ? p.id : null
  } catch {
    return null
  }
}

export async function PATCH(req: NextRequest) {
  const userId = getUserIdFromCookie(req)
  if (!userId) return NextResponse.json({ error: "Non authentifié" }, { status: 401 })

  try {
    const body = await req.json()
    const username = body.username?.trim().toLowerCase().replace(/[^a-z0-9_-]/g, "") || null
    const calcomLink = body.calcomLink?.trim() || null
    const whatsappNumber = body.whatsappNumber?.trim() || null

    const payload = await getPayload({ config: configPromise })
    const db = (payload.db as any).drizzle

    // Check uniqueness if username provided
    if (username) {
      const existing = await db.execute(sql`
        SELECT id FROM users WHERE username = ${username} AND id != ${userId} LIMIT 1
      `)
      const rows = existing.rows ?? existing
      if (rows.length > 0) {
        return NextResponse.json({ error: "Ce nom d'utilisateur est déjà pris" }, { status: 409 })
      }
    }

    await db.execute(sql`
      UPDATE users
      SET
        username         = ${username},
        calcom_link      = ${calcomLink},
        whatsapp_number  = ${whatsappNumber},
        updated_at       = now()
      WHERE id = ${userId}
    `)

    return NextResponse.json({ ok: true, username })
  } catch (err) {
    console.error("[PATCH /api/user/public-profile]", err)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
