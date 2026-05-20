"use client"

import { useState } from "react"
import { MobileStatsBar, MobileBottomNav, PlusDrawer, DesktopSidebar, DesktopTopBar } from "@/components/dashboard/navigation"
import { cn } from "@/lib/utils"

interface ChatShellProps {
  children: React.ReactNode
  breadcrumbs?: { label: string; href?: string }[]
  hideSidebar?: boolean
}

export function ChatShell({ children, breadcrumbs, hideSidebar = false }: ChatShellProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)

  return (
    <div className="flex h-[100dvh] flex-col overflow-hidden bg-background">
      {/* Mobile stats bar */}
      <MobileStatsBar />

      {/* Desktop sidebar — hidden when Atlas sidebar takes over */}
      {!hideSidebar && (
        <DesktopSidebar
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
      )}

      {/* Main content area */}
      <div
        className={cn(
          "flex flex-1 flex-col overflow-hidden transition-all duration-300",
          "pt-14 pb-[68px]",
          "lg:pt-0 lg:pb-0",
          hideSidebar
            ? "lg:pl-0"
            : sidebarCollapsed ? "lg:pl-16" : "lg:pl-60"
        )}
      >
        {/* Desktop top bar */}
        {!hideSidebar && <DesktopTopBar breadcrumbs={breadcrumbs} />}

        {/* Chat content - full width like other pages */}
        <main className="flex flex-1 flex-col overflow-hidden">
          <div className="flex h-full w-full flex-col">
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
