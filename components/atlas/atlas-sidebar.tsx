"use client"

import { useState, useEffect, useCallback } from "react"
import { Plus, Trash2, X, BookOpen } from "lucide-react"
import { cn } from "@/lib/utils"

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
}

function groupByDate(convs: Conversation[]) {
  const now = new Date()
  const todayStart = new Date(now); todayStart.setHours(0, 0, 0, 0)
  const weekStart = new Date(todayStart); weekStart.setDate(weekStart.getDate() - 7)

  const groups: { label: string; items: Conversation[] }[] = [
    { label: "Aujourd'hui", items: [] },
    { label: "Cette semaine", items: [] },
    { label: "Plus ancien", items: [] },
  ]
  for (const c of convs) {
    const d = new Date(c.updatedAt)
    if (d >= todayStart) groups[0].items.push(c)
    else if (d >= weekStart) groups[1].items.push(c)
    else groups[2].items.push(c)
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
}: Props) {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [modulesOpen, setModulesOpen] = useState(false)

  const fetchConversations = useCallback(async () => {
    try {
      const res = await fetch("/api/conversations")
      if (!res.ok) return
      const data = await res.json()
      setConversations(data.conversations ?? [])
    } catch {}
  }, [])

  useEffect(() => {
    fetchConversations()
  }, [fetchConversations, refreshKey])

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
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-3 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center text-xs font-bold text-white">A</div>
          <span className="font-semibold text-sm text-foreground">Atlas</span>
        </div>
        <button onClick={onMobileClose} className="lg:hidden p-1 text-muted-foreground hover:text-foreground">
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* New chat button */}
      <div className="px-3 pt-3 pb-2">
        <button
          onClick={() => { onNewChat(); onMobileClose() }}
          className="flex w-full items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground hover:bg-muted transition"
        >
          <Plus className="h-4 w-4 text-primary" />
          Nouveau chat
        </button>
      </div>

      {/* Conversation history */}
      <div className="flex-1 overflow-y-auto px-2 pb-2">
        {groups.length === 0 ? (
          <p className="px-2 py-4 text-xs text-muted-foreground text-center">Aucune conversation</p>
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

      {/* Formation modules */}
      <div className="border-t border-border px-2 pt-2 pb-3">
        <button
          onClick={() => setModulesOpen((v) => !v)}
          className="flex w-full items-center gap-2 px-2 py-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground transition"
        >
          <BookOpen className="h-3.5 w-3.5" />
          Formation
          <span className="ml-auto">{modulesOpen ? "▲" : "▼"}</span>
        </button>
        {modulesOpen && (
          <div className="mt-1 space-y-0.5">
            {ATLAS_MODULES.map((mod) => (
              <button
                key={mod.id}
                onClick={() => { onSelectModule(mod.id, mod.welcome); onMobileClose() }}
                className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition"
              >
                <span className="flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full bg-primary/20 text-[10px] font-bold text-primary">
                  {mod.num}
                </span>
                <span className="truncate">{mod.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-56 flex-shrink-0 flex-col border-r border-border bg-card">
        <SidebarContent />
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
