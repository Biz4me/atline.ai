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

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const userId = getUserIdFromCookie(req)
  if (!userId) return NextResponse.json({ error: "Non authentifié" }, { status: 401 })

  const { id } = await params
  const scriptId = parseInt(id, 10)
  if (isNaN(scriptId)) return NextResponse.json({ error: "ID invalide" }, { status: 400 })

  try {
    const payload = await getPayload({ config: configPromise })
    const db = (payload.db as any).drizzle

    await db.execute(sql`
      DELETE FROM scripts_library
      WHERE id = ${scriptId} AND owner_id = ${userId}
    `)

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error("[DELETE /api/scripts-library/[id]]", err)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const userId = getUserIdFromCookie(req)
  if (!userId) return NextResponse.json({ error: "Non authentifié" }, { status: 401 })

  const { id } = await params
  const scriptId = parseInt(id, 10)
  if (isNaN(scriptId)) return NextResponse.json({ error: "ID invalide" }, { status: 400 })

  try {
    const body = await req.json()
    const payload = await getPayload({ config: configPromise })
    const db = (payload.db as any).drizzle

    if (body.action === "use") {
      // Increment use count
      await db.execute(sql`
        UPDATE scripts_library
        SET use_count = use_count + 1, updated_at = now()
        WHERE id = ${scriptId} AND owner_id = ${userId}
      `)
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error("[PATCH /api/scripts-library/[id]]", err)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
