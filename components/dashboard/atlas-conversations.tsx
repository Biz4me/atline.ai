"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface Conversation {
  id: string
  title: string
  updatedAt: string
}

function groupByDate(convs: Conversation[]) {
  const todayStart = new Date(); todayStart.setHours(0, 0, 0, 0)
  const weekStart = new Date(todayStart); weekStart.setDate(weekStart.getDate() - 7)
  const groups: { label: string; items: Conversation[] }[] = [
    { label: "Aujourd'hui", items: [] },
    { label: "Cette semaine", items: [] },
    { label: "Plus ancien", items: [] },
  ]
  for (const c of convs) {
    const d = new Date(c.updatedAt)
    if (d >= todayStart)     groups[0].items.push(c)
    else if (d >= weekStart) groups[1].items.push(c)
    else                     groups[2].items.push(c)
  }
  return groups.filter((g) => g.items.length > 0)
}

export function AtlasConversations() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const activeId = searchParams.get("c")

  const [conversations, setConversations] = useState<Conversation[]>([])
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const fetchConversations = useCallback(async () => {
    try {
      const res = await fetch("/api/conversations")
      if (!res.ok) return
      const data = await res.json()
      setConversations(data.conversations ?? [])
    } catch {}
  }, [])

  useEffect(() => { fetchConversations() }, [fetchConversations])

  useEffect(() => {
    window.addEventListener("atlas:refresh", fetchConversations)
    return () => window.removeEventListener("atlas:refresh", fetchConversations)
  }, [fetchConversations])

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    setDeletingId(id)
    try {
      await fetch(`/api/conversations/${id}`, { method: "DELETE" })
      setConversations((prev) => prev.filter((c) => c.id !== id))
      if (id === activeId) router.push("/atlas")
    } finally {
      setDeletingId(null)
    }
  }

  const groups = groupByDate(conversations)

  return (
    <div className="min-h-0 flex-1 overflow-y-auto px-2 py-1">
      {groups.length === 0 ? (
        <p className="px-2 py-3 text-center text-xs text-muted-foreground">Aucune conversation</p>
      ) : (
        groups.map((group) => (
          <div key={group.label} className="mb-3">
            <p className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              {group.label}
            </p>
            {group.items.map((conv) => (
              <button
                key={conv.id}
                onClick={() => router.push(`/atlas?c=${conv.id}`)}
                onMouseEnter={() => setHoveredId(conv.id)}
                onMouseLeave={() => setHoveredId(null)}
                className={cn(
                  "flex w-full items-center justify-between rounded-md px-2 py-1.5 text-left text-sm transition",
                  conv.id === activeId
                    ? "bg-primary/10 text-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <span className="truncate">{conv.title}</span>
                {(hoveredId === conv.id || conv.id === activeId) && (
                  <button
                    onClick={(e) => handleDelete(e, conv.id)}
                    disabled={deletingId === conv.id}
                    className="ml-1 flex-shrink-0 rounded p-0.5 text-muted-foreground hover:text-destructive transition"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                )}
              </button>
            ))}
          </div>
        ))
      )}
    </div>
  )
}
