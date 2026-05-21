"use client"

import { useState } from "react"
import { DashboardShell } from "@/components/dashboard/shell"
import { TabsNav } from "@/components/reseau/tabs-nav"
import { XpNiveauTab } from "@/components/croissance/xp-niveau-tab"
import { BadgesTab } from "@/components/croissance/badges-tab"
import { DefisTab } from "@/components/croissance/defis-tab"
import { LeaderboardTab } from "@/components/croissance/leaderboard-tab"
import { CommunauteTab } from "@/components/croissance/communaute-tab"

const tabs = ["XP & Niveau", "Badges", "Défis", "Leaderboard", "Communauté"]

export default function CroissancePage() {
  const [activeTab, setActiveTab] = useState("XP & Niveau")

  return (
    <DashboardShell>
      <div>
        <div className="mb-6">
          <h1 className="font-heading text-xl font-semibold text-foreground">Croissance</h1>
          <p className="mt-1 text-sm text-muted-foreground">XP, badges, défis et communauté</p>
        </div>
        <TabsNav tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
        <div className="mt-6">
          {activeTab === "XP & Niveau" && <XpNiveauTab />}
          {activeTab === "Badges" && <BadgesTab />}
          {activeTab === "Défis" && <DefisTab />}
          {activeTab === "Leaderboard" && <LeaderboardTab />}
          {activeTab === "Communauté" && <CommunauteTab />}
        </div>
      </div>
    </DashboardShell>
  )
}
