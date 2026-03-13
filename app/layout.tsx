import type { Metadata, Viewport } from 'next'
import './globals.css'
import Script from 'next/script'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://synchrosoul.app'
const googleVerification = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
const gaMeasurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID

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
    'numerology calculator', 'angel number tracker', 'spiritual community',
    'angel number app', 'spiritual wellness', 'divine guidance', 'sacred numbers',
    'numerology reading', 'soul path', 'destiny number', 'angel number meaning',
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
    google: googleVerification,
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
        "offers": [
          { "@type": "Offer", "name": "Free", "price": "0", "priceCurrency": "USD" },
          { "@type": "Offer", "name": "Mystic", "price": "6.99", "priceCurrency": "USD" },
          { "@type": "Offer", "name": "Twin Flame", "price": "9.99", "priceCurrency": "USD" }
        ],
        "description": "Log angel numbers, get numerology readings, and match with souls on your cosmic frequency.",
        "url": siteUrl,
        "screenshot": `${siteUrl}/og-image.png`,
        "featureList": [
          "Angel Number Logger",
          "Thought Anchor Journal",
          "Dream Journal",
          "Live Sync Matching",
          "Numerology Calculator",
          "AI Angel Oracle",
          "Healer Directory",
          "Weekly Cosmic Synthesis"
        ]
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "What are angel numbers?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Angel numbers are repeating number sequences like 1111, 555, or 333 that many people believe carry divine guidance and spiritual messages. They often appear at meaningful moments as signs from the universe."
            }
          },
          {
            "@type": "Question",
            "name": "What does 1111 mean?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "1111 is known as the manifestation portal. It signals new beginnings, spiritual awakening, and alignment with your highest path. When you see 1111, the universe is asking you to pay attention to your thoughts."
            }
          },
          {
            "@type": "Question",
            "name": "How does SynchroSoul match people?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "SynchroSoul matches users who log the same or harmonically compatible angel numbers within the same time window. Your Sync Score is calculated based on shared numbers, numerology compatibility, and timing proximity."
            }
          },
          {
            "@type": "Question",
            "name": "What is a Life Path number?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Your Life Path number is calculated from your birthdate by reducing all digits to a single number (or master number 11, 22, 33). It reveals your core personality, natural talents, and life purpose."
            }
          },
          {
            "@type": "Question",
            "name": "Is SynchroSoul free?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes! SynchroSoul is free to use with core features including angel number logging, journal, numerology calculator, and sync matching. Premium Mystic ($6.99/mo) and Twin Flame ($9.99/mo) tiers unlock AI readings, advanced tools, and priority matching."
            }
          }
        ]
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
        {gaMeasurementId && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${gaMeasurementId}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${gaMeasurementId}', {
                  page_path: window.location.pathname,
                });
              `}
            </Script>
          </>
        )}
      </body>
    </html>
  )
}
