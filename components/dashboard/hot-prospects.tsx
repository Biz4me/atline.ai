import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ChevronRight } from "lucide-react"

interface Prospect {
  id: string
  name: string
  score: number
  lastActivity: string
}

interface ProspectCardProps {
  prospect: Prospect
}

export function ProspectCard({ prospect }: ProspectCardProps) {
  return (
    <Card className="flex items-center justify-between p-4">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-accent/20 to-primary/20">
          <span className="text-sm font-medium">{prospect.name.charAt(0)}</span>
        </div>
        <div>
          <p className="font-medium">{prospect.name}</p>
          <p className="text-sm text-muted-foreground">
            {prospect.lastActivity}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <Badge variant="accent" className="font-mono">
          {prospect.score}/10
        </Badge>
        <ChevronRight className="h-4 w-4 text-muted-foreground" />
      </div>
    </Card>
  )
}

interface HotProspectsProps {
  prospects: Prospect[]
}

export function HotProspects({ prospects }: HotProspectsProps) {
  return (
    <section>
      <h3 className="mb-3 font-heading text-base font-medium">
        Prospects chauds
      </h3>
      <div className="space-y-3">
        {prospects.map((prospect) => (
          <ProspectCard key={prospect.id} prospect={prospect} />
        ))}
      </div>
    </section>
  )
}
