"use client"

import { useState, useRef, useEffect } from "react"
import { Mic, MicOff, Send, Volume2, VolumeX } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface ChatInputProps {
  onSend: (message: string) => void
  disabled?: boolean
  ttsEnabled?: boolean
  onToggleTts?: () => void
}

export function ChatInput({
  onSend,
  disabled,
  ttsEnabled = true,
  onToggleTts,
}: ChatInputProps) {
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

    recognition.onend = () => {
      setIsRecording(false)
    }

    recognition.onerror = () => {
      setIsRecording(false)
    }

    recognitionRef.current = recognition
    recognition.start()
    setIsRecording(true)
  }

  return (
    <div className="border-t border-border bg-background">
      <form onSubmit={handleSubmit} className="flex items-center gap-1.5 p-3 lg:gap-2 lg:p-4 lg:px-6">
        {/* TTS toggle */}
        {onToggleTts && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onToggleTts}
            title={ttsEnabled ? "Couper la voix" : "Activer la voix"}
            className="h-9 w-9 shrink-0 rounded-full lg:h-10 lg:w-10"
          >
            {ttsEnabled ? (
              <Volume2 className="h-5 w-5 text-primary" />
            ) : (
              <VolumeX className="h-5 w-5 text-muted-foreground" />
            )}
            <span className="sr-only">{ttsEnabled ? "Couper la voix" : "Activer la voix"}</span>
          </Button>
        )}

        {/* Microphone button */}
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={toggleRecording}
          className={cn(
            "h-9 w-9 shrink-0 rounded-full lg:h-10 lg:w-10",
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
          placeholder="Pose une question..."
          disabled={disabled}
          className="h-9 min-w-0 flex-1 rounded-full border border-border bg-card px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50 lg:h-10 lg:px-4"
        />

        {/* Send button */}
        <Button
          type="submit"
          size="icon"
          disabled={!message.trim() || disabled}
          className="h-9 w-9 shrink-0 rounded-full bg-primary text-white hover:bg-primary/90 disabled:opacity-50 lg:h-10 lg:w-10"
        >
          <Send className="h-4 w-4 lg:h-5 lg:w-5" />
          <span className="sr-only">Envoyer</span>
        </Button>
      </form>
    </div>
  )
}
