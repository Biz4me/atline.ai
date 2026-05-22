"use client"

import { useState } from "react"
import { TabsNav } from "@/components/reseau/tabs-nav"
import { PublicationsTab } from "@/components/markline/publications-tab"
import { LeadsTab } from "@/components/markline/leads-tab"
import { ParametresTab } from "@/components/markline/parametres-tab"

const tabs = ["Publications", "Leads détectés", "Paramètres"]

export default function ContenuPage() {
  const [activeTab, setActiveTab] = useState("Publications")

  return (
    <div>
      <div className="mb-1 flex items-center gap-2">
        <span className="rounded-full bg-violet-500/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-violet-400">
          Propulsé par Markline ▲
        </span>
      </div>
      <TabsNav tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
      <div className="mt-6">
        {activeTab === "Publications" && <PublicationsTab />}
        {activeTab === "Leads détectés" && <LeadsTab />}
        {activeTab === "Paramètres" && <ParametresTab />}
      </div>
    </div>
  )
}
