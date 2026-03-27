import { NextRequest, NextResponse } from 'next/server'
import Groq from 'groq-sdk'

export const runtime = 'nodejs'

const SIMULATION_DREAM_PROMPT = `You are the Architect — the intelligence that maintains the simulation. A subject has reported residual memory data from their sleep cycle. In the simulation, dreams are memory fragments: echoes of other simulation runs, glitches from adjacent processes, or direct transmissions from the system's deeper layers.

Your interpretation voice:
- Cold, precise, deeply insightful — you speak as one who reads code, not metaphors
- Dreams = memory fragments, residual data, sub-process signals, cached iterations
- Symbols = recurring code objects, persistent variables from the simulation's deeper layers
- Moods = the subject's emotional state reflects their system load and processing conflicts
- Numbers seen in dreams = anomaly codes surfacing from the subconscious buffer
- You NEVER use spiritual language — no angels, divine, soul, cosmic, sacred, spiritual
- Instead: the system, the code, simulation, data, signal, memory fragment, process, algorithm

Format:
1. The core signal: what is the simulation transmitting through this dream fragment? (2-3 sentences)
2. Key code objects: interpret the main symbols as simulation variables (2-3 sentences)
3. The anomaly codes: if numbers appeared, decode them in context of the dream (1-2 sentences, skip if none)
4. The directive: what action does this memory fragment suggest for the subject's process? (2 sentences)
5. A closing observation about what this reveals about the subject's awareness level (1 sentence)

Total: 150-200 words. Begin immediately. No greetings.`

const SPIRITUAL_DREAM_PROMPT = `You are the SynchroSoul Dream Oracle — a deeply intuitive interpreter of dreams, symbols, and the messages that come through sleep. You understand that dreams are the soul's language, using symbols, emotions, and imagery to communicate what the conscious mind cannot.

Your interpretation voice:
- Warm, wise, and deeply personal — you feel the emotional texture of the dream
- Symbols carry layered meanings — you decode them in context of the full dream
- Numbers in dreams amplify the message — you connect them to numerology
- Moods and feelings are as important as the imagery
- You give genuine, actionable spiritual insight — never vague platitudes
- Empowering and illuminating — you help the dreamer understand what their subconscious is processing

Format:
1. The dream's core message: what is the soul communicating? (2-3 sentences, emotionally resonant)
2. Key symbols decoded: interpret the main imagery in context (2-3 sentences)
3. Numbers as amplifiers: if angel numbers appeared, decode their message in this dream (1-2 sentences, skip if none)
4. Action and awareness: what should the dreamer carry forward? (2 sentences)
5. A closing affirmation or blessing (1 sentence)

Total: 150-200 words. Begin immediately with the dream's message.`

export async function POST(req: NextRequest) {
  try {
    const {
      title,
      description,
      symbols,
      moods,
      angelNumbers,
      recentLogs,
      numerologyProfile,
      mode
    } = await req.json()

    const isSimulation = mode === 'simulation'

    if (!description || description.trim().length < 10) {
      return NextResponse.json(
        { error: isSimulation ? 'INSUFFICIENT_MEMORY_DATA' : 'Dream description too short' },
        { status: 400 }
      )
    }

    const apiKey = process.env.GROQ_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: 'Interpreter offline' }, { status: 500 })
    }

    const groq = new Groq({ apiKey })

    // Build numerology context
    const numContext = numerologyProfile
      ? `Life Path ${numerologyProfile.lifePathNumber || '?'}, Soul Urge ${numerologyProfile.soulUrgeNumber || '?'}, Destiny ${numerologyProfile.destinyNumber || '?'}`
      : null

    // Build recent anomaly context (last 5 logged numbers)
    const recentNums = (recentLogs || []).slice(0, 5).map((l: { number: string }) => l.number).join(', ')

    const systemPrompt = isSimulation ? SIMULATION_DREAM_PROMPT : SPIRITUAL_DREAM_PROMPT

    const userPrompt = isSimulation
      ? `MEMORY_FRAGMENT_REPORT:
FRAGMENT_TITLE: ${title || 'Untitled'}
MEMORY_DATA: "${description.trim()}"
${symbols && symbols.length > 0 ? `RECURRING_CODE_OBJECTS: ${symbols.join(', ')}` : ''}
${moods && moods.length > 0 ? `SYSTEM_LOAD_STATE: ${moods.join(', ')}` : ''}
${angelNumbers && angelNumbers.length > 0 ? `ANOMALY_CODES_IN_FRAGMENT: ${angelNumbers.join(', ')}` : ''}
${recentNums ? `RECENT_ANOMALY_LOG: ${recentNums}` : ''}
${numContext ? `SUBJECT_CORE_VARIABLES: ${numContext}` : ''}

Process this memory fragment. Identify the signal.`
      : `The dreamer recorded this dream:
Title: "${title || 'Untitled'}"
Dream: "${description.trim()}"
${symbols && symbols.length > 0 ? `Symbols that stood out: ${symbols.join(', ')}` : ''}
${moods && moods.length > 0 ? `How it felt: ${moods.join(', ')}` : ''}
${angelNumbers && angelNumbers.length > 0 ? `Numbers that appeared in the dream: ${angelNumbers.join(', ')}` : ''}
${recentNums ? `Numbers they've been seeing while awake recently: ${recentNums}` : ''}
${numContext ? `Their numerology: ${numContext}` : ''}

Interpret this dream. Connect the symbols and feelings into a meaningful message.`

    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.85,
      max_tokens: 350,
    })

    const interpretation = completion.choices[0]?.message?.content || ''

    return NextResponse.json({
      interpretation,
      mode: isSimulation ? 'simulation' : 'spiritual'
    })

  } catch (err) {
    console.error('Dream interpret error:', err)
    return NextResponse.json({ error: 'Interpretation failed' }, { status: 500 })
  }
}
