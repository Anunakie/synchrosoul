// app/api/cosmic-field/snapshot/route.ts
// POST — capture the live Cosmic Field at the moment of a reading, generate a
// poetic Oracle field note, and attach it to the angel_log / dream entry.
// ADMIN-ONLY private beta: non-admins receive 404 so the feature leaves no trace.

import { NextRequest, NextResponse } from 'next/server'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/server'
import { groqChatWithRetry } from '@/lib/groq-retry'
import { fetchCosmicSnapshot, isCosmicFieldAdmin, type CosmicSnapshot } from '@/lib/cosmic-field'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const SPIRITUAL_SYSTEM_PROMPT = `You are the SynchroSoul Oracle reading the living field of Earth at this exact moment. You receive the current state of the solar wind, Earth's magnetic field, the moon, and the global consciousness network, together with what a soul just experienced.

Write exactly 1-2 poetic sentences connecting the field's current state to their moment. Warm, mystical, specific — as if the cosmos itself timestamped their experience. Reference at least one real field condition (solar wind, magnetic valve, moon, consciousness field). Never use the word "AI", never explain the data, never use bullet points.`

const SIMULATION_SYSTEM_PROMPT = `You are the Architect logging the system state at the moment a signal was registered. You receive live telemetry: solar wind parameters, magnetospheric coupling (Bz), geomagnetic index, lunar cycle position, and global RNG network variance.

Write exactly 1-2 cold, precise sentences connecting the field telemetry to the registered signal. Use system language: signal, code, field variance, coupling, telemetry. Never use spiritual words (angel, cosmic, divine, universe, soul). Never use the word "AI". No bullet points.`

function describeSnapshot(snapshot: CosmicSnapshot): string {
  const { solar, consciousness, moon } = snapshot
  const parts: string[] = []
  if (solar.windSpeed !== null) parts.push(`Solar wind: ${solar.windSpeed} km/s${solar.density !== null ? ` at ${solar.density} p/cm³` : ''}`)
  if (solar.bz !== null) parts.push(`Bz: ${solar.bz} nT ${solar.bzDirection === 'southward' ? '(southward — Earth\u2019s magnetic valve open, energy flowing in)' : '(northward — Earth shielded)'}`)
  if (solar.kp !== null) parts.push(`Geomagnetic Kp: ${solar.kp} (${solar.kpLabel})`)
  if (solar.flareClass) parts.push(`X-ray flare level: ${solar.flareClass}`)
  parts.push(`Moon: ${moon.phase}, ${moon.illumination}% illuminated`)
  if (consciousness.available && consciousness.coherence) {
    parts.push(`Global consciousness network coherence: ${consciousness.coherence}${consciousness.value != null ? ` (variance ${consciousness.value})` : ''}`)
  } else {
    parts.push('Global consciousness network: signal quiet')
  }
  return parts.join('\n')
}

async function generateFieldNote(
  snapshot: CosmicSnapshot,
  entryType: 'log' | 'dream',
  context: { number?: string; thought?: string; reading?: string },
  isSimulation: boolean
): Promise<string | null> {
  try {
    if (!process.env.GROQ_API_KEY) return null

    const momentParts: string[] = []
    if (entryType === 'log') {
      if (context.number) momentParts.push(isSimulation ? `Registered anomaly code: ${context.number}` : `Angel number seen: ${context.number}`)
    } else {
      momentParts.push(isSimulation ? 'A dream sequence was logged.' : 'A dream was recorded.')
    }
    if (context.thought) momentParts.push(`What they were holding: "${context.thought.slice(0, 300)}"`)
    if (context.reading) momentParts.push(`The reading they received: "${context.reading.slice(0, 500)}"`)

    const userPrompt = `LIVE FIELD STATE:\n${describeSnapshot(snapshot)}\n\nTHE MOMENT:\n${momentParts.join('\n')}\n\nWrite the 1-2 sentence field note now.`

    const completion = await groqChatWithRetry({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: isSimulation ? SIMULATION_SYSTEM_PROMPT : SPIRITUAL_SYSTEM_PROMPT },
        { role: 'user', content: userPrompt },
      ],
      max_tokens: 120,
      temperature: 0.85,
    })

    const note = completion.choices?.[0]?.message?.content?.trim()
    return note || null
  } catch (error) {
    console.error('cosmic-field fieldNote generation failed:', error)
    return null
  }
}

export async function POST(req: NextRequest) {
  try {
    // Admin gate — silent 404 for everyone else
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user || !isCosmicFieldAdmin(user.email)) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    const body = await req.json().catch(() => ({}))
    const entryType = body?.entryType as 'log' | 'dream' | undefined
    const entryId = typeof body?.entryId === 'string' ? body.entryId : null
    const isSimulation = body?.mode === 'simulation'

    if ((entryType !== 'log' && entryType !== 'dream') || !entryId) {
      return NextResponse.json({ error: 'entryType (log|dream) and entryId required' }, { status: 400 })
    }

    // 1. Live field snapshot (cached ~5 min)
    const snapshot = await fetchCosmicSnapshot()

    // 2. Oracle field note connecting the field to their moment (best effort)
    const fieldNote = await generateFieldNote(snapshot, entryType, {
      number: typeof body?.number === 'string' ? body.number : undefined,
      thought: typeof body?.thought === 'string' ? body.thought : undefined,
      reading: typeof body?.reading === 'string' ? body.reading : undefined,
    }, isSimulation)

    const stored = { ...snapshot, fieldNote }

    // 3. Persist onto the entry via service-role client (best effort — the
    // snapshot is still returned to the caller even if persistence fails)
    try {
      const serviceUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
      if (serviceUrl && serviceKey) {
        const admin = createSupabaseClient(serviceUrl, serviceKey)
        const table = entryType === 'log' ? 'angel_logs' : 'dreams'
        const { error } = await admin
          .from(table)
          .update({ cosmic_field_snapshot: stored })
          .eq('id', entryId)
          .eq('user_id', user.id) // never write to another user's entry
        if (error) console.error(`cosmic-field snapshot persist failed (${table}):`, error.message)
      }
    } catch (error) {
      console.error('cosmic-field snapshot persist failed:', error)
    }

    // 4. Return the snapshot for immediate rendering
    return NextResponse.json(stored)
  } catch (error) {
    console.error('cosmic-field snapshot POST failed:', error)
    return NextResponse.json({ error: 'Field reading unavailable' }, { status: 500 })
  }
}
