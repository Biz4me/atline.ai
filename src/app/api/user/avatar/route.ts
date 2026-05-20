import { NextRequest, NextResponse } from "next/server"
import { put, del } from "@vercel/blob"
import { getPayload } from "payload"
import configPromise from "@payload-config"

export const runtime = "nodejs"


async function getAuthUser(req: NextRequest) {
  const payload = await getPayload({ config: configPromise })
  try {
    const { user } = await payload.auth({ headers: req.headers })
    if (user) return { payload, user }
  } catch {}
  try {
    const cookie = req.headers.get("cookie") ?? ""
    const match = cookie.match(/payload-token=([^;]+)/)
    if (match?.[1]) {
      const headers = new Headers(req.headers)
      headers.set("Authorization", `JWT ${decodeURIComponent(match[1])}`)
      const { user } = await payload.auth({ headers })
      if (user) return { payload, user }
    }
  } catch {}
  return { payload, user: null }
}

export async function POST(req: NextRequest) {
  try {
    const { payload, user } = await getAuthUser(req)

    if (!user) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 })
    }

    const form = await req.formData()
    const file = form.get("file") as File | null
    if (!file) {
      return NextResponse.json({ error: "Fichier manquant" }, { status: 400 })
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "Format invalide — image uniquement" }, { status: 400 })
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "Fichier trop lourd — max 5 Mo" }, { status: 400 })
    }

    // Delete old avatar if exists
    const existing = user as any
    if (existing.avatarUrl) {
      await del(existing.avatarUrl).catch(() => null)
    }

    const ext = file.name.split(".").pop() ?? "jpg"
    const blob = await put(`avatars/${user.id}.${ext}`, file, {
      access: "public",
      addRandomSuffix: false,
    })

    await payload.update({
      collection: "users",
      id: user.id,
      data: { avatarUrl: blob.url } as any,
      overrideAccess: true,
    })

    return NextResponse.json({ url: blob.url })
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
