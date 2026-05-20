"use client"

import { cn } from "@/lib/utils"

interface ChatMessageProps {
  role: "user" | "assistant"
  content: string
  isStreaming?: boolean
}

export function ChatMessage({ role, content, isStreaming }: ChatMessageProps) {
  const isUser = role === "user"

  return (
    <div className={cn("flex w-full", isUser ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "rounded-[14px] px-4 py-3",
          isUser
            ? "max-w-[78%] bg-primary text-white lg:max-w-[55%]"
            : "w-full border border-border bg-card text-foreground"
        )}
      >
        <p className="whitespace-pre-wrap text-base leading-relaxed">
          {content}
          {isStreaming && (
            <span className="ml-0.5 inline-block h-[16px] w-[2px] translate-y-[2px] animate-pulse rounded-sm bg-current opacity-70" />
          )}
        </p>
      </div>
    </div>
  )
}

export function TypingIndicator() {
  return (
    <div className="flex w-full">
      <div className="rounded-[14px] border border-border bg-card px-4 py-3">
        <div className="flex gap-1">
          <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.3s]" />
          <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.15s]" />
          <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground" />
        </div>
      </div>
    </div>
  )
}
