import { NextRequest, NextResponse } from "next/server"
import { getPayload } from "payload"
import configPromise from "@payload-config"
import { getUserIdFromCookie } from "@/lib/auth"

export const runtime = "nodejs"

export async function DELETE(req: NextRequest) {
  const userId = getUserIdFromCookie(req)
  if (!userId) return NextResponse.json({ error: "Non authentifié" }, { status: 401 })

  try {
    const payload = await getPayload({ config: configPromise })
    await payload.delete({ collection: "users", id: userId, overrideAccess: true })

    const res = NextResponse.json({ ok: true })
    res.cookies.set("payload-token", "", { maxAge: 0, path: "/" })
    return res
  } catch (e) {
    console.error("[user/delete]", e)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
