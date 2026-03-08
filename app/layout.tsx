import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'SynchroSoul — Angel Number Dating',
  description: 'Match with souls seeing the same angel numbers as you. Discover your cosmic connections.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'SynchroSoul',
  },
  openGraph: {
    title: 'SynchroSoul — Angel Number Dating',
    description: 'Match with souls seeing the same angel numbers as you.',
    type: 'website',
  },
}

export const viewport: Viewport = {
  themeColor: '#050510',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet" />
      </head>
      <body style={{ background: '#050510', minHeight: '100vh', overflowX: 'hidden' }}>
        {children}
      </body>
    </html>
  )
}
