"use client"

import { useState, useRef, useEffect, useCallback, useMemo } from "react"
import { ChevronDown, Menu, ChevronLeft } from "lucide-react"
import { ChatMessage, TypingIndicator } from "./chat-message"
import { QuickPrompts } from "./quick-prompts"
import { ChatInput } from "./chat-input"
import { useUser } from "@/hooks/use-user"
import { AtlineLogo } from "@/components/dashboard/logo"
import { getModule } from "@/lib/modules"

const SUBTITLES = [
  "Prêt à faire avancer ton business aujourd'hui ?",
  "Qu'est-ce qu'on améliore ensemble aujourd'hui ?",
  "Ton coach IA est là — quel est ton objectif du jour ?",
  "Une question, un script, une stratégie — par où on commence ?",
  "Comment puis-je t'aider à progresser aujourd'hui ?",
  "Posons les bases de ta prochaine victoire.",
  "Quel défi on attaque ensemble aujourd'hui ?",
]

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  isStreaming?: boolean
  createdAt?: string
}

interface ChatInterfaceProps {
  conversationId?: string
  moduleId?: string
  moduleWelcome?: string
  onConversationCreated?: (id: string) => void
  onExchangeComplete?: () => void
  onOpenSidebar?: () => void
  onBackToModules?: () => void
}

const WORD_INTERVAL_MS = 22

export function ChatInterface({
  conversationId,
  moduleId,
  moduleWelcome,
  onConversationCreated,
  onExchangeComplete,
  onOpenSidebar,
  onBackToModules,
}: ChatInterfaceProps) {
  const { user } = useUser()
  const subtitle = useMemo(() => SUBTITLES[Math.floor(Math.random() * SUBTITLES.length)], [])
  const [messages, setMessages] = useState<Message[]>([])
  const [isTyping, setIsTyping] = useState(false)
  const [isStreaming, setIsStreaming] = useState(false)
  const [showScrollBtn, setShowScrollBtn] = useState(false)
  const [activeConvId, setActiveConvId] = useState<string | undefined>(conversationId)

  const scrollRef = useRef<HTMLDivElement>(null)
  const lastScrollTime = useRef(0)
  const abortRef = useRef<AbortController | null>(null)
  const wordQueueRef = useRef<string[]>([])
  const displayedTextRef = useRef("")
  const wordTimerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const currentIdRef = useRef<string>("")
  const isAtBottomRef = useRef(true)
  const lastUserMessageRef = useRef<string>("")

  // Load conversation from DB on mount / conversationId change
  useEffect(() => {
    setActiveConvId(conversationId)
    if (!conversationId) {
      // New chat — show module welcome if present
      if (moduleWelcome) {
        setMessages([{
          id: "welcome",
          role: "assistant",
          content: moduleWelcome,
        }])
      } else {
        setMessages([])
      }
      return
    }
    fetch(`/api/conversations/${conversationId}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.messages && Array.isArray(data.messages)) {
          setMessages(data.messages.map((m: any) => ({
            id: m.id ?? String(Math.random()),
            role: m.role,
            content: m.content,
            createdAt: m.createdAt,
          })))
          // Scroll to bottom after React re-renders the messages
          setTimeout(() => scrollToBottom(true), 100)
        }
      })
      .catch(() => {})
  }, [conversationId, moduleWelcome])

  const scrollToBottom = useCallback((force = false) => {
    if (!scrollRef.current) return
    if (force || isAtBottomRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [])

  const handleScroll = useCallback(() => {
    const now = Date.now()
    if (now - lastScrollTime.current < 50) return
    lastScrollTime.current = now
    const el = scrollRef.current
    if (!el) return
    const dist = el.scrollHeight - el.scrollTop - el.clientHeight
    isAtBottomRef.current = dist < 80
    setShowScrollBtn(dist > 120)
  }, [])

  const flushQueue = useCallback((assistantId: string) => {
    if (wordTimerRef.current) {
      clearInterval(wordTimerRef.current)
      wordTimerRef.current = null
    }
    if (wordQueueRef.current.length > 0) {
      displayedTextRef.current += wordQueueRef.current.join("")
      wordQueueRef.current = []
    }
    setMessages((prev) =>
      prev.map((m) =>
        m.id === assistantId
          ? { ...m, content: displayedTextRef.current, isStreaming: false }
          : m
      )
    )
    scrollToBottom()
  }, [scrollToBottom])

  const startWordTimer = useCallback((assistantId: string) => {
    if (wordTimerRef.current) return
    wordTimerRef.current = setInterval(() => {
      if (wordQueueRef.current.length === 0) return
      const token = wordQueueRef.current.shift()!
      displayedTextRef.current += token
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantId ? { ...m, content: displayedTextRef.current } : m
        )
      )
      if (isAtBottomRef.current) scrollToBottom()
    }, WORD_INTERVAL_MS)
  }, [scrollToBottom])

  const handleSend = async (content: string) => {
    if (isStreaming) return

    // Show user message immediately — before any network call
    lastUserMessageRef.current = content
    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content,
      createdAt: new Date().toISOString(),
    }
    setMessages((prev) => [...prev.filter((m) => m.id !== "welcome"), userMsg])
    setIsTyping(true)
    isAtBottomRef.current = true
    setTimeout(() => scrollToBottom(true), 50)

    // Ensure conversation exists in DB (after showing message)
    let convId = activeConvId
    if (!convId && user?.id) {
      try {
        const res = await fetch("/api/conversations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ moduleId: moduleId ?? null }),
        })
        const data = await res.json()
        convId = data.id
        setActiveConvId(convId)
        onConversationCreated?.(data.id)
      } catch {}
    }

    const assistantId = `assistant-${Date.now()}`
    currentIdRef.current = assistantId
    wordQueueRef.current = []
    displayedTextRef.current = ""

    abortRef.current = new AbortController()

    try {
      const res = await fetch("/api/atlas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: content,
          userId: user?.id,
          conversationId: convId,
          moduleId: moduleId ?? null,
        }),
        signal: abortRef.current.signal,
      })

      if (!res.ok || !res.body) throw new Error("Réponse invalide")

      setIsTyping(false)
      setIsStreaming(true)
      setMessages((prev) => [
        ...prev,
        { id: assistantId, role: "assistant", content: "", isStreaming: true },
      ])
      scrollToBottom(true)
      startWordTimer(assistantId)

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ""

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split("\n")
        buffer = lines.pop() ?? ""

        for (const line of lines) {
          if (!line.startsWith("data:")) continue
          const raw = line.slice(5).trim()
          if (!raw || raw === "[DONE]") continue

          let token = ""
          try {
            const parsed = JSON.parse(raw)
            if (parsed.event === "token" && typeof parsed.data === "string") {
              token = parsed.data
            } else if (
              parsed.event === "end" ||
              parsed.event === "start" ||
              parsed.event === "metadata"
            ) {
              continue
            } else if (typeof parsed === "string") {
              token = parsed
            }
          } catch {
            token = raw
          }

          if (token) wordQueueRef.current.push(token)
        }
      }
    } catch (err: unknown) {
      setIsTyping(false)
      if (err instanceof Error && err.name === "AbortError") return

      const errorMsg =
        "Désolé, je ne suis pas disponible pour l'instant. Réessaie dans un instant."
      setMessages((prev) => {
        const existing = prev.find((m) => m.id === assistantId)
        if (existing)
          return prev.map((m) =>
            m.id === assistantId ? { ...m, content: errorMsg, isStreaming: false } : m
          )
        return [...prev, { id: assistantId, role: "assistant", content: errorMsg }]
      })
      if (wordTimerRef.current) {
        clearInterval(wordTimerRef.current)
        wordTimerRef.current = null
      }
      return
    } finally {
      setTimeout(() => {
        flushQueue(assistantId)
        setIsTyping(false)
        setIsStreaming(false)
        scrollToBottom(true)
        onExchangeComplete?.()
      }, wordQueueRef.current.length * WORD_INTERVAL_MS + 150)
    }
  }

  const handleRegenerate = useCallback(() => {
    if (isStreaming || !lastUserMessageRef.current) return
    setMessages((prev) => {
      const lastAssistant = [...prev].reverse().find((m) => m.role === "assistant")
      if (!lastAssistant) return prev
      return prev.filter((m) => m.id !== lastAssistant.id)
    })
    handleSend(lastUserMessageRef.current)
  }, [isStreaming]) // eslint-disable-line react-hooks/exhaustive-deps

  const lastAssistantId = [...messages].reverse().find((m) => m.role === "assistant" && !m.isStreaming)?.id

  const hasMessages = messages.length > 0
  const activeModule = moduleId ? getModule(moduleId) : undefined

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      {/* Mobile header */}
      <div className="flex items-center gap-2 border-b border-border px-3 py-2 lg:hidden">
        {onBackToModules ? (
          <button onClick={onBackToModules} className="p-1.5 text-muted-foreground hover:text-foreground transition">
            <ChevronLeft className="h-5 w-5" />
          </button>
        ) : (
          <button onClick={onOpenSidebar} className="p-1.5 text-muted-foreground hover:text-foreground transition">
            <Menu className="h-5 w-5" />
          </button>
        )}
        <span className="text-sm font-medium text-foreground">
          {activeModule ? activeModule.subtitle : "Atlas"}
        </span>
      </div>

      {!hasMessages ? (
        /* ── Welcome screen ── */
        <div className="flex flex-1 flex-col items-center justify-center px-4 py-8">
          <div className="flex w-full max-w-[700px] flex-col items-center gap-8">
            <AtlineLogo size="xl" showText={false} />
            <div className="text-center">
              {activeModule ? (
                <>
                  <p className="text-sm font-semibold uppercase tracking-wider" style={{ color: activeModule.color }}>
                    {activeModule.label}
                  </p>
                  <h1 className="mt-1 text-3xl font-bold text-foreground">{activeModule.subtitle}</h1>
                </>
              ) : (
                <>
                  <h1 className="text-3xl font-bold text-foreground">
                    Bonjour {user?.firstName ?? ""}
                  </h1>
                  <p className="mt-2 text-base text-muted-foreground">{subtitle}</p>
                </>
              )}
            </div>
            <div className="w-full space-y-4">
              <ChatInput onSend={handleSend} disabled={isStreaming} />
              {!activeModule && <QuickPrompts onSelect={handleSend} />}
            </div>
          </div>
        </div>
      ) : (
        /* ── Chat mode ── */
        <>
          <div className="relative flex-1 overflow-hidden">
            <div
              ref={scrollRef}
              onScroll={handleScroll}
              className="h-full overflow-y-auto"
            >
              <div className="mx-auto max-w-[700px] space-y-6 px-4 pt-6 pb-8">
                {messages.map((msg) => (
                  <ChatMessage
                    key={msg.id}
                    role={msg.role}
                    content={msg.content}
                    isStreaming={msg.isStreaming}
                    messageId={msg.id}
                    onRegenerate={msg.id === lastAssistantId ? handleRegenerate : undefined}
                  />
                ))}
                {isTyping && <TypingIndicator />}
              </div>
              <div className="pointer-events-none sticky bottom-0 h-8 bg-gradient-to-t from-background to-transparent" />
            </div>

            {showScrollBtn && (
              <button
                onClick={() => { scrollToBottom(true); setShowScrollBtn(false) }}
                className="absolute bottom-4 left-1/2 z-10 flex h-8 w-8 -translate-x-1/2 items-center justify-center rounded-full border border-border bg-card text-muted-foreground shadow-md transition hover:bg-muted hover:text-foreground"
                aria-label="Aller en bas"
              >
                <ChevronDown className="h-4 w-4" />
              </button>
            )}
          </div>

          <div className="bg-background py-3">
            <div className="mx-auto max-w-[780px] px-4">
              <ChatInput onSend={handleSend} disabled={isStreaming} />
            </div>
          </div>
        </>
      )}
    </div>
  )
}
