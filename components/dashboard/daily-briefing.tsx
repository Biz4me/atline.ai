import { Sparkles } from "lucide-react"
import { Card } from "@/components/ui/card"

interface DailyBriefingProps {
  userName: string
  message?: string
}

export function DailyBriefing({ userName, message }: DailyBriefingProps) {
  return (
    <Card className="relative overflow-hidden border-l-4 border-l-primary p-4">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
          <Sparkles className="h-5 w-5 text-primary" />
        </div>
        <div className="flex-1">
          <h2 className="font-heading text-base font-medium">
            Bonjour {userName} — voici ton plan du jour
          </h2>
          {message && (
            <p className="mt-1 text-sm text-muted-foreground">{message}</p>
          )}
        </div>
      </div>
    </Card>
  )
}
