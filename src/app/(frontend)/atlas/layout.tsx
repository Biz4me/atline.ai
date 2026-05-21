import { cookies } from "next/headers"
import { redirect } from "next/navigation"

function decodeOnboardingStatus(token: string): boolean | null {
  try {
    const parts = decodeURIComponent(token).split(".")
    if (parts.length !== 3) return null
    const pad = parts[1].length % 4
    const b64 = parts[1] + (pad ? "=".repeat(4 - pad) : "")
    const jwt = JSON.parse(Buffer.from(b64, "base64").toString("utf8"))
    if (jwt.onboardingCompleted === false) return false
    return true
  } catch {
    return null
  }
}

export default async function AtlasLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies()
  const token = cookieStore.get("payload-token")?.value
  if (token) {
    const onboarded = decodeOnboardingStatus(token)
    if (onboarded === false) redirect("/onboarding")
  }
  return <>{children}</>
}
