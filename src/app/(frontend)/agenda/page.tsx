"use client"

import { useState } from "react"
import { IconPhone, IconPresentation, IconRefresh, IconSchool, IconPlus, IconSparkles, IconX } from "@tabler/icons-react"
import { DashboardShell } from "@/components/dashboard/shell"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import Link from "next/link"

interface Event {
  id: string
  time: string
  title: string
  prospect?: string
  type: "appel" | "presentation" | "suivi" | "formation"
}

const eventTypes = {
  appel: { icon: IconPhone, color: "#06B6D4", label: "Appel prospect" },
  presentation: { icon: IconPresentation, color: "#7C6FE8", label: "Présentation" },
  suivi: { icon: IconRefresh, color: "#F59E0B", label: "Suivi" },
  formation: { icon: IconSchool, color: "#10B981", label: "Formation" },
}

const todayEvents: Event[] = [
  { id: "1", time: "10h00", title: "Appel prospect", prospect: "Marie T.", type: "appel" },
  { id: "2", time: "14h30", title: "Présentation", prospect: "Thomas R.", type: "presentation" },
  { id: "3", time: "19h00", title: "Formation", prospect: "Module Invitation", type: "formation" },
]

const upcomingEvents: Event[] = [
  { id: "4", time: "Demain 11h", title: "Suivi", prospect: "Julie M.", type: "suivi" },
  { id: "5", time: "Mer 15h", title: "Appel prospect", prospect: "Pierre L.", type: "appel" },
  { id: "6", time: "Jeu 10h", title: "Présentation", prospect: "Sarah B.", type: "presentation" },
]

function generateWeekDays() {
  const days = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"]
  const today = new Date()
  const result = []
  
  for (let i = 0; i < 7; i++) {
    const date = new Date(today)
    date.setDate(today.getDate() + i)
    result.push({
      day: days[date.getDay()],
      date: date.getDate(),
      isToday: i === 0,
      hasEvent: i === 0 || i === 1 || i === 2 || i === 3,
    })
  }
  return result
}

export default function AgendaPage() {
  const [showModal, setShowModal] = useState(false)
  const weekDays = generateWeekDays()

  return (
    <DashboardShell>
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <h1 className="font-heading text-xl font-semibold text-white">Agenda</h1>
        <Button size="sm" onClick={() => setShowModal(true)}>
          <IconPlus className="h-4 w-4" />
          Ajouter
        </Button>
      </div>

      {/* Week view */}
      <div className="mb-6 overflow-hidden">
        <div
          className="flex gap-2 overflow-x-auto pb-2 scrollbar-none"
          style={{ WebkitOverflowScrolling: "touch" }}
        >
          {weekDays.map((day, index) => (
            <button
              key={index}
              className={cn(
                "flex min-w-[52px] flex-col items-center rounded-lg border px-3 py-2 transition-colors",
                day.isToday
                  ? "border-primary bg-primary/10"
                  : "border-border bg-card hover:border-primary/50"
              )}
            >
              <span className="text-xs text-muted-foreground">{day.day}</span>
              <span className={cn(
                "mt-0.5 font-mono text-lg font-bold",
                day.isToday ? "text-primary" : "text-white"
              )}>
                {day.date}
              </span>
              {day.hasEvent && (
                <span className={cn(
                  "mt-1 h-1.5 w-1.5 rounded-full",
                  day.isToday ? "bg-primary" : "bg-muted-foreground"
                )} />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Today's events */}
      <div className="mb-6">
        <h2 className="mb-3 text-sm font-medium text-muted-foreground">Aujourd&apos;hui</h2>
        <div className="space-y-2">
          {todayEvents.map((event) => {
            const typeInfo = eventTypes[event.type]
            const Icon = typeInfo.icon
            const showSimulate = event.type === "appel" || event.type === "presentation"

            return (
              <Card key={event.id} className="p-3">
                <div className="flex items-center gap-3">
                  <div
                    className="h-full w-1 self-stretch rounded-full"
                    style={{ backgroundColor: typeInfo.color }}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-medium text-white">{event.time}</span>
                      <span className="text-sm text-white">{event.title}</span>
                    </div>
                    {event.prospect && (
                      <p className="text-sm text-muted-foreground">{event.prospect}</p>
                    )}
                  </div>
                  {showSimulate ? (
                    <Link href="/simulations">
                      <Button size="sm" variant="ghost" className="shrink-0 text-xs">
                        Simuler avant
                      </Button>
                    </Link>
                  ) : event.type === "formation" ? (
                    <Link href="/formation">
                      <Button size="sm" variant="ghost" className="shrink-0 text-xs">
                        Reprendre
                      </Button>
                    </Link>
                  ) : null}
                </div>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Upcoming this week */}
      <div className="mb-6">
        <h2 className="mb-3 text-sm font-medium text-muted-foreground">Cette semaine</h2>
        <div className="space-y-2">
          {upcomingEvents.map((event) => {
            const typeInfo = eventTypes[event.type]
            return (
              <Card key={event.id} className="flex items-center gap-3 p-3">
                <div
                  className="h-8 w-1 rounded-full"
                  style={{ backgroundColor: typeInfo.color }}
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm text-muted-foreground">{event.time}</span>
                    <span className="text-sm text-white">{event.title}</span>
                  </div>
                  {event.prospect && (
                    <p className="text-xs text-muted-foreground">{event.prospect}</p>
                  )}
                </div>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Atlas reminder */}
      <Card className="border-l-2 border-l-primary p-4">
        <div className="flex items-start gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/20">
            <IconSparkles className="h-4 w-4 text-primary" />
          </div>
          <div className="flex-1">
            <p className="text-sm text-white">
              Tu as 2 suivis en retard cette semaine.
            </p>
            <p className="text-sm text-muted-foreground">
              Veux-tu que je planifie des rappels ?
            </p>
          </div>
        </div>
        <Button className="mt-3 w-full" size="sm">
          Oui, planifier
        </Button>
      </Card>

      {/* Add event modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 lg:items-center">
          <div className="w-full max-w-lg rounded-t-2xl bg-card p-4 lg:rounded-2xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-heading text-lg font-medium">Ajouter un événement</h3>
              <button
                onClick={() => setShowModal(false)}
                className="rounded-full p-1.5 text-muted-foreground hover:bg-background"
              >
                <IconX className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3">
              <input
                type="text"
                placeholder="Titre"
                className="h-11 w-full rounded-lg border border-border bg-background px-3 text-sm text-white placeholder:text-muted-foreground focus:border-primary focus:outline-none"
              />
              <input
                type="datetime-local"
                className="h-11 w-full rounded-lg border border-border bg-background px-3 text-sm text-white focus:border-primary focus:outline-none"
              />
              <select className="h-11 w-full rounded-lg border border-border bg-background px-3 text-sm text-white focus:border-primary focus:outline-none">
                <option value="appel">Appel prospect</option>
                <option value="presentation">Présentation</option>
                <option value="suivi">Suivi</option>
                <option value="formation">Formation</option>
              </select>
              <input
                type="text"
                placeholder="Prospect (optionnel)"
                className="h-11 w-full rounded-lg border border-border bg-background px-3 text-sm text-white placeholder:text-muted-foreground focus:border-primary focus:outline-none"
              />
            </div>

            <div className="mt-4 flex gap-2">
              <Button className="flex-1">Ajouter</Button>
              <Button variant="ghost" className="flex-1" onClick={() => setShowModal(false)}>
                Annuler
              </Button>
            </div>
          </div>
        </div>
      )}
    </DashboardShell>
  )
}
