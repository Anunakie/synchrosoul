import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'

function getServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) throw new Error('Missing Supabase credentials')
  return createSupabaseClient(url, key)
}

function parseThemes(raw: any): string[] {
  if (!raw) return []
  if (Array.isArray(raw)) return raw.map((t: any) => String(t))
  if (typeof raw === 'string') {
    try { return JSON.parse(raw) } catch { return [] }
  }
  return []
}

export async function GET() {
  try {
    // Authenticate user via session
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    // Use service role for all data queries (bypasses RLS)
    const admin = getServiceClient()

    // Get current user's shared dreams themes
    const { data: myDreams, error: myErr } = await admin
      .from('dreams')
      .select('dream_themes')
      .eq('user_id', user.id)
      .eq('is_shared', true)
      .limit(10)

    const myThemes = new Set<string>()
    ;(myDreams || []).forEach(d => {
      parseThemes(d.dream_themes).forEach(t => myThemes.add(t.toLowerCase()))
    })

    // Get other users' shared dreams
    const { data: sharedDreams, error } = await admin
      .from('dreams')
      .select('id, title, description, dream_themes, shared_at, user_id')
      .eq('is_shared', true)
      .neq('user_id', user.id)
      .order('shared_at', { ascending: false })
      .limit(30)

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    // Get profile info for matched users
    const userIds = [...new Set((sharedDreams || []).map(d => d.user_id))]
    const profileMap: Record<string, any> = {}
    if (userIds.length > 0) {
      const { data: profiles } = await admin
        .from('profiles')
        .select('id, display_name, avatar_url, avatar_color, life_path')
        .in('id', userIds)
      ;(profiles || []).forEach(p => { profileMap[p.id] = p })
    }

    const resonances = (sharedDreams || []).map((dream: any) => {
      const themes = parseThemes(dream.dream_themes)

      // Calculate resonance score based on theme overlap (Jaccard-like)
      const themesLower = themes.map(t => t.toLowerCase())
      const matchedThemes = themesLower.filter(t => myThemes.has(t))
      const overlap = matchedThemes.length
      const union = new Set([...myThemes, ...themesLower]).size
      const resonanceScore = myThemes.size > 0 && union > 0
        ? Math.round((overlap / union) * 100)
        : 30 // base score if user has no shared dreams yet

      const profile = profileMap[dream.user_id]
      return {
        dreamId: dream.id,
        userId: dream.user_id,
        userName: profile?.display_name || 'Cosmic Soul',
        userAvatar: profile?.avatar_url || null,
        userAvatarColor: profile?.avatar_color || '#9b59b6',
        lifePath: profile?.life_path || null,
        dreamTitle: dream.title || 'Untitled Dream',
        dreamDescription: dream.description || '',
        themes,
        sharedAt: dream.shared_at,
        resonanceScore,
        matchedThemes: themes.filter(t => myThemes.has(t.toLowerCase()))
      }
    }).sort((a: any, b: any) => b.resonanceScore - a.resonanceScore)

    return NextResponse.json({ resonances })
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}
