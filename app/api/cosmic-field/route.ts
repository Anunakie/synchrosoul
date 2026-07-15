// app/api/cosmic-field/route.ts
// GET — live Cosmic Field snapshot (NOAA space weather + GCP2 consciousness + moon).
// ADMIN-ONLY private beta: non-admins receive 404 so the feature leaves no trace.

import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { fetchCosmicSnapshot, isCosmicFieldAdmin } from '@/lib/cosmic-field'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    // Admin gate — silent 404 for everyone else
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user || !isCosmicFieldAdmin(user.email)) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    const snapshot = await fetchCosmicSnapshot()
    return NextResponse.json(snapshot)
  } catch (error) {
    console.error('cosmic-field GET failed:', error)
    return NextResponse.json({ error: 'Field reading unavailable' }, { status: 500 })
  }
}
