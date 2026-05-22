import { NextRequest, NextResponse } from "next/server"
import { getPayload } from "payload"
import configPromise from "@payload-config"
import { sql } from "@payloadcms/db-postgres"
import { randomBytes } from "crypto"

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

// GET: get or create referral code + list referrals
export async function GET(req: NextRequest) {
  const userId = getUserIdFromCookie(req)
  if (!userId) return NextResponse.json({ error: "Non authentifié" }, { status: 401 })

  try {
    const payload = await getPayload({ config: configPromise })
    const db = (payload.db as any).drizzle

    // Get or create referral code
    let userRow = await db.execute(sql`
      SELECT referral_code FROM users WHERE id = ${userId} LIMIT 1
    `)
    let code = (userRow.rows ?? userRow)?.[0]?.referral_code

    if (!code) {
      code = randomBytes(5).toString("hex").toUpperCase() // e.g. "A3F1B2"
      await db.execute(sql`
        UPDATE users SET referral_code = ${code}, updated_at = now() WHERE id = ${userId}
      `)
    }

    // List referrals
    const referralsResult = await db.execute(sql`
      SELECT
        r.id, r.status, r.reward_given, r.created_at,
        u.first_name, u.last_name, u.email
      FROM referrals r
      JOIN users u ON u.id = r.referred_id
      WHERE r.referrer_id = ${userId}
      ORDER BY r.created_at DESC
    `)

    const referrals = (referralsResult.rows ?? referralsResult ?? []).map((r: any) => ({
      id: r.id,
      status: r.status,
      rewardGiven: r.reward_given,
      createdAt: r.created_at,
      firstName: r.first_name,
      lastName: r.last_name,
      email: r.email,
    }))

    return NextResponse.json({ code, referrals })
  } catch (err) {
    console.error("[GET /api/referral]", err)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
