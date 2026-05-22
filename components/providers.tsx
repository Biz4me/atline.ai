"use client"

import { ThemeProvider } from "next-themes"
import { SidebarProvider } from "@/components/dashboard/sidebar-context"
import { ModulesProvider } from "@/components/dashboard/modules-context"
import { PWARegister } from "@/components/pwa-register"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <SidebarProvider>
        <ModulesProvider>
          <PWARegister />
          {children}
        </ModulesProvider>
      </SidebarProvider>
    </ThemeProvider>
  )
}
