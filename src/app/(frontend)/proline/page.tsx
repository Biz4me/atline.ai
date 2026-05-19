"use client"

import { useState } from "react"
import { DashboardShell } from "@/components/dashboard/shell"
import { TabsNav } from "@/components/reseau/tabs-nav"
import { MonPlanTab } from "@/components/proline/mon-plan-tab"
import { ObjectionsTab } from "@/components/proline/objections-tab"
import { ComparaisonTab } from "@/components/proline/comparaison-tab"

const tabs = ["Mon plan", "Objections", "Comparaison"]

export default function ProlinePage() {
  const [activeTab, setActiveTab] = useState("Mon plan")

  return (
    <DashboardShell>
      {/* Header */}
      <div className="mb-4">
        <h1 className="font-heading text-xl font-semibold text-white">Proline</h1>
        <p className="text-sm text-muted-foreground">Plans de compensation et objections</p>
      </div>

      {/* Tabs */}
      <TabsNav tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Tab content */}
      <div className="mt-4">
        {activeTab === "Mon plan" && <MonPlanTab />}
        {activeTab === "Objections" && <ObjectionsTab />}
        {activeTab === "Comparaison" && <ComparaisonTab />}
      </div>
    </DashboardShell>
  )
}
