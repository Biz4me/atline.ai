"use client"

import { useState, Suspense } from "react"
import { MobileStatsBar, MobileBottomNav, PlusDrawer, DesktopSidebar, DesktopTopBar } from "@/components/dashboard/navigation"
import { useSidebar } from "@/components/dashboard/sidebar-context"
import { cn } from "@/lib/utils"

interface ChatShellProps {
  children: React.ReactNode
  hideSidebar?: boolean
}

export function ChatShell({ children, hideSidebar = false }: ChatShellProps) {
  const { collapsed: sidebarCollapsed, ready: sidebarReady, toggle: toggleSidebar } = useSidebar()
  const [drawerOpen, setDrawerOpen] = useState(false)

  return (
    <div className="flex h-[100dvh] flex-col overflow-hidden bg-background">
      {/* Mobile stats bar */}
      <MobileStatsBar />

      {/* Desktop sidebar — hidden when Atlas sidebar takes over */}
      {!hideSidebar && (
        <Suspense>
          <DesktopSidebar
            collapsed={sidebarCollapsed}
            onToggle={toggleSidebar}
            enableTransition={sidebarReady}
          />
        </Suspense>
      )}

      {/* Main content area */}
      <div
        className={cn(
          "flex flex-1 flex-col overflow-hidden",
          sidebarReady && "transition-all duration-300",
          "pt-14 pb-[68px]",
          "lg:pt-0 lg:pb-0",
          hideSidebar
            ? "lg:pl-0"
            : sidebarCollapsed ? "lg:pl-16" : "lg:pl-60"
        )}
      >
        {/* Desktop top bar */}
        {!hideSidebar && <DesktopTopBar />}

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
