"use client"

import { Suspense } from "react"
import { MobileStatsBar, MobileBottomNav, DesktopSidebar, DesktopTopBar } from "@/components/dashboard/navigation"
import { useSidebar } from "@/components/dashboard/sidebar-context"
import { cn } from "@/lib/utils"

interface ChatShellProps {
  children: React.ReactNode
  hideSidebar?: boolean
}

export function ChatShell({ children, hideSidebar = false }: ChatShellProps) {
  const { collapsed: sidebarCollapsed, ready: sidebarReady, toggle: toggleSidebar } = useSidebar()

  return (
    <div className="flex h-[100dvh] flex-col overflow-hidden bg-background">
      <MobileStatsBar />

      {!hideSidebar && (
        <Suspense>
          <DesktopSidebar
            collapsed={sidebarCollapsed}
            onToggle={toggleSidebar}
            enableTransition={sidebarReady}
          />
        </Suspense>
      )}

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
        {!hideSidebar && <DesktopTopBar />}

        <main className="flex min-h-0 flex-1 flex-col overflow-hidden">
          <div className="flex min-h-0 flex-1 flex-col">
            {children}
          </div>
        </main>
      </div>

      <MobileBottomNav />
    </div>
  )
}
