import { createServerClient } from '@supabase/ssr'
import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  try {
    // Verify user is authenticated via their session cookie
    const cookieStore = await cookies()
    const supabase = createServerClient(
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

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { otherUserId, myName, myAvatar, otherName, otherAvatar } = await req.json()
    if (!otherUserId) return NextResponse.json({ error: 'Missing otherUserId' }, { status: 400 })

    // Use service role to bypass RLS for conversation creation
    const admin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { autoRefreshToken: false, persistSession: false } }
    )

    const myId = user.id

    // Check if conversation already exists in either direction
    const { data: existing } = await admin
      .from('conversations')
      .select('id')
      .or(`and(user1_id.eq.${myId},user2_id.eq.${otherUserId}),and(user1_id.eq.${otherUserId},user2_id.eq.${myId})`)
      .maybeSingle()

    if (existing?.id) {
      return NextResponse.json({ conversationId: existing.id })
    }

    // Create new conversation
    const { data: created, error } = await admin
      .from('conversations')
      .insert({
        user1_id: myId,
        user2_id: otherUserId,
        user1_name: myName || 'Soul',
        user2_name: otherName || 'Soul',
        user1_avatar: myAvatar || '',
        user2_avatar: otherAvatar || '',
        last_message_at: new Date().toISOString(),
        last_message_preview: '',
      })
      .select('id')
      .single()

    if (error) {
      console.error('[Messages API] create conversation error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ conversationId: created.id })
  } catch (e: any) {
    console.error('[Messages API] exception:', e)
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
