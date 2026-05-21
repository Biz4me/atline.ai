"use client"

import { useState } from "react"
import Link from "next/link"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { Copy, ThumbsUp, ThumbsDown, RotateCcw, Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { AtlineLogo } from "@/components/dashboard/logo"

interface ChatMessageProps {
  role: "user" | "assistant"
  content: string
  isStreaming?: boolean
}

function toHardBreaks(content: string): string {
  return content.replace(/(?<!\n)\n(?!\n)/g, "  \n")
}

export function ChatMessage({ role, content, isStreaming }: ChatMessageProps) {
  const isUser = role === "user"
  const [copied, setCopied] = useState(false)
  const [vote, setVote] = useState<"up" | "down" | null>(null)

  const handleCopy = () => {
    navigator.clipboard.writeText(content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className={cn("flex w-full", isUser ? "justify-end" : "justify-start")}>
      {isUser ? (
        <div className="max-w-[75%] rounded-[18px] bg-primary px-4 py-3 text-white lg:max-w-[60%]">
          <p className="text-base leading-snug whitespace-pre-wrap">{content}</p>
        </div>
      ) : (
        <div className="w-full">
        <div className={cn("w-full text-zinc-300 text-base", isStreaming && "atlas-token-in")}>
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
                <p className="leading-relaxed mb-2 last:mb-0">{children}</p>
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
                    <Link href={href} className="font-medium text-primary underline underline-offset-2 hover:opacity-80">
                      {children}
                    </Link>
                  )
                }
                return (
                  <a href={href} target="_blank" rel="noopener noreferrer" className="font-medium text-primary underline underline-offset-2 hover:opacity-80">
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

        {/* Action buttons — after streaming completes */}
        {!isStreaming && (
          <div className="mt-3 flex items-center gap-1">
            <button onClick={handleCopy} className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground/50 transition hover:text-muted-foreground">
              {copied ? <Check className="h-3.5 w-3.5 text-green-400" /> : <Copy className="h-3.5 w-3.5" />}
            </button>
            <button onClick={() => setVote(v => v === "up" ? null : "up")} className={cn("flex h-7 w-7 items-center justify-center rounded-md transition", vote === "up" ? "text-primary" : "text-muted-foreground/50 hover:text-muted-foreground")}>
              <ThumbsUp className="h-3.5 w-3.5" />
            </button>
            <button onClick={() => setVote(v => v === "down" ? null : "down")} className={cn("flex h-7 w-7 items-center justify-center rounded-md transition", vote === "down" ? "text-red-400" : "text-muted-foreground/50 hover:text-muted-foreground")}>
              <ThumbsDown className="h-3.5 w-3.5" />
            </button>
            <button className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground/50 transition hover:text-muted-foreground">
              <RotateCcw className="h-3.5 w-3.5" />
            </button>
          </div>
        )}
        </div>
      )}
    </div>
  )
}

export function TypingIndicator() {
  return (
    <div className="flex items-center py-2">
      <AtlineLogo size="md" showText={false} className="atlas-heartbeat" />
    </div>
  )
}
