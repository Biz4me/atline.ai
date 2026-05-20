"use client"

import { cn } from "@/lib/utils"

interface ChatMessageProps {
  role: "user" | "assistant"
  content: string
  isStreaming?: boolean
}

function renderContent(content: string, isStreaming?: boolean) {
  const paragraphs = content.split(/\n\n+/)
  return paragraphs.map((para, i) => {
    const isLast = i === paragraphs.length - 1
    const lines = para.split("\n")
    return (
      <p key={i} className={cn("text-base leading-snug", !isLast && "mb-2")}>
        {lines.map((line, j) => (
          <span key={j}>
            {line}
            {j < lines.length - 1 && <br />}
          </span>
        ))}
        {isLast && isStreaming && (
          <span className="ml-0.5 inline-block h-[15px] w-[2px] translate-y-[2px] animate-pulse rounded-sm bg-current opacity-70" />
        )}
      </p>
    )
  })
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
        {isUser ? (
          <p className="text-base leading-snug whitespace-pre-wrap">
            {content}
          </p>
        ) : (
          renderContent(content, isStreaming)
        )}
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
