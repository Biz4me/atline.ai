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

// GET: list last 12 months of revenue for authenticated user
export async function GET(req: NextRequest) {
  const userId = getUserIdFromCookie(req)
  if (!userId) return NextResponse.json({ error: "Non authentifié" }, { status: 401 })

  try {
    const payload = await getPayload({ config: configPromise })
    const db = (payload.db as any).drizzle

    const result = await db.execute(sql`
      SELECT id, year, month, amount, updated_at
      FROM revenue_tracking
      WHERE owner_id = ${userId}
      ORDER BY year DESC, month DESC
      LIMIT 24
    `)

    const entries = (result.rows ?? result ?? []).map((r: any) => ({
      id: r.id,
      year: r.year,
      month: r.month,
      amount: parseFloat(r.amount),
      updatedAt: r.updated_at,
    }))

    return NextResponse.json({ entries })
  } catch (err) {
    console.error("[GET /api/revenue-tracking]", err)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}

// POST: upsert revenue for a given month
export async function POST(req: NextRequest) {
  const userId = getUserIdFromCookie(req)
  if (!userId) return NextResponse.json({ error: "Non authentifié" }, { status: 401 })

  try {
    const body = await req.json()
    const year = parseInt(body.year, 10)
    const month = parseInt(body.month, 10)
    const amount = parseFloat(body.amount)

    if (
      isNaN(year) || isNaN(month) || isNaN(amount) ||
      month < 1 || month > 12 ||
      amount < 0
    ) {
      return NextResponse.json({ error: "Données invalides" }, { status: 400 })
    }

    const payload = await getPayload({ config: configPromise })
    const db = (payload.db as any).drizzle

    const result = await db.execute(sql`
      INSERT INTO revenue_tracking (owner_id, year, month, amount, updated_at, created_at)
      VALUES (${userId}, ${year}, ${month}, ${amount}, now(), now())
      ON CONFLICT (owner_id, year, month)
      DO UPDATE SET amount = ${amount}, updated_at = now()
      RETURNING id, year, month, amount, updated_at
    `)

    const row = (result.rows ?? result)?.[0]
    return NextResponse.json({
      entry: {
        id: row.id,
        year: row.year,
        month: row.month,
        amount: parseFloat(row.amount),
        updatedAt: row.updated_at,
      }
    })
  } catch (err) {
    console.error("[POST /api/revenue-tracking]", err)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
