import { Plus_Jakarta_Sans, DM_Sans, JetBrains_Mono, Space_Grotesk } from "next/font/google"
import "../(frontend)/globals.css"

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-plus-jakarta",
  display: "swap",
})

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-dm-sans",
  display: "swap",
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-jetbrains",
  display: "swap",
})

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["700"],
  variable: "--font-space-grotesk",
  display: "swap",
})

export const metadata = {
  title: "Atline.ai",
}

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="fr"
      className={`${plusJakarta.variable} ${dmSans.variable} ${jetbrainsMono.variable} ${spaceGrotesk.variable} dark bg-background`}
    >
      <body className="min-h-screen font-sans antialiased">{children}</body>
    </html>
  )
}
