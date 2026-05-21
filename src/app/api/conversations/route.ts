import { NextRequest, NextResponse } from "next/server"
import { getPayload } from "payload"
import configPromise from "@payload-config"
import { sql } from "@payloadcms/db-postgres"
import { getUserIdFromCookie } from "@/lib/auth"

export const runtime = "nodejs"

// GET /api/conversations — list user conversations
// ?perModule=true → one latest conversation per module
export async function GET(req: NextRequest) {
  const userId = getUserIdFromCookie(req)
  if (!userId) return NextResponse.json({ error: "Non authentifié" }, { status: 401 })

  const perModule = req.nextUrl.searchParams.get("perModule") === "true"

  try {
    const payload = await getPayload({ config: configPromise })
    const db = (payload.db as any).drizzle

    const result = perModule
      ? await db.execute(sql`
          SELECT DISTINCT ON (module_id) id, title, module_id, updated_at
          FROM conversations
          WHERE "user_id" = ${userId} AND module_id IS NOT NULL
          ORDER BY module_id, updated_at DESC
        `)
      : await db.execute(sql`
          SELECT id, title, module_id, updated_at
          FROM conversations
          WHERE "user_id" = ${userId}
          ORDER BY updated_at DESC
          LIMIT 50
        `)

    const rows = result.rows ?? result ?? []
    return NextResponse.json({
      conversations: rows.map((r: any) => ({
        id: String(r.id),
        title: r.title ?? "Nouvelle conversation",
        moduleId: r.module_id ?? null,
        updatedAt: r.updated_at,
      })),
    })
  } catch (err) {
    console.error("[GET /api/conversations]", err)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}

// POST /api/conversations — create new conversation
export async function POST(req: NextRequest) {
  const userId = getUserIdFromCookie(req)
  if (!userId) return NextResponse.json({ error: "Non authentifié" }, { status: 401 })

  try {
    const body = await req.json()
    const moduleId = body.moduleId ?? null

    const payload = await getPayload({ config: configPromise })
    const db = (payload.db as any).drizzle

    const result = await db.execute(sql`
      INSERT INTO conversations ("user_id", module_id, messages_json, agent, created_at, updated_at)
      VALUES (${userId}, ${moduleId}, '[]'::jsonb, 'atlas', now(), now())
      RETURNING id
    `)

    const row = result.rows?.[0] ?? result?.[0]
    return NextResponse.json({ id: String(row.id) })
  } catch (err) {
    console.error("[POST /api/conversations]", err)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
