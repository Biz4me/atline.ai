import { NextRequest, NextResponse } from "next/server"
import { getPayload } from "payload"
import configPromise from "@payload-config"

export const runtime = "nodejs"

export async function POST(req: NextRequest) {
  // Verify user is authenticated and is admin
  const authHeader = req.headers.get("x-user-id")
  if (!authHeader) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 })
  }

  try {
    const payload = await getPayload({ config: configPromise })
    const user = await payload.findByID({ collection: "users", id: authHeader, depth: 0 })
    if (!(user as any)?.isAdmin) {
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

  // Forward the multipart form data to VPS
  const formData = await req.formData()
  const res = await fetch(`${vpsUrl}/ingest`, {
    method: "POST",
    headers: { Authorization: `Bearer ${vpsKey}` },
    body: formData,
  })

  const json = await res.json()
  return NextResponse.json(json, { status: res.status })
}
