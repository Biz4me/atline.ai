"use client"

import { useState, useRef, useEffect } from "react"
import { Mic, MicOff, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface ChatInputProps {
  onSend: (message: string) => void
  disabled?: boolean
}

export function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [message, setMessage] = useState("")
  const [isRecording, setIsRecording] = useState(false)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null)

  useEffect(() => {
    return () => {
      recognitionRef.current?.stop()
    }
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (message.trim() && !disabled) {
      onSend(message.trim())
      setMessage("")
    }
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
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript
      setMessage(transcript)
    }

    recognition.onend = () => setIsRecording(false)
    recognition.onerror = () => setIsRecording(false)

    recognitionRef.current = recognition
    recognition.start()
    setIsRecording(true)
  }

  return (
    <div className="border-t border-border bg-background">
      <form onSubmit={handleSubmit} className="flex items-center gap-2 p-3 lg:gap-3 lg:p-4">
        {/* Microphone button */}
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={toggleRecording}
          className={cn(
            "h-11 w-11 shrink-0 rounded-full lg:h-12 lg:w-12",
            isRecording && "animate-pulse text-accent"
          )}
        >
          {isRecording ? (
            <MicOff className="h-5 w-5 text-accent" />
          ) : (
            <Mic className="h-5 w-5 text-primary" />
          )}
          <span className="sr-only">{isRecording ? "Arrêter" : "Dictée vocale"}</span>
        </Button>

        {/* Text input */}
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Pose une question…"
          disabled={disabled}
          className="h-11 min-w-0 flex-1 rounded-full border border-border bg-card px-4 text-base text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50 lg:h-12 lg:px-5"
        />

        {/* Send button */}
        <Button
          type="submit"
          size="icon"
          disabled={!message.trim() || disabled}
          className="h-11 w-11 shrink-0 rounded-full bg-primary text-white hover:bg-primary/90 disabled:opacity-50 lg:h-12 lg:w-12"
        >
          <Send className="h-5 w-5" />
          <span className="sr-only">Envoyer</span>
        </Button>
      </form>
    </div>
  )
}
