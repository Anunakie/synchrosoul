import type { Metadata, Viewport } from 'next'
import './globals.css'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://synchrosoul.com'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'SynchroSoul — Angel Number Dating & Spiritual Matching App',
    template: '%s | SynchroSoul',
  },
  description: 'Match with souls seeing the same angel numbers as you. Log 1111, 555, 333 and connect with people on your cosmic frequency. Free numerology readings, dream journal, and spiritual matching.',
  keywords: [
    'angel numbers', 'angel number dating', 'spiritual dating app', 'numerology app',
    '1111 meaning', '555 meaning', '333 meaning', '444 meaning', '777 meaning',
    'twin flame', 'soul mate', 'spiritual connection', 'numerology dating',
    'angel number matching', 'cosmic connection', 'life path number', 'soul urge number',
    'spiritual journal', 'angel number journal', 'synchronicity', 'manifestation app',
    'numerology calculator', 'angel number tracker', 'spiritual community'
  ],
  authors: [{ name: 'SynchroSoul', url: siteUrl }],
  creator: 'SynchroSoul',
  publisher: 'SynchroSoul',
  category: 'Lifestyle',
  classification: 'Spiritual Dating & Numerology',
  manifest: '/manifest.json',
  alternates: {
    canonical: siteUrl,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteUrl,
    siteName: 'SynchroSoul',
    title: 'SynchroSoul — Angel Number Dating & Spiritual Matching',
    description: 'Log the angel numbers you see. Match with souls on your cosmic frequency. Discover your numerology profile and connect with people seeing 1111, 555, 333 at the same time as you.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'SynchroSoul — Angel Number Dating App',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@synchrosoul',
    creator: '@synchrosoul',
    title: 'SynchroSoul — Angel Number Dating',
    description: 'Match with souls seeing the same angel numbers. Log 1111, 555, 333 and find your cosmic connection.',
    images: ['/og-image.png'],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'SynchroSoul',
  },
  icons: {
    icon: [
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/icon-192.png', sizes: '192x192' },
      { url: '/icon-512.png', sizes: '512x512' },
    ],
    shortcut: '/icon-192.png',
  },
  verification: {
    // google: 'your-google-verification-code', // Add after Google Search Console setup
  },
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
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        "url": siteUrl,
        "name": "SynchroSoul",
        "description": "Angel Number Dating & Spiritual Matching App",
        "potentialAction": {
          "@type": "SearchAction",
          "target": {
            "@type": "EntryPoint",
            "urlTemplate": `${siteUrl}/dashboard/dictionary?q={search_term_string}`
          },
          "query-input": "required name=search_term_string"
        }
      },
      {
        "@type": "Organization",
        "@id": `${siteUrl}/#organization`,
        "name": "SynchroSoul",
        "url": siteUrl,
        "logo": {
          "@type": "ImageObject",
          "url": `${siteUrl}/icon-512.png`,
          "width": 512,
          "height": 512
        },
        "sameAs": [
          "https://twitter.com/synchrosoul",
          "https://instagram.com/synchrosoul"
        ]
      },
      {
        "@type": "SoftwareApplication",
        "name": "SynchroSoul",
        "operatingSystem": "Web, iOS, Android",
        "applicationCategory": "LifestyleApplication",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD"
        },
        "description": "Log angel numbers, get numerology readings, and match with souls on your cosmic frequency.",
        "url": siteUrl
      }
    ]
  }

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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body style={{ background: "#050510", minHeight: "100vh", overflowX: "hidden" }}>
        {children}
      </body>
    </html>
  )
}
