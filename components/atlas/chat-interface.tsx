"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { ChevronDown } from "lucide-react"
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
}

// Word-by-word interval (ms) — fast enough to feel live, slow enough to read
const WORD_INTERVAL_MS = 22

export function ChatInterface() {
  const { user } = useUser()
  const [messages, setMessages] = useState<Message[]>([])
  const [isTyping, setIsTyping] = useState(false)
  const [isStreaming, setIsStreaming] = useState(false)
  const [showScrollBtn, setShowScrollBtn] = useState(false)

  const scrollRef = useRef<HTMLDivElement>(null)
  const abortRef = useRef<AbortController | null>(null)

  // Word-queue streaming
  const wordQueueRef = useRef<string[]>([])
  const displayedTextRef = useRef("")
  const wordTimerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const currentIdRef = useRef<string>("")

  // Smart scroll
  const isAtBottomRef = useRef(true)

  const sessionId = user?.id ? `atlas-${user.id}` : "atlas-guest"

  const scrollToBottom = useCallback((force = false) => {
    if (!scrollRef.current) return
    if (force || isAtBottomRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [])

  const handleScroll = useCallback(() => {
    const el = scrollRef.current
    if (!el) return
    const distFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight
    isAtBottomRef.current = distFromBottom < 80
    setShowScrollBtn(distFromBottom > 120)
  }, [])

  // Flush remaining queue immediately (called on stream end)
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

  // Start word-by-word interval
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

    const userMsg: Message = { id: Date.now().toString(), role: "user", content }
    setMessages((prev) => [...prev, userMsg])
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
        body: JSON.stringify({ message: content, sessionId, userId: user?.id }),
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

      // Start word-by-word display
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

          if (token) {
            wordQueueRef.current.push(token)
          }
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
    } finally {
      // Wait briefly for the queue to drain, then flush the rest
      setTimeout(() => {
        flushQueue(assistantId)
        setIsTyping(false)
        setIsStreaming(false)
        scrollToBottom()
      }, wordQueueRef.current.length * WORD_INTERVAL_MS + 100)
    }
  }

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <QuoteCard />

      {/* Scrollable messages area — relative so the scroll btn can be positioned inside */}
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

        {/* Scroll-to-bottom button */}
        {showScrollBtn && (
          <button
            onClick={() => {
              scrollToBottom(true)
              setShowScrollBtn(false)
            }}
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
