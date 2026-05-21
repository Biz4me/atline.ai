import { NextRequest, NextResponse } from "next/server"
import { getPayload } from "payload"
import configPromise from "@payload-config"
import { getUserIdFromCookie } from "@/lib/auth"

export const runtime = "nodejs"

export async function GET(req: NextRequest) {
  const userId = getUserIdFromCookie(req)
  if (!userId) return NextResponse.json({ error: "Non authentifié" }, { status: 401 })

  const payload = await getPayload({ config: configPromise })

  let user: any
  try {
    user = await payload.findByID({ collection: "users", id: userId, depth: 0 })
    if (!user?.isAdmin) return NextResponse.json({ error: "Accès refusé" }, { status: 403 })
  } catch {
    return NextResponse.json({ error: "Erreur auth" }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const agent = searchParams.get("agent")
  const docType = searchParams.get("docType")
  const themeId = searchParams.get("themeId")

  const where: Record<string, any> = {}
  if (agent) where.agent = { equals: agent }
  if (docType) where.docType = { equals: docType }
  if (themeId) where["theme.id"] = { equals: Number(themeId) }

  try {
    const result = await payload.find({
      collection: "rag-documents" as any,
      where,
      sort: "-createdAt",
      limit: 200,
      depth: 1,
      overrideAccess: true,
    })
    return NextResponse.json({ docs: result.docs, total: result.totalDocs })
  } catch (e) {
    console.error("[rag-documents GET]", e)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  const userId = getUserIdFromCookie(req)
  if (!userId) return NextResponse.json({ error: "Non authentifié" }, { status: 401 })

  const payload = await getPayload({ config: configPromise })

  let user: any
  try {
    user = await payload.findByID({ collection: "users", id: userId, depth: 0 })
    if (!user?.isAdmin) return NextResponse.json({ error: "Accès refusé" }, { status: 403 })
  } catch {
    return NextResponse.json({ error: "Erreur auth" }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const id = searchParams.get("id")
  if (!id) return NextResponse.json({ error: "ID manquant" }, { status: 400 })

  const numId = parseInt(id)
  if (isNaN(numId)) return NextResponse.json({ error: "ID invalide" }, { status: 400 })
  try {
    await payload.delete({ collection: "rag-documents" as any, id: numId, overrideAccess: true })
    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error("[rag-documents DELETE]", e)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
