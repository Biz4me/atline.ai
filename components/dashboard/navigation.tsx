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
  IconSparkles,
  IconGridDots,
  IconUser,
  IconBroadcast,
  IconChartBar,
  IconUpload,
  IconChevronLeft,
  IconChevronRight,
  IconBell,
  IconX,
  IconFlame,
  IconBarbell,
  IconLogout,
  IconCreditCard,
  IconLanguage,
  IconSun,
  IconMoon,
  IconTrophy,
} from "@tabler/icons-react"
import { AtlineLogo } from "./logo"
import { useUser } from "@/hooks/use-user"
import { ToggleSwitch } from "@/components/ui/toggle-switch"

// ═══════════════════════════════════════════════════════════════
// MOBILE STATS BAR (replaces header)
// ═══════════════════════════════════════════════════════════════

const statsBarItems = [
  { href: "/croissance", icon: IconFlame,    value: "12", color: "#F59E0B", bg: "rgba(245,158,11,0.15)" },
  { href: "/proline",    icon: IconChartBar, value: "4",  color: "#10B981", bg: "rgba(16,185,129,0.15)" },
  { href: "/markline",   icon: IconBroadcast,value: "5",  color: "#06B6D4", bg: "rgba(6,182,212,0.15)"  },
  { href: "/reseau",     icon: IconUsers,    value: "24", color: "#7C6FE8", bg: "rgba(124,111,232,0.15)"},
]

export function MobileStatsBar() {
  const { user, initials } = useUser()
  const avatarUrl = (user as any)?.avatarUrl ?? null

  return (
    <header className="mobile-nav-top fixed left-0 right-0 top-0 z-50 flex h-14 items-center border-b border-white/[0.08] px-3 lg:hidden">
      <Link href="/profil" className="mr-2 shrink-0">
        <div className="relative h-10 w-10 overflow-hidden rounded-full bg-primary">
          {avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={avatarUrl} alt="Avatar" className="absolute inset-0 h-full w-full object-cover" />
          ) : (
            <span className="flex h-full w-full items-center justify-center text-xs font-bold text-white">
              {initials}
            </span>
          )}
        </div>
      </Link>

      <div className="flex flex-1 items-center justify-around">
        {statsBarItems.map((item) => {
          const Icon = item.icon
          return (
            <Link key={item.href} href={item.href} className="flex items-center gap-1">
              <div
                className="flex h-8 w-8 items-center justify-center rounded-lg"
                style={{ backgroundColor: item.bg }}
              >
                <Icon className="h-[18px] w-[18px]" style={{ color: item.color }} />
              </div>
              <span className="font-mono text-[12px] font-bold" style={{ color: item.color }}>
                {item.value}
              </span>
            </Link>
          )
        })}
      </div>
    </header>
  )
}

// ═══════════════════════════════════════════════════════════════
// MOBILE BOTTOM NAV (5 tabs)
// ═══════════════════════════════════════════════════════════════

function AtlasTriangleLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M14 4L24 22H4L14 4Z" fill="#7C6FE8" />
      <path d="M14 8L20 20H8L14 8Z" fill="#06B6D4" fillOpacity="0.6" />
    </svg>
  )
}

const bottomNavItems = [
  { href: "/formation",  icon: IconSchool,   label: "Formation",   color: "#7C6FE8", bg: "rgba(124,111,232,0.15)" },
  { href: "/simulations",icon: IconBarbell,  label: "Simulations", color: "#06B6D4", bg: "rgba(6,182,212,0.15)"   },
  { href: "/atlas",      icon: null,         label: "Atlas",       color: "",        bg: "",  isCenter: true       },
  { href: "/agenda",     icon: IconCalendar, label: "Agenda",      color: "#10B981", bg: "rgba(16,185,129,0.15)"  },
]

interface MobileBottomNavProps {
  isOpen: boolean
  onPlusClick: () => void
}

export function MobileBottomNav({ isOpen, onPlusClick }: MobileBottomNavProps) {
  const pathname = usePathname()

  return (
    <nav className="mobile-nav-bottom fixed bottom-0 left-0 right-0 z-[65] h-[68px] border-t border-white/[0.08] lg:hidden">
      <div className="flex h-full items-center justify-around px-1">
        {bottomNavItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/")

          if (item.isCenter) {
            const isAtlasActive = pathname === "/atlas" || pathname.startsWith("/atlas/")
            return (
              <Link key={item.href} href={item.href} className="flex min-h-[44px] flex-col items-center justify-center gap-1 px-2">
                <div className={cn(
                  "flex h-12 w-12 items-center justify-center rounded-xl transition-opacity",
                  isAtlasActive ? "opacity-100" : "opacity-70"
                )} style={{ backgroundColor: "rgba(124,111,232,0.2)" }}>
                  <AtlasTriangleLogo className="h-8 w-8" />
                </div>
                {isAtlasActive && <span className="h-1 w-1 rounded-full bg-primary" />}
              </Link>
            )
          }

          const Icon = item.icon!
          return (
            <Link key={item.href} href={item.href} className="flex min-h-[44px] flex-col items-center justify-center gap-1 px-2">
              <div
                className={cn("flex h-12 w-12 items-center justify-center rounded-xl transition-opacity", isActive ? "opacity-100" : "opacity-50")}
                style={{ backgroundColor: item.bg }}
              >
                <Icon className="h-7 w-7" style={{ color: item.color }} />
              </div>
              {isActive && <span className="h-1 w-1 rounded-full bg-primary" />}
            </Link>
          )
        })}
        {/* Plus button */}
        <button onClick={onPlusClick} className="flex min-h-[44px] flex-col items-center justify-center gap-1 px-2">
          <div
            className="flex h-12 w-12 items-center justify-center rounded-xl transition-colors"
            style={{ backgroundColor: isOpen ? "rgba(124,111,232,0.2)" : "rgba(113,113,122,0.15)" }}
          >
            {isOpen
              ? <IconX className="h-7 w-7 text-primary" />
              : <IconGridDots className="h-7 w-7 text-[#71717A]" />
            }
          </div>
        </button>
      </div>
    </nav>
  )
}

// ═══════════════════════════════════════════════════════════════
// PLUS DRAWER (bottom sheet)
// ═══════════════════════════════════════════════════════════════

interface PlusDrawerProps {
  isOpen: boolean
  onClose: () => void
}

const LANGUAGES = [
  { code: "fr", label: "Français", flag: "🇫🇷" },
  { code: "en", label: "English",  flag: "🇬🇧" },
  { code: "es", label: "Español",  flag: "🇪🇸" },
]

function DrawerItem({ children }: { children: React.ReactNode }) {
  return <div className="flex h-[62px] items-center border-b border-white/[0.05] px-4">{children}</div>
}

function DrawerIcon({ bg, color, icon: Icon }: { bg: string; color: string; icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }> }) {
  return (
    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl" style={{ backgroundColor: bg }}>
      <Icon className="h-6 w-6" style={{ color }} />
    </div>
  )
}

function DrawerSeparator() {
  return <div className="mx-4 my-1 border-t border-white/[0.06]" />
}

export function PlusDrawer({ isOpen, onClose }: PlusDrawerProps) {
  const { theme, setTheme } = useTheme()
  const { logout } = useUser()
  const [lang, setLang] = useState("fr")
  const [langOpen, setLangOpen] = useState(false)
  const isDark = theme === "dark"

  if (!isOpen) return null

  const currentLang = LANGUAGES.find((l) => l.code === lang)!

  return (
    <>
      <div className="fixed inset-x-0 top-0 bottom-[68px] z-[60] bg-black/60 lg:hidden" onClick={onClose} />
      <div className="fixed bottom-[68px] left-0 right-0 z-[70] rounded-t-[24px] bg-background lg:hidden">
        <div className="flex justify-center py-3">
          <div className="h-[3px] w-10 rounded-full bg-foreground/20" />
        </div>
        <button onClick={onClose} className="absolute right-4 top-3 flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground hover:bg-card">
          <IconX className="h-5 w-5" />
        </button>
        <div className="max-h-[calc(75vh-68px)] overflow-y-auto pb-6">
          <DrawerItem>
            <Link href="/profil" onClick={onClose} className="flex w-full items-center gap-3">
              <DrawerIcon bg="rgba(113,113,122,0.12)" color="#71717A" icon={IconUser} />
              <span className="flex-1 text-sm font-medium text-foreground">Profil</span>
            </Link>
          </DrawerItem>
          <DrawerItem>
            <Link href="/abonnement" onClick={onClose} className="flex w-full items-center gap-3">
              <DrawerIcon bg="rgba(124,111,232,0.15)" color="#7C6FE8" icon={IconCreditCard} />
              <div className="flex flex-1 flex-col">
                <span className="text-sm font-medium text-foreground">Abonnement</span>
                <span className="text-[11px] text-muted-foreground">Plan Pro · Actif</span>
              </div>
            </Link>
          </DrawerItem>
          <DrawerSeparator />
          <DrawerItem>
            <Link href="/enrichir-atlas" onClick={onClose} className="flex w-full items-center gap-3">
              <DrawerIcon bg="rgba(124,111,232,0.12)" color="#7C6FE8" icon={IconUpload} />
              <span className="flex-1 text-sm font-medium text-foreground">Enrichir Atlas</span>
              <span className="rounded bg-primary/20 px-1.5 py-0.5 text-[10px] font-medium text-primary">Pro</span>
            </Link>
          </DrawerItem>
          <DrawerSeparator />
          <DrawerItem>
            <button onClick={() => setLangOpen((v) => !v)} className="flex w-full items-center gap-3">
              <DrawerIcon bg="rgba(6,182,212,0.12)" color="#06B6D4" icon={IconLanguage} />
              <span className="flex-1 text-left text-sm font-medium text-foreground">Langue</span>
              <span className="text-sm text-muted-foreground">{currentLang.flag} {currentLang.label}</span>
            </button>
          </DrawerItem>
          {langOpen && (
            <div className="mx-4 mb-1 overflow-hidden rounded-xl border border-border bg-card">
              {LANGUAGES.map((l) => (
                <button key={l.code} onClick={() => { setLang(l.code); setLangOpen(false) }}
                  className={cn("flex w-full items-center gap-3 px-4 py-3 text-sm transition-colors", lang === l.code ? "text-primary" : "text-foreground hover:bg-muted")}
                >
                  <span className="text-base">{l.flag}</span>
                  <span>{l.label}</span>
                  {lang === l.code && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-primary" />}
                </button>
              ))}
            </div>
          )}
          <DrawerItem>
            <div className="flex w-full items-center gap-3">
              <DrawerIcon
                bg={isDark ? "rgba(113,113,122,0.12)" : "rgba(245,158,11,0.12)"}
                color={isDark ? "#71717A" : "#F59E0B"}
                icon={isDark ? IconMoon : IconSun}
              />
              <span className="flex-1 text-sm font-medium text-foreground">{isDark ? "Mode sombre" : "Mode clair"}</span>
              <ToggleSwitch enabled={isDark} onChange={(v) => setTheme(v ? "dark" : "light")} />
            </div>
          </DrawerItem>
          <DrawerSeparator />
          <DrawerItem>
            <button onClick={() => { logout(); onClose() }} className="flex w-full items-center gap-3">
              <DrawerIcon bg="rgba(239,68,68,0.12)" color="#EF4444" icon={IconLogout} />
              <span className="text-sm font-medium text-red-400">Déconnexion</span>
            </button>
          </DrawerItem>
        </div>
      </div>
    </>
  )
}

// ═══════════════════════════════════════════════════════════════
// DESKTOP SIDEBAR — flat nav, style Claude
// ═══════════════════════════════════════════════════════════════

const navItems = [
  { href: "/formation",     icon: IconSchool,    label: "Formation"      },
  { href: "/simulations",   icon: IconBarbell,   label: "Simulations"    },
  { href: "/reseau",        icon: IconUsers,     label: "Réseau"         },
  { href: "/agenda",        icon: IconCalendar,  label: "Agenda"         },
  { href: "/markline",      icon: IconBroadcast, label: "Markline"       },
  { href: "/proline",       icon: IconChartBar,  label: "Proline"        },
  { href: "/enrichir-atlas",icon: IconUpload,    label: "Enrichir Atlas" },
  { href: "/croissance",    icon: IconTrophy,    label: "Croissance"     },
]

interface DesktopSidebarProps {
  collapsed?: boolean
  onToggle?: () => void
}

export function DesktopSidebar({ collapsed = false, onToggle }: DesktopSidebarProps) {
  const pathname = usePathname()
  const { user } = useUser()

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/")

  return (
    <aside className={cn(
      "fixed left-0 top-0 z-40 hidden h-screen flex-col border-r border-border bg-card transition-all duration-300 lg:flex",
      collapsed ? "w-16" : "w-60"
    )}>
      {/* Logo */}
      <div className="flex h-14 items-center border-b border-border px-4">
        <AtlineLogo showText={!collapsed} size="md" />
      </div>

      {/* + Nouvelle conversation */}
      <div className={cn("px-3 pt-3 pb-2", collapsed && "px-2 flex justify-center")}>
        {collapsed ? (
          <div className="group relative">
            <Link
              href="/atlas"
              className="flex h-9 w-9 items-center justify-center rounded-lg hover:bg-muted transition"
            >
              <IconSparkles className="h-5 w-5 text-primary" />
            </Link>
            <span className="pointer-events-none absolute left-full top-1/2 -translate-y-1/2 ml-3 whitespace-nowrap rounded-md border border-border bg-card px-2 py-1 text-xs text-foreground shadow-md opacity-0 group-hover:opacity-100 transition-opacity z-[100]">
              Nouvelle conversation
            </span>
          </div>
        ) : (
          <Link
            href="/atlas"
            className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground hover:bg-muted transition"
          >
            <IconSparkles className="h-4 w-4 text-primary flex-shrink-0" />
            <span>Nouvelle conversation</span>
          </Link>
        )}
      </div>

      {/* Navigation */}
      <nav className={cn("flex flex-1 flex-col justify-end px-2 py-1", collapsed ? "overflow-visible" : "overflow-y-auto")}>
        <div className="space-y-0.5">
          {navItems.map((item) => {
            const Icon = item.icon
            const active = isActive(item.href)
            return collapsed ? (
              <div key={item.href} className="group relative flex justify-center">
                <Link
                  href={item.href}
                  className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-md transition-colors",
                    active ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <Icon className="h-5 w-5 shrink-0" />
                </Link>
                <span className="pointer-events-none absolute left-full top-1/2 -translate-y-1/2 ml-3 whitespace-nowrap rounded-md border border-border bg-card px-2 py-1 text-xs text-foreground shadow-md opacity-0 group-hover:opacity-100 transition-opacity z-[100]">
                  {item.label}
                </span>
              </div>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                  active ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <Icon className="h-5 w-5 shrink-0" />
                <span>{item.label}</span>
              </Link>
            )
          })}
          {(user as any)?.isAdmin && (
            collapsed ? (
              <div className="group relative flex justify-center">
                <Link
                  href="/rag"
                  className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-md transition-colors",
                    isActive("/rag") ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <IconUpload className="h-5 w-5 shrink-0" />
                </Link>
                <span className="pointer-events-none absolute left-full top-1/2 -translate-y-1/2 ml-3 whitespace-nowrap rounded-md border border-border bg-card px-2 py-1 text-xs text-foreground shadow-md opacity-0 group-hover:opacity-100 transition-opacity z-[100]">
                  Admin RAG
                </span>
              </div>
            ) : (
              <Link
                href="/rag"
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                  isActive("/rag") ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <IconUpload className="h-5 w-5 shrink-0" />
                <span>Admin RAG</span>
              </Link>
            )
          )}
        </div>
      </nav>

      {/* Collapse toggle */}
      <button
        onClick={onToggle}
        className="flex h-10 items-center justify-center border-t border-border text-muted-foreground transition-colors hover:text-foreground"
      >
        {collapsed ? <IconChevronRight className="h-5 w-5" /> : <IconChevronLeft className="h-5 w-5" />}
      </button>

      {/* User section */}
      <div className="border-t border-border p-3">
        <UserSection collapsed={collapsed} />
      </div>
    </aside>
  )
}

function UserSection({ collapsed }: { collapsed: boolean }) {
  const { user, loading, logout, initials, displayName } = useUser()
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const planLabel = user?.plan === "pro" ? "Plan Pro" : "Plan Gratuit"
  const avatarUrl = (user as any)?.avatarUrl ?? null

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
      {/* Popup menu */}
      {menuOpen && !collapsed && (
        <div className="absolute bottom-full left-0 right-0 mb-2 rounded-lg border border-border bg-card p-1 shadow-lg overflow-hidden">
          <Link
            href="/profil"
            onClick={() => setMenuOpen(false)}
            className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-foreground hover:bg-muted transition"
          >
            <IconUser className="h-4 w-4 flex-shrink-0" />
            <span>Mon profil</span>
          </Link>
          <Link
            href="/abonnement"
            onClick={() => setMenuOpen(false)}
            className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-foreground hover:bg-muted transition"
          >
            <IconCreditCard className="h-4 w-4 flex-shrink-0" />
            <div>
              <div>Abonnement</div>
              <div className="text-[11px] text-muted-foreground">{planLabel}</div>
            </div>
          </Link>
          <div className="my-1 border-t border-border" />
          <button
            onClick={() => { logout(); setMenuOpen(false) }}
            className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-red-400 hover:bg-muted transition"
          >
            <IconLogout className="h-4 w-4 flex-shrink-0" />
            <span>Déconnexion</span>
          </button>
        </div>
      )}

      <button
        onClick={() => setMenuOpen((v) => !v)}
        className={cn(
          "flex w-full items-center gap-3 rounded-md px-2 py-2 transition-colors hover:bg-muted",
          collapsed && "justify-center px-0"
        )}
      >
        <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full bg-primary">
          {avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={avatarUrl} alt="Avatar" className="absolute inset-0 h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-sm font-medium text-white">
              {loading ? "…" : initials}
            </div>
          )}
        </div>
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

interface DesktopTopBarProps {
  breadcrumbs?: { label: string; href?: string }[]
}

export function DesktopTopBar({ breadcrumbs }: DesktopTopBarProps) {
  return (
    <header className="sticky top-0 z-30 hidden h-14 items-center justify-between border-b border-border bg-background/80 px-6 backdrop-blur-sm lg:flex">
      <nav className="flex items-center gap-2 text-sm">
        {breadcrumbs?.map((crumb, index) => (
          <span key={index} className="flex items-center gap-2">
            {index > 0 && <span className="text-muted-foreground">/</span>}
            {crumb.href ? (
              <a href={crumb.href} className="text-muted-foreground transition-colors hover:text-foreground">{crumb.label}</a>
            ) : (
              <span className="text-foreground">{crumb.label}</span>
            )}
          </span>
        ))}
      </nav>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          {statsBarItems.map((item, index) => {
            const Icon = item.icon
            return (
              <div key={item.href} className="flex items-center">
                <Link href={item.href} className="flex items-center gap-1.5 px-1">
                  <Icon className="h-5 w-5" style={{ color: item.color }} />
                  <span className="font-mono text-xs font-bold text-white">{item.value}</span>
                </Link>
                {index < statsBarItems.length - 1 && <div className="ml-2 h-4 w-px bg-white/[0.08]" />}
              </div>
            )
          })}
        </div>
        <button className="relative flex h-9 w-9 items-center justify-center rounded-md transition-colors hover:bg-card">
          <IconBell className="h-5 w-5 text-muted-foreground" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-primary" />
        </button>
        <TopBarAvatar />
      </div>
    </header>
  )
}

function TopBarAvatar() {
  const { initials, loading, logout } = useUser()
  return (
    <button onClick={logout} title="Déconnexion" className="h-8 w-8 overflow-hidden rounded-full bg-primary transition-opacity hover:opacity-80">
      <div className="flex h-full w-full items-center justify-center text-xs font-medium text-white">
        {loading ? "…" : initials}
      </div>
    </button>
  )
}
