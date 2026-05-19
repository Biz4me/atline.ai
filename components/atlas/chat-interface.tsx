"use client"

import { useState, useRef, useEffect, useCallback } from "react"
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

export function ChatInterface() {
  const { user } = useUser()
  const [messages, setMessages] = useState<Message[]>([])
  const [isTyping, setIsTyping] = useState(false)
  const [isStreaming, setIsStreaming] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const abortRef = useRef<AbortController | null>(null)
  // RAF batching
  const pendingTextRef = useRef("")
  const rafRef = useRef<number | null>(null)
  const currentIdRef = useRef<string>("")
  // Smart scroll
  const isAtBottomRef = useRef(true)

  const sessionId = user?.id ? `atlas-${user.id}` : "atlas-guest"

  // Track if user is near the bottom
  const handleScroll = useCallback(() => {
    const el = scrollRef.current
    if (!el) return
    isAtBottomRef.current = el.scrollHeight - el.scrollTop - el.clientHeight < 80
  }, [])

  const scrollToBottom = useCallback((force = false) => {
    if (!scrollRef.current) return
    if (force || isAtBottomRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [])

  // Flush buffered text to state at 60fps
  const flushText = useCallback(() => {
    rafRef.current = null
    const id = currentIdRef.current
    const text = pendingTextRef.current
    setMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, content: text } : m))
    )
    scrollToBottom()
  }, [scrollToBottom])

  const scheduleFlush = useCallback(() => {
    if (rafRef.current) return
    rafRef.current = requestAnimationFrame(flushText)
  }, [flushText])

  const handleSend = async (content: string) => {
    if (isStreaming) return

    const userMsg: Message = { id: Date.now().toString(), role: "user", content }
    setMessages((prev) => [...prev, userMsg])
    setIsTyping(true)
    isAtBottomRef.current = true
    scrollToBottom(true)

    const assistantId = `assistant-${Date.now()}`
    currentIdRef.current = assistantId
    pendingTextRef.current = ""

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
            } else if (parsed.event === "end" || parsed.event === "start" || parsed.event === "metadata") {
              continue
            } else if (typeof parsed === "string") {
              token = parsed
            }
          } catch {
            token = raw
          }

          if (token) {
            pendingTextRef.current += token
            scheduleFlush()
          }
        }
      }
    } catch (err: unknown) {
      setIsTyping(false)
      if (err instanceof Error && err.name === "AbortError") return

      const errorMsg = "Désolé, je ne suis pas disponible pour l'instant. Réessaie dans un instant."
      setMessages((prev) => {
        const existing = prev.find((m) => m.id === assistantId)
        if (existing) return prev.map((m) => m.id === assistantId ? { ...m, content: errorMsg } : m)
        return [...prev, { id: assistantId, role: "assistant", content: errorMsg }]
      })
    } finally {
      // Flush any remaining buffered text
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
        rafRef.current = null
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId ? { ...m, content: pendingTextRef.current, isStreaming: false } : m
          )
        )
      } else {
        setMessages((prev) =>
          prev.map((m) => (m.id === assistantId ? { ...m, isStreaming: false } : m))
        )
      }
      setIsTyping(false)
      setIsStreaming(false)
      scrollToBottom()
    }
  }

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <QuoteCard />

      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto px-3 py-4 lg:px-4"
      >
        {messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary">
              <span className="text-2xl font-bold text-white">A</span>
            </div>
            <p className="font-medium text-white">
              Bonjour {user?.firstName ?? ""}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Comment puis-je t&apos;aider aujourd&apos;hui ?
            </p>
          </div>
        ) : (
          <div className="space-y-4">
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

      <div className="relative w-full">
        <MessageToast messagesRemaining={8} />
        <QuickPrompts onSelect={handleSend} />
      </div>

      <ChatInput onSend={handleSend} disabled={isStreaming} />
    </div>
  )
}
