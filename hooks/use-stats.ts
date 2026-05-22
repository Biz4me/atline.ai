"use client"

import { useState, useEffect } from "react"

interface UserStats {
  activeProspects: number
  urgentProspects: number
}

export function useStats() {
  const [stats, setStats] = useState<UserStats>({ activeProspects: 0, urgentProspects: 0 })
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    fetch("/api/user/stats")
      .then((r) => r.ok ? r.json() : null)
      .then((data) => {
        if (data) setStats({ activeProspects: data.activeProspects ?? 0, urgentProspects: data.urgentProspects ?? 0 })
        setLoaded(true)
      })
      .catch(() => setLoaded(true))
  }, [])

  return { stats, loaded }
}
