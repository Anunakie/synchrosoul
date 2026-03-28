import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    // Get current user's shared dreams themes
    const { data: myDreams } = await supabase
      .from('dreams')
      .select('dream_themes')
      .eq('user_id', user.id)
      .eq('is_shared', true)
      .limit(10)

    const myThemes = new Set<string>()
    ;(myDreams || []).forEach(d => {
      try { JSON.parse(d.dream_themes || '[]')
        .forEach((t: string) => myThemes.add(t.toLowerCase())) } catch {}
    })

    // Get other users' shared dreams with their profile info
    const { data: sharedDreams, error } = await supabase
      .from('dreams')
      .select(`
        id, title, description, dream_themes, shared_at, user_id,
        profiles!inner(display_name, avatar_url, avatar_color, life_path)
      `)
      .eq('is_shared', true)
      .neq('user_id', user.id)
      .order('shared_at', { ascending: false })
      .limit(30)

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    const resonances = (sharedDreams || []).map((dream: any) => {
      let themes: string[] = []
      try { themes = JSON.parse(dream.dream_themes || '[]')} catch {}

      // Calculate resonance score based on theme overlap
      const overlap = themes.filter(t => myThemes.has(t.toLowerCase())).length
      const resonanceScore = myThemes.size > 0
        ? Math.round((overlap / Math.max(themes.length, 1)) * 100)
        : 30 // base score if user has no shared dreams yet

      const profile = dream.profiles as any
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
