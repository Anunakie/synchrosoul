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
    startupImage: [
      { url: '/icon-512.png', media: '(device-width: 390px) and (device-height: 844px)' },
    ],
  },
  openGraph: {
    title: 'SynchroSoul — Angel Number Dating',
    description: 'Match with souls seeing the same angel numbers as you.',
    type: 'website',
    images: [{ url: '/icon-512.png', width: 512, height: 512, alt: 'SynchroSoul' }],
  },
  twitter: {
    card: 'summary',
    title: 'SynchroSoul',
    description: 'Angel number dating app — match with souls on your frequency',
    images: ['/icon-512.png'],
  },
  icons: {
    icon: '/icon-192.png',
    apple: [
      { url: '/icon-192.png', sizes: '192x192' },
      { url: '/icon-512.png', sizes: '512x512' },
    ],
    shortcut: '/icon-192.png',
  },
  keywords: ['angel numbers', 'numerology', 'spiritual dating', 'soul mate', 'twin flame', '1111', '555', '333'],
}

export const viewport: Viewport = {
  themeColor: '#050510',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="SynchroSoul" />
        <meta name="application-name" content="SynchroSoul" />
        <meta name="msapplication-TileColor" content="#050510" />
        <meta name="msapplication-TileImage" content="/icon-192.png" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
        <link rel="apple-touch-icon" sizes="192x192" href="/icon-192.png" />
        <link rel="apple-touch-icon" sizes="512x512" href="/icon-512.png" />
        <link rel="apple-touch-startup-image" href="/icon-512.png" />
      </head>
      <body style={{ background: '#050510', minHeight: '100vh', overflowX: 'hidden' }}>
        {children}
      </body>
    </html>
  )
}
