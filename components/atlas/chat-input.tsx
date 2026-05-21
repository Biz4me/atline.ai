"use client"

import { useState, useRef, useEffect } from "react"
import { Mic, MicOff, ArrowUp } from "lucide-react"
import { cn } from "@/lib/utils"

interface ChatInputProps {
  onSend: (message: string) => void
  disabled?: boolean
}

const MIN_HEIGHT = 28
const MAX_HEIGHT = 160

export function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [message, setMessage] = useState("")
  const [isRecording, setIsRecording] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null)

  useEffect(() => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = "auto"
    el.style.height = message
      ? Math.min(el.scrollHeight, MAX_HEIGHT) + "px"
      : MIN_HEIGHT + "px"
  }, [message])

  useEffect(() => {
    return () => recognitionRef.current?.stop()
  }, [])

  const submit = () => {
    const text = message.trim()
    if (!text || disabled) return
    onSend(text)
    setMessage("")
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      submit()
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    submit()
  }

  const toggleRecording = () => {
    if (isRecording) {
      recognitionRef.current?.stop()
      setIsRecording(false)
      return
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const w = window as any
    const SpeechRecognition = w.SpeechRecognition || w.webkitSpeechRecognition
    if (!SpeechRecognition) return
    const recognition = new SpeechRecognition()
    recognition.lang = "fr-FR"
    recognition.interimResults = false
    recognition.maxAlternatives = 1
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recognition.onresult = (event: any) => setMessage(event.results[0][0].transcript)
    recognition.onend = () => setIsRecording(false)
    recognition.onerror = () => setIsRecording(false)
    recognitionRef.current = recognition
    recognition.start()
    setIsRecording(true)
  }

  const canSend = message.trim().length > 0 && !disabled

  return (
    <form onSubmit={handleSubmit}>
      <div className="rounded-2xl border border-border bg-card px-4 pt-3 pb-3 transition-colors focus-within:border-primary/40">
        {/* Textarea */}
        <textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Pose une question…"
          disabled={disabled}
          rows={1}
          style={{ height: MIN_HEIGHT }}
          className="w-full resize-none overflow-y-auto bg-transparent text-base text-foreground placeholder:text-muted-foreground/60 focus:outline-none leading-snug disabled:opacity-50"
        />

        {/* Bottom bar */}
        <div className="flex items-center justify-end gap-2 pt-2">
          {/* Mic */}
          <button
            type="button"
            onClick={toggleRecording}
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:text-foreground",
              isRecording && "animate-pulse text-primary"
            )}
          >
            {isRecording
              ? <MicOff className="h-4 w-4" />
              : <Mic className="h-4 w-4" />}
          </button>

          {/* Send */}
          <button
            type="submit"
            disabled={!canSend}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white transition-colors hover:bg-primary/90 disabled:opacity-30"
          >
            <ArrowUp className="h-4 w-4" />
          </button>
        </div>
      </div>
    </form>
  )
}
