"use client"

import { ThemeProvider } from "next-themes"
import { SidebarProvider } from "@/components/dashboard/sidebar-context"
import { ConversationsProvider } from "@/components/dashboard/conversations-context"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <SidebarProvider>
        <ConversationsProvider>
          {children}
        </ConversationsProvider>
      </SidebarProvider>
    </ThemeProvider>
  )
}
