"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { AtlineLogo } from "@/components/dashboard/logo"
import { ArrowRight, Check } from "lucide-react"
import {
  IconSchool,
  IconBarbell,
  IconSparkles,
  IconUsers,
  IconCalendar,
  IconBroadcast,
} from "@tabler/icons-react"

// ─── Types ───────────────────────────────────────────────────────────────────

interface ChatMsg {
  id: string
  role: "atlas" | "user"
  content: string
}

type ChatStep =
  | "q1_company"
  | "q2_seniority"
  | "q3_goal"
  | "q4_hours"
  | "q5_social"
  | "tour"
  | "done"

interface Answers {
  mlmCompany?: string
  experienceLevel?: string
  financialGoal?: string
  weeklyHours?: string
  socialPlatforms?: string[]
}

// ─── Constants ───────────────────────────────────────────────────────────────

const COMPANIES = [
  "Herbalife", "Forever Living", "Amway", "doTERRA",
  "Young Living", "Juice Plus+", "4Life", "Nu Skin",
]

const SENIORITY = [
  { label: "Débutant — moins de 3 mois", value: "beginner" },
  { label: "En développement — 3 à 12 mois", value: "developing" },
  { label: "Expérimenté — plus d'1 an", value: "experienced" },
]

const GOALS = [
  { label: "+200€ / mois", value: "+200€/mois" },
  { label: "+500€ / mois", value: "+500€/mois" },
  { label: "+1 000€ / mois", value: "+1000€/mois" },
  { label: "Remplacer mon salaire", value: "Remplacer mon salaire" },
  { label: "Devenir leader / manager", value: "Devenir leader/manager" },
]

const HOURS = [
  { label: "Moins de 5h / semaine", value: "lt5" },
  { label: "5 à 10h / semaine", value: "5to10" },
  { label: "Plus de 10h / semaine", value: "gt10" },
  { label: "Temps plein", value: "fulltime" },
]

const SOCIAL = [
  "Instagram", "Facebook", "TikTok", "LinkedIn",
]

const TOUR_TOOLS = [
  { icon: IconSchool, color: "#7C6FE8", bg: "rgba(124,111,232,0.12)", label: "Formation", desc: "8 modules Go Pro — méthode Eric Worre. Ton plan de bataille." },
  { icon: IconBarbell, color: "#06B6D4", bg: "rgba(6,182,212,0.12)", label: "Simulations", desc: "Entraîne-toi sur les objections avant chaque vrai appel." },
  { icon: IconSparkles, color: "#8B5CF6", bg: "rgba(139,92,246,0.12)", label: "Atlas", desc: "Moi — ton coach disponible 24h/24, spécialisé pour toi." },
  { icon: IconUsers, color: "#10B981", bg: "rgba(16,185,129,0.15)", label: "Réseau", desc: "Ta liste de noms et ton pipeline de prospects." },
  { icon: IconCalendar, color: "#F59E0B", bg: "rgba(245,158,11,0.15)", label: "Agenda", desc: "Tes RDV et rappels de suivi automatiques." },
  { icon: IconBroadcast, color: "#06B6D4", bg: "rgba(6,182,212,0.12)", label: "Markline", desc: "Génère du contenu réseaux et détecte tes leads." },
]

// ─── Save helper ─────────────────────────────────────────────────────────────

async function saveOnboarding(data: Record<string, unknown>) {
  await fetch("/api/onboarding", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
}

// ─── Progress bar ────────────────────────────────────────────────────────────

function ProgressBar({ step }: { step: number }) {
  const labels = ["Identité", "Profil", "Découverte", "Mission"]
  const pct = (step / 4) * 100
  return (
    <div className="w-full px-6 pt-4 pb-2">
      <div className="mx-auto max-w-lg">
        <div className="mb-1.5 flex justify-between text-[10px] font-medium text-muted-foreground">
          {labels.map((l, i) => (
            <span key={l} className={cn(i + 1 <= step && "text-primary")}>{l}</span>
          ))}
        </div>
        <div className="h-1 w-full rounded-full bg-muted overflow-hidden">
          <div
            className="h-full rounded-full bg-primary transition-all duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
    </div>
  )
}

// ─── Atlas bubble ─────────────────────────────────────────────────────────────

function AtlasBubble({ content, animate = false }: { content: string; animate?: boolean }) {
  return (
    <div className={cn("flex items-start gap-2.5", animate && "animate-in fade-in slide-in-from-bottom-2 duration-300")}>
      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 mt-0.5">
        <IconSparkles className="h-3.5 w-3.5 text-primary" />
      </div>
      <div className="max-w-sm rounded-2xl rounded-tl-sm bg-muted px-4 py-3 text-sm leading-relaxed text-foreground">
        {content}
      </div>
    </div>
  )
}

function UserBubble({ content }: { content: string }) {
  return (
    <div className="flex justify-end animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="max-w-xs rounded-2xl rounded-tr-sm bg-primary px-4 py-3 text-sm text-white">
        {content}
      </div>
    </div>
  )
}

function TypingDots() {
  return (
    <div className="flex items-start gap-2.5 animate-in fade-in duration-200">
      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10">
        <IconSparkles className="h-3.5 w-3.5 text-primary" />
      </div>
      <div className="rounded-2xl rounded-tl-sm bg-muted px-4 py-3">
        <div className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-1.5 w-1.5 rounded-full bg-muted-foreground animate-bounce"
              style={{ animationDelay: `${i * 150}ms` }} />
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Option buttons ───────────────────────────────────────────────────────────

function OptionButton({ label, onClick, selected = false }: { label: string; onClick: () => void; selected?: boolean }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "rounded-xl border px-4 py-2.5 text-sm font-medium transition-all text-left",
        selected
          ? "border-primary bg-primary text-white"
          : "border-border bg-background text-foreground hover:border-primary/50 hover:bg-primary/5"
      )}
    >
      {label}
    </button>
  )
}

// ─── Act 1 — Identity ─────────────────────────────────────────────────────────

function ActIdentity({ onDone }: { onDone: (firstName: string, lastName: string) => void }) {
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!firstName.trim()) return
    setLoading(true)
    await saveOnboarding({ firstName: firstName.trim(), lastName: lastName.trim() })
    onDone(firstName.trim(), lastName.trim())
  }

  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6 py-8">
      <div className="w-full max-w-sm space-y-8">
        <div className="flex justify-center">
          <AtlineLogo size="lg" showText={false} />
        </div>

        <AtlasBubble content="Bonjour ! Je suis Atlas, ton coach MLM personnel sur Atline. Avant qu'on commence, j'ai besoin de te connaître pour vraiment t'aider. 3 minutes, c'est tout." />
        <AtlasBubble content="Première question — comment tu t'appelles ?" />

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            autoFocus
            type="text"
            placeholder="Prénom *"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition"
          />
          <input
            type="text"
            placeholder="Nom (optionnel)"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition"
          />
          <button
            type="submit"
            disabled={!firstName.trim() || loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white transition hover:bg-primary/90 disabled:opacity-40"
          >
            {loading ? "..." : <>Continuer <ArrowRight className="h-4 w-4" /></>}
          </button>
        </form>
      </div>
    </div>
  )
}

// ─── Act 2+3 — Chat ────────────────────────────────────────────────────────────

function ActChat({
  firstName,
  answers,
  onAnswer,
  onTourComplete,
}: {
  firstName: string
  answers: Answers
  onAnswer: (step: ChatStep, value: string | string[], label: string) => void
  onTourComplete: () => void
}) {
  const [messages, setMessages] = useState<ChatMsg[]>([])
  const [isTyping, setIsTyping] = useState(false)
  const [currentStep, setCurrentStep] = useState<ChatStep>("q1_company")
  const [companyInput, setCompanyInput] = useState("")
  const [showCompanyInput, setShowCompanyInput] = useState(false)
  const [selectedSocial, setSelectedSocial] = useState<string[]>([])
  const scrollRef = useRef<HTMLDivElement>(null)
  const initialized = useRef(false)

  const scrollToBottom = useCallback(() => {
    setTimeout(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight
      }
    }, 100)
  }, [])

  const addAtlasMsg = useCallback((content: string) => {
    return new Promise<void>((resolve) => {
      setIsTyping(true)
      setTimeout(() => {
        setIsTyping(false)
        setMessages((prev) => [...prev, { id: `a-${Date.now()}`, role: "atlas", content }])
        scrollToBottom()
        resolve()
      }, 800)
    })
  }, [scrollToBottom])

  const addUserMsg = useCallback((content: string) => {
    setMessages((prev) => [...prev, { id: `u-${Date.now()}`, role: "user", content }])
    scrollToBottom()
  }, [scrollToBottom])

  // Init Q1
  useEffect(() => {
    if (initialized.current) return
    initialized.current = true
    addAtlasMsg(`Enchanté ${firstName} ! Tu travailles avec quelle société MLM ?`)
  }, [firstName, addAtlasMsg])

  const handleAnswer = useCallback(async (step: ChatStep, value: string | string[], label: string) => {
    addUserMsg(Array.isArray(label) ? label.join(", ") : label)
    onAnswer(step, value, Array.isArray(label) ? label.join(", ") : label)

    if (step === "q1_company") {
      await addAtlasMsg(`Parfait ! Depuis combien de temps tu es dans ce business ?`)
      setCurrentStep("q2_seniority")
    } else if (step === "q2_seniority") {
      await addAtlasMsg(`Super. Et ton objectif dans les 6 prochains mois ?`)
      setCurrentStep("q3_goal")
    } else if (step === "q3_goal") {
      await addAtlasMsg(`Combien d'heures par semaine tu peux consacrer à ton business ?`)
      setCurrentStep("q4_hours")
    } else if (step === "q4_hours") {
      await addAtlasMsg(`Tu utilises les réseaux sociaux pour ton business ?`)
      setCurrentStep("q5_social")
    } else if (step === "q5_social") {
      // Tour
      setCurrentStep("tour")
      const goal = answers.financialGoal ?? (value as string)
      const company = answers.mlmCompany ?? ""
      await addAtlasMsg(`${firstName}, voici ce qu'on va construire ensemble pour atteindre ton objectif avec ${company} :`)
      for (const tool of TOUR_TOOLS) {
        await addAtlasMsg(`${tool.label} — ${tool.desc}`)
      }
      await addAtlasMsg(`Ton profil est configuré. On y va ! 🎉`)
      setCurrentStep("done")
      onTourComplete()
    }
  }, [addAtlasMsg, addUserMsg, onAnswer, answers, firstName, onTourComplete])

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.map((msg) =>
          msg.role === "atlas"
            ? <AtlasBubble key={msg.id} content={msg.content} animate />
            : <UserBubble key={msg.id} content={msg.content} />
        )}
        {isTyping && <TypingDots />}
      </div>

      {/* Options zone */}
      {!isTyping && currentStep !== "tour" && currentStep !== "done" && (
        <div className="border-t border-border bg-background p-4 space-y-2 animate-in slide-in-from-bottom-2 duration-300">
          {currentStep === "q1_company" && (
            <>
              <div className="flex flex-wrap gap-2">
                {COMPANIES.map((c) => (
                  <OptionButton key={c} label={c} onClick={() => handleAnswer("q1_company", c, c)} />
                ))}
                <OptionButton label="Autre →" onClick={() => setShowCompanyInput(true)} />
              </div>
              {showCompanyInput && (
                <form
                  className="flex gap-2"
                  onSubmit={(e) => {
                    e.preventDefault()
                    if (companyInput.trim()) handleAnswer("q1_company", companyInput.trim(), companyInput.trim())
                  }}
                >
                  <input
                    autoFocus
                    value={companyInput}
                    onChange={(e) => setCompanyInput(e.target.value)}
                    placeholder="Nom de ta société"
                    className="flex-1 rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                  />
                  <button type="submit" className="rounded-xl bg-primary px-4 py-2 text-sm font-medium text-white">OK</button>
                </form>
              )}
            </>
          )}

          {currentStep === "q2_seniority" && (
            <div className="flex flex-col gap-2">
              {SENIORITY.map((s) => (
                <OptionButton key={s.value} label={s.label} onClick={() => handleAnswer("q2_seniority", s.value, s.label)} />
              ))}
            </div>
          )}

          {currentStep === "q3_goal" && (
            <div className="flex flex-wrap gap-2">
              {GOALS.map((g) => (
                <OptionButton key={g.value} label={g.label} onClick={() => handleAnswer("q3_goal", g.value, g.label)} />
              ))}
            </div>
          )}

          {currentStep === "q4_hours" && (
            <div className="flex flex-col gap-2">
              {HOURS.map((h) => (
                <OptionButton key={h.value} label={h.label} onClick={() => handleAnswer("q4_hours", h.value, h.label)} />
              ))}
            </div>
          )}

          {currentStep === "q5_social" && (
            <div className="space-y-3">
              <div className="flex flex-wrap gap-2">
                {SOCIAL.map((s) => (
                  <button
                    key={s}
                    onClick={() =>
                      setSelectedSocial((prev) =>
                        prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
                      )
                    }
                    className={cn(
                      "flex items-center gap-1.5 rounded-xl border px-4 py-2.5 text-sm font-medium transition-all",
                      selectedSocial.includes(s)
                        ? "border-primary bg-primary text-white"
                        : "border-border bg-background text-foreground hover:border-primary/50"
                    )}
                  >
                    {selectedSocial.includes(s) && <Check className="h-3.5 w-3.5" />}
                    {s}
                  </button>
                ))}
                <OptionButton label="Non, pas encore" onClick={() => handleAnswer("q5_social", [], "Non, pas encore")} />
              </div>
              {selectedSocial.length > 0 && (
                <button
                  onClick={() => handleAnswer("q5_social", selectedSocial, selectedSocial.join(", "))}
                  className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white"
                >
                  Valider <ArrowRight className="h-4 w-4" />
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ─── Act 4 — Mission ──────────────────────────────────────────────────────────

function ActMission({
  firstName,
  answers,
  onComplete,
}: {
  firstName: string
  answers: Answers
  onComplete: () => void
}) {
  const [loading, setLoading] = useState(false)

  const handleAction = async (href: string) => {
    setLoading(true)
    await saveOnboarding({ complete: true })
    // Refresh JWT so middleware sees onboardingCompleted=true
    await fetch("/api/users/refresh-token", { method: "POST" }).catch(() => {})
    window.location.href = href
  }

  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6 py-8">
      <div className="w-full max-w-sm space-y-6">
        {/* XP badge */}
        <div className="flex justify-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-semibold text-primary">
            <IconSparkles className="h-4 w-4" />
            +100 XP offerts
          </div>
        </div>

        {/* Atlas message */}
        <div className="text-center space-y-1">
          <h2 className="text-xl font-bold text-foreground">Ton profil est prêt, {firstName} !</h2>
          <p className="text-sm text-muted-foreground">
            Je suis configuré pour{" "}
            <span className="font-medium text-foreground">{answers.mlmCompany ?? "ta société"}</span>,
            objectif{" "}
            <span className="font-medium text-foreground">{answers.financialGoal ?? "croissance"}</span>.
          </p>
        </div>

        {/* Mission card */}
        <div className="rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/10 to-transparent p-5 space-y-2">
          <p className="text-[10px] font-bold uppercase tracking-wider text-primary">Mission #1</p>
          <p className="font-semibold text-foreground">Importer ta liste de noms</p>
          <p className="text-xs text-muted-foreground">
            Exporte tes contacts téléphone et ajoute-les dans Atline — c'est ta mine d'or.
          </p>
          <p className="text-[11px] text-muted-foreground">⏱ Environ 10 minutes</p>
        </div>

        {/* CTAs */}
        <div className="space-y-2">
          <button
            onClick={() => handleAction("/reseau")}
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white transition hover:bg-primary/90 disabled:opacity-50"
          >
            Importer ma liste <ArrowRight className="h-4 w-4" />
          </button>
          <button
            onClick={() => handleAction("/formation")}
            disabled={loading}
            className="w-full rounded-xl border border-border px-4 py-2.5 text-sm font-medium text-foreground transition hover:bg-muted disabled:opacity-50"
          >
            Commencer la formation
          </button>
          <button
            onClick={() => handleAction("/")}
            disabled={loading}
            className="w-full rounded-xl px-4 py-2.5 text-sm text-muted-foreground transition hover:text-foreground disabled:opacity-50"
          >
            Explorer librement
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function OnboardingPage() {
  const [act, setAct] = useState<"identity" | "chat" | "mission">("identity")
  const [progressStep, setProgressStep] = useState(1)
  const [firstName, setFirstName] = useState("")
  const [answers, setAnswers] = useState<Answers>({})

  const handleIdentityDone = (fn: string, ln: string) => {
    setFirstName(fn)
    setAct("chat")
    setProgressStep(2)
  }

  const handleAnswer = useCallback(async (step: ChatStep, value: string | string[], label: string) => {
    const update: Answers = { ...answers }

    if (step === "q1_company") {
      update.mlmCompany = value as string
      await saveOnboarding({ mlmCompany: value })
    } else if (step === "q2_seniority") {
      update.experienceLevel = value as string
      await saveOnboarding({ experienceLevel: value })
    } else if (step === "q3_goal") {
      update.financialGoal = value as string
      await saveOnboarding({ financialGoal: value })
    } else if (step === "q4_hours") {
      update.weeklyHours = value as string
      await saveOnboarding({ weeklyHours: value })
    } else if (step === "q5_social") {
      update.socialPlatforms = value as string[]
      await saveOnboarding({ socialPlatforms: value })
    }

    setAnswers(update)
    if (step === "q2_seniority") setProgressStep(2)
    if (step === "q5_social") setProgressStep(3)
  }, [answers])

  const handleTourComplete = () => {
    setProgressStep(4)
    setTimeout(() => setAct("mission"), 600)
  }

  return (
    <div className="flex h-[100dvh] flex-col bg-background">
      <ProgressBar step={progressStep} />
      {act === "identity" && (
        <ActIdentity onDone={handleIdentityDone} />
      )}
      {act === "chat" && (
        <ActChat
          firstName={firstName}
          answers={answers}
          onAnswer={handleAnswer}
          onTourComplete={handleTourComplete}
        />
      )}
      {act === "mission" && (
        <ActMission
          firstName={firstName}
          answers={answers}
          onComplete={() => {}}
        />
      )}
    </div>
  )
}
