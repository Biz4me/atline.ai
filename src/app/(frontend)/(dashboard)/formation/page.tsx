"use client"

import { Suspense, useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { CurrentLessonCard } from "@/components/formation/current-lesson-card"
import { GlobalProgressBar } from "@/components/formation/progress-bar"
import { ModuleList, type Module } from "@/components/formation/module-list"
import { ProgressSidebar } from "@/components/formation/progress-sidebar"
import { TabsNav } from "@/components/reseau/tabs-nav"

const modules: Module[] = [
  { number: "01", name: "Mindset & Vision", lessons: 6, duration: 45, status: "done", xp: 150 },
  { number: "02", name: "Prospection", lessons: 8, duration: 60, status: "active", progress: 50, xp: 75 },
  { number: "03", name: "Invitation", lessons: 7, duration: 55, status: "locked" },
  { number: "04", name: "Presentation", lessons: 9, duration: 70, status: "locked" },
  { number: "05", name: "Suivi prospect", lessons: 6, duration: 50, status: "locked" },
  { number: "06", name: "Closing", lessons: 7, duration: 55, status: "locked" },
  { number: "07", name: "Reseaux sociaux", lessons: 8, duration: 65, status: "locked" },
  { number: "08", name: "Leadership", lessons: 6, duration: 50, status: "locked" },
]

const tabs = ["Modules", "Bibliothèque", "Mes notes"]
const tabFromParam: Record<string, string> = {
  "bibliotheque": "Bibliothèque",
  "notes": "Mes notes",
}

function FormationContent() {
  const searchParams = useSearchParams()
  const tabParam = searchParams.get("tab")
  const [activeTab, setActiveTab] = useState(tabParam ? (tabFromParam[tabParam] ?? "Modules") : "Modules")

  useEffect(() => {
    const tab = searchParams.get("tab")
    setActiveTab(tab ? (tabFromParam[tab] ?? "Modules") : "Modules")
  }, [searchParams])

  return (
    <div className="flex flex-col gap-6 lg:flex-row lg:gap-8">
        <div className="min-w-0 flex-1 lg:max-w-[680px]">
          <div className="mb-6">
            <h1 className="font-heading text-xl font-semibold text-foreground">Formation</h1>
            <p className="mt-1 text-sm text-muted-foreground">Methode Go Pro — Eric Worre</p>
          </div>
          <TabsNav tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
          {activeTab === "Modules" && (
            <div className="mt-6 space-y-6">
              <CurrentLessonCard lessonNumber={4} title="La liste de noms" moduleNumber={2} moduleName="Prospection" minutesRemaining={12} />
              <GlobalProgressBar percentage={37} modulesRemaining={3} />
              <ModuleList modules={modules} />
            </div>
          )}
          {activeTab === "Bibliothèque" && (
            <div className="mt-6 flex flex-col items-center justify-center rounded-xl border border-border bg-card py-16 text-center">
              <p className="text-2xl">📚</p>
              <p className="mt-3 font-medium text-foreground">Bibliothèque</p>
              <p className="mt-1 text-sm text-muted-foreground">Les livres et ressources MLM recommandés arrivent bientôt.</p>
            </div>
          )}
          {activeTab === "Mes notes" && (
            <div className="mt-6 flex flex-col items-center justify-center rounded-xl border border-border bg-card py-16 text-center">
              <p className="text-2xl">📝</p>
              <p className="mt-3 font-medium text-foreground">Mes notes</p>
              <p className="mt-1 text-sm text-muted-foreground">Tes notes de formation apparaîtront ici.</p>
            </div>
          )}
        </div>
        <ProgressSidebar streak={12} totalXP={225} nextBadge="Studieux" badgeRequirement="5 modules" atlasRecommendation="Continue le module Prospection !" />
    </div>
  )
}

export default function FormationPage() {
  return <Suspense><FormationContent /></Suspense>
}
