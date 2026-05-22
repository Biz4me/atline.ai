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
    const payload = JSON.parse(Buffer.from(b64, "base64").toString("utf8"))
    return typeof payload.id === "number" ? payload.id : null
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

    const result = await db.execute(sql`
      SELECT id, title, content, category, use_count, created_at
      FROM scripts_library
      WHERE owner_id = ${userId}
      ORDER BY created_at DESC
    `)

    const scripts = (result.rows ?? result ?? []).map((r: any) => ({
      id: r.id,
      title: r.title,
      content: r.content,
      category: r.category,
      useCount: r.use_count,
      createdAt: r.created_at,
    }))

    return NextResponse.json({ scripts })
  } catch (err) {
    console.error("[GET /api/scripts-library]", err)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const userId = getUserIdFromCookie(req)
  if (!userId) return NextResponse.json({ error: "Non authentifié" }, { status: 401 })

  try {
    const body = await req.json()
    const title = (body.title ?? "").trim().slice(0, 120)
    const content = (body.content ?? "").trim()
    const category = ["invitation", "objection", "closing", "suivi"].includes(body.category)
      ? body.category
      : "invitation"

    if (!title || !content) {
      return NextResponse.json({ error: "Titre et contenu requis" }, { status: 400 })
    }

    const payload = await getPayload({ config: configPromise })
    const db = (payload.db as any).drizzle

    const result = await db.execute(sql`
      INSERT INTO scripts_library (title, content, category, use_count, owner_id, updated_at, created_at)
      VALUES (${title}, ${content}, ${category}, 0, ${userId}, now(), now())
      RETURNING id, title, content, category, use_count, created_at
    `)

    const row = (result.rows ?? result)?.[0]
    return NextResponse.json({
      script: {
        id: row.id,
        title: row.title,
        content: row.content,
        category: row.category,
        useCount: row.use_count,
        createdAt: row.created_at,
      }
    }, { status: 201 })
  } catch (err) {
    console.error("[POST /api/scripts-library]", err)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
