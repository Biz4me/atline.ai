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

export async function PATCH(req: NextRequest) {
  const userId = getUserIdFromCookie(req)
  if (!userId) return NextResponse.json({ error: "Non authentifié" }, { status: 401 })

  let body: Record<string, unknown>
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "JSON invalide" }, { status: 400 })
  }

  try {
    const payload = await getPayload({ config: configPromise })

    // Build update data — only include defined fields
    const data: Record<string, unknown> = {}
    if (body.firstName !== undefined) data.firstName = String(body.firstName).trim() || null
    if (body.lastName !== undefined) data.lastName = String(body.lastName).trim() || null
    if (body.mlmCompany !== undefined) data.mlmCompany = body.mlmCompany || null
    if (body.experienceLevel !== undefined) data.experienceLevel = body.experienceLevel || null
    if (body.financialGoal !== undefined) data.financialGoal = body.financialGoal || null
    if (body.weeklyHours !== undefined) data.weeklyHours = body.weeklyHours || null
    if (body.socialPlatforms !== undefined) data.socialPlatforms = body.socialPlatforms
    if (body.hasProspectList !== undefined) data.hasProspectList = !!body.hasProspectList

    if (body.complete === true) {
      data.onboardingCompleted = true
      // Increment XP via raw SQL (payload.update can't increment)
      const db = (payload.db as any).drizzle
      await db.execute(sql`UPDATE users SET "xp" = COALESCE("xp", 0) + 100 WHERE id = ${userId}`)
    }

    await payload.update({
      collection: "users",
      id: userId,
      data: data as any,
      overrideAccess: true,
    })

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error("[PATCH /api/onboarding]", err)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
