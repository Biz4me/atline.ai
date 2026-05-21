import { NextRequest } from "next/server"

export function getUserIdFromCookie(req: NextRequest): number | null {
  try {
    const cookie = req.headers.get("cookie") ?? ""
    const match = cookie.match(/payload-token=([^;]+)/)
    if (!match?.[1]) return null
    const token = decodeURIComponent(match[1])
    const parts = token.split(".")
    if (parts.length !== 3) return null
    const pad = parts[1].length % 4
    const b64 = parts[1] + (pad ? "=".repeat(4 - pad) : "")
    const data = JSON.parse(Buffer.from(b64, "base64").toString("utf8"))
    return typeof data.id === "number" ? data.id : null
  } catch {
    return null
  }
}
