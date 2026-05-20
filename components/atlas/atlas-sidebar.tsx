"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import Link from "next/link"
import { Plus, Trash2, X, ChevronLeft, ChevronRight } from "lucide-react"
import {
  IconUser,
  IconLogout,
  IconCreditCard,
} from "@tabler/icons-react"
import { cn } from "@/lib/utils"
import { useUser } from "@/hooks/use-user"

export const ATLAS_MODULES = [
  { id: "mindset",      num: 1, label: "Mindset",        welcome: "Parlons mindset MLM. Quel est ton plus grand blocage en ce moment — la peur du rejet, le regard des autres, ou autre chose ?" },
  { id: "liste-noms",   num: 2, label: "Liste de noms",  welcome: "On attaque ta liste de noms. Combien de contacts tu as dans ton téléphone ? On va transformer ça en pipeline actif." },
  { id: "invitation",   num: 3, label: "Invitation",     welcome: "L'invitation, c'est la clé. Raconte-moi ta dernière tentative — j'analyse et on améliore ton script ensemble." },
  { id: "presentation", num: 4, label: "Présentation",   welcome: "La présentation de l'opportunité. Tu fais ça en 1-to-1, en réunion, ou en ligne ? On adapte l'approche à ton contexte." },
  { id: "objections",   num: 5, label: "Objections",     welcome: "Les objections, c'est mon terrain. Dis-moi la dernière qui t'a bloqué — on la démonte ensemble avec Feel-Felt-Found." },
  { id: "closing",      num: 6, label: "Closing",        welcome: "Le closing. Quelle est la phrase que tu utilises pour conclure une présentation ? On va la perfectionner." },
  { id: "suivi",        num: 7, label: "Suivi",          welcome: "Le suivi, c'est là où se fait l'argent. Combien de prospects tu as en attente de relance en ce moment ?" },
  { id: "duplication",  num: 8, label: "Duplication",    welcome: "La duplication. Tu as une équipe ou tu en es à construire tes premiers filleuls ? Raconte-moi où tu en es." },
]

interface Conversation {
  id: string
  title: string
  moduleId: string | null
  updatedAt: string
}

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

function groupByDate(convs: Conversation[]) {
  const todayStart = new Date(); todayStart.setHours(0, 0, 0, 0)
  const weekStart = new Date(todayStart); weekStart.setDate(weekStart.getDate() - 7)
  const groups: { label: string; items: Conversation[] }[] = [
    { label: "Aujourd'hui", items: [] },
    { label: "Cette semaine", items: [] },
    { label: "Plus ancien", items: [] },
  ]
  for (const c of convs) {
    const d = new Date(c.updatedAt)
    if (d >= todayStart)      groups[0].items.push(c)
    else if (d >= weekStart)  groups[1].items.push(c)
    else                      groups[2].items.push(c)
  }
  return groups.filter((g) => g.items.length > 0)
}

export function AtlasSidebar({
  activeConversationId,
  onNewChat,
  onSelectConversation,
  onSelectModule,
  onDeleteConversation,
  mobileOpen,
  onMobileClose,
  refreshKey,
  mobileOnly = false,
}: Props) {
  const { user, logout, initials, displayName } = useUser()
  const avatarUrl = (user as any)?.avatarUrl ?? null
  const planLabel = (user as any)?.plan === "pro" ? "Plan Pro" : "Plan Gratuit"

  const [conversations, setConversations] = useState<Conversation[]>([])
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [collapsed, setCollapsed] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const userSectionRef = useRef<HTMLDivElement>(null)

  const fetchConversations = useCallback(async () => {
    try {
      const res = await fetch("/api/conversations")
      if (!res.ok) return
      const data = await res.json()
      setConversations(data.conversations ?? [])
    } catch {}
  }, [])

  useEffect(() => { fetchConversations() }, [fetchConversations, refreshKey])

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (userSectionRef.current && !userSectionRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false)
      }
    }
    if (userMenuOpen) document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [userMenuOpen])

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    setDeletingId(id)
    try {
      await fetch(`/api/conversations/${id}`, { method: "DELETE" })
      setConversations((prev) => prev.filter((c) => c.id !== id))
      if (id === activeConversationId) onNewChat()
      onDeleteConversation(id)
    } finally {
      setDeletingId(null)
    }
  }

  const groups = groupByDate(conversations)

  const SidebarContent = () => (
    <div className="relative flex h-full flex-col overflow-hidden">

      {/* ── Header Atlas ── */}
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

      {/* ── Nouveau chat ── */}
      <div className="px-3 pt-3 pb-2">
        <button
          onClick={() => { onNewChat(); onMobileClose() }}
          className="flex w-full items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground hover:bg-muted transition"
        >
          <Plus className="h-4 w-4 text-primary" />
          Nouvelle conversation
        </button>
      </div>

      {/* ── Historique conversations (scrollable) ── */}
      <div className="min-h-0 flex-1 overflow-y-auto px-2">
        {groups.length === 0 ? (
          <p className="px-2 py-3 text-xs text-muted-foreground text-center">Aucune conversation</p>
        ) : (
          groups.map((group) => (
            <div key={group.label} className="mb-3">
              <p className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                {group.label}
              </p>
              {group.items.map((conv) => (
                <button
                  key={conv.id}
                  onClick={() => { onSelectConversation(conv.id); onMobileClose() }}
                  onMouseEnter={() => setHoveredId(conv.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  className={cn(
                    "group flex w-full items-center justify-between rounded-md px-2 py-1.5 text-left text-sm transition",
                    conv.id === activeConversationId
                      ? "bg-primary/10 text-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <span className="truncate">{conv.title}</span>
                  {(hoveredId === conv.id || conv.id === activeConversationId) && (
                    <button
                      onClick={(e) => handleDelete(e, conv.id)}
                      disabled={deletingId === conv.id}
                      className="ml-1 flex-shrink-0 rounded p-0.5 text-muted-foreground hover:text-destructive transition"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  )}
                </button>
              ))}
            </div>
          ))
        )}
      </div>

      {/* ── User section (avatar fixe en bas, menu s'ouvre au-dessus) ── */}
      <div className="relative border-t border-border px-3 py-2" ref={userSectionRef}>
        {/* Menu — monte depuis le bas, au-dessus de l'avatar */}
        {userMenuOpen && (
          <div className="absolute bottom-full left-0 right-0 z-30 overflow-hidden rounded-t-xl border border-b-0 border-border bg-card shadow-xl">
            {/* User info */}
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
            {/* Items */}
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

        {/* Avatar trigger — toujours visible */}
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
