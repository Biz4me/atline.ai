"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { ChevronDown, Menu } from "lucide-react"
import { QuoteCard } from "./quote-card"
import { ChatMessage, TypingIndicator } from "./chat-message"
import { QuickPrompts } from "./quick-prompts"
import { ChatInput } from "./chat-input"
import { MessageToast } from "./message-toast"
import { useUser } from "@/hooks/use-user"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  isStreaming?: boolean
  createdAt?: string
}

interface ChatInterfaceProps {
  conversationId?: string
  moduleWelcome?: string
  onConversationCreated?: (id: string) => void
  onExchangeComplete?: () => void
  onOpenSidebar?: () => void
}

const WORD_INTERVAL_MS = 22

export function ChatInterface({
  conversationId,
  moduleWelcome,
  onConversationCreated,
  onExchangeComplete,
  onOpenSidebar,
}: ChatInterfaceProps) {
  const { user } = useUser()
  const [messages, setMessages] = useState<Message[]>([])
  const [isTyping, setIsTyping] = useState(false)
  const [isStreaming, setIsStreaming] = useState(false)
  const [showScrollBtn, setShowScrollBtn] = useState(false)
  const [activeConvId, setActiveConvId] = useState<string | undefined>(conversationId)

  const scrollRef = useRef<HTMLDivElement>(null)
  const abortRef = useRef<AbortController | null>(null)
  const wordQueueRef = useRef<string[]>([])
  const displayedTextRef = useRef("")
  const wordTimerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const currentIdRef = useRef<string>("")
  const isAtBottomRef = useRef(true)

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

    // Ensure conversation exists in DB
    let convId = activeConvId
    if (!convId && user?.id) {
      try {
        const res = await fetch("/api/conversations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ moduleId: null }),
        })
        const data = await res.json()
        convId = data.id
        setActiveConvId(convId)
        onConversationCreated?.(data.id)
      } catch {}
    }

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content,
      createdAt: new Date().toISOString(),
    }
    setMessages((prev) => {
      // Remove welcome message if present
      const filtered = prev.filter((m) => m.id !== "welcome")
      return [...filtered, userMsg]
    })
    setIsTyping(true)
    isAtBottomRef.current = true
    scrollToBottom(true)

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
        scrollToBottom()
        // Trigger sidebar refresh so new title appears
        onExchangeComplete?.()
      }, wordQueueRef.current.length * WORD_INTERVAL_MS + 150)
    }
  }

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      {/* Mobile header with sidebar toggle */}
      <div className="flex items-center gap-2 border-b border-border px-3 py-2 lg:hidden">
        <button
          onClick={onOpenSidebar}
          className="p-1.5 text-muted-foreground hover:text-foreground transition"
        >
          <Menu className="h-5 w-5" />
        </button>
        <span className="text-sm font-medium text-foreground">Atlas</span>
      </div>

      <QuoteCard />

      <div className="relative flex-1 overflow-hidden">
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="h-full overflow-y-auto px-3 py-4 lg:px-4"
        >
          {messages.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <div
                className={
                  "mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary" +
                  (isTyping ? " atlas-icon-thinking" : "")
                }
              >
                <span className="text-2xl font-bold text-white">A</span>
              </div>
              <p className="font-medium text-white">Bonjour {user?.firstName ?? ""}</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Comment puis-je t&apos;aider aujourd&apos;hui ?
              </p>
            </div>
          ) : (
            <div className="space-y-4 pb-6">
              {messages.map((msg) => (
                <ChatMessage
                  key={msg.id}
                  role={msg.role}
                  content={msg.content}
                  isStreaming={msg.isStreaming}
                />
              ))}
              {isTyping && <TypingIndicator />}
            </div>
          )}

          {messages.length > 0 && (
            <div className="pointer-events-none sticky bottom-0 h-8 bg-gradient-to-t from-background to-transparent" />
          )}
        </div>

        {showScrollBtn && (
          <button
            onClick={() => { scrollToBottom(true); setShowScrollBtn(false) }}
            className="absolute bottom-10 right-4 flex h-8 w-8 items-center justify-center rounded-full border border-border bg-card text-muted-foreground shadow-md transition hover:bg-muted hover:text-foreground"
            aria-label="Aller en bas"
          >
            <ChevronDown className="h-4 w-4" />
          </button>
        )}
      </div>

      <div className="relative w-full">
        <MessageToast messagesRemaining={8} />
        <QuickPrompts onSelect={handleSend} />
      </div>

      <ChatInput onSend={handleSend} disabled={isStreaming} />
    </div>
  )
}
