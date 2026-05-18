"use client"

import { useState } from "react"
import { DashboardShell } from "@/components/dashboard/shell"
import { ScenarioCard } from "@/components/simulations/scenario-card"
import { EricWorréSteps } from "@/components/simulations/eric-worre-steps"
import { HistoryChart } from "@/components/simulations/history-chart"
import { ActiveCallScreen } from "@/components/simulations/active-call-screen"
import { DebriefScreen } from "@/components/simulations/debrief-screen"

type Screen = "selection" | "call" | "debrief"

interface Scenario {
  id: string
  name: string
  character: string
  duration: string
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

export default function SimulationsPage() {
  const [screen, setScreen] = useState<Screen>("selection")
  const [selectedScenario, setSelectedScenario] = useState<Scenario | null>(null)

  const handleSelectScenario = (id: string) => {
    const scenario = scenarios.find((s) => s.id === id)
    if (scenario) {
      setSelectedScenario(scenario)
      setScreen("call")
    }
  }

  const handleEndCall = () => {
    setScreen("debrief")
  }

  const handleReplay = () => {
    setScreen("call")
  }

  const handleNewScenario = () => {
    setScreen("selection")
    setSelectedScenario(null)
  }

  // Active call screen - full immersive without shell
  if (screen === "call" && selectedScenario) {
    return (
      <DashboardShell>
        <ActiveCallScreen
          scenarioName={selectedScenario.name}
          characterName={selectedScenario.character}
          onEndCall={handleEndCall}
          onBack={handleNewScenario}
        />
      </DashboardShell>
    )
  }

  // Debrief screen
  if (screen === "debrief" && selectedScenario) {
    return (
      <DashboardShell>
        <div className="mx-auto max-w-[600px]">
          <DebriefScreen
            scenarioName={selectedScenario.name}
            characterName={selectedScenario.character}
            score={8.2}
            xpEarned={50}
            badgeUnlocked="Persuasif"
            strengths={[
              "Accroche naturelle et confiante",
              "Compliment sincère bien placé",
              "Ton enthousiaste tout au long",
            ]}
            improvements={[
              "Pas de confirmation du RDV",
              "Raccroché un peu trop tôt",
            ]}
            atlasAdvice="Pense toujours à confirmer l'heure et le lieu du RDV avant de raccrocher. C'est ce qui transforme une bonne conversation en action concrète."
            onReplay={handleReplay}
            onNewScenario={handleNewScenario}
          />
        </div>
      </DashboardShell>
    )
  }

  // Selection screen (default)
  return (
    <DashboardShell>
      <div className="flex flex-col gap-6 lg:flex-row lg:gap-8">
        {/* Main content */}
        <div className="min-w-0 flex-1">
          {/* Page header */}
          <div className="mb-6">
            <h1 className="font-heading text-2xl font-semibold text-white">Simulations</h1>
            <p className="mt-1 text-[12px] text-muted-foreground">
              Entraîne-toi avant chaque appel réel
            </p>
          </div>

          {/* Scenario cards */}
          <div className="grid gap-3 lg:grid-cols-2">
            {scenarios.map((scenario) => (
              <ScenarioCard
                key={scenario.id}
                id={scenario.id}
                name={scenario.name}
                character={scenario.character}
                duration={scenario.duration}
                difficulty={scenario.difficulty}
                icon={scenario.icon}
                isFreeform={scenario.isFreeform}
                onClick={handleSelectScenario}
              />
            ))}
          </div>

          {/* Eric Worre steps */}
          <div className="mt-6">
            <EricWorréSteps />
          </div>
        </div>

        {/* History sidebar - desktop only */}
        <div className="hidden w-[280px] shrink-0 lg:block">
          <HistoryChart />
        </div>

        {/* History - mobile only */}
        <div className="lg:hidden">
          <HistoryChart />
        </div>
      </div>
    </DashboardShell>
  )
}
