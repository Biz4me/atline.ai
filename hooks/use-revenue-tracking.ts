"use client"

import { useState, useEffect, useCallback } from "react"

export interface RevenueEntry {
  id: number
  year: number
  month: number
  amount: number
  updatedAt: string
}

export function useRevenueTracking() {
  const [entries, setEntries] = useState<RevenueEntry[]>([])
  const [loading, setLoading] = useState(true)

  const fetchEntries = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/revenue-tracking")
      if (res.ok) {
        const data = await res.json()
        setEntries(data.entries ?? [])
      }
    } catch {}
    finally { setLoading(false) }
  }, [])

  useEffect(() => { fetchEntries() }, [fetchEntries])

  const saveEntry = useCallback(async (year: number, month: number, amount: number) => {
    const res = await fetch("/api/revenue-tracking", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ year, month, amount }),
    })
    if (!res.ok) throw new Error("Erreur lors de la sauvegarde")
    const data = await res.json()
    setEntries((prev) => {
      const existing = prev.findIndex((e) => e.year === year && e.month === month)
      if (existing >= 0) {
        return prev.map((e, i) => i === existing ? data.entry : e)
      }
      return [data.entry, ...prev].sort((a, b) =>
        b.year !== a.year ? b.year - a.year : b.month - a.month
      )
    })
    return data.entry as RevenueEntry
  }, [])

  // Total this month
  const now = new Date()
  const thisMonthEntry = entries.find(
    (e) => e.year === now.getFullYear() && e.month === now.getMonth() + 1
  )
  const totalThisMonth = thisMonthEntry?.amount ?? 0

  return { entries, loading, saveEntry, totalThisMonth, refresh: fetchEntries }
}
