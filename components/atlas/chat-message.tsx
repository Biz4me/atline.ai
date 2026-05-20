"use client"

import Link from "next/link"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { cn } from "@/lib/utils"

interface ChatMessageProps {
  role: "user" | "assistant"
  content: string
  isStreaming?: boolean
}

// Convert single newlines to hard breaks so ✅/❌/→ items each appear on their own line.
function toHardBreaks(content: string): string {
  return content.replace(/(?<!\n)\n(?!\n)/g, "  \n")
}

export function ChatMessage({ role, content, isStreaming }: ChatMessageProps) {
  const isUser = role === "user"

  return (
    <div className={cn("flex w-full items-start gap-2", isUser ? "justify-end" : "justify-start")}>
      {/* Atlas icon — left of assistant messages, pulses while streaming */}
      {!isUser && (
        <div
          className={cn(
            "mt-1 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-white",
            isStreaming && "atlas-icon-thinking"
          )}
        >
          A
        </div>
      )}

      <div
        className={cn(
          "rounded-[14px] px-4 py-3",
          isUser
            ? "max-w-[78%] bg-primary text-white lg:max-w-[55%]"
            : "flex-1 border border-border bg-card text-foreground"
        )}
      >
        {isUser ? (
          <p className="text-base leading-snug whitespace-pre-wrap">{content}</p>
        ) : (
          <div className={cn("text-base", isStreaming && "atlas-token-in")}>
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                h2: ({ children }) => (
                  <h2 className="font-bold mb-2 mt-3 first:mt-0 text-base">{children}</h2>
                ),
                h3: ({ children }) => (
                  <h3 className="font-semibold mb-1.5 mt-2.5 first:mt-0 text-base">{children}</h3>
                ),
                p: ({ children }) => (
                  <p className="leading-snug mb-2 last:mb-0">{children}</p>
                ),
                ul: ({ children }) => (
                  <ul className="mb-2 pl-4 space-y-0.5 list-disc">{children}</ul>
                ),
                ol: ({ children }) => (
                  <ol className="mb-2 pl-4 space-y-0.5 list-decimal">{children}</ol>
                ),
                li: ({ children }) => (
                  <li className="leading-snug">{children}</li>
                ),
                pre: ({ children }) => <>{children}</>,
                code: ({ className, children }) => {
                  const isBlock = /language-/.test(className ?? "")
                  if (isBlock) {
                    return (
                      <pre className="bg-muted rounded-md p-3 mb-2 overflow-x-auto text-sm font-mono whitespace-pre-wrap">
                        {String(children).replace(/\n$/, "")}
                      </pre>
                    )
                  }
                  return (
                    <code className="bg-muted px-1 py-0.5 rounded text-sm font-mono">
                      {children}
                    </code>
                  )
                },
                blockquote: ({ children }) => (
                  <blockquote className="border-l-2 border-primary/60 pl-3 mb-2 text-muted-foreground">
                    {children}
                  </blockquote>
                ),
                strong: ({ children }) => (
                  <strong className="font-bold">{children}</strong>
                ),
                hr: () => <hr className="border-border my-2" />,
                a: ({ href, children }) => {
                  const isInternal = href?.startsWith("/")
                  if (isInternal && href) {
                    return (
                      <Link
                        href={href}
                        className="font-medium text-primary underline underline-offset-2 hover:opacity-80"
                      >
                        {children}
                      </Link>
                    )
                  }
                  return (
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-primary underline underline-offset-2 hover:opacity-80"
                    >
                      {children}
                    </a>
                  )
                },
              }}
            >
              {toHardBreaks(content)}
            </ReactMarkdown>
            {isStreaming && (
              <span className="ml-0.5 inline-block h-[15px] w-[2px] translate-y-[2px] animate-pulse rounded-sm bg-current opacity-70" />
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export function TypingIndicator() {
  return (
    <div className="flex w-full items-start gap-2">
      {/* Atlas icon pulsing while typing */}
      <div className="mt-1 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-white atlas-icon-thinking">
        A
      </div>
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
