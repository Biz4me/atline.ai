"use client"

import { useState, useRef, useEffect } from "react"
import { Mic, MicOff, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface ChatInputProps {
  onSend: (message: string) => void
  disabled?: boolean
}

const MIN_HEIGHT = 44  // px — single line
const MAX_HEIGHT = 160 // px — ~5 lines

export function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [message, setMessage] = useState("")
  const [isRecording, setIsRecording] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null)

  // Auto-resize textarea
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

  return (
    <div className="border-t border-border bg-background" style={{ paddingBottom: "env(safe-area-inset-bottom)" }}>
      <form onSubmit={handleSubmit} className="flex items-end gap-2 p-3 lg:gap-3 lg:p-4">

        {/* Microphone */}
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={toggleRecording}
          className={cn(
            "mb-0.5 h-10 w-10 shrink-0 rounded-full lg:h-11 lg:w-11",
            isRecording && "animate-pulse text-accent"
          )}
        >
          {isRecording
            ? <MicOff className="h-5 w-5 text-accent" />
            : <Mic className="h-5 w-5 text-primary" />}
          <span className="sr-only">{isRecording ? "Arrêter" : "Dictée vocale"}</span>
        </Button>

        {/* Textarea auto-resize */}
        <textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Pose une question…"
          disabled={disabled}
          rows={1}
          style={{ height: MIN_HEIGHT }}
          className={cn(
            "min-w-0 flex-1 resize-none overflow-y-auto rounded-2xl border border-border bg-card px-4 py-2.5",
            "text-base text-foreground placeholder:text-muted-foreground",
            "focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary",
            "disabled:opacity-50 leading-snug"
          )}
        />

        {/* Send */}
        <Button
          type="submit"
          size="icon"
          disabled={!message.trim() || disabled}
          className="mb-0.5 h-10 w-10 shrink-0 rounded-full bg-primary text-white hover:bg-primary/90 disabled:opacity-50 lg:h-11 lg:w-11"
        >
          <Send className="h-5 w-5" />
          <span className="sr-only">Envoyer</span>
        </Button>

      </form>
    </div>
  )
}
