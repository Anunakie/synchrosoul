import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import Groq from 'groq-sdk'

export const runtime = 'nodejs'

interface CandidateSong {
  song_id: string
  song_title: string
  song_description: string | null
  song_genre: string | null
  song_embed_url: string | null
  song_cover_art_url: string | null
  song_amazon_music_url: string | null
  song_spotify_url: string | null
  healer_id: string
  artist_name: string
  healer_avatar_url: string | null
  relevance_score: number
}

// Extract themes/moods from a reading for candidate song matching
function extractContextKeywords(number: string, thought: string, reading: string): { themes: string[]; moods: string[]; angelNumbers: string[] } {
  const text = `${thought} ${reading}`.toLowerCase()

  // Theme extraction based on common spiritual/emotional keywords
  const themeMap: Record<string, string[]> = {
    'love': ['love', 'heart', 'relationship', 'partner', 'romance', 'connection', 'beloved'],
    'transformation': ['change', 'transform', 'shift', 'evolve', 'transition', 'metamorphosis', 'rebirth'],
    'healing': ['heal', 'recovery', 'wholeness', 'restore', 'mend', 'wellness'],
    'courage': ['courage', 'brave', 'fear', 'scared', 'bold', 'strength', 'overcome'],
    'peace': ['peace', 'calm', 'tranquil', 'serene', 'quiet', 'still', 'rest'],
    'letting go': ['let go', 'release', 'surrender', 'detach', 'forgive', 'move on'],
    'new beginnings': ['new', 'begin', 'start', 'fresh', 'opportunity', 'chapter', 'dawn'],
    'destiny': ['destiny', 'fate', 'purpose', 'meant to be', 'path', 'calling', 'mission'],
    'spiritual growth': ['spiritual', 'growth', 'awakening', 'enlighten', 'consciousness', 'evolve'],
    'abundance': ['abundance', 'wealth', 'prosper', 'money', 'success', 'career', 'financial'],
    'time': ['time', 'past', 'future', 'memory', 'moment', 'timeline', 'clock'],
    'nature': ['nature', 'ocean', 'mountain', 'forest', 'earth', 'sky', 'water'],
    'connection': ['connect', 'bond', 'together', 'unity', 'twin', 'soul', 'family'],
    'introspection': ['reflect', 'think', 'wonder', 'contemplate', 'question', 'understand'],
    'joy': ['joy', 'happy', 'bliss', 'delight', 'celebrate', 'grateful', 'excited'],
    'protection': ['protect', 'safe', 'guard', 'shield', 'security', 'trust'],
    'life purpose': ['purpose', 'meaning', 'why', 'direction', 'fulfill', 'mission'],
    'relationships': ['relationship', 'friend', 'family', 'partner', 'trust', 'bond'],
    'emotional healing': ['emotion', 'feeling', 'pain', 'hurt', 'grief', 'sadness', 'tears'],
    'paradox': ['paradox', 'contrast', 'both', 'opposite', 'balance', 'duality'],
  }

  const moodMap: Record<string, string[]> = {
    'peaceful': ['peace', 'calm', 'tranquil', 'serene', 'gentle', 'soft'],
    'uplifting': ['uplift', 'inspire', 'hope', 'rise', 'light', 'bright', 'positive'],
    'emotional': ['emotion', 'feel', 'deep', 'heart', 'cry', 'touch', 'move'],
    'introspective': ['reflect', 'think', 'contemplate', 'wonder', 'inner', 'quiet'],
    'empowering': ['power', 'strong', 'courage', 'brave', 'bold', 'confident'],
    'bittersweet': ['bitter', 'sweet', 'mix', 'both', 'paradox', 'nostalg'],
    'profound': ['profound', 'deep', 'truth', 'wisdom', 'meaning', 'significant'],
    'tender': ['tender', 'gentle', 'soft', 'delicate', 'fragile', 'vulnerable'],
    'contemplative': ['contemplate', 'ponder', 'meditat', 'still', 'quiet', 'observe'],
    'heartfelt': ['heart', 'sincere', 'genuine', 'warm', 'caring', 'compassion'],
  }

  const themes: string[] = []
  const moods: string[] = []

  for (const [theme, keywords] of Object.entries(themeMap)) {
    if (keywords.some(kw => text.includes(kw))) themes.push(theme)
  }
  for (const [mood, keywords] of Object.entries(moodMap)) {
    if (keywords.some(kw => text.includes(kw))) moods.push(mood)
  }

  // Always include the logged angel number
  const angelNumbers = [number]

  return { themes: themes.slice(0, 8), moods: moods.slice(0, 5), angelNumbers }
}

export async function POST(req: NextRequest) {
  try {
    const { number, thought, reading, readingType, mode } = await req.json()

    const groqKey = process.env.GROQ_API_KEY
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!groqKey || !supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json({ recommendation: null })
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Step 1: Extract themes/moods from the reading context
    const { themes, moods, angelNumbers } = extractContextKeywords(
      number || '',
      thought || '',
      reading || ''
    )

    // Step 2: Query candidate songs using the RPC function
    const { data: candidates, error } = await supabase.rpc('get_candidate_songs', {
      p_themes: themes,
      p_moods: moods,
      p_angel_numbers: angelNumbers,
      p_limit: 10,
    }) as { data: CandidateSong[] | null; error: any }

    if (error || !candidates || candidates.length === 0) {
      return NextResponse.json({ recommendation: null })
    }

    // Step 3: Send candidates to Groq for intelligent matching
    const groq = new Groq({ apiKey: groqKey })
    const isSimulation = mode === 'simulation'

    const candidateList = candidates.map((c, i) =>
      `${i + 1}. "${c.song_title}" by ${c.artist_name} — ${c.song_description || 'No description'} (Genre: ${c.song_genre || 'unknown'}, Relevance: ${c.relevance_score})`
    ).join('\n')

    const systemPrompt = isSimulation
      ? `You are the Architect's audio-signal processor. Given a decoded anomaly reading and a list of audio data objects, select the single most resonant frequency match. Your response must be JSON only: {"pick": <number 1-N>, "reason": "<one sentence — cold, technical, referencing signal patterns>"}`
      : `You are the SynchroSoul Music Oracle. Given a spiritual reading and a list of healing songs, select the single best match — the song whose healing energy most directly resonates with what the seeker is going through. Your response must be JSON only: {"pick": <number 1-N>, "reason": "<one sentence — warm, mystical, connecting the song to the reading>"}`

    const userPrompt = isSimulation
      ? `ANOMALY_CODE: ${number || 'N/A'}\nCONSCIOUSNESS_SNAPSHOT: "${thought || 'unrecorded'}"\nDECODED_SIGNAL:\n${reading || 'No signal decoded'}\n\nAVAILABLE AUDIO DATA:\n${candidateList}\n\nSelect the optimal frequency match. Return JSON only.`
      : `Angel Number: ${number || 'N/A'}\nThe seeker was thinking: "${thought || 'not recorded'}"\nOracle Reading:\n${reading || 'No reading generated'}\n\nAvailable Healing Songs:\n${candidateList}\n\nWhich song best matches this moment in the seeker's journey? Return JSON only.`

    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.7,
      max_tokens: 150,
    })

    const aiResponse = completion.choices[0]?.message?.content || ''

    // Parse AI response
    let pick = 1
    let reason = ''
    try {
      // Try to extract JSON from response (may have surrounding text)
      const jsonMatch = aiResponse.match(/\{[^}]+\}/)
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0])
        pick = parsed.pick || 1
        reason = parsed.reason || ''
      }
    } catch {
      // If JSON parsing fails, default to first candidate
      pick = 1
      reason = isSimulation
        ? 'Frequency alignment detected with primary audio signal.'
        : 'This healing melody resonates with the energy of your reading.'
    }

    // Clamp pick to valid range
    const index = Math.max(0, Math.min(pick - 1, candidates.length - 1))
    const chosen = candidates[index]

    // Step 4: Record the recommendation (non-blocking)
    try {
      const userId = req.headers.get('x-user-id')
      if (userId) {
        await supabase.from('song_recommendations').insert({
          user_id: userId,
          song_id: chosen.song_id,
          healer_id: chosen.healer_id,
          reading_type: readingType || 'oracle',
          context_number: number || null,
          context_thought: thought?.slice(0, 500) || null,
          ai_reasoning: reason?.slice(0, 500) || null,
          clicked: false,
        })
      }
    } catch {
      // Don't fail the request if tracking fails
    }

    return NextResponse.json({
      recommendation: {
        songId: chosen.song_id,
        songTitle: chosen.song_title,
        songDescription: chosen.song_description,
        songGenre: chosen.song_genre,
        songEmbedUrl: chosen.song_embed_url,
        songCoverArtUrl: chosen.song_cover_art_url,
        songAmazonMusicUrl: chosen.song_amazon_music_url,
        songSpotifyUrl: chosen.song_spotify_url,
        healerId: chosen.healer_id,
        artistName: chosen.artist_name,
        healerAvatarUrl: chosen.healer_avatar_url,
        reason: reason,
      }
    })

  } catch (err) {
    console.error('Song recommendation error:', err)
    return NextResponse.json({ recommendation: null })
  }
}
