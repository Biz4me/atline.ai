import { NextRequest, NextResponse } from "next/server"

const PUBLIC_PATHS = ["/login", "/signup", "/onboarding", "/api", "/_next", "/favicon", "/icon", "/manifest"]

function decodeJWT(token: string): Record<string, unknown> | null {
  try {
    const parts = decodeURIComponent(token).split(".")
    if (parts.length !== 3) return null
    const pad = parts[1].length % 4
    const b64 = parts[1] + (pad ? "=".repeat(4 - pad) : "")
    return JSON.parse(Buffer.from(b64, "base64").toString("utf8"))
  } catch {
    return null
  }
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Skip non-app paths
  if (PUBLIC_PATHS.some((p) => pathname.startsWith(p))) {
    // If already onboarded and trying to access /onboarding → redirect to app
    if (pathname === "/onboarding") {
      const token = req.cookies.get("payload-token")?.value
      if (token) {
        const jwt = decodeJWT(token)
        if (jwt?.onboardingCompleted === true) {
          return NextResponse.redirect(new URL("/", req.url))
        }
      }
    }
    return NextResponse.next()
  }

  const token = req.cookies.get("payload-token")?.value

  // Not logged in → login
  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url))
  }

  const jwt = decodeJWT(token)

  // Can't decode JWT → login
  if (!jwt) {
    return NextResponse.redirect(new URL("/login", req.url))
  }

  // Logged in but onboarding not completed → onboarding
  // Only redirect if the field is explicitly false (new users)
  // undefined = existing user before the field existed → let through
  if (jwt.onboardingCompleted === false) {
    return NextResponse.redirect(new URL("/onboarding", req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|icon-|manifest|api/).*)"],
}
