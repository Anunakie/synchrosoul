import { NextRequest, NextResponse } from 'next/server'
import { groqChatWithRetry } from '@/lib/groq-retry'


export async function POST(req: NextRequest) {
  try {
    const { description, title, tier } = await req.json()

    if (!description || typeof description !== 'string' || description.trim().length < 10) {
      return NextResponse.json(
        { error: 'Song description must be at least 10 characters' },
        { status: 400 }
      )
    }

    // Determine oracle tag limit based on tier (3-6-9)
    const oracleTagLimit = tier === 'twin-flame' || tier === 'twin_flame' ? 9
      : tier === 'mystic' ? 6
      : 3

    const completion = await groqChatWithRetry({
      model: 'llama-3.3-70b-versatile',
      temperature: 0.3,
      max_tokens: 400,
      messages: [
        {
          role: 'system',
          content: `You are an angel number oracle and spiritual music analyst. Given a song's title and description, you will:

1. Assign 3-5 angel numbers that resonate with the song's spiritual energy.
2. Generate ${oracleTagLimit} rich, specific descriptive tags that capture the song's unique spiritual essence, emotional landscape, and healing themes.

For angel numbers, use these common ones:
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

For oracle tags, be SPECIFIC and UNIQUE to this song. Don't use generic terms like "healing" or "peace" — instead use evocative, descriptive phrases that capture the song's particular energy. Good examples:
- "parallel realities", "impermanence", "golden light", "heart opening", "cosmic ocean"
- "alternate timelines", "letting go of the past", "quiet observation", "emotional paradox"
- "dawn awakening", "soul remembrance", "inner temple", "river of time"

These tags should feel like they describe the SPECIFIC spiritual journey of THIS song, not generic spiritual concepts.

Return ONLY a JSON object with two fields:
{
  "angel_numbers": ["444", "777", "1111"],
  "oracle_tags": ["parallel realities", "impermanence", "quiet observation"]
}

No explanation, no markdown, just the JSON object.`
        },
        {
          role: 'user',
          content: `Song Title: ${title || 'Untitled'}

Song Description:
${description.trim()}

Generate exactly ${oracleTagLimit} oracle tags.`
        }
      ]
    })

    const content = completion.choices[0]?.message?.content?.trim() || '{}'

    let angelNumbers: string[] = []
    let oracleTags: string[] = []

    try {
      // Try to extract JSON from response
      const jsonMatch = content.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0])

        // Parse angel numbers
        if (Array.isArray(parsed.angel_numbers)) {
          const validNumbers = ['111', '222', '333', '444', '555', '666', '777', '888', '999', '1010', '1111', '1212', '1234']
          angelNumbers = parsed.angel_numbers
            .map(String)
            .filter((n: string) => validNumbers.includes(n))
            .slice(0, 5)
        }

        // Parse oracle tags
        if (Array.isArray(parsed.oracle_tags)) {
          oracleTags = parsed.oracle_tags
            .map(String)
            .map((t: string) => t.toLowerCase().trim())
            .filter((t: string) => t.length > 1 && t.length < 50)
            .slice(0, oracleTagLimit)
        }
      }
    } catch {
      // If JSON parsing fails, try to extract numbers from text
      const matches = content.match(/\d{3,4}/g)
      if (matches) {
        const validNumbers = ['111', '222', '333', '444', '555', '666', '777', '888', '999', '1010', '1111', '1212', '1234']
        angelNumbers = matches
          .filter(n => validNumbers.includes(n))
          .slice(0, 5)
      }
    }

    // Ensure at least one angel number
    if (angelNumbers.length === 0) {
      angelNumbers = ['1111']
    }

    // Ensure at least one oracle tag
    if (oracleTags.length === 0) {
      oracleTags = ['spiritual journey']
    }

    return NextResponse.json({
      angel_numbers: angelNumbers,
      oracle_tags: oracleTags,
    })

  } catch (error) {
    console.error('Angel/oracle tag assignment error:', error)
    return NextResponse.json(
      { error: 'Failed to assign', angel_numbers: ['1111'], oracle_tags: ['spiritual journey'] },
      { status: 500 }
    )
  }
}
