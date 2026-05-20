"use client"

import { useEffect, useState } from "react"

export interface AtlineUser {
  id: string
  email: string
  firstName?: string
  lastName?: string
  phone?: string
  avatarUrl?: string
  mlmCompany?: string
  mlmLevel?: string
  plan?: string
}

type ProfileUpdate = Partial<Pick<AtlineUser, "firstName" | "lastName" | "phone" | "mlmCompany" | "mlmLevel">>

interface UseUserReturn {
  user: AtlineUser | null
  loading: boolean
  logout: () => Promise<void>
  refresh: () => Promise<void>
  updateProfile: (data: ProfileUpdate) => Promise<void>
  initials: string
  displayName: string
}

export function useUser(): UseUserReturn {
  const [user, setUser] = useState<AtlineUser | null>(null)
  const [loading, setLoading] = useState(true)

  async function fetchUser() {
    setLoading(true)
    try {
      const data = await fetch("/api/users/me").then((r) => r.json())
      setUser(data.user ?? null)
    } catch {
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUser()
  }, [])

  async function refresh() {
    await fetchUser()
  }

  async function updateProfile(data: ProfileUpdate) {
    const res = await fetch("/api/user/me", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      throw new Error(err.error ?? "Erreur lors de la sauvegarde")
    }
    const result = await res.json()
    setUser((prev) => (prev ? { ...prev, ...result.user } : result.user))
  }

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

  return { user, loading, logout, refresh, updateProfile, displayName, initials }
}
