import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://synchrosoul.app'
  const now = new Date()

  return [
    // Public pages - highest priority
    { url: siteUrl, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: `${siteUrl}/auth/signup`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${siteUrl}/auth/login`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },

    // High-value SEO pages
    { url: `${siteUrl}/dashboard/dictionary`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${siteUrl}/dashboard/numerology-deep`, lastModified: now, changeFrequency: 'monthly', priority: 0.85 },
    { url: `${siteUrl}/dashboard/compatibility`, lastModified: now, changeFrequency: 'monthly', priority: 0.85 },
    { url: `${siteUrl}/dashboard/oracle`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${siteUrl}/dashboard/tarot`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${siteUrl}/dashboard/healers`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${siteUrl}/dashboard/affirmations`, lastModified: now, changeFrequency: 'weekly', priority: 0.75 },
    { url: `${siteUrl}/dashboard/personal-year`, lastModified: now, changeFrequency: 'monthly', priority: 0.75 },
    { url: `${siteUrl}/dashboard/karmic-debt`, lastModified: now, changeFrequency: 'monthly', priority: 0.75 },
    { url: `${siteUrl}/dashboard/synthesis`, lastModified: now, changeFrequency: 'weekly', priority: 0.75 },
    { url: `${siteUrl}/dashboard/soul-twin`, lastModified: now, changeFrequency: 'daily', priority: 0.75 },

    // Dashboard core pages
    { url: `${siteUrl}/dashboard`, lastModified: now, changeFrequency: 'daily', priority: 0.7 },
    { url: `${siteUrl}/dashboard/journal`, lastModified: now, changeFrequency: 'daily', priority: 0.7 },
    { url: `${siteUrl}/dashboard/dreams`, lastModified: now, changeFrequency: 'daily', priority: 0.7 },
    { url: `${siteUrl}/dashboard/sync`, lastModified: now, changeFrequency: 'daily', priority: 0.7 },
    { url: `${siteUrl}/dashboard/feed`, lastModified: now, changeFrequency: 'daily', priority: 0.65 },
    { url: `${siteUrl}/dashboard/profile`, lastModified: now, changeFrequency: 'weekly', priority: 0.65 },

    // Tools & features
    { url: `${siteUrl}/dashboard/vision-board`, lastModified: now, changeFrequency: 'weekly', priority: 0.6 },
    { url: `${siteUrl}/dashboard/manifestations`, lastModified: now, changeFrequency: 'weekly', priority: 0.6 },
    { url: `${siteUrl}/dashboard/gratitude`, lastModified: now, changeFrequency: 'daily', priority: 0.6 },
    { url: `${siteUrl}/dashboard/badges`, lastModified: now, changeFrequency: 'weekly', priority: 0.6 },
    { url: `${siteUrl}/dashboard/stats`, lastModified: now, changeFrequency: 'weekly', priority: 0.6 },
    { url: `${siteUrl}/dashboard/streak`, lastModified: now, changeFrequency: 'daily', priority: 0.6 },
    { url: `${siteUrl}/dashboard/insights`, lastModified: now, changeFrequency: 'weekly', priority: 0.6 },
    { url: `${siteUrl}/dashboard/solfeggio`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${siteUrl}/dashboard/rituals`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${siteUrl}/dashboard/cosmic-report`, lastModified: now, changeFrequency: 'weekly', priority: 0.6 },
    { url: `${siteUrl}/dashboard/relationships`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${siteUrl}/dashboard/angel-circles`, lastModified: now, changeFrequency: 'weekly', priority: 0.6 },
    { url: `${siteUrl}/dashboard/profile-card`, lastModified: now, changeFrequency: 'monthly', priority: 0.55 },
    { url: `${siteUrl}/dashboard/saved-readings`, lastModified: now, changeFrequency: 'weekly', priority: 0.55 },
    { url: `${siteUrl}/dashboard/messages`, lastModified: now, changeFrequency: 'daily', priority: 0.55 },
    { url: `${siteUrl}/dashboard/notifications`, lastModified: now, changeFrequency: 'daily', priority: 0.5 },
    { url: `${siteUrl}/dashboard/referrals`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${siteUrl}/dashboard/upgrade`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
  ]
}
