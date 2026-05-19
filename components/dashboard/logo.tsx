import { cn } from "@/lib/utils"

interface AtlineLogoProps {
  className?: string
  showText?: boolean
  size?: "sm" | "md" | "lg"
}

export function AtlineMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 220 170"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="atlineMark" x1="108" y1="15" x2="186" y2="138" gradientUnits="userSpaceOnUse">
          <stop offset="0%"   stopColor="#8855E8" />
          <stop offset="100%" stopColor="#00BBEE" />
        </linearGradient>
      </defs>

      {/* Left leg — trapezoid tapering to apex */}
      <path d="M 108,15 L 112,15 L 83,122 L 59,117 Z" fill="url(#atlineMark)" />

      {/* Right leg — trapezoid tapering to apex */}
      <path d="M 108,15 L 112,15 L 158,90 L 141,100 Z" fill="url(#atlineMark)" />

      {/* Arc swoosh — thin ribbon curving under the A and extending right */}
      <path
        d="M 28,101 C 80,133 140,131 188,88 L 180,80 C 140,122 80,124 36,94 Z"
        fill="url(#atlineMark)"
      />

      {/* Cyan accent — between right leg and arc */}
      <path d="M 143,97 L 161,84 L 163,96 L 145,109 Z" fill="#00CCFF" />
    </svg>
  )
}

export function AtlineLogo({ className, showText = true, size = "md" }: AtlineLogoProps) {
  const sizes = {
    sm: { icon: "h-5 w-7",  text: "text-base" },
    md: { icon: "h-7 w-9",  text: "text-lg"   },
    lg: { icon: "h-9 w-12", text: "text-xl"   },
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
