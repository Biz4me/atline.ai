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

export async function GET(req: NextRequest) {
  const userId = getUserIdFromCookie(req)
  if (!userId) return NextResponse.json({ error: "Non authentifié" }, { status: 401 })

  try {
    const payload = await getPayload({ config: configPromise })
    const db = (payload.db as any).drizzle

    // Prospects actifs (tous sauf converti et non-interesse)
    const prospectsResult = await db.execute(sql`
      SELECT COUNT(*) as total
      FROM prospects
      WHERE owner_id = ${userId}
        AND status NOT IN ('converti', 'non-interesse')
    `)
    const activeProspects = parseInt((prospectsResult.rows ?? prospectsResult)?.[0]?.total ?? "0", 10)

    // Prospects urgents (next_follow_up <= aujourd'hui)
    const urgentResult = await db.execute(sql`
      SELECT COUNT(*) as total
      FROM prospects
      WHERE owner_id = ${userId}
        AND status NOT IN ('converti', 'non-interesse')
        AND next_follow_up IS NOT NULL
        AND next_follow_up <= now()
    `)
    const urgentProspects = parseInt((urgentResult.rows ?? urgentResult)?.[0]?.total ?? "0", 10)

    return NextResponse.json({
      activeProspects,
      urgentProspects,
    })
  } catch (err) {
    console.error("[GET /api/user/stats]", err)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
