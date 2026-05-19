"use client"

import { useState } from "react"
import { DashboardShell } from "@/components/dashboard/shell"
import { TabsNav } from "@/components/reseau/tabs-nav"
import { PublicationsTab } from "@/components/markline/publications-tab"
import { LeadsTab } from "@/components/markline/leads-tab"
import { ParametresTab } from "@/components/markline/parametres-tab"

const tabs = ["Publications", "Leads détectés", "Paramètres"]

export default function MarklinePage() {
  const [activeTab, setActiveTab] = useState("Publications")

  return (
    <DashboardShell>
      {/* Header */}
      <div className="mb-4">
        <h1 className="font-heading text-xl font-semibold text-white">Markline</h1>
        <p className="text-sm text-muted-foreground">Publie et génère des leads</p>
      </div>

      {/* Tabs */}
      <TabsNav tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Tab content */}
      <div className="mt-4">
        {activeTab === "Publications" && <PublicationsTab />}
        {activeTab === "Leads détectés" && <LeadsTab />}
        {activeTab === "Paramètres" && <ParametresTab />}
      </div>
    </DashboardShell>
  )
}
