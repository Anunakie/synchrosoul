import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'

export const runtime = 'nodejs'

const TOTAL_TRIAL_READINGS = 3

/**
 * Service-role Supabase client that bypasses RLS for DB reads/writes.
 */
function serviceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )
}

/**
 * Returns an SSR Supabase client wired to the request cookies so getUser()
 * resolves the session from the browser's auth cookie.
 */
async function sessionClient() {
  const cookieStore = await cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll(cookiesToSet) {
          try { cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options)) } catch {}
        },
      },
    }
  )
}

/**
 * GET /api/trial-reading
 * Returns the authenticated user's free-trial reading counter.
 */
export async function GET() {
  try {
    const supabase = await sessionClient()
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const admin = serviceClient()
    const { data } = await admin
      .from('profiles')
      .select('free_trial_readings_used')
      .eq('id', user.id)
      .single()

    const used = (data?.free_trial_readings_used as number) || 0
    const remaining = Math.max(0, TOTAL_TRIAL_READINGS - used)

    return NextResponse.json({ remaining, used, total: TOTAL_TRIAL_READINGS })
  } catch (err) {
    console.error('trial-reading GET error:', err)
    return NextResponse.json({ error: 'Failed to fetch trial status' }, { status: 500 })
  }
}

/**
 * POST /api/trial-reading
 * Increments the user's free-trial reading counter by 1 (caps at TOTAL_TRIAL_READINGS).
 */
export async function POST() {
  try {
    const supabase = await sessionClient()
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const admin = serviceClient()

    // Read current value
    const { data } = await admin
      .from('profiles')
      .select('free_trial_readings_used')
      .eq('id', user.id)
      .single()

    const currentUsed = (data?.free_trial_readings_used as number) || 0
    const newUsed = Math.min(TOTAL_TRIAL_READINGS, currentUsed + 1)

    await admin
      .from('profiles')
      .update({ free_trial_readings_used: newUsed })
      .eq('id', user.id)

    return NextResponse.json({
      remaining: Math.max(0, TOTAL_TRIAL_READINGS - newUsed),
      used: newUsed,
    })
  } catch (err) {
    console.error('trial-reading POST error:', err)
    return NextResponse.json({ error: 'Failed to increment trial counter' }, { status: 500 })
  }
}
