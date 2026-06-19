import type { Metadata, Viewport } from 'next'
import { Analytics } from '@vercel/analytics/next'
import { Toaster } from '@/components/ui/sonner'
import './globals.css'

// Cabinet Grotesk via Fontshare CDN (display font — titres, KPIs)
const cabinetGroteskHref =
  'https://api.fontshare.com/v2/css?f[]=cabinet-grotesk@800,700,600&display=swap'

export const metadata: Metadata = {
  title: 'Atline — Ton coach MLM',
  description:
    'Atline accompagne les distributeurs MLM : contacts, contenu Nova, réseau et coaching Atlas. App mobile française.',
  generator: 'v0.app',
  applicationName: 'Atline',
  icons: {
    icon: '/brand/atline-icon.png',
    apple: '/brand/atline-icon.png',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#f5f4f1',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr">
      <head>
        <link rel="preconnect" href="https://api.fontshare.com" />
        <link rel="stylesheet" href={cabinetGroteskHref} />
        {/* Blocking script — reads localStorage BEFORE React hydrates to avoid sidebar flash */}
        <script dangerouslySetInnerHTML={{ __html: `(function(){try{var h=document.documentElement;if(localStorage.getItem('sidebar-collapsed')==='1')h.setAttribute('data-sc','1');if(localStorage.getItem('atlas-sidebar-collapsed')==='1')h.setAttribute('data-ac','1');}catch(e){}})();` }} />
      </head>
      <body className="font-sans antialiased">
        {children}
        <Toaster position="top-center" />
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
