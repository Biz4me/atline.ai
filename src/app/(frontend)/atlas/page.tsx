"use client"

import { Suspense, useState, useCallback, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { ChatShell } from "@/components/atlas/chat-shell"
import { ChatInterface } from "@/components/atlas/chat-interface"
import { AtlasSidebar } from "@/components/atlas/atlas-sidebar"
import { ErrorBoundary } from "@/components/error-boundary"

function AtlasContent() {
  const router = useRouter()
  const searchParams = useSearchParams()

  // Local state so we can update it without causing ChatInterface to remount mid-stream
  const [conversationId, setConversationId] = useState<string | undefined>(
    searchParams.get("c") ?? undefined
  )
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [moduleWelcome, setModuleWelcome] = useState<string | undefined>(undefined)

  // Sync when Next.js router navigates (sidebar clicks, back button)
  useEffect(() => {
    setConversationId(searchParams.get("c") ?? undefined)
  }, [searchParams])

  // Listen for the "new chat" event dispatched by the sparkle button in the desktop sidebar
  useEffect(() => {
    const handler = () => {
      setConversationId(undefined)
      setModuleWelcome(undefined)
      // Also reset the URL cleanly via the router so Next.js tracks it
      router.replace("/atlas", { scroll: false })
    }
    window.addEventListener("atlas:new-chat", handler)
    return () => window.removeEventListener("atlas:new-chat", handler)
  }, [router])

  const handleNewChat = useCallback(() => {
    setConversationId(undefined)
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
    // Update URL without triggering a Next.js re-render (avoids remounting ChatInterface mid-stream)
    window.history.replaceState(null, "", `/atlas?c=${id}`)
    setConversationId(id)
    window.dispatchEvent(new Event("atlas:refresh"))
  }, [])

  const handleExchangeComplete = useCallback(() => {
    window.dispatchEvent(new Event("atlas:refresh"))
    // Second refresh after delay to pick up the AI-generated title from after()
    setTimeout(() => window.dispatchEvent(new Event("atlas:refresh")), 3000)
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
