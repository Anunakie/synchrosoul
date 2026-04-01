import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'

export async function GET(req: NextRequest, { params }: { params: Promise<{ userId: string }> }) {
  try {
    const { userId } = await params
    if (!userId) return NextResponse.json({ error: 'Missing userId' }, { status: 400 })

    // Use service role to bypass RLS
    const admin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { autoRefreshToken: false, persistSession: false } }
    )

    // Fetch profile
    const { data: prof, error } = await admin
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (error || !prof) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }

    // Don't show private profiles
    if (prof.privacy_mode) {
      return NextResponse.json({ error: 'Profile is private' }, { status: 403 })
    }

    // Fetch angel logs for top numbers
    const { data: logs } = await admin
      .from('angel_logs')
      .select('number')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(100)

    let topNumbers: string[] = []
    let totalLogs = 0
    if (logs && logs.length > 0) {
      totalLogs = logs.length
      const freq: Record<string, number> = {}
      logs.forEach((l: any) => { freq[l.number] = (freq[l.number] || 0) + 1 })
      topNumbers = Object.entries(freq).sort((a, b) => b[1] - a[1]).slice(0, 4).map(([n]) => n)
    }

    return NextResponse.json({ profile: prof, topNumbers, totalLogs })
  } catch (e: any) {
    console.error('[Profile API] error:', e)
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
