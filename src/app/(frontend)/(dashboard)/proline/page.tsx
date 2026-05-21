"use client"

import { useState } from "react"
import { TabsNav } from "@/components/reseau/tabs-nav"
import { MonPlanTab } from "@/components/proline/mon-plan-tab"
import { ObjectionsTab } from "@/components/proline/objections-tab"
import { ComparaisonTab } from "@/components/proline/comparaison-tab"

const tabs = ["Mon plan", "Objections", "Comparaison"]

export default function ProlinePage() {
  const [activeTab, setActiveTab] = useState("Mon plan")

  return (
    <div>
      <TabsNav tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
      <div className="mt-6">
        {activeTab === "Mon plan" && <MonPlanTab />}
        {activeTab === "Objections" && <ObjectionsTab />}
        {activeTab === "Comparaison" && <ComparaisonTab />}
      </div>
    </div>
  )
}
