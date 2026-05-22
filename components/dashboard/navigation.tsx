"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useTheme } from "next-themes"
import { cn } from "@/lib/utils"
import {
  IconCalendar,
  IconUsers,
  IconSchool,
  IconUser,
  IconBroadcast,
  IconChartBar,
  IconChevronLeft,
  IconChevronRight,
  IconBell,
  IconFlame,
  IconLogout,
  IconCreditCard,
  IconTrophy,
  IconBarbell,
  IconMessages,
  IconAdjustments,
  IconUpload,
  IconHome,
  IconTool,
  IconSparkles,
  IconSun,
  IconMoon,
  IconGift,
  IconSettings,
} from "@tabler/icons-react"
import { AtlineLogo } from "./logo"
import { useUser } from "@/hooks/use-user"
import { ToggleSwitch } from "@/components/ui/toggle-switch"

// ═══════════════════════════════════════════════════════════════
// AVATAR IMAGE
// ═══════════════════════════════════════════════════════════════

function AvatarImg({
  avatarUrl,
  initials,
  loading = false,
  className,
  textSize = "text-xs",
}: {
  avatarUrl: string | null
  initials: string
  loading?: boolean
  className?: string
  textSize?: string
}) {
  const [loaded, setLoaded] = useState(false)
  return (
    <div className={cn("relative overflow-hidden rounded-full bg-primary", className)}>
      <div className={cn("flex h-full w-full items-center justify-center font-bold text-white", textSize)}>
        {loading ? "…" : initials}
      </div>
      {avatarUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={avatarUrl}
          alt="Avatar"
          onLoad={() => setLoaded(true)}
          className={cn(
            "absolute inset-0 h-full w-full object-cover transition-opacity duration-300",
            loaded ? "opacity-100" : "opacity-0"
          )}
        />
      )}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════
// ATLAS SVG LOGO (triangle)
// ═══════════════════════════════════════════════════════════════

function AtlasTriangleLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M14 4L24 22H4L14 4Z" fill="#7C6FE8" />
      <path d="M14 8L20 20H8L14 8Z" fill="#06B6D4" fillOpacity="0.6" />
    </svg>
  )
}

// ═══════════════════════════════════════════════════════════════
// PAGE TITLES
// ═══════════════════════════════════════════════════════════════

const PAGE_TITLES: Record<string, string> = {
  "/aujourd-hui":   "Aujourd'hui",
  "/reseau":        "Réseau",
  "/moi":           "Moi",
  "/formation":     "Formation",
  "/simulations":   "Simulations",
  "/contenu":       "Contenu",
  "/mon-plan":      "Mon plan",
  "/agenda":        "Agenda",
  "/croissance":    "Croissance",
  "/communaute":    "Communauté",
  "/profil":        "Mon Profil",
  "/enrichir-atlas":"Enrichir Atlas",
  "/rag":           "Admin RAG",
}

// ═══════════════════════════════════════════════════════════════
// MOBILE STATS BAR
// ═══════════════════════════════════════════════════════════════

export function MobileStatsBar() {
  const { user } = useUser()
  const pathname = usePathname()
  const title = PAGE_TITLES[pathname] ?? null
  const streak = user?.streak ?? 0
  const isAtlas = pathname === "/atlas" || pathname.startsWith("/atlas/")

  return (
    <header className="mobile-nav-top fixed left-0 right-0 top-0 z-50 flex h-14 items-center border-b border-border bg-background px-3 lg:hidden">
      {/* Logo → Aujourd'hui */}
      <Link href="/aujourd-hui" className="mr-3 shrink-0">
        <AtlineLogo showText={false} size="sm" />
      </Link>

      {/* Content zone */}
      {title && !isAtlas ? (
        <span className="flex-1 text-center text-sm font-semibold text-foreground">{title}</span>
      ) : isAtlas ? (
        <div className="flex-1" />
      ) : (
        <div className="flex flex-1 items-center justify-between">
          {/* Streak — décoratif */}
          <div className="flex items-center gap-1">
            <IconFlame className="h-4 w-4 text-amber-500" />
            <span className="font-mono text-xs font-bold text-amber-500">{streak}</span>
          </div>

          {/* Pills */}
          <div className="flex items-center gap-1.5">
            <Link
              href="/croissance"
              className="flex items-center gap-1 rounded-full bg-amber-500/10 px-2.5 py-1 transition-opacity active:opacity-70"
            >
              <IconTrophy className="h-3 w-3 text-amber-500" />
              <span className="text-[11px] font-semibold text-amber-500">Croissance</span>
            </Link>
            <Link
              href="/moi"
              className="flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-1 transition-opacity active:opacity-70"
            >
              <IconTool className="h-3 w-3 text-emerald-500" />
              <span className="text-[11px] font-semibold text-emerald-500">Outils</span>
            </Link>
          </div>

          {/* Prospects — décoratif */}
          <div className="flex items-center gap-1">
            <IconUsers className="h-4 w-4 text-emerald-500" />
            <span className="font-mono text-xs font-bold text-emerald-500">—</span>
          </div>
        </div>
      )}
    </header>
  )
}

// ═══════════════════════════════════════════════════════════════
// MOBILE BOTTOM NAV (4 tabs, sans labels)
// ═══════════════════════════════════════════════════════════════

const BOTTOM_TABS = [
  { href: "/aujourd-hui", label: "Aujourd'hui", isAtlas: false },
  { href: "/atlas",       label: "Atlas",       isAtlas: true  },
  { href: "/reseau",      label: "Réseau",       isAtlas: false },
  { href: "/moi",         label: "Moi",          isAtlas: false },
]

export function MobileBottomNav() {
  const pathname = usePathname()

  return (
    <nav className="mobile-nav-bottom fixed bottom-0 left-0 right-0 z-[65] h-[68px] border-t border-border bg-background lg:hidden">
      <div className="flex h-full items-center justify-around">
        {BOTTOM_TABS.map((tab) => {
          const isActive = pathname === tab.href || pathname.startsWith(tab.href + "/")
          return (
            <Link
              key={tab.href}
              href={tab.href}
              aria-label={tab.label}
              className="flex min-h-[44px] flex-1 flex-col items-center justify-center gap-1"
            >
              {tab.isAtlas ? (
                <AtlasTriangleLogo
                  className={cn("h-6 w-6 transition-opacity", isActive ? "opacity-100" : "opacity-35")}
                />
              ) : tab.href === "/aujourd-hui" ? (
                <IconHome
                  className={cn("h-6 w-6 transition-opacity", isActive ? "text-primary opacity-100" : "text-muted-foreground opacity-50")}
                />
              ) : tab.href === "/reseau" ? (
                <IconUsers
                  className={cn("h-6 w-6 transition-opacity", isActive ? "text-primary opacity-100" : "text-muted-foreground opacity-50")}
                />
              ) : (
                <IconUser
                  className={cn("h-6 w-6 transition-opacity", isActive ? "text-primary opacity-100" : "text-muted-foreground opacity-50")}
                />
              )}
              <span className={cn("h-1 w-1 rounded-full bg-primary transition-opacity", isActive ? "opacity-100" : "opacity-0")} />
            </Link>
          )
        })}
      </div>
    </nav>
  )
}

// ═══════════════════════════════════════════════════════════════
// DESKTOP SIDEBAR
// ═══════════════════════════════════════════════════════════════

interface DesktopSidebarProps {
  collapsed?: boolean
  onToggle?: () => void
  enableTransition?: boolean
}

// Level 1 — quotidien (Aujourd'hui + Réseau — Atlas est traité séparément)
const L1_ITEMS = [
  { href: "/aujourd-hui", icon: IconHome,    label: "Aujourd'hui" },
  { href: "/reseau",      icon: IconUsers,   label: "Réseau"      },
]

// Level 2 — secondaire
const L2_ITEMS = [
  { href: "/formation",   icon: IconSchool,    label: "Formation"   },
  { href: "/simulations", icon: IconBarbell,   label: "Simulations" },
  { href: "/contenu",     icon: IconBroadcast, label: "Contenu"     },
  { href: "/mon-plan",    icon: IconChartBar,  label: "Mon plan"    },
  { href: "/agenda",      icon: IconCalendar,  label: "Agenda"      },
  { href: "/croissance",  icon: IconTrophy,    label: "Croissance"  },
]

const L2_BOTTOM = [
  { href: "/communaute",    icon: IconMessages,   label: "Communauté"    },
  { href: "/profil",        icon: IconUser,       label: "Profil"        },
]

export function DesktopSidebar({ collapsed = false, onToggle, enableTransition = true }: DesktopSidebarProps) {
  const pathname = usePathname()
  const { user } = useUser()

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/")
  const isAtlas = isActive("/atlas")

  // ── Collapsed sidebar item helper ────────────────────────────
  function CollapsedItem({ href, icon: Icon, label, small = false }: {
    href: string; icon: React.ComponentType<{ className?: string }>; label: string; small?: boolean
  }) {
    const active = isActive(href)
    return (
      <div className="group relative flex justify-center">
        <Link
          href={href}
          className={cn(
            "flex items-center justify-center rounded-md transition-colors",
            small ? "h-7 w-7" : "h-9 w-9",
            active ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"
          )}
        >
          <Icon className={cn("shrink-0", small ? "h-[13px] w-[13px]" : "h-[17px] w-[17px]")} />
        </Link>
        <span className="pointer-events-none absolute left-full top-1/2 -translate-y-1/2 ml-3 whitespace-nowrap rounded-md border border-border bg-card px-2 py-1 text-xs text-foreground shadow-md opacity-0 group-hover:opacity-100 transition-opacity z-[100]">
          {label}
        </span>
      </div>
    )
  }

  // ── Expanded sidebar item helper ─────────────────────────────
  function ExpandedItem({ href, icon: Icon, label, small = false }: {
    href: string; icon: React.ComponentType<{ className?: string }>; label: string; small?: boolean
  }) {
    const active = isActive(href)
    return (
      <Link
        href={href}
        className={cn(
          "flex items-center gap-3 rounded-md transition-colors",
          small
            ? "px-2 py-[5px] text-[10px]"
            : "px-3 py-2.5 text-[13px]",
          active
            ? "bg-primary/10 text-primary"
            : "text-muted-foreground hover:bg-muted hover:text-foreground"
        )}
      >
        <Icon className={cn("shrink-0", small ? "h-[13px] w-[13px]" : "h-[17px] w-[17px]")} />
        <span className={small ? "font-medium" : "font-medium"}>{label}</span>
      </Link>
    )
  }

  return (
    <aside className={cn(
      "fixed left-0 top-0 z-40 hidden h-screen flex-col border-r border-border bg-card lg:flex",
      enableTransition && "transition-all duration-300",
      collapsed ? "w-16" : "w-60"
    )}>
      {/* Logo */}
      <div className="flex h-14 shrink-0 items-center border-b border-border px-4">
        <AtlineLogo showText={!collapsed} size="md" />
      </div>

      {/* Scrollable nav */}
      <nav className="flex min-h-0 flex-1 flex-col overflow-y-auto overflow-x-hidden px-2 py-3">

        {/* ── ATLAS — Level 1 special ── */}
        <div className={cn("mb-1", collapsed ? "flex justify-center" : "")}>
          {collapsed ? (
            <div className="group relative flex justify-center">
              <Link
                href="/atlas"
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-lg transition-colors",
                  isAtlas ? "bg-primary/20" : "bg-primary/10 hover:bg-primary/20"
                )}
              >
                <AtlasTriangleLogo className="h-5 w-5" />
              </Link>
              <span className="pointer-events-none absolute left-full top-1/2 -translate-y-1/2 ml-3 whitespace-nowrap rounded-md border border-border bg-card px-2 py-1 text-xs text-foreground shadow-md opacity-0 group-hover:opacity-100 transition-opacity z-[100]">
                Atlas — Coach IA
              </span>
            </div>
          ) : (
            <Link
              href="/atlas"
              className={cn(
                "flex items-center gap-2.5 rounded-xl px-3 py-2.5 transition-all",
                isAtlas
                  ? "bg-primary text-white shadow-sm"
                  : "bg-primary/8 text-primary hover:bg-primary/15"
              )}
            >
              <AtlasTriangleLogo className="h-[17px] w-[17px] shrink-0" />
              <span className="flex-1 text-[13px] font-semibold">Atlas</span>
              <span className={cn(
                "rounded-full px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide",
                isAtlas ? "bg-white/20 text-white" : "bg-primary/15 text-primary"
              )}>
                Coach IA
              </span>
            </Link>
          )}
        </div>

        {/* ── Level 1 items ── */}
        <div className={cn("space-y-0.5", collapsed ? "flex flex-col items-center gap-0.5 space-y-0" : "")}>
          {L1_ITEMS.map((item) =>
            collapsed
              ? <CollapsedItem key={item.href} {...item} />
              : <ExpandedItem key={item.href} {...item} />
          )}
        </div>

        {/* ── Separator ── */}
        <div className="my-2 mx-1 border-t border-border" />

        {/* ── Level 2 items ── */}
        <div className={cn("space-y-0.5", collapsed ? "flex flex-col items-center gap-0.5 space-y-0" : "")}>
          {L2_ITEMS.map((item) =>
            collapsed
              ? <CollapsedItem key={item.href} {...item} small />
              : <ExpandedItem key={item.href} {...item} small />
          )}
        </div>

        {/* ── Separator ── */}
        <div className="my-2 mx-1 border-t border-border" />

        {/* ── Bottom level 2 (Communauté + Profil) ── */}
        <div className={cn("space-y-0.5", collapsed ? "flex flex-col items-center gap-0.5 space-y-0" : "")}>
          {L2_BOTTOM.map((item) =>
            collapsed
              ? <CollapsedItem key={item.href} {...item} small />
              : <ExpandedItem key={item.href} {...item} small />
          )}
        </div>

        {/* ── Admin items ── */}
        {(user as any)?.isAdmin && (
          <>
            <div className="my-2 mx-1 border-t border-border" />
            <div className={cn("space-y-0.5", collapsed ? "flex flex-col items-center gap-0.5 space-y-0" : "")}>
              {collapsed ? (
                <>
                  <CollapsedItem href="/rag" icon={IconUpload} label="Admin RAG" small />
                  <CollapsedItem href="/enrichir-atlas" icon={IconAdjustments} label="Config. Agents" small />
                </>
              ) : (
                <>
                  <ExpandedItem href="/rag" icon={IconUpload} label="Admin RAG" small />
                  <ExpandedItem href="/enrichir-atlas" icon={IconAdjustments} label="Config. Agents" small />
                </>
              )}
            </div>
          </>
        )}
      </nav>

      {/* Collapse toggle */}
      <button
        onClick={onToggle}
        className="flex h-10 shrink-0 items-center justify-center border-t border-border text-muted-foreground transition-colors hover:text-foreground"
      >
        {collapsed ? <IconChevronRight className="h-5 w-5" /> : <IconChevronLeft className="h-5 w-5" />}
      </button>

      {/* User section */}
      <div className={cn("shrink-0 border-t border-border", collapsed ? "px-1 py-2" : "p-3")}>
        <UserSection collapsed={collapsed} />
      </div>
    </aside>
  )
}

// ═══════════════════════════════════════════════════════════════
// USER SECTION (desktop sidebar bottom)
// ═══════════════════════════════════════════════════════════════

function UserSection({ collapsed }: { collapsed: boolean }) {
  const { user, loading, logout, initials, displayName } = useUser()
  const [menuOpen, setMenuOpen] = useState(false)
  const [clickable, setClickable] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const planLabel = user?.plan === "pro" ? "Plan Pro" : "Plan Gratuit"
  const avatarUrl = (user as any)?.avatarUrl ?? null

  useEffect(() => {
    const t = setTimeout(() => setClickable(true), 200)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
    }
    if (menuOpen) document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [menuOpen])

  return (
    <div className="relative" ref={menuRef}>
      {menuOpen && (
        <div className={cn(
          "absolute z-[100] rounded-lg border border-border bg-card p-1 shadow-lg overflow-hidden",
          collapsed ? "bottom-0 left-full ml-2 w-52" : "bottom-full left-0 right-0 mb-2"
        )}>
          <Link href="/profil" onClick={() => setMenuOpen(false)}
            className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-foreground hover:bg-muted transition">
            <IconUser className="h-4 w-4 flex-shrink-0" />
            <span>Mon profil</span>
          </Link>
          <Link href="/abonnement" onClick={() => setMenuOpen(false)}
            className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-foreground hover:bg-muted transition">
            <IconCreditCard className="h-4 w-4 flex-shrink-0" />
            <div>
              <div>Abonnement</div>
              <div className="text-[11px] text-muted-foreground">{planLabel}</div>
            </div>
          </Link>
          <div className="my-1 border-t border-border" />
          <button onClick={() => { logout(); setMenuOpen(false) }}
            className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-red-400 hover:bg-muted transition">
            <IconLogout className="h-4 w-4 flex-shrink-0" />
            <span>Déconnexion</span>
          </button>
        </div>
      )}
      <button
        onClick={() => clickable && setMenuOpen((v) => !v)}
        className={cn(
          "flex items-center rounded-md transition-colors hover:bg-muted",
          !clickable && "pointer-events-none",
          collapsed ? "px-1 py-1 w-full justify-center" : "gap-3 w-full px-2 py-2"
        )}
      >
        <AvatarImg avatarUrl={avatarUrl} initials={initials} loading={loading} className="h-9 w-9 shrink-0" textSize="text-sm" />
        {!collapsed && !loading && (
          <div className="min-w-0 flex-1 text-left">
            <p className="truncate text-sm font-medium text-foreground">{displayName}</p>
            <p className="text-[11px] text-muted-foreground">{planLabel}</p>
          </div>
        )}
      </button>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════
// DESKTOP TOP BAR
// ═══════════════════════════════════════════════════════════════

export function DesktopTopBar() {
  const { user } = useUser()
  const pathname = usePathname()
  const title = PAGE_TITLES[pathname] ?? null
  const streak = user?.streak ?? 0
  const xp = user?.xp ?? 0

  return (
    <header className="sticky top-0 z-30 hidden h-14 items-center border-b border-border bg-background/80 px-6 backdrop-blur-sm lg:grid lg:grid-cols-3">
      {/* left — page title */}
      <div className="flex items-center">
        {title && <span className="text-sm font-semibold text-foreground">{title}</span>}
      </div>

      {/* center — spacer */}
      <div />

      {/* right — stats + bell */}
      <div className="flex items-center justify-end gap-3">
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <IconFlame className="h-4 w-4 text-amber-500" />
            <span className="font-mono font-bold text-foreground">{streak}</span>
          </div>
          <div className="h-4 w-px bg-border" />
          <div className="flex items-center gap-1.5">
            <IconTrophy className="h-4 w-4 text-violet-500" />
            <span className="font-mono font-bold text-foreground">{xp} XP</span>
          </div>
          <div className="h-4 w-px bg-border" />
          <div className="flex items-center gap-1.5">
            <IconUsers className="h-4 w-4 text-emerald-500" />
            <span className="font-mono font-bold text-foreground">—</span>
          </div>
        </div>
        <button className="relative flex h-9 w-9 items-center justify-center rounded-md transition-colors hover:bg-card">
          <IconBell className="h-5 w-5 text-muted-foreground" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-primary" />
        </button>
      </div>
    </header>
  )
}

// ═══════════════════════════════════════════════════════════════
// MOI PAGE — FAB PLUS
// ═══════════════════════════════════════════════════════════════

export function MoiFab() {
  const { user, loading, logout, initials, displayName } = useUser()
  const { theme, setTheme } = useTheme()
  const [open, setOpen] = useState(false)
  const avatarUrl = (user as any)?.avatarUrl ?? null
  const planLabel = user?.plan === "pro" ? "Plan Pro" : "Plan Gratuit"
  const isDark = theme === "dark"

  return (
    <>
      {/* Overlay */}
      {open && (
        <div className="fixed inset-0 z-[60] bg-black/40 lg:hidden" onClick={() => setOpen(false)} />
      )}

      {/* Sheet */}
      {open && (
        <div className="fixed bottom-[68px] left-0 right-0 z-[70] rounded-t-[24px] bg-background lg:hidden animate-in slide-in-from-bottom-4 duration-200">
          <div className="flex justify-center py-3">
            <div className="h-[3px] w-10 rounded-full bg-foreground/20" />
          </div>

          {/* Avatar + nom + plan */}
          <div className="flex items-center gap-3 border-b border-border px-5 pb-4">
            <AvatarImg avatarUrl={avatarUrl} initials={initials} loading={loading} className="h-12 w-12" textSize="text-base" />
            <div>
              <p className="font-semibold text-foreground">{displayName}</p>
              <p className="text-xs text-muted-foreground">{planLabel}</p>
            </div>
          </div>

          <div className="px-3 py-2 space-y-1">
            <Link href="/profil" onClick={() => setOpen(false)}
              className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-foreground hover:bg-muted transition">
              <IconUser className="h-5 w-5 text-muted-foreground" />
              <span>Mon profil</span>
            </Link>
            <button
              className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm text-foreground hover:bg-muted transition"
              onClick={() => setOpen(false)}
            >
              <IconSettings className="h-5 w-5 text-muted-foreground" />
              <span>Paramètres</span>
            </button>
            <Link href="/abonnement" onClick={() => setOpen(false)}
              className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-foreground hover:bg-muted transition">
              <IconCreditCard className="h-5 w-5 text-muted-foreground" />
              <span>Abonnement</span>
            </Link>
            <button
              className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm text-foreground hover:bg-muted transition"
              onClick={() => setOpen(false)}
            >
              <IconGift className="h-5 w-5 text-muted-foreground" />
              <span>Parrainer</span>
            </button>

            {/* Dark mode */}
            <div className="flex items-center gap-3 rounded-xl px-3 py-3">
              {isDark ? <IconMoon className="h-5 w-5 text-muted-foreground" /> : <IconSun className="h-5 w-5 text-amber-500" />}
              <span className="flex-1 text-sm text-foreground">{isDark ? "Mode sombre" : "Mode clair"}</span>
              <ToggleSwitch enabled={isDark} onChange={(v) => setTheme(v ? "dark" : "light")} />
            </div>

            <div className="my-1 border-t border-border" />

            <button onClick={() => { logout(); setOpen(false) }}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm text-red-400 hover:bg-muted transition">
              <IconLogout className="h-5 w-5" />
              <span>Déconnexion</span>
            </button>
          </div>
          <div className="h-6" />
        </div>
      )}

      {/* FAB button */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-[84px] right-4 z-[55] flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white shadow-lg transition-transform active:scale-95 lg:hidden"
      >
        <IconSparkles className="h-5 w-5" />
      </button>
    </>
  )
}
