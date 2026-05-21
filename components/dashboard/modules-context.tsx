"use client"

import { createContext, useContext, useCallback, useEffect, useState } from "react"
import { ATLAS_MODULES } from "@/lib/modules"

// moduleId → conversationId (null = no conversation yet)
type ModuleConvMap = Record<string, string | null>

interface ModulesContextValue {
  moduleConversations: ModuleConvMap
  refresh: () => void
}

const ModulesContext = createContext<ModulesContextValue>({
  moduleConversations: {},
  refresh: () => {},
})

export function useModules() {
  return useContext(ModulesContext)
}

export function ModulesProvider({ children }: { children: React.ReactNode }) {
  const [moduleConversations, setModuleConversations] = useState<ModuleConvMap>(() =>
    Object.fromEntries(ATLAS_MODULES.map((m) => [m.id, null]))
  )

  const refresh = useCallback(() => {
    fetch("/api/conversations?perModule=true")
      .then((r) => r.json())
      .then((data) => {
        if (!data.conversations) return
        const map: ModuleConvMap = Object.fromEntries(
          ATLAS_MODULES.map((m) => [m.id, null])
        )
        for (const conv of data.conversations as { id: string; moduleId: string }[]) {
          if (conv.moduleId && map[conv.moduleId] !== undefined) {
            map[conv.moduleId] = conv.id
          }
        }
        setModuleConversations(map)
      })
      .catch(() => {})
  }, [])

  useEffect(() => {
    refresh()
    window.addEventListener("atlas:refresh", refresh)
    return () => window.removeEventListener("atlas:refresh", refresh)
  }, [refresh])

  return (
    <ModulesContext.Provider value={{ moduleConversations, refresh }}>
      {children}
    </ModulesContext.Provider>
  )
}
