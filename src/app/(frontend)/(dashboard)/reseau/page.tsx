"use client"

import { Suspense, useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { TabsNav } from "@/components/reseau/tabs-nav"
import { PipelineTab } from "@/components/reseau/pipeline-tab"
import { ListeNomsTab } from "@/components/reseau/liste-noms-tab"
import { EquipeTab } from "@/components/reseau/equipe-tab"
import { CarteDigitaleTab } from "@/components/reseau/carte-digitale-tab"

const tabs = ["Pipeline", "Liste de noms", "Équipe", "Carte digitale"]
const tabFromParam: Record<string, string> = {
  "liste-de-noms": "Liste de noms",
  "equipe": "Équipe",
  "carte-digitale": "Carte digitale",
  "pipeline": "Pipeline",
}

function ReseauContent() {
  const searchParams = useSearchParams()
  const tabParam = searchParams.get("tab")
  const [activeTab, setActiveTab] = useState(tabParam ? (tabFromParam[tabParam] ?? "Pipeline") : "Pipeline")

  useEffect(() => {
    const tab = searchParams.get("tab")
    setActiveTab(tab ? (tabFromParam[tab] ?? "Pipeline") : "Pipeline")
  }, [searchParams])

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-heading text-xl font-semibold text-foreground">Réseau</h1>
        <p className="mt-1 text-sm text-muted-foreground">Prospects, équipe et carte digitale</p>
      </div>
      <TabsNav tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
      {activeTab === "Pipeline" && <PipelineTab />}
      {activeTab === "Liste de noms" && <ListeNomsTab />}
      {activeTab === "Équipe" && <EquipeTab />}
      {activeTab === "Carte digitale" && <CarteDigitaleTab />}
    </div>
  )
}

export default function ReseauPage() {
  return <Suspense><ReseauContent /></Suspense>
}
