"use client"

import { useState } from "react"
import { MobileStatsBar, MobileBottomNav, PlusDrawer, DesktopSidebar, DesktopTopBar } from "@/components/dashboard/navigation"
import { cn } from "@/lib/utils"

interface ChatShellProps {
  children: React.ReactNode
  breadcrumbs?: { label: string; href?: string }[]
}

export function ChatShell({ children, breadcrumbs }: ChatShellProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-background">
      {/* Mobile stats bar */}
      <MobileStatsBar />

      {/* Desktop sidebar */}
      <DesktopSidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {/* Main content area */}
      <div
        className={cn(
          "flex flex-1 flex-col overflow-hidden transition-all duration-300",
          "pt-14 pb-[68px]", // Mobile: stats bar h-14 (56px) + bottom nav h-[68px]
          "lg:pt-0 lg:pb-0",
          sidebarCollapsed ? "lg:pl-16" : "lg:pl-60"
        )}
      >
        {/* Desktop top bar */}
        <DesktopTopBar breadcrumbs={breadcrumbs} />

        {/* Chat content - centered at 672px on desktop */}
        <main className="flex flex-1 flex-col overflow-hidden">
          <div className="mx-auto flex h-full w-full max-w-2xl flex-col">
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
