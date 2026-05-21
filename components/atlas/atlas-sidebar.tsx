"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { X, ChevronLeft, ChevronRight } from "lucide-react"
import {
  IconUser,
  IconLogout,
  IconCreditCard,
  IconSparkles,
} from "@tabler/icons-react"
import { cn } from "@/lib/utils"
import { useUser } from "@/hooks/use-user"
import { ATLAS_MODULES } from "@/lib/modules"
import { useModules } from "@/components/dashboard/modules-context"

interface Props {
  activeConversationId?: string
  onNewChat: () => void
  onSelectConversation: (id: string) => void
  onSelectModule: (moduleId: string, welcome: string) => void
  onDeleteConversation: (id: string) => void
  mobileOpen: boolean
  onMobileClose: () => void
  refreshKey?: number
  mobileOnly?: boolean
}

export function AtlasSidebar({
  activeConversationId,
  onNewChat,
  onSelectConversation,
  onSelectModule,
  onDeleteConversation,
  mobileOpen,
  onMobileClose,
  mobileOnly = false,
}: Props) {
  const { user, logout, initials, displayName } = useUser()
  const { moduleConversations } = useModules()
  const avatarUrl = (user as any)?.avatarUrl ?? null
  const planLabel = (user as any)?.plan === "pro" ? "Plan Pro" : "Plan Gratuit"

  const [collapsed, setCollapsed] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const userSectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (userSectionRef.current && !userSectionRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false)
      }
    }
    if (userMenuOpen) document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [userMenuOpen])

  const SidebarContent = () => (
    <div className="relative flex h-full flex-col overflow-hidden">

      {/* ── Header ── */}
      <div className="flex items-center justify-between px-3 py-3 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-full bg-primary flex items-center justify-center text-xs font-bold text-white">A</div>
          <span className="font-semibold text-sm text-foreground">Atlas</span>
        </div>
        <div className="flex items-center gap-0.5">
          <button
            onClick={() => setCollapsed(true)}
            className="hidden lg:flex p-1.5 text-muted-foreground hover:text-foreground transition rounded-md hover:bg-muted"
            title="Réduire"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button onClick={onMobileClose} className="lg:hidden p-1.5 text-muted-foreground hover:text-foreground">
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* ── Accueil modules ── */}
      <div className="px-3 pt-3 pb-2">
        <button
          onClick={() => { onNewChat(); onMobileClose() }}
          className="flex w-full items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground hover:bg-muted transition"
        >
          <IconSparkles className="h-4 w-4 text-primary flex-shrink-0" />
          Accueil modules
        </button>
      </div>

      {/* ── Module list (scrollable) ── */}
      <div className="min-h-0 flex-1 overflow-y-auto px-2 py-1">
        <p className="mb-1 px-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60">
          Modules
        </p>
        {ATLAS_MODULES.map((mod) => {
          const convId = moduleConversations[mod.id]
          const isActive = activeConversationId != null && convId === activeConversationId
          return (
            <button
              key={mod.id}
              onClick={() => {
                onSelectModule(mod.id, mod.welcome)
                onMobileClose()
              }}
              className={cn(
                "flex w-full items-center gap-2.5 rounded-md px-2 py-1.5 text-left text-sm transition",
                isActive
                  ? "bg-primary/10 text-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <span
                className="h-2 w-2 shrink-0 rounded-full"
                style={{ backgroundColor: mod.color }}
              />
              <span className="truncate">{mod.subtitle}</span>
            </button>
          )
        })}
      </div>

      {/* ── User section ── */}
      <div className="relative border-t border-border px-3 py-2" ref={userSectionRef}>
        {userMenuOpen && (
          <div className="absolute bottom-full left-0 right-0 z-30 overflow-hidden rounded-t-xl border border-b-0 border-border bg-card shadow-xl">
            <div className="flex items-center gap-2.5 border-b border-border px-4 py-3">
              <div className="h-8 w-8 flex-shrink-0 overflow-hidden rounded-full bg-primary">
                {avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={avatarUrl} alt="" className="h-full w-full object-cover" />
                ) : (
                  <span className="flex h-full w-full items-center justify-center text-xs font-bold text-white">
                    {initials}
                  </span>
                )}
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-foreground">{displayName}</p>
                <p className="text-[11px] text-muted-foreground">{planLabel}</p>
              </div>
            </div>
            <div className="p-1">
              <Link
                href="/profil"
                onClick={() => setUserMenuOpen(false)}
                className="flex items-center gap-2.5 rounded-md px-3 py-2 text-sm text-foreground hover:bg-muted transition"
              >
                <IconUser className="h-4 w-4 flex-shrink-0" />
                <span>Mon profil</span>
              </Link>
              <Link
                href="/abonnement"
                onClick={() => setUserMenuOpen(false)}
                className="flex items-center gap-2.5 rounded-md px-3 py-2 text-sm text-foreground hover:bg-muted transition"
              >
                <IconCreditCard className="h-4 w-4 flex-shrink-0" />
                <span>Abonnement</span>
              </Link>
              <div className="my-1 border-t border-border" />
              <button
                onClick={() => { logout(); setUserMenuOpen(false) }}
                className="flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-sm text-red-400 hover:bg-muted transition"
              >
                <IconLogout className="h-4 w-4 flex-shrink-0" />
                <span>Déconnexion</span>
              </button>
            </div>
          </div>
        )}

        <button
          onClick={() => setUserMenuOpen((v) => !v)}
          className="flex w-full items-center gap-2.5 rounded-md px-2 py-1.5 text-sm hover:bg-muted transition"
        >
          <div className="h-8 w-8 flex-shrink-0 overflow-hidden rounded-full bg-primary">
            {avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={avatarUrl} alt="" className="h-full w-full object-cover" />
            ) : (
              <span className="flex h-full w-full items-center justify-center text-xs font-bold text-white">
                {initials}
              </span>
            )}
          </div>
          <div className="min-w-0 flex-1 text-left">
            <p className="truncate text-sm font-medium text-foreground">{displayName}</p>
            <p className="text-[11px] text-muted-foreground">{planLabel}</p>
          </div>
        </button>
      </div>

    </div>
  )

  return (
    <>
      {/* Desktop — masqué si mobileOnly (DesktopSidebar gère la nav) */}
      <aside className={cn(
        "flex-shrink-0 flex-col border-r border-border bg-card h-full transition-all duration-300",
        mobileOnly ? "hidden" : "hidden lg:flex",
        collapsed ? "w-10" : "w-60"
      )}>
        {collapsed ? (
          <div className="flex flex-col items-center py-3">
            <button
              onClick={() => setCollapsed(false)}
              className="p-1.5 text-muted-foreground hover:text-foreground transition rounded-md hover:bg-muted"
              title="Ouvrir"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        ) : (
          <SidebarContent />
        )}
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={onMobileClose} />
          <aside className="absolute left-0 top-0 h-full w-64 bg-card border-r border-border">
            <SidebarContent />
          </aside>
        </div>
      )}
    </>
  )
}
