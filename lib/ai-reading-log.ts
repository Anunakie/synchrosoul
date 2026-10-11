import { after } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { createClient as createSessionClient } from '@/lib/supabase/server'
import { ORACLE_MODEL } from '@/lib/groq-retry'

/**
 * Records, for every AI reading request, whether the user got a real AI
 * reading or a generic fallback. Shown in Admin → Readings.
 *
 * Why: when Groq retired our model in Aug 2026, every Oracle call failed and
 * users silently got generic angel-number text for weeks. Nobody could see it.
 *
 * Table: ai_reading_events (see AI_READING_EVENTS_SCHEMA.sql). If the table is
 * missing, logging silently does nothing — it must never break a reading.
 */

export type ReadingFeature = 'oracle_instant' | 'oracle_question' | 'dream_interpret' | 'synthesis'

// ai        = personalized reading from the main model
// ai_backup = personalized reading, but the main model failed and the backup answered
// empty     = the model answered with nothing, so the user saw generic text
// error     = the AI call failed, so the user saw generic text
export type ReadingStatus = 'ai' | 'ai_backup' | 'empty' | 'error'

export interface ReadingEvent {
  feature: ReadingFeature
  status: ReadingStatus
  mode?: string
  model?: string | null
  error?: string | null
  latencyMs?: number
  hasThought?: boolean
  reading?: string | null
}

function serviceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )
}

/** Work out the status from what the model returned. */
export function statusFor(model: string | undefined, text: string | null | undefined): ReadingStatus {
  if (!text || !text.trim()) return 'empty'
  if (model && model !== ORACLE_MODEL) return 'ai_backup'
  return 'ai'
}

function describeError(err: unknown): string {
  const e = err as { status?: number; message?: string }
  const msg = (e?.message || String(err)).slice(0, 300)
  return e?.status ? `${e.status}: ${msg}` : msg
}

/**
 * Queue a reading event to be saved after the response is sent, so it never
 * slows down or breaks the user's reading.
 */
export function logReadingEvent(event: ReadingEvent & { err?: unknown }) {
  after(async () => {
    try {
      if (!process.env.SUPABASE_SERVICE_ROLE_KEY) return

      let userId: string | null = null
      try {
        const supabase = await createSessionClient()
        const { data: { user } } = await supabase.auth.getUser()
        userId = user?.id ?? null
      } catch { /* anonymous */ }

      const reading = event.reading?.trim() || ''
      const { error } = await serviceClient().from('ai_reading_events').insert({
        user_id: userId,
        feature: event.feature,
        status: event.status,
        mode: event.mode ?? null,
        model: event.model ?? null,
        error: event.error ?? (event.err ? describeError(event.err) : null),
        latency_ms: event.latencyMs ?? null,
        has_thought: event.hasThought ?? null,
        reading_length: reading.length,
        reading_preview: reading ? reading.slice(0, 240) : null,
      })
      if (error) console.warn('[ai-reading-log] insert failed:', error.message)
    } catch (err) {
      console.warn('[ai-reading-log] failed:', (err as Error)?.message)
    }
  })
}
