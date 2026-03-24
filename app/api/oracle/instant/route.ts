import { NextRequest, NextResponse } from 'next/server'
import Groq from 'groq-sdk'

export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  try {
    const { number, thoughtAnchor, numerologyProfile } = await req.json()

    if (!number) {
      return NextResponse.json({ error: 'Number required' }, { status: 400 })
    }

    const apiKey = process.env.GROQ_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: 'Oracle not configured' }, { status: 500 })
    }

    const groq = new Groq({ apiKey })

    const numerologyContext = numerologyProfile
      ? `Life Path ${numerologyProfile.lifePathNumber || numerologyProfile.lifePath || '?'}, Soul Urge ${numerologyProfile.soulUrgeNumber || numerologyProfile.soulUrge || '?'}, Destiny ${numerologyProfile.destinyNumber || numerologyProfile.destiny || '?'}`
      : null

    const hasThought = thoughtAnchor && thoughtAnchor.trim().length > 0

    const systemPrompt = `You are the SynchroSoul Angel Oracle — a mystical, deeply intuitive spiritual guide. You interpret angel numbers in direct relation to what someone was thinking or experiencing when they saw the number.

Your readings are:
- Deeply personal and SPECIFIC to their thought — never generic
- Poetic but clear and immediately relevant to their situation
- 3-4 sentences maximum
- Warm, empowering, and feel genuinely fated — like the universe was listening

CRITICAL RULE: The thought anchor is the most important element. Your reading MUST directly address and weave in what they were thinking. If they thought about taxes, address finances and transformation. If they thought about a relationship, address that specifically. Never give a generic angel number meaning — always make the cosmic message feel like a direct response to their exact thought.`

    const userPrompt = hasThought
      ? `The seeker just saw angel number ${number}.

Right before seeing it, they were thinking about: "${thoughtAnchor.trim()}"

Give a cosmic reading that DIRECTLY connects the meaning of ${number} to their specific thought. Make them feel the universe was responding directly to what was on their mind.${numerologyContext ? `\n\nTheir numerology: ${numerologyContext}` : ''}`
      : `The seeker just saw angel number ${number}. Give them a brief, powerful cosmic reading about what this number means for them right now.${numerologyContext ? `\n\nTheir numerology: ${numerologyContext}` : ''}`

    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.88,
      max_tokens: 220,
    })

    const reading = completion.choices[0]?.message?.content || null

    // Generate a short mystical title when thought is present
    let title = `${number} — Divine Message`
    if (hasThought && reading) {
      const titleCompletion = await groq.chat.completions.create({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: 'Generate a short mystical title (4-6 words max) for an angel number reading that connects the number to the thought. Return ONLY the title, no quotes, no punctuation at end.' },
          { role: 'user', content: `Angel number ${number}, thought about: ${thoughtAnchor.trim().slice(0, 80)}` }
        ],
        temperature: 0.9,
        max_tokens: 20,
      })
      const generatedTitle = titleCompletion.choices[0]?.message?.content?.trim().replace(/["']/g, '')
      if (generatedTitle) title = generatedTitle
    }

    return NextResponse.json({
      reading,
      title,
      isAI: true,
      hasThoughtContext: hasThought,
    })

  } catch (err) {
    console.error('Instant oracle error:', err)
    return NextResponse.json({ error: 'Oracle temporarily unavailable' }, { status: 500 })
  }
}
