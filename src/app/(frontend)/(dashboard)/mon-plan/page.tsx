"use client"

import { useState } from "react"
import { TabsNav } from "@/components/reseau/tabs-nav"
import { MonPlanTab } from "@/components/proline/mon-plan-tab"
import { ObjectionsTab } from "@/components/proline/objections-tab"
import { ComparaisonTab } from "@/components/proline/comparaison-tab"

const tabs = ["Mon plan", "Objections", "Comparaison"]

export default function MonPlanPage() {
  const [activeTab, setActiveTab] = useState("Mon plan")

  return (
    <div>
      <div className="mb-1 flex items-center gap-2">
        <span className="rounded-full bg-violet-500/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-violet-400">
          Propulsé par Proline ▲
        </span>
      </div>
      <TabsNav tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
      <div className="mt-6">
        {activeTab === "Mon plan" && <MonPlanTab />}
        {activeTab === "Objections" && <ObjectionsTab />}
        {activeTab === "Comparaison" && <ComparaisonTab />}
      </div>
    </div>
  )
}
