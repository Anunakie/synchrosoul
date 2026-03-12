import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: {
    default: 'Sign In | SynchroSoul',
    template: '%s | SynchroSoul',
  },
  description: 'Sign in or create your free SynchroSoul account. Discover your numerology profile and match with souls seeing the same angel numbers as you.',
  robots: { index: false, follow: true },
}

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
