import { cn } from "@/lib/utils"

interface AtlineLogoProps {
  className?: string
  showText?: boolean
  size?: "sm" | "md" | "lg"
}

// Shared SVG mark — the stylized A with arc and gradient
export function AtlineMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 180 145"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="atlineMark" x1="88" y1="10" x2="148" y2="135" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#A060E8" />
          <stop offset="48%" stopColor="#6080E0" />
          <stop offset="100%" stopColor="#00C8F5" />
        </linearGradient>
      </defs>

      {/* Left leg */}
      <path d="M 87,10 L 93,10 L 36,108 L 11,104 Z" fill="url(#atlineMark)" />

      {/* Right leg */}
      <path d="M 87,10 L 93,10 L 116,80 L 98,90 Z" fill="url(#atlineMark)" />

      {/* Arc swoosh — outer + inner as closed ribbon */}
      <path
        d="
          M 11,104
          C 10,120 52,136 88,128
          C 114,122 140,104 160,84
          L 165,75
          C 144,97 118,115 90,122
          C 54,130 20,118 20,105
          Z
        "
        fill="url(#atlineMark)"
      />

      {/* Cyan accent square on right end of arc */}
      <path d="M 150,83 L 166,72 L 168,86 L 152,97 Z" fill="#00DDFF" />
    </svg>
  )
}

export function AtlineLogo({ className, showText = true, size = "md" }: AtlineLogoProps) {
  const sizes = {
    sm: { icon: "h-6 w-8", text: "text-base" },
    md: { icon: "h-8 w-10", text: "text-lg" },
    lg: { icon: "h-10 w-12", text: "text-xl" },
  }

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <AtlineMark className={sizes[size].icon} />
      {showText && (
        <span className={cn("font-logo font-bold text-white", sizes[size].text)}>
          Atline
        </span>
      )}
    </div>
  )
}
