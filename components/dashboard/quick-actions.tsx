import { Button } from "@/components/ui/button"
import { Phone, BookOpen, UserPlus } from "lucide-react"

const actions = [
  {
    label: "Simuler un appel",
    icon: Phone,
    href: "/simulations",
  },
  {
    label: "Voir ma formation",
    icon: BookOpen,
    href: "/formation",
  },
  {
    label: "Ajouter un prospect",
    icon: UserPlus,
    href: "/reseau/add",
  },
]

export function QuickActions() {
  return (
    <section>
      <h3 className="mb-3 font-heading text-base font-medium">
        Actions rapides
      </h3>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {actions.map((action) => (
          <Button
            key={action.label}
            variant="outline"
            className="h-auto justify-start gap-3 p-4"
            asChild
          >
            <a href={action.href}>
              <action.icon className="h-5 w-5 text-primary" />
              <span>{action.label}</span>
            </a>
          </Button>
        ))}
      </div>
    </section>
  )
}
