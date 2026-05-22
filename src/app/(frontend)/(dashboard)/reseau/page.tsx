"use client"

import { Suspense, useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { TabsNav } from "@/components/reseau/tabs-nav"
import { PipelineTab } from "@/components/reseau/pipeline-tab"
import { ListeNomsTab } from "@/components/reseau/liste-noms-tab"
import { AgendaTab } from "@/components/reseau/agenda-tab"
import { LeadsTab } from "@/components/reseau/leads-tab"
import { cn } from "@/lib/utils"

const tabs = ["Pipeline", "Ma liste", "Agenda", "Leads"]

const tabFromParam: Record<string, string> = {
  pipeline: "Pipeline",
  "ma-liste": "Ma liste",
  agenda: "Agenda",
  leads: "Leads",
}

const STATS = [
  { label: "urgents", value: 3, color: "bg-red-500/10 text-red-500" },
  { label: "RDV", value: 4, color: "bg-emerald-500/10 text-emerald-500" },
  { label: "leads", value: 4, color: "bg-cyan-500/10 text-cyan-500" },
]

function ReseauContent() {
  const searchParams = useSearchParams()
  const tabParam = searchParams.get("tab")
  const [activeTab, setActiveTab] = useState(
    tabParam ? (tabFromParam[tabParam] ?? "Pipeline") : "Pipeline"
  )

  useEffect(() => {
    const tab = searchParams.get("tab")
    setActiveTab(tab ? (tabFromParam[tab] ?? "Pipeline") : "Pipeline")
  }, [searchParams])

  return (
    <div>
      {/* Stats badges */}
      <div className="mb-4 flex gap-2">
        {STATS.map((s) => (
          <span key={s.label} className={cn("rounded-full px-3 py-1 text-xs font-semibold", s.color)}>
            {s.value} {s.label}
          </span>
        ))}
      </div>

      <TabsNav tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

      {activeTab === "Pipeline" && <PipelineTab />}
      {activeTab === "Ma liste" && <ListeNomsTab />}
      {activeTab === "Agenda" && <AgendaTab />}
      {activeTab === "Leads" && <LeadsTab />}
    </div>
  )
}

export default function ReseauPage() {
  return (
    <Suspense>
      <ReseauContent />
    </Suspense>
  )
}
