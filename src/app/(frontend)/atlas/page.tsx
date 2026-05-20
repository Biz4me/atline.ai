"use client"

import { Suspense, useState, useCallback } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { ChatShell } from "@/components/atlas/chat-shell"
import { ChatInterface } from "@/components/atlas/chat-interface"
import { AtlasSidebar } from "@/components/atlas/atlas-sidebar"

function AtlasContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const conversationId = searchParams.get("c") ?? undefined

  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [moduleWelcome, setModuleWelcome] = useState<string | undefined>(undefined)
  const [refreshKey, setRefreshKey] = useState(0)

  const handleNewChat = useCallback(() => {
    setModuleWelcome(undefined)
    router.push("/atlas")
  }, [router])

  const handleSelectConversation = useCallback((id: string) => {
    setModuleWelcome(undefined)
    router.push(`/atlas?c=${id}`)
  }, [router])

  const handleSelectModule = useCallback((moduleId: string, welcome: string) => {
    setModuleWelcome(welcome)
    router.push("/atlas")
  }, [router])

  const handleConversationCreated = useCallback((id: string) => {
    router.replace(`/atlas?c=${id}`)
    setRefreshKey((k) => k + 1)
  }, [router])

  const handleExchangeComplete = useCallback(() => {
    setRefreshKey((k) => k + 1)
  }, [])

  return (
    <ChatShell breadcrumbs={[{ label: "Atlas" }]} hideSidebar>
      <div className="flex h-full overflow-hidden">
        <AtlasSidebar
          activeConversationId={conversationId}
          onNewChat={handleNewChat}
          onSelectConversation={handleSelectConversation}
          onSelectModule={handleSelectModule}
          onDeleteConversation={() => setRefreshKey((k) => k + 1)}
          mobileOpen={sidebarOpen}
          onMobileClose={() => setSidebarOpen(false)}
          refreshKey={refreshKey}
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
  return <Suspense><AtlasContent /></Suspense>
}
