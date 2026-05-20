import { NextRequest, NextResponse } from "next/server"
import { getPayload } from "payload"
import configPromise from "@payload-config"

export const runtime = "nodejs"

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get("x-user-id")
  if (!authHeader) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 })
  }

  const payload = await getPayload({ config: configPromise })

  let user: any
  try {
    user = await payload.findByID({ collection: "users", id: authHeader, depth: 0 })
    if (!user?.isAdmin) {
      return NextResponse.json({ error: "Accès refusé" }, { status: 403 })
    }
  } catch {
    return NextResponse.json({ error: "Erreur auth" }, { status: 401 })
  }

  const vpsUrl = process.env.VPS_INGEST_URL
  const vpsKey = process.env.VPS_INGEST_KEY
  if (!vpsUrl || !vpsKey) {
    return NextResponse.json({ error: "Service ingest non configuré" }, { status: 503 })
  }

  const formData = await req.formData()
  const agent = formData.get("agent") as string ?? "atlas"
  const docType = formData.get("doc_type") as string ?? "autre"
  const title = formData.get("title") as string ?? ""
  const language = formData.get("language") as string ?? "fr"
  const themeId = formData.get("theme_id") as string | null
  const file = formData.get("file") as File | null

  const res = await fetch(`${vpsUrl}/ingest`, {
    method: "POST",
    headers: { Authorization: `Bearer ${vpsKey}` },
    body: formData,
  })

  const json = await res.json()

  let payloadError: string | null = null

  if (res.ok) {
    try {
      await payload.create({
        collection: "rag-documents" as any,
        data: {
          title: title || file?.name || "Document",
          fileName: file?.name ?? null,
          agent,
          docType,
          language,
          status: "indexed",
          chunksCount: json.points_inserted ?? json.chunks ?? 0,
          uploadedBy: user.id,
          ...(themeId ? { theme: themeId } : {}),
        } as any,
        overrideAccess: true,
      })
    } catch (e: any) {
      payloadError = String(e?.message ?? e)
      console.error("Failed to save rag document to Payload:", e)
    }
  }

  return NextResponse.json({ ...json, payloadError }, { status: res.status })
}
