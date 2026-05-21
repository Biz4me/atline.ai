"use client"

import { useState } from "react"
import { TabsNav } from "@/components/reseau/tabs-nav"
import { PublicationsTab } from "@/components/markline/publications-tab"
import { LeadsTab } from "@/components/markline/leads-tab"
import { ParametresTab } from "@/components/markline/parametres-tab"

const tabs = ["Publications", "Leads détectés", "Paramètres"]

export default function MarklinePage() {
  const [activeTab, setActiveTab] = useState("Publications")

  return (
    <div>
      <TabsNav tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
      <div className="mt-6">
        {activeTab === "Publications" && <PublicationsTab />}
        {activeTab === "Leads détectés" && <LeadsTab />}
        {activeTab === "Paramètres" && <ParametresTab />}
      </div>
    </div>
  )
}
