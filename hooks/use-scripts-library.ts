"use client"

import { useState, useEffect, useCallback } from "react"

export interface SavedScript {
  id: number
  title: string
  content: string
  category: "invitation" | "objection" | "closing" | "suivi"
  useCount: number
  createdAt: string
}

export function useScriptsLibrary() {
  const [scripts, setScripts] = useState<SavedScript[]>([])
  const [loading, setLoading] = useState(true)

  const fetchScripts = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/scripts-library")
      if (res.ok) {
        const data = await res.json()
        setScripts(data.scripts ?? [])
      }
    } catch {}
    finally { setLoading(false) }
  }, [])

  useEffect(() => { fetchScripts() }, [fetchScripts])

  const saveScript = useCallback(async (title: string, content: string, category: SavedScript["category"]) => {
    const res = await fetch("/api/scripts-library", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, content, category }),
    })
    if (!res.ok) throw new Error("Erreur lors de la sauvegarde")
    const data = await res.json()
    setScripts((prev) => [data.script, ...prev])
    return data.script as SavedScript
  }, [])

  const deleteScript = useCallback(async (id: number) => {
    await fetch(`/api/scripts-library/${id}`, { method: "DELETE" })
    setScripts((prev) => prev.filter((s) => s.id !== id))
  }, [])

  const incrementUse = useCallback(async (id: number) => {
    await fetch(`/api/scripts-library/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "use" }),
    })
    setScripts((prev) => prev.map((s) => s.id === id ? { ...s, useCount: s.useCount + 1 } : s))
  }, [])

  return { scripts, loading, saveScript, deleteScript, incrementUse, refresh: fetchScripts }
}
