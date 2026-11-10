import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { createClient as createSessionClient } from '@/lib/supabase/server'

export const runtime = 'nodejs'

// Marks a song recommendation as clicked (Listen or View Artist).
// Only the signed-in user who received the recommendation can mark it.
export async function POST(req: NextRequest) {
  try {
    const { recommendationId } = await req.json()
    if (!recommendationId || typeof recommendationId !== 'string') {
      return NextResponse.json({ ok: false }, { status: 400 })
    }

    const session = await createSessionClient()
    const { data: { user } } = await session.auth.getUser()
    if (!user) return NextResponse.json({ ok: false }, { status: 401 })

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (!url || !key) return NextResponse.json({ ok: false })

    const admin = createClient(url, key)
    const { error } = await admin
      .from('song_recommendations')
      .update({ clicked: true })
      .eq('id', recommendationId)
      .eq('user_id', user.id)

    if (error) {
      console.error('Song recommendation click tracking failed:', error.message)
      return NextResponse.json({ ok: false })
    }
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ ok: false })
  }
}
