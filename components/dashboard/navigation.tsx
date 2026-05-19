"use client"

import { useState } from "react"
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
  IconChevronDown,
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

// Small triangle logo for stats bar
function StatsBarLogo() {
  return (
    <svg
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="h-6 w-6"
    >
      <path d="M9 2L17 15H1L9 2Z" fill="#7C6FE8" />
      <path d="M9 5L14 13H4L9 5Z" fill="#06B6D4" fillOpacity="0.6" />
    </svg>
  )
}

const statsBarItems = [
  { href: "/croissance", icon: IconFlame,    value: "12", color: "#F59E0B", bg: "rgba(245,158,11,0.15)" },
  { href: "/proline",    icon: IconChartBar, value: "4",  color: "#10B981", bg: "rgba(16,185,129,0.15)" },
  { href: "/markline",   icon: IconBroadcast,value: "5",  color: "#06B6D4", bg: "rgba(6,182,212,0.15)"  },
  { href: "/reseau",     icon: IconUsers,    value: "24", color: "#7C6FE8", bg: "rgba(124,111,232,0.15)"},
]

export function MobileStatsBar() {
  return (
    <header className="mobile-nav-top fixed left-0 right-0 top-0 z-50 flex h-14 items-center border-b border-white/[0.08] px-4 lg:hidden">
      <Link href="/" className="mr-3 flex items-center justify-center">
        <StatsBarLogo />
      </Link>

      <div className="flex flex-1 items-center justify-between">
        {statsBarItems.map((item) => {
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-1.5"
            >
              <div
                className="flex h-9 w-9 items-center justify-center rounded-xl"
                style={{ backgroundColor: item.bg }}
              >
                <Icon className="h-5 w-5" style={{ color: item.color }} />
              </div>
              <span className="font-mono text-[13px] font-bold" style={{ color: item.color }}>
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

// Triangle logo SVG for Atlas center tab
function AtlasTriangleLogo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 28 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
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
  onPlusClick: () => void
}

export function MobileBottomNav({ onPlusClick }: MobileBottomNavProps) {
  const pathname = usePathname()

  return (
    <nav className="mobile-nav-bottom fixed bottom-0 left-0 right-0 z-50 h-[68px] border-t border-white/[0.08] lg:hidden">
      <div className="flex h-full items-center justify-around px-1">
        {bottomNavItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
          
          // Atlas center tab
          if (item.isCenter) {
            const isAtlasActive = pathname === "/atlas" || pathname.startsWith("/atlas/")
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex min-h-[44px] flex-col items-center justify-center gap-1 px-2"
              >
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
          const activeOpacity = isActive ? "opacity-100" : "opacity-50"
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex min-h-[44px] flex-col items-center justify-center gap-1 px-2"
            >
              <div
                className={cn("flex h-12 w-12 items-center justify-center rounded-xl transition-opacity", activeOpacity)}
                style={{ backgroundColor: item.bg }}
              >
                <Icon className="h-7 w-7" style={{ color: item.color }} />
              </div>
              {isActive && <span className="h-1 w-1 rounded-full bg-primary" />}
            </Link>
          )
        })}
        {/* Plus button */}
        <button
          onClick={onPlusClick}
          className="flex min-h-[44px] flex-col items-center justify-center gap-1 px-2"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-xl" style={{ backgroundColor: "rgba(113,113,122,0.15)" }}>
            <IconGridDots className="h-7 w-7 text-[#71717A]" />
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
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "es", label: "Español", flag: "🇪🇸" },
]

function DrawerItem({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-[62px] items-center border-b border-white/[0.05] px-4">
      {children}
    </div>
  )
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
      <div className="fixed inset-0 z-[60] bg-black/60 lg:hidden" onClick={onClose} />

      <div className="fixed bottom-0 left-0 right-0 z-[70] rounded-t-[24px] bg-background lg:hidden">
        {/* Handle */}
        <div className="flex justify-center py-3">
          <div className="h-[3px] w-10 rounded-full bg-white/20" />
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-3 flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground hover:bg-card"
        >
          <IconX className="h-5 w-5" />
        </button>

        <div className="max-h-[75vh] overflow-y-auto pb-10">

          {/* ── Compte ── */}
          <DrawerItem>
            <Link href="/profil" onClick={onClose} className="flex w-full items-center gap-3">
              <DrawerIcon bg="rgba(113,113,122,0.12)" color="#71717A" icon={IconUser} />
              <span className="flex-1 text-sm font-medium text-white">Profil</span>
            </Link>
          </DrawerItem>

          <DrawerItem>
            <Link href="/abonnement" onClick={onClose} className="flex w-full items-center gap-3">
              <DrawerIcon bg="rgba(124,111,232,0.15)" color="#7C6FE8" icon={IconCreditCard} />
              <div className="flex flex-1 flex-col">
                <span className="text-sm font-medium text-white">Abonnement</span>
                <span className="text-[11px] text-muted-foreground">Plan Pro · Actif</span>
              </div>
            </Link>
          </DrawerItem>

          <DrawerSeparator />

          {/* ── Outils ── */}
          <DrawerItem>
            <Link href="/enrichir-atlas" onClick={onClose} className="flex w-full items-center gap-3">
              <DrawerIcon bg="rgba(124,111,232,0.12)" color="#7C6FE8" icon={IconUpload} />
              <span className="flex-1 text-sm font-medium text-white">Enrichir Atlas</span>
              <span className="rounded bg-primary/20 px-1.5 py-0.5 text-[10px] font-medium text-primary">Pro</span>
            </Link>
          </DrawerItem>

          <DrawerSeparator />

          {/* ── Préférences ── */}
          {/* Langue */}
          <DrawerItem>
            <button
              onClick={() => setLangOpen((v) => !v)}
              className="flex w-full items-center gap-3"
            >
              <DrawerIcon bg="rgba(6,182,212,0.12)" color="#06B6D4" icon={IconLanguage} />
              <span className="flex-1 text-left text-sm font-medium text-white">Langue</span>
              <span className="text-sm text-muted-foreground">{currentLang.flag} {currentLang.label}</span>
            </button>
          </DrawerItem>

          {langOpen && (
            <div className="mx-4 mb-1 overflow-hidden rounded-xl border border-white/[0.08] bg-card">
              {LANGUAGES.map((l) => (
                <button
                  key={l.code}
                  onClick={() => { setLang(l.code); setLangOpen(false) }}
                  className={cn(
                    "flex w-full items-center gap-3 px-4 py-3 text-sm transition-colors",
                    lang === l.code ? "text-primary" : "text-white hover:bg-white/[0.04]"
                  )}
                >
                  <span className="text-base">{l.flag}</span>
                  <span>{l.label}</span>
                  {lang === l.code && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-primary" />}
                </button>
              ))}
            </div>
          )}

          {/* Mode */}
          <DrawerItem>
            <div className="flex w-full items-center gap-3">
              <DrawerIcon
                bg={isDark ? "rgba(113,113,122,0.12)" : "rgba(245,158,11,0.12)"}
                color={isDark ? "#71717A" : "#F59E0B"}
                icon={isDark ? IconMoon : IconSun}
              />
              <span className="flex-1 text-sm font-medium text-white">
                {isDark ? "Mode sombre" : "Mode clair"}
              </span>
              <ToggleSwitch
                enabled={isDark}
                onChange={(v) => setTheme(v ? "dark" : "light")}
              />
            </div>
          </DrawerItem>

          <DrawerSeparator />

          {/* ── Session ── */}
          <DrawerItem>
            <button
              onClick={() => { logout(); onClose() }}
              className="flex w-full items-center gap-3"
            >
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
// DESKTOP SIDEBAR (240px, collapsible to 64px)
// ═══════════════════════════════════════════════════════════════

interface NavItemWithSub {
  href: string
  icon: typeof IconSchool
  label: string
  subItems?: { href: string; label: string }[]
}

const sidebarSections = {
  principal: [
    {
      href: "/formation",
      icon: IconSchool,
      label: "Formation",
      subItems: [
        { href: "/formation", label: "Modules" },
        { href: "/formation?tab=bibliotheque", label: "Bibliothèque" },
        { href: "/formation?tab=notes", label: "Mes notes" },
      ],
    },
    {
      href: "/atlas",
      icon: IconSparkles,
      label: "Atlas",
      subItems: [
        { href: "/atlas", label: "Chat" },
        { href: "/atlas?tab=historique", label: "Historique" },
        { href: "/atlas?tab=scripts", label: "Scripts WhatsApp" },
      ],
    },
    {
      href: "/simulations",
      icon: IconBarbell,
      label: "Simulations",
      subItems: [
        { href: "/simulations", label: "Scénarios" },
        { href: "/simulations?tab=historique", label: "Historique scores" },
        { href: "/simulations?tab=analyse", label: "Analyse présentation" },
      ],
    },
    {
      href: "/reseau",
      icon: IconUsers,
      label: "Réseau",
      subItems: [
        { href: "/reseau", label: "Pipeline" },
        { href: "/reseau?tab=liste-de-noms", label: "Liste de noms" },
        { href: "/reseau?tab=equipe", label: "Équipe" },
        { href: "/reseau?tab=carte-digitale", label: "Carte digitale" },
      ],
    },
  ] as NavItemWithSub[],
  outils: [
    { href: "/markline", icon: IconBroadcast, label: "Markline" },
    { href: "/agenda", icon: IconCalendar, label: "Agenda" },
    { href: "/proline", icon: IconChartBar, label: "Proline" },
    { href: "/enrichir-atlas", icon: IconUpload, label: "Enrichir Atlas" },
  ],
  compte: [
    { href: "/croissance", icon: IconTrophy, label: "Croissance" },
    { href: "/profil", icon: IconUser, label: "Profil" },
  ],
}

interface DesktopSidebarProps {
  collapsed?: boolean
  onToggle?: () => void
}

export function DesktopSidebar({ collapsed = false, onToggle }: DesktopSidebarProps) {
  const pathname = usePathname()
  const { user } = useUser()
  const [expandedItems, setExpandedItems] = useState<string[]>([])

  const toggleExpanded = (href: string) => {
    setExpandedItems((prev) =>
      prev.includes(href)
        ? prev.filter((h) => h !== href)
        : [...prev, href]
    )
  }

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + "/")

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 hidden h-screen flex-col border-r border-border bg-card transition-all duration-300 lg:flex",
        collapsed ? "w-16" : "w-60"
      )}
    >
      {/* Logo */}
      <div className="flex h-14 items-center border-b border-border px-4">
        <AtlineLogo showText={!collapsed} size="md" />
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-3">
        {/* PRINCIPAL section */}
        {!collapsed && (
          <div className="mb-2 px-3">
            <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
              Principal
            </span>
          </div>
        )}
        <div className="space-y-0.5">
          {sidebarSections.principal.map((item) => {
            const Icon = item.icon
            const active = isActive(item.href)
            const expanded = expandedItems.includes(item.href)
            const hasSubItems = item.subItems && item.subItems.length > 0

            return (
              <div key={item.href}>
                <button
                  onClick={() => hasSubItems && !collapsed && toggleExpanded(item.href)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                    active
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <Icon className="h-5 w-5 shrink-0" />
                  {!collapsed && (
                    <>
                      <span className="flex-1 text-left">{item.label}</span>
                      {hasSubItems && (
                        <IconChevronDown
                          className={cn(
                            "h-4 w-4 transition-transform",
                            expanded && "rotate-180"
                          )}
                        />
                      )}
                    </>
                  )}
                </button>
                {/* Sub items */}
                {!collapsed && expanded && hasSubItems && (
                  <div className="ml-8 mt-0.5 space-y-0.5">
                    {item.subItems?.map((sub) => (
                      <Link
                        key={sub.href}
                        href={sub.href}
                        className={cn(
                          "block rounded-md px-3 py-1.5 text-sm transition-colors",
                          pathname === sub.href
                            ? "text-primary"
                            : "text-muted-foreground hover:text-foreground"
                        )}
                      >
                        {sub.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* OUTILS section */}
        {!collapsed && (
          <div className="mb-2 mt-6 px-3">
            <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
              Outils
            </span>
          </div>
        )}
        {collapsed && <div className="mt-4" />}
        <div className="space-y-0.5">
          {sidebarSections.outils.map((item) => {
            const Icon = item.icon
            const active = isActive(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                  active
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <Icon className="h-5 w-5 shrink-0" />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            )
          })}
        </div>

        {/* COMPTE section */}
        {!collapsed && (
          <div className="mb-2 mt-6 px-3">
            <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
              Compte
            </span>
          </div>
        )}
        {collapsed && <div className="mt-4" />}
        <div className="space-y-0.5">
          {sidebarSections.compte.map((item) => {
            const Icon = item.icon
            const active = isActive(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                  active
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <Icon className="h-5 w-5 shrink-0" />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            )
          })}
          {(user as any)?.isAdmin && (
            <Link
              href="/rag"
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                isActive("/rag")
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <IconUpload className="h-5 w-5 shrink-0" />
              {!collapsed && <span>Admin RAG</span>}
            </Link>
          )}
        </div>
      </nav>

      {/* Collapse toggle */}
      <button
        onClick={onToggle}
        className="flex h-10 items-center justify-center border-t border-border text-muted-foreground transition-colors hover:text-foreground"
      >
        {collapsed ? (
          <IconChevronRight className="h-9 w-9" />
        ) : (
          <IconChevronLeft className="h-9 w-9" />
        )}
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
  const planLabel = user?.plan === "pro" ? "Plan Pro" : "Plan Gratuit"

  return (
    <div className="space-y-1">
      <div
        className={cn(
          "flex items-center gap-3 rounded-md px-3 py-2",
          collapsed && "justify-center px-0"
        )}
      >
        <div className="h-9 w-9 shrink-0 overflow-hidden rounded-full bg-primary">
          <div className="flex h-full w-full items-center justify-center text-sm font-medium text-white">
            {loading ? "…" : initials}
          </div>
        </div>
        {!collapsed && !loading && (
          <div className="flex flex-col">
            <span className="text-sm font-medium text-white">{displayName}</span>
            <span className="inline-flex w-fit items-center rounded-[4px] bg-primary px-1.5 py-0.5 text-[10px] font-medium text-white">
              {planLabel}
            </span>
          </div>
        )}
      </div>
      <button
        onClick={logout}
        className={cn(
          "flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
          collapsed && "justify-center px-0"
        )}
      >
        <IconLogout className="h-4 w-4 shrink-0" />
        {!collapsed && <span>Déconnexion</span>}
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
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-sm">
        {breadcrumbs?.map((crumb, index) => (
          <span key={index} className="flex items-center gap-2">
            {index > 0 && <span className="text-muted-foreground">/</span>}
            {crumb.href ? (
              <a
                href={crumb.href}
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                {crumb.label}
              </a>
            ) : (
              <span className="text-foreground">{crumb.label}</span>
            )}
          </span>
        ))}
      </nav>

      {/* Right side: stats + bell + avatar */}
      <div className="flex items-center gap-4">
        {/* Stats */}
        <div className="flex items-center gap-3">
          {statsBarItems.map((item, index) => {
            const Icon = item.icon
            return (
              <div key={item.href} className="flex items-center">
                <Link
                  href={item.href}
                  className="flex items-center gap-1.5 px-1"
                >
                  <Icon className="h-5 w-5" style={{ color: item.color }} />
                  <span className="font-mono text-xs font-bold text-white">
                    {item.value}
                  </span>
                </Link>
                {index < statsBarItems.length - 1 && (
                  <div className="ml-2 h-4 w-px bg-white/[0.08]" />
                )}
              </div>
            )
          })}
        </div>

        {/* Bell */}
        <button className="relative flex h-9 w-9 items-center justify-center rounded-md transition-colors hover:bg-card">
          <IconBell className="h-5 w-5 text-muted-foreground" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-primary" />
        </button>

        {/* Avatar */}
        <TopBarAvatar />
      </div>
    </header>
  )
}

function TopBarAvatar() {
  const { initials, loading, logout } = useUser()
  return (
    <button
      onClick={logout}
      title="Déconnexion"
      className="h-8 w-8 overflow-hidden rounded-full bg-primary transition-opacity hover:opacity-80"
    >
      <div className="flex h-full w-full items-center justify-center text-xs font-medium text-white">
        {loading ? "…" : initials}
      </div>
    </button>
  )
}
