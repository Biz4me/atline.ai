"use client"

import { useState, useCallback, useEffect } from "react"
import { PhoneOff, Mic, ArrowLeft } from "lucide-react"
import { cn } from "@/lib/utils"

interface ActiveCallScreenProps {
  scenarioName: string
  characterName: string
  onEndCall: () => void
  onBack: () => void
}

export function ActiveCallScreen({ scenarioName, characterName, onEndCall, onBack }: ActiveCallScreenProps) {
  const [isSpeaking, setIsSpeaking] = useState(true)
  const [isUserSpeaking, setIsUserSpeaking] = useState(false)
  const [exchangeCount, setExchangeCount] = useState(3)
  const [transcript, setTranscript] = useState(
    "Salut Marc ! Je suis pressé mais je voulais absolument t'appeler. Tu as toujours su voir les bonnes opportunités..."
  )

  // Simulate Atlas speaking
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isUserSpeaking) {
        setIsSpeaking((prev) => !prev)
      }
    }, 3000)
    return () => clearInterval(interval)
  }, [isUserSpeaking])

  const handleMicPress = useCallback(() => {
    setIsUserSpeaking(true)
    setIsSpeaking(false)
  }, [])

  const handleMicRelease = useCallback(() => {
    setIsUserSpeaking(false)
    setExchangeCount((prev) => Math.min(prev + 1, 10))
    // Simulate Atlas responding
    setTimeout(() => {
      setIsSpeaking(true)
      setTranscript("Oui, je comprends ce que tu veux dire. Mais dis-moi, qu'est-ce qui t'a fait penser à moi ?")
    }, 500)
  }, [])

  return (
    <div className="relative flex min-h-[calc(100vh-140px)] flex-col items-center justify-center bg-background px-4 py-6 lg:min-h-[calc(100vh-80px)]">
      {/* Back button */}
      <button
        onClick={onBack}
        className="absolute left-4 top-4 flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-card hover:text-white"
      >
        <ArrowLeft className="h-5 w-5" />
      </button>

      {/* Scenario name */}
      <p className="mb-2 text-[11px] text-muted-foreground">{scenarioName}</p>

      {/* Animated Sphere */}
      <div className="relative mb-4">
        {/* Pulsing rings */}
        <div
          className={cn(
            "absolute left-1/2 top-1/2 h-[96px] w-[96px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary/30 transition-all duration-500",
            isSpeaking && "animate-ping"
          )}
        />
        <div
          className={cn(
            "absolute left-1/2 top-1/2 h-[112px] w-[112px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary/20 transition-all duration-700",
            isSpeaking && "animate-ping"
          )}
        />

        {/* Main sphere */}
        <div
          className="relative flex h-20 w-20 items-center justify-center rounded-full"
          style={{
            background: "radial-gradient(circle at 35% 35%, #9B8FF8, #7C6FE8 50%, #5A4FD4)",
          }}
        >
          <span className="text-lg font-semibold text-white">A</span>
        </div>
      </div>

      {/* Character name */}
      <p className="text-sm font-medium text-white">{characterName}</p>

      {/* Status */}
      <p className="mt-1 text-[11px]">
        {isUserSpeaking ? (
          <span className="text-success">● En écoute...</span>
        ) : isSpeaking ? (
          <span className="text-accent">● Atlas parle...</span>
        ) : (
          <span className="text-muted-foreground">● En attente...</span>
        )}
      </p>

      {/* Transcript */}
      <div className="mx-auto mt-4 w-full max-w-[320px] rounded-[8px] bg-card p-3">
        <p className="text-[11px] leading-relaxed text-muted-foreground">&quot;{transcript}&quot;</p>
      </div>

      {/* Exchange counter */}
      <p className="mt-3 text-[10px] text-muted-foreground">Échange {exchangeCount}/10</p>

      {/* Action buttons */}
      <div className="mt-6 flex items-center justify-center gap-6">
        {/* End call button */}
        <div className="text-center">
          <button
            onClick={onEndCall}
            className="flex h-11 w-11 items-center justify-center rounded-full bg-destructive text-white transition-transform hover:scale-105 active:scale-95"
          >
            <PhoneOff className="h-5 w-5" />
          </button>
          <p className="mt-1.5 text-[9px] text-muted-foreground">Raccrocher</p>
        </div>

        {/* Mic button */}
        <div className="text-center">
          <button
            onMouseDown={handleMicPress}
            onMouseUp={handleMicRelease}
            onMouseLeave={handleMicRelease}
            onTouchStart={handleMicPress}
            onTouchEnd={handleMicRelease}
            className={cn(
              "flex h-[52px] w-[52px] items-center justify-center rounded-full bg-primary text-white transition-all",
              isUserSpeaking && "ring-4 ring-accent/50 scale-105"
            )}
          >
            <Mic className={cn("h-6 w-6", isUserSpeaking && "text-accent")} />
          </button>
          <p className="mt-1.5 text-[9px] text-muted-foreground">Maintenir pour parler</p>
        </div>
      </div>
    </div>
  )
}
