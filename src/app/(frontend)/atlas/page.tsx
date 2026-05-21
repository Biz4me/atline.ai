"use client"

import { Suspense, useState, useCallback, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { ChatShell } from "@/components/atlas/chat-shell"
import { ChatInterface } from "@/components/atlas/chat-interface"
import { AtlasSidebar } from "@/components/atlas/atlas-sidebar"
import { ErrorBoundary } from "@/components/error-boundary"
import { ATLAS_MODULES, CORE_MODULES, SPECIALIZED_MODULES, getModule } from "@/lib/modules"
import { useModules } from "@/components/dashboard/modules-context"
import { cn } from "@/lib/utils"

function ModuleCard({
  mod,
  convId,
  onSelect,
}: {
  mod: (typeof ATLAS_MODULES)[number]
  convId: string | null
  onSelect: (moduleId: string, convId: string | null) => void
}) {
  return (
    <button
      onClick={() => onSelect(mod.id, convId)}
      className="group flex flex-col items-start gap-2 rounded-xl border border-border p-4 text-left transition-all hover:border-transparent hover:shadow-md"
      style={{ background: `linear-gradient(135deg, ${mod.bg} 0%, transparent 100%)` }}
    >
      <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: mod.color }} />
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">{mod.label}</p>
        <p className="mt-0.5 text-sm font-medium text-foreground leading-snug">{mod.subtitle}</p>
      </div>
      {convId && <span className="text-[10px] text-muted-foreground/70">Continuer →</span>}
    </button>
  )
}

function ModuleGrid({ onSelect }: { onSelect: (moduleId: string, convId: string | null) => void }) {
  const { moduleConversations } = useModules()

  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4 py-8">
      <div className="w-full max-w-[700px] space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground">Atlas</h1>
          <p className="mt-1 text-sm text-muted-foreground">Choisis un module pour continuer ta progression</p>
        </div>

        {/* 8 modules core */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {CORE_MODULES.map((mod) => (
            <ModuleCard
              key={mod.id}
              mod={mod}
              convId={moduleConversations[mod.id] ?? null}
              onSelect={onSelect}
            />
          ))}
        </div>

        {/* 3 modules spécialisés */}
        <div>
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/60">
            Spécialisé
          </p>
          <div className="grid grid-cols-3 gap-3">
            {SPECIALIZED_MODULES.map((mod) => (
              <ModuleCard
                key={mod.id}
                mod={mod}
                convId={moduleConversations[mod.id] ?? null}
                onSelect={onSelect}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function AtlasContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { moduleConversations, refresh } = useModules()

  const [conversationId, setConversationId] = useState<string | undefined>(
    searchParams.get("c") ?? undefined
  )
  const [moduleId, setModuleId] = useState<string | undefined>(
    searchParams.get("m") ?? undefined
  )
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Sync when Next.js router navigates (back button)
  useEffect(() => {
    const c = searchParams.get("c") ?? undefined
    const m = searchParams.get("m") ?? undefined
    setConversationId(c)
    setModuleId(m)
  }, [searchParams])

  // Listen for module selection from sidebar
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<{ moduleId: string; convId: string | null }>).detail
      handleSelectModule(detail.moduleId, detail.convId)
    }
    window.addEventListener("atlas:select-module", handler)
    return () => window.removeEventListener("atlas:select-module", handler)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Listen for "new chat" → go home (module grid)
  useEffect(() => {
    const handler = () => {
      setConversationId(undefined)
      setModuleId(undefined)
      router.replace("/atlas", { scroll: false })
    }
    window.addEventListener("atlas:new-chat", handler)
    return () => window.removeEventListener("atlas:new-chat", handler)
  }, [router])

  const handleSelectModule = useCallback((modId: string, convId: string | null) => {
    const mod = getModule(modId)
    if (!mod) return

    if (convId) {
      window.history.replaceState(null, "", `/atlas?c=${convId}&m=${modId}`)
      setConversationId(convId)
      setModuleId(modId)
      // Tell sidebar which conv is active
      window.dispatchEvent(new CustomEvent("atlas:conversation-active", { detail: { convId } }))
    } else {
      window.history.replaceState(null, "", `/atlas?m=${modId}`)
      setConversationId(undefined)
      setModuleId(modId)
    }
  }, [])

  const handleModuleGridSelect = useCallback((modId: string, convId: string | null) => {
    handleSelectModule(modId, convId)
  }, [handleSelectModule])

  const handleConversationCreated = useCallback((id: string) => {
    window.history.replaceState(null, "", `/atlas?c=${id}${moduleId ? `&m=${moduleId}` : ""}`)
    setConversationId(id)
    window.dispatchEvent(new CustomEvent("atlas:conversation-active", { detail: { convId: id } }))
    refresh()
  }, [moduleId, refresh])

  const handleExchangeComplete = useCallback(() => {
    window.dispatchEvent(new Event("atlas:refresh"))
    setTimeout(() => window.dispatchEvent(new Event("atlas:refresh")), 3000)
  }, [])

  const activeModule = moduleId ? getModule(moduleId) : undefined
  const showChat = !!(conversationId || moduleId)

  return (
    <ChatShell>
      <div className="flex h-full overflow-hidden">
        {/* Mobile-only sidebar overlay */}
        <AtlasSidebar
          mobileOnly
          activeConversationId={conversationId}
          onNewChat={() => {
            setConversationId(undefined)
            setModuleId(undefined)
            router.push("/atlas")
          }}
          onSelectConversation={(id) => {
            setConversationId(id)
            router.push(`/atlas?c=${id}`)
          }}
          onSelectModule={(modId, welcome) => {
            const convId = moduleConversations[modId] ?? null
            handleSelectModule(modId, convId)
          }}
          onDeleteConversation={() => refresh()}
          mobileOpen={sidebarOpen}
          onMobileClose={() => setSidebarOpen(false)}
        />

        {showChat ? (
          <ChatInterface
            key={`${moduleId ?? "free"}-${conversationId ?? "new"}`}
            conversationId={conversationId}
            moduleId={moduleId}
            moduleWelcome={!conversationId && activeModule ? activeModule.welcome : undefined}
            onConversationCreated={handleConversationCreated}
            onExchangeComplete={handleExchangeComplete}
            onOpenSidebar={() => setSidebarOpen(true)}
            onBackToModules={() => {
              setConversationId(undefined)
              setModuleId(undefined)
              window.history.replaceState(null, "", "/atlas")
            }}
          />
        ) : (
          <div className="flex flex-1 flex-col overflow-hidden">
            {/* Mobile header */}
            <div className="flex items-center gap-2 border-b border-border px-3 py-2 lg:hidden">
              <span className="text-sm font-medium text-foreground">Atlas</span>
            </div>
            <ModuleGrid onSelect={handleModuleGridSelect} />
          </div>
        )}
      </div>
    </ChatShell>
  )
}

export default function AtlasPage() {
  return (
    <ErrorBoundary>
      <Suspense><AtlasContent /></Suspense>
    </ErrorBoundary>
  )
}
