"use client"

import { createContext, useContext, useState, useLayoutEffect, ReactNode } from "react"

const SIDEBAR_KEY = "atline:sidebar-collapsed"

interface SidebarContextValue {
  collapsed: boolean
  ready: boolean
  toggle: () => void
}

const SidebarContext = createContext<SidebarContextValue>({
  collapsed: false,
  ready: false,
  toggle: () => {},
})

export function SidebarProvider({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false)
  const [ready, setReady] = useState(false)

  useLayoutEffect(() => {
    try {
      setCollapsed(localStorage.getItem(SIDEBAR_KEY) === "1")
    } catch {}
    setReady(true)
  }, [])

  function toggle() {
    setCollapsed((prev) => {
      const next = !prev
      try { localStorage.setItem(SIDEBAR_KEY, next ? "1" : "0") } catch {}
      return next
    })
  }

  return (
    <SidebarContext.Provider value={{ collapsed, ready, toggle }}>
      {children}
    </SidebarContext.Provider>
  )
}

export const useSidebar = () => useContext(SidebarContext)
