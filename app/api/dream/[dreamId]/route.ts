import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Lazy initialization to avoid build-time errors
function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ dreamId: string }> }
) {
  try {
    const { dreamId } = await params
    if (!dreamId) {
      return NextResponse.json({ error: 'Dream ID required' }, { status: 400 })
    }

    const supabase = getSupabase()

    // Fetch the dream - only if it's shared
    const { data: dream, error } = await supabase
      .from('dreams')
      .select('id, title, description, dream_themes, shared_at, created_at, reading, user_id, symbols, moods')
      .eq('id', dreamId)
      .eq('is_shared', true)
      .single()

    if (error || !dream) {
      return NextResponse.json({ error: 'Dream not found or not shared' }, { status: 404 })
    }

    // Fetch the author's display name from profiles
    let authorName = 'A Starseed'
    if (dream.user_id) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('display_name')
        .eq('id', dream.user_id)
        .single()

      if (profile?.display_name) {
        // Only use first name for privacy
        authorName = profile.display_name.split(' ')[0]
      }
    }

    // Parse dream_themes - could be JSON string or array
    let themes: string[] = []
    if (dream.dream_themes) {
      if (typeof dream.dream_themes === 'string') {
        try {
          themes = JSON.parse(dream.dream_themes)
        } catch {
          themes = []
        }
      } else if (Array.isArray(dream.dream_themes)) {
        themes = dream.dream_themes
      }
    }

    return NextResponse.json({
      dream: {
        id: dream.id,
        title: dream.title || 'Untitled Dream',
        description: dream.description || '',
        dream_themes: themes,
        shared_at: dream.shared_at,
        created_at: dream.created_at,
        author_name: authorName,
        interpretation: dream.reading || null,
        symbols: dream.symbols || [],
        moods: dream.moods || [],
      }
    })
  } catch (e) {
    console.error('[Dream API] Error:', e)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
