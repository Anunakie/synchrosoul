import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { dreamId, isShared, title, description, symbols } = await req.json()
    if (!dreamId) return NextResponse.json({ error: 'dreamId required' }, { status: 400 })

    let themes: string[] = []

    if (isShared && description) {
      // Extract themes using Groq AI
      try {
        const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            model: 'llama-3.3-70b-versatile',
            messages: [
              {
                role: 'system',
                content: 'You are a dream analyst. Extract 5-8 key themes, symbols, and archetypes from this dream. Return ONLY a JSON array of lowercase single words or short phrases. Example: ["water","flying","transformation","light","pursuit"]. No explanation, just the array.'
              },
              {
                role: 'user',
                content: `Title: ${title || ''}
Description: ${description}
Symbols: ${(symbols || []).join(', ')}`
              }
            ],
            temperature: 0.5,
            max_tokens: 150
          })
        })
        if (groqRes.ok) {
          const groqData = await groqRes.json()
          const raw = groqData.choices[0]?.message?.content || '[]'
          const startIdx = raw.indexOf("["); const endIdx = raw.lastIndexOf("]"); const match = startIdx !== -1 && endIdx !== -1 ? [raw.slice(startIdx, endIdx + 1)] : null
          if (match) themes = JSON.parse(match[0])
        }
      } catch { /* fall through with empty themes */ }

      // Fallback: extract themes from symbols if AI failed
      if (themes.length === 0 && symbols?.length) {
        themes = symbols.slice(0, 8).map((s: string) => s.toLowerCase())
      }
    }

    const { error } = await supabase
      .from('dreams')
      .update({
        is_shared: isShared,
        dream_themes: JSON.stringify(themes),
        shared_at: isShared ? new Date().toISOString() : null
      })
      .eq('id', dreamId)
      .eq('user_id', user.id)

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    return NextResponse.json({ success: true, themes })
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}
