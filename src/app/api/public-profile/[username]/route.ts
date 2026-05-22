import { NextRequest, NextResponse } from "next/server"
import { getPayload } from "payload"
import configPromise from "@payload-config"
import { sql } from "@payloadcms/db-postgres"

export const runtime = "nodejs"

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  const { username } = await params
  if (!username) return NextResponse.json({ error: "Introuvable" }, { status: 404 })

  try {
    const payload = await getPayload({ config: configPromise })
    const db = (payload.db as any).drizzle

    const result = await db.execute(sql`
      SELECT
        id, "first_name", "last_name", "avatar_url",
        "mlm_company", "mlm_level", "calcom_link", "whatsapp_number", username
      FROM users
      WHERE username = ${username.toLowerCase()}
      LIMIT 1
    `)

    const row = (result.rows ?? result)?.[0]
    if (!row) return NextResponse.json({ error: "Utilisateur introuvable" }, { status: 404 })

    return NextResponse.json({
      profile: {
        username: row.username,
        firstName: row.first_name,
        lastName: row.last_name,
        avatarUrl: row.avatar_url,
        mlmCompany: row.mlm_company,
        mlmLevel: row.mlm_level,
        calcomLink: row.calcom_link,
        whatsappNumber: row.whatsapp_number,
      }
    })
  } catch (err) {
    console.error("[GET /api/public-profile/[username]]", err)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
