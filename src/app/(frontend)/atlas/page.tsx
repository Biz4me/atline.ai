"use client"

import { Suspense, useState, useCallback } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { ChatShell } from "@/components/atlas/chat-shell"
import { ChatInterface } from "@/components/atlas/chat-interface"
import { AtlasSidebar } from "@/components/atlas/atlas-sidebar"
import { ErrorBoundary } from "@/components/error-boundary"

function AtlasContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const conversationId = searchParams.get("c") ?? undefined

  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [moduleWelcome, setModuleWelcome] = useState<string | undefined>(undefined)

  const handleNewChat = useCallback(() => {
    setModuleWelcome(undefined)
    router.push("/atlas")
  }, [router])

  const handleSelectConversation = useCallback((id: string) => {
    setModuleWelcome(undefined)
    router.push(`/atlas?c=${id}`)
  }, [router])

  const handleSelectModule = useCallback((_moduleId: string, welcome: string) => {
    setModuleWelcome(welcome)
    router.push("/atlas")
  }, [router])

  const handleConversationCreated = useCallback((id: string) => {
    window.history.replaceState(null, "", `/atlas?c=${id}`)
    window.dispatchEvent(new Event("atlas:refresh"))
  }, [])

  const handleExchangeComplete = useCallback(() => {
    window.dispatchEvent(new Event("atlas:refresh"))
  }, [])

  return (
    <ChatShell>
      <div className="flex h-full overflow-hidden">
        {/* Mobile-only sidebar overlay */}
        <AtlasSidebar
          mobileOnly
          activeConversationId={conversationId}
          onNewChat={handleNewChat}
          onSelectConversation={handleSelectConversation}
          onSelectModule={handleSelectModule}
          onDeleteConversation={() => window.dispatchEvent(new Event("atlas:refresh"))}
          mobileOpen={sidebarOpen}
          onMobileClose={() => setSidebarOpen(false)}
        />
        <ChatInterface
          key={conversationId ?? "new"}
          conversationId={conversationId}
          moduleWelcome={!conversationId ? moduleWelcome : undefined}
          onConversationCreated={handleConversationCreated}
          onExchangeComplete={handleExchangeComplete}
          onOpenSidebar={() => setSidebarOpen(true)}
        />
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
