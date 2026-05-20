import { NextRequest, NextResponse } from "next/server"
import { getPayload } from "payload"
import configPromise from "@payload-config"

export const runtime = "nodejs"

async function getAdmin(req: NextRequest) {
  const userId = req.headers.get("x-user-id")
  if (!userId) return null
  const payload = await getPayload({ config: configPromise })
  try {
    const user = await payload.findByID({ collection: "users", id: userId, depth: 0 })
    if (!user?.isAdmin) return null
    return { payload, user }
  } catch {
    return null
  }
}

export async function GET(req: NextRequest) {
  const ctx = await getAdmin(req)
  if (!ctx) return NextResponse.json({ error: "Accès refusé" }, { status: 403 })

  const result = await ctx.payload.find({
    collection: "rag-tags" as any,
    sort: "name",
    limit: 500,
    overrideAccess: true,
  })

  return NextResponse.json({ tags: result.docs })
}

export async function POST(req: NextRequest) {
  const ctx = await getAdmin(req)
  if (!ctx) return NextResponse.json({ error: "Accès refusé" }, { status: 403 })

  const { name } = await req.json()
  if (!name?.trim()) return NextResponse.json({ error: "Nom requis" }, { status: 400 })

  // Return existing tag if name already exists
  const existing = await ctx.payload.find({
    collection: "rag-tags" as any,
    where: { name: { equals: name.trim() } },
    limit: 1,
    overrideAccess: true,
  })
  if (existing.docs.length > 0) return NextResponse.json({ tag: existing.docs[0] })

  const tag = await ctx.payload.create({
    collection: "rag-tags" as any,
    data: { name: name.trim() },
    overrideAccess: true,
  })

  return NextResponse.json({ tag })
}
