"use client"

import { Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { ChatShell } from "@/components/atlas/chat-shell"
import { ChatInterface } from "@/components/atlas/chat-interface"

function AtlasContent() {
  const searchParams = useSearchParams()
  const tab = searchParams.get("tab")

  return (
    <ChatShell breadcrumbs={[{ label: "Atlas" }]}>
      {(!tab || tab === "chat") && <ChatInterface />}
      {tab === "historique" && (
        <div className="flex flex-1 flex-col items-center justify-center gap-3 text-center">
          <p className="text-3xl">🕐</p>
          <p className="font-medium text-white">Historique des conversations</p>
          <p className="text-sm text-muted-foreground">Tes sessions précédentes avec Atlas apparaîtront ici.</p>
        </div>
      )}
      {tab === "scripts" && (
        <div className="flex flex-1 flex-col items-center justify-center gap-3 text-center">
          <p className="text-3xl">💬</p>
          <p className="font-medium text-white">Scripts WhatsApp</p>
          <p className="text-sm text-muted-foreground">Atlas génère tes scripts d'invitation et de suivi en 1 clic.</p>
        </div>
      )}
    </ChatShell>
  )
}

export default function AtlasPage() {
  return <Suspense><AtlasContent /></Suspense>
}
