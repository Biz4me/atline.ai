"use client"

import { useState, useRef, useEffect } from "react"
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

  // session id: one per browser session, tied to user
  const sessionId = user?.id ? `atlas-${user.id}` : "atlas-guest"

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, isTyping])

  const handleSend = async (content: string) => {
    if (isStreaming) return

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content,
    }
    setMessages((prev) => [...prev, userMsg])
    setIsTyping(true)

    const assistantId = `assistant-${Date.now()}`

    abortRef.current = new AbortController()

    try {
      const res = await fetch("/api/atlas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: content, sessionId }),
        signal: abortRef.current.signal,
      })

      if (!res.ok || !res.body) {
        throw new Error("Réponse invalide")
      }

      // Add empty assistant message and start streaming
      setIsTyping(false)
      setIsStreaming(true)
      setMessages((prev) => [
        ...prev,
        { id: assistantId, role: "assistant", content: "", isStreaming: true },
      ])

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
          if (!line.startsWith("data: ")) continue
          const raw = line.slice(6).trim()
          if (!raw || raw === "[DONE]") continue

          let token = ""
          try {
            const parsed = JSON.parse(raw)
            // Flowise SSE format: { event: "token", data: "..." }
            if (parsed.event === "token" && typeof parsed.data === "string") {
              token = parsed.data
            } else if (parsed.event === "end") {
              break
            } else if (typeof parsed === "string") {
              token = parsed
            }
          } catch {
            // raw token (non-JSON line)
            token = raw
          }

          if (token) {
            setMessages((prev) =>
              prev.map((m) =>
                m.id === assistantId
                  ? { ...m, content: m.content + token }
                  : m
              )
            )
          }
        }
      }
    } catch (err: unknown) {
      setIsTyping(false)
      if (err instanceof Error && err.name === "AbortError") return

      // Show error in assistant bubble
      setMessages((prev) => {
        const existing = prev.find((m) => m.id === assistantId)
        if (existing) {
          return prev.map((m) =>
            m.id === assistantId
              ? { ...m, content: "Désolé, je ne suis pas disponible pour l'instant. Réessaie dans un instant." }
              : m
          )
        }
        return [
          ...prev,
          {
            id: assistantId,
            role: "assistant",
            content: "Désolé, je ne suis pas disponible pour l'instant. Réessaie dans un instant.",
          },
        ]
      })
    } finally {
      setIsTyping(false)
      setIsStreaming(false)
      // Remove streaming flag from last message
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantId ? { ...m, isStreaming: false } : m
        )
      )
    }
  }

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <QuoteCard />

      <div ref={scrollRef} className="flex-1 overflow-y-auto px-3 py-4 lg:px-4">
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
