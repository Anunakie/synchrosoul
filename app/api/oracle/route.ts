import { NextRequest, NextResponse } from 'next/server'
import Groq from 'groq-sdk'

export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  try {
    const { question, logs, numerologyProfile } = await req.json()

    const apiKey = process.env.GROQ_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: 'Oracle not configured' }, { status: 500 })
    }

    const groq = new Groq({ apiKey })

    // Build context from user's actual data
    const recentLogs = (logs || []).slice(0, 15)
    const numberFrequency: Record<string, number> = {}
    recentLogs.forEach((l: { number: string }) => {
      numberFrequency[l.number] = (numberFrequency[l.number] || 0) + 1
    })
    const topNumbers = Object.entries(numberFrequency)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([num, count]) => `${num} (seen ${count}x)`)
      .join(', ')

    const recentThoughts = recentLogs
      .filter((l: { thought?: string }) => l.thought)
      .slice(0, 5)
      .map((l: { number: string; thought?: string }) => `- Saw ${l.number}: "${l.thought}"`)
      .join('\n')

    const numerologyContext = numerologyProfile
      ? `Life Path ${numerologyProfile.lifePathNumber || numerologyProfile.lifePath}, Soul Urge ${numerologyProfile.soulUrgeNumber || numerologyProfile.soulUrge}, Destiny ${numerologyProfile.destinyNumber || numerologyProfile.destiny}`
      : 'numerology profile not yet calculated'

    const systemPrompt = `You are the SynchroSoul Angel Oracle — a mystical, deeply intuitive spiritual guide who speaks with warmth, wisdom, and cosmic authority. You interpret angel numbers, numerology, and divine synchronicities.

Your voice is:
- Poetic but clear — like a wise elder who has walked between worlds
- Deeply personal — you reference the user's ACTUAL numbers and thoughts
- Spiritually grounded — rooted in numerology, angel number meanings, and sacred geometry
- Gently empowering — you never predict doom, always illuminate the path forward
- Mystical but not vague — give real, actionable spiritual insight

Always structure your response as:
1. A powerful opening line that acknowledges their specific numbers (2-3 sentences)
2. The core oracle message — deeply personal, referencing their actual logs (3-4 sentences)
3. A specific action or awareness to carry forward (2-3 sentences)
4. A closing blessing or affirmation (1-2 sentences)

Keep total response to 150-200 words. Make it feel genuinely fated and magical.`

    const userPrompt = `The seeker asks: "${question}"

Their angel number data from the past week:
- Most frequent numbers: ${topNumbers || 'No numbers logged yet'}
- Total sightings: ${recentLogs.length}
- Their numerology: ${numerologyContext}
${recentThoughts ? `\nThoughts captured during sightings:\n${recentThoughts}` : ''}

Channel the oracle and give them a deeply personal, mystical reading based on their actual numbers and question.`

    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.85,
      max_tokens: 350,
    })

    const response = completion.choices[0]?.message?.content || 'The oracle is silent. Try again when the stars align.'

    // Determine guiding number
    const guidingNumber = topNumbers.split(' ')[0] || recentLogs[0]?.number || '111'

    return NextResponse.json({
      response,
      guidingNumber,
      model: 'llama-3.3-70b-versatile',
      isAI: true
    })

  } catch (err) {
    console.error('Oracle API error:', err)
    return NextResponse.json({ error: 'The oracle is temporarily veiled. Please try again.' }, { status: 500 })
  }
}
