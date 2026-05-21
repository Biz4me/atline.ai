"use client"

import { Suspense, useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { TabsNav } from "@/components/reseau/tabs-nav"
import { ScenarioCard } from "@/components/simulations/scenario-card"
import { EricWorréSteps } from "@/components/simulations/eric-worre-steps"
import { HistoryChart } from "@/components/simulations/history-chart"
import { ActiveCallScreen } from "@/components/simulations/active-call-screen"
import { DebriefScreen } from "@/components/simulations/debrief-screen"

type Screen = "selection" | "call" | "debrief"
interface Scenario {
  id: string; name: string; character: string; duration: string
  difficulty: "easy" | "medium" | "hard" | "pro"
  icon: "phone" | "clock" | "alert" | "target" | "sparkles"
  isFreeform?: boolean
}

const scenarios: Scenario[] = [
  { id: "1", name: "Invitation — Marché chaud", character: "Marc", duration: "3-5 min", difficulty: "easy", icon: "phone" },
  { id: "2", name: "Invitation — Marché froid", character: "Sophie", duration: "3-5 min", difficulty: "medium", icon: "phone" },
  { id: "3", name: "Suivi — Prospect hésitant", character: "Jean", duration: "4-6 min", difficulty: "medium", icon: "clock" },
  { id: "4", name: "Objection — C'est une pyramide", character: "Laura", duration: "4-6 min", difficulty: "hard", icon: "alert" },
  { id: "5", name: "Closing — Décision finale", character: "Pierre", duration: "5-7 min", difficulty: "hard", icon: "target" },
  { id: "6", name: "Simulation libre", character: "Ton contexte", duration: "Variable", difficulty: "pro", icon: "sparkles", isFreeform: true },
]

const tabs = ["Scénarios", "Historique scores", "Analyse présentation"]
const tabFromParam: Record<string, string> = {
  "historique": "Historique scores",
  "analyse": "Analyse présentation",
}

function SimulationsContent() {
  const searchParams = useSearchParams()
  const tabParam = searchParams.get("tab")
  const [activeTab, setActiveTab] = useState(tabParam ? (tabFromParam[tabParam] ?? "Scénarios") : "Scénarios")
  const [screen, setScreen] = useState<Screen>("selection")
  const [selectedScenario, setSelectedScenario] = useState<Scenario | null>(null)

  useEffect(() => {
    const tab = searchParams.get("tab")
    setActiveTab(tab ? (tabFromParam[tab] ?? "Scénarios") : "Scénarios")
  }, [searchParams])

  const handleSelectScenario = (id: string) => {
    const scenario = scenarios.find((s) => s.id === id)
    if (scenario) { setSelectedScenario(scenario); setScreen("call") }
  }
  const handleEndCall = () => setScreen("debrief")
  const handleReplay = () => setScreen("call")
  const handleNewScenario = () => { setScreen("selection"); setSelectedScenario(null) }

  if (screen === "call" && selectedScenario) {
    return (
      <ActiveCallScreen scenarioName={selectedScenario.name} characterName={selectedScenario.character} onEndCall={handleEndCall} onBack={handleNewScenario} />
    )
  }

  if (screen === "debrief" && selectedScenario) {
    return (
      <div className="mx-auto max-w-[600px]">
        <DebriefScreen
          scenarioName={selectedScenario.name} characterName={selectedScenario.character}
          score={8.2} xpEarned={50} badgeUnlocked="Persuasif"
          strengths={["Accroche naturelle et confiante", "Compliment sincère bien placé", "Ton enthousiaste tout au long"]}
          improvements={["Pas de confirmation du RDV", "Raccroché un peu trop tôt"]}
          atlasAdvice="Pense toujours à confirmer l'heure et le lieu du RDV avant de raccrocher."
          onReplay={handleReplay} onNewScenario={handleNewScenario}
        />
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-heading text-xl font-semibold text-foreground">Simulations</h1>
        <p className="mt-1 text-[12px] text-muted-foreground">Entraîne-toi avant chaque appel réel</p>
      </div>
      <TabsNav tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
      {activeTab === "Scénarios" && (
        <div className="mt-6 flex flex-col gap-6 lg:flex-row lg:gap-8">
          <div className="min-w-0 flex-1">
            <div className="grid gap-3 lg:grid-cols-2">
              {scenarios.map((s) => (
                <ScenarioCard key={s.id} id={s.id} name={s.name} character={s.character} duration={s.duration} difficulty={s.difficulty} icon={s.icon} isFreeform={s.isFreeform} onClick={handleSelectScenario} />
              ))}
            </div>
            <div className="mt-6"><EricWorréSteps /></div>
          </div>
          <div className="hidden w-[280px] shrink-0 lg:block"><HistoryChart /></div>
          <div className="lg:hidden"><HistoryChart /></div>
        </div>
      )}
      {activeTab === "Historique scores" && (
        <div className="mt-6 flex flex-col items-center justify-center rounded-xl border border-border bg-card py-16 text-center">
          <p className="text-3xl">📊</p>
          <p className="mt-3 font-medium text-foreground">Historique des scores</p>
          <p className="mt-1 text-sm text-muted-foreground">Ta progression dans le temps apparaîtra ici.</p>
        </div>
      )}
      {activeTab === "Analyse présentation" && (
        <div className="mt-6 flex flex-col items-center justify-center rounded-xl border border-border bg-card py-16 text-center">
          <p className="text-3xl">🎙️</p>
          <p className="mt-3 font-medium text-foreground">Analyse de présentation</p>
          <p className="mt-1 text-sm text-muted-foreground">Enregistre ta présentation et Atlas l'analyse en détail.</p>
        </div>
      )}
    </div>
  )
}

export default function SimulationsPage() {
  return <Suspense><SimulationsContent /></Suspense>
}
