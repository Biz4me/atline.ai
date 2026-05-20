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
    const data = JSON.parse(Buffer.from(b64, "base64").toString("utf8"))
    return typeof data.id === "number" ? data.id : null
  } catch {
    return null
  }
}

// GET /api/conversations/[id]
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const userId = getUserIdFromCookie(req)
  if (!userId) return NextResponse.json({ error: "Non authentifié" }, { status: 401 })

  const { id } = await params

  try {
    const payload = await getPayload({ config: configPromise })
    const db = (payload.db as any).drizzle

    const result = await db.execute(sql`
      SELECT id, title, module_id, messages_json, updated_at
      FROM conversations
      WHERE id = ${Number(id)} AND "user_id" = ${userId}
      LIMIT 1
    `)

    const row = result.rows?.[0] ?? result?.[0]
    if (!row) return NextResponse.json({ error: "Introuvable" }, { status: 404 })

    return NextResponse.json({
      id: String(row.id),
      title: row.title ?? "Nouvelle conversation",
      moduleId: row.module_id ?? null,
      messages: row.messages_json ?? [],
      updatedAt: row.updated_at,
    })
  } catch (err) {
    console.error("[GET /api/conversations/[id]]", err)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}

// PATCH /api/conversations/[id] — update messages + optional title
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const userId = getUserIdFromCookie(req)
  if (!userId) return NextResponse.json({ error: "Non authentifié" }, { status: 401 })

  const { id } = await params

  try {
    const body = await req.json()
    const payload = await getPayload({ config: configPromise })
    const db = (payload.db as any).drizzle

    // Verify ownership
    const check = await db.execute(sql`
      SELECT id FROM conversations WHERE id = ${Number(id)} AND "user_id" = ${userId} LIMIT 1
    `)
    const owned = check.rows?.[0] ?? check?.[0]
    if (!owned) return NextResponse.json({ error: "Introuvable" }, { status: 404 })

    const messagesJson = body.messages !== undefined
      ? JSON.stringify(body.messages)
      : undefined
    const title = body.title ?? null

    if (messagesJson !== undefined && title !== null) {
      await db.execute(sql`
        UPDATE conversations
        SET messages_json = ${messagesJson}::jsonb, title = ${title}, updated_at = now()
        WHERE id = ${Number(id)}
      `)
    } else if (messagesJson !== undefined) {
      await db.execute(sql`
        UPDATE conversations
        SET messages_json = ${messagesJson}::jsonb, updated_at = now()
        WHERE id = ${Number(id)}
      `)
    } else if (title !== null) {
      await db.execute(sql`
        UPDATE conversations
        SET title = ${title}, updated_at = now()
        WHERE id = ${Number(id)}
      `)
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error("[PATCH /api/conversations/[id]]", err)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}

// DELETE /api/conversations/[id]
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const userId = getUserIdFromCookie(req)
  if (!userId) return NextResponse.json({ error: "Non authentifié" }, { status: 401 })

  const { id } = await params

  try {
    const payload = await getPayload({ config: configPromise })
    const db = (payload.db as any).drizzle

    await db.execute(sql`
      DELETE FROM conversations WHERE id = ${Number(id)} AND "user_id" = ${userId}
    `)

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error("[DELETE /api/conversations/[id]]", err)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
