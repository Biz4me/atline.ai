"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  Home,
  Sparkles,
  GraduationCap,
  Users,
  TrendingUp,
  Calendar,
  LineChart,
} from "lucide-react"

const mobileNavItems = [
  { href: "/", icon: Home, label: "Home" },
  { href: "/atlas", icon: Sparkles, label: "Atlas" },
  { href: "/formation", icon: GraduationCap, label: "Formation" },
  { href: "/reseau", icon: Users, label: "Réseau" },
  { href: "/croissance", icon: TrendingUp, label: "Croissance" },
]

const desktopNavItems = [
  { href: "/", icon: Home, label: "Accueil" },
  { href: "/atlas", icon: Sparkles, label: "Atlas" },
  { href: "/formation", icon: GraduationCap, label: "Formation" },
  { href: "/simulations", icon: LineChart, label: "Simulations" },
  { href: "/reseau", icon: Users, label: "Réseau" },
  { href: "/agenda", icon: Calendar, label: "Agenda" },
  { href: "/croissance", icon: TrendingUp, label: "Croissance" },
]

export function MobileBottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 h-16 border-t border-border bg-card lg:hidden">
      <div className="flex h-full items-center justify-around px-2">
        {mobileNavItems.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 px-3 py-2 transition-colors",
                isActive ? "text-primary" : "text-muted-foreground"
              )}
            >
              <Icon className="h-5 w-5" />
              {isActive && (
                <span className="text-[10px] font-medium">{item.label}</span>
              )}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}

interface DesktopSidebarProps {
  collapsed?: boolean
  onToggle?: () => void
}

export function DesktopSidebar({ collapsed = false }: DesktopSidebarProps) {
  const pathname = usePathname()

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 hidden h-screen flex-col border-r border-border bg-card transition-all duration-300 lg:flex",
        collapsed ? "w-16" : "w-60"
      )}
    >
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 border-b border-border px-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
          <Sparkles className="h-4 w-4 text-primary-foreground" />
        </div>
        {!collapsed && (
          <span className="font-heading text-lg font-medium">Atline</span>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-3">
        {desktopNavItems.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm transition-colors",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <Icon className="h-5 w-5 shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          )
        })}
      </nav>

      {/* User section */}
      <div className="border-t border-border p-3">
        <div
          className={cn(
            "flex items-center gap-3 rounded-md px-3 py-2",
            collapsed && "justify-center px-0"
          )}
        >
          <div className="h-9 w-9 shrink-0 overflow-hidden rounded-full bg-gradient-to-br from-primary to-accent">
            <div className="flex h-full w-full items-center justify-center text-sm font-medium text-white">
              PH
            </div>
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="text-sm font-medium">Patrice</span>
              <span className="text-xs text-primary">Plan Pro</span>
            </div>
          )}
        </div>
      </div>
    </aside>
  )
}
