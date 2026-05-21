"use client"

import { useState, useLayoutEffect } from "react"
import { MobileStatsBar, MobileBottomNav, PlusDrawer, DesktopSidebar, DesktopTopBar } from "./navigation"
import { cn } from "@/lib/utils"

const SIDEBAR_KEY = "atline:sidebar-collapsed"

type LayoutVariant = "standard" | "with-sidebar"

interface DashboardShellProps {
  children: React.ReactNode
  breadcrumbs?: { label: string; href?: string }[]
  layout?: LayoutVariant
}

export function DashboardShell({ children, breadcrumbs, layout = "standard" }: DashboardShellProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)

  useLayoutEffect(() => {
    try {
      setSidebarCollapsed(localStorage.getItem(SIDEBAR_KEY) === "1")
    } catch {}
  }, [])

  function toggleSidebar() {
    setSidebarCollapsed((prev) => {
      const next = !prev
      try { localStorage.setItem(SIDEBAR_KEY, next ? "1" : "0") } catch {}
      return next
    })
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile stats bar (replaces old header) */}
      <MobileStatsBar />

      {/* Desktop sidebar */}
      <DesktopSidebar
        collapsed={sidebarCollapsed}
        onToggle={toggleSidebar}
      />

      {/* Main content area */}
      <div
        className={cn(
          "flex flex-col transition-all duration-300",
          sidebarCollapsed ? "lg:pl-16" : "lg:pl-60"
        )}
      >
        {/* Desktop top bar */}
        <DesktopTopBar breadcrumbs={breadcrumbs} />

        {/* Page content */}
        <main className="flex-1 px-4 pb-[84px] pt-[72px] lg:px-8 lg:pb-8 lg:pt-6">
          <div
            className={cn(
              "mx-auto",
              layout === "standard" && "max-w-6xl",
              layout === "with-sidebar" && "max-w-7xl"
            )}
          >
            {children}
          </div>
        </main>
      </div>

      {/* Mobile bottom nav */}
      <MobileBottomNav isOpen={drawerOpen} onPlusClick={() => setDrawerOpen((v) => !v)} />

      {/* Plus drawer */}
      <PlusDrawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </div>
  )
}
