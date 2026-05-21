"use client"

import { useState, Suspense } from "react"
import { MobileStatsBar, MobileBottomNav, PlusDrawer, DesktopSidebar, DesktopTopBar } from "./navigation"
import { useSidebar } from "./sidebar-context"
import { cn } from "@/lib/utils"

interface DashboardShellProps {
  children: React.ReactNode
}

export function DashboardShell({ children }: DashboardShellProps) {
  const { collapsed: sidebarCollapsed, ready: sidebarReady, toggle: toggleSidebar } = useSidebar()
  const [drawerOpen, setDrawerOpen] = useState(false)

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile stats bar (replaces old header) */}
      <MobileStatsBar />

      {/* Desktop sidebar */}
      <Suspense>
        <DesktopSidebar
          collapsed={sidebarCollapsed}
          onToggle={toggleSidebar}
          enableTransition={sidebarReady}
        />
      </Suspense>

      {/* Main content area */}
      <div
        className={cn(
          "flex flex-col",
          sidebarReady && "transition-all duration-300",
          sidebarCollapsed ? "lg:pl-16" : "lg:pl-60"
        )}
      >
        {/* Desktop top bar */}
        <DesktopTopBar />

        {/* Page content */}
        <main className="flex-1 px-4 pb-[84px] pt-[72px] lg:px-8 lg:pb-8 lg:pt-6">
          <div className="mx-auto max-w-6xl">
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
