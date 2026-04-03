import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'

function getServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) throw new Error('Missing Supabase credentials')
  return createSupabaseClient(url, key)
}

export async function POST(req: Request) {
  try {
    // Authenticate user via session
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { userIds } = await req.json()
    if (!Array.isArray(userIds) || userIds.length === 0) {
      return NextResponse.json({ profiles: {} })
    }

    const admin = getServiceClient()
    const { data: profiles, error } = await admin
      .from('profiles')
      .select('id, display_name, avatar_url')
      .in('id', userIds.slice(0, 50)) // cap at 50

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    const profileMap: Record<string, { displayName: string; avatarUrl: string }> = {}
    ;(profiles || []).forEach((p: any) => {
      profileMap[p.id] = {
        displayName: p.display_name || '',
        avatarUrl: p.avatar_url || '',
      }
    })

    return NextResponse.json({ profiles: profileMap })
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}
