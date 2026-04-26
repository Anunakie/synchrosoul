import { NextRequest, NextResponse } from 'next/server'
import Groq from 'groq-sdk'

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

export async function POST(req: NextRequest) {
  try {
    const { description, title } = await req.json()

    if (!description || typeof description !== 'string' || description.trim().length < 10) {
      return NextResponse.json(
        { error: 'Song description must be at least 10 characters' },
        { status: 400 }
      )
    }

    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      temperature: 0.3,
      max_tokens: 200,
      messages: [
        {
          role: 'system',
          content: `You are an angel number oracle that assigns angel numbers to healing music based on their spiritual energy and themes.

Given a song's title and description, analyze the spiritual themes, emotions, healing intentions, and energy of the music. Then assign 3-5 angel numbers that most deeply resonate with the song.

Common angel numbers and their meanings:
- 111: New beginnings, manifestation, spiritual awakening
- 222: Balance, harmony, relationships, partnership, trust
- 333: Creativity, self-expression, ascended masters, encouragement
- 444: Protection, stability, angels nearby, foundation, love
- 555: Change, transformation, freedom, adventure, life transitions
- 666: Balance material/spiritual, self-care, nurturing, harmony
- 777: Divine alignment, luck, spiritual growth, inner wisdom, magic
- 888: Abundance, prosperity, infinite energy, karmic balance
- 999: Completion, endings, letting go, spiritual mastery, closure
- 1010: Spiritual awakening, staying positive, divine guidance
- 1111: Spiritual awakening, cosmic connection, synchronicity, portal
- 1212: Spiritual growth, divine path, stay on course, destiny
- 1234: Progressive steps, simplification, life path alignment

Return ONLY a JSON array of 3-5 angel number strings. No explanation, no markdown, just the JSON array.
Example: ["444", "777", "1111"]`
        },
        {
          role: 'user',
          content: `Song Title: ${title || 'Untitled'}

Song Description:
${description.trim()}`
        }
      ]
    })

    const content = completion.choices[0]?.message?.content?.trim() || '[]'

    // Parse the response
    let angelNumbers: string[] = []
    try {
      const parsed = JSON.parse(content)
      if (Array.isArray(parsed)) {
        // Validate: only keep known angel numbers, max 5
        const validNumbers = ['111', '222', '333', '444', '555', '666', '777', '888', '999', '1010', '1111', '1212', '1234']
        angelNumbers = parsed
          .map(String)
          .filter(n => validNumbers.includes(n))
          .slice(0, 5)
      }
    } catch {
      // If parsing fails, try to extract numbers from the text
      const matches = content.match(/\d{3,4}/g)
      if (matches) {
        const validNumbers = ['111', '222', '333', '444', '555', '666', '777', '888', '999', '1010', '1111', '1212', '1234']
        angelNumbers = matches
          .filter(n => validNumbers.includes(n))
          .slice(0, 5)
      }
    }

    // Ensure at least one number is assigned
    if (angelNumbers.length === 0) {
      angelNumbers = ['1111'] // Default: spiritual awakening
    }

    return NextResponse.json({ angel_numbers: angelNumbers })

  } catch (error) {
    console.error('Angel number assignment error:', error)
    return NextResponse.json(
      { error: 'Failed to assign angel numbers', angel_numbers: ['1111'] },
      { status: 500 }
    )
  }
}
