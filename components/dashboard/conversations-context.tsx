"use client"

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react"

interface Conversation {
  id: string
  title: string
  updatedAt: string
}

interface ConversationsContextValue {
  conversations: Conversation[]
  refresh: () => void
}

const ConversationsContext = createContext<ConversationsContextValue>({
  conversations: [],
  refresh: () => {},
})

export function ConversationsProvider({ children }: { children: ReactNode }) {
  const [conversations, setConversations] = useState<Conversation[]>([])

  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/conversations")
      if (!res.ok) return
      const data = await res.json()
      setConversations(data.conversations ?? [])
    } catch {}
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  useEffect(() => {
    window.addEventListener("atlas:refresh", refresh)
    return () => window.removeEventListener("atlas:refresh", refresh)
  }, [refresh])

  return (
    <ConversationsContext.Provider value={{ conversations, refresh }}>
      {children}
    </ConversationsContext.Provider>
  )
}

export const useConversations = () => useContext(ConversationsContext)
