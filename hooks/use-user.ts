"use client"

import { useEffect, useState } from "react"

export interface AtlineUser {
  id: string
  email: string
  firstName?: string
  lastName?: string
  mlmCompany?: string
  mlmLevel?: string
  plan?: string
}

interface UseUserReturn {
  user: AtlineUser | null
  loading: boolean
  logout: () => Promise<void>
  initials: string
  displayName: string
}

export function useUser(): UseUserReturn {
  const [user, setUser] = useState<AtlineUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/users/me")
      .then((r) => r.json())
      .then((data) => setUser(data.user ?? null))
      .catch(() => setUser(null))
      .finally(() => setLoading(false))
  }, [])

  async function logout() {
    await fetch("/api/users/logout", { method: "POST" })
    window.location.href = "/login"
  }

  const displayName =
    user?.firstName && user?.lastName
      ? `${user.firstName} ${user.lastName}`
      : user?.email ?? ""

  const initials =
    user?.firstName && user?.lastName
      ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
      : user?.email?.slice(0, 2).toUpperCase() ?? "??"

  return { user, loading, logout, displayName, initials }
}
