import Groq from 'groq-sdk'
import { ChatCompletionCreateParamsNonStreaming } from 'groq-sdk/resources/chat/completions'

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

/**
 * SINGLE SOURCE OF TRUTH for which Groq model powers the Oracle.
 *
 * History: every route used to hard-code 'llama-3.3-70b-versatile'. Groq shut
 * that model down on 2026-08-16, so every Oracle call failed and users silently
 * got the generic angel-number meaning instead of a personalized reading.
 *
 * To switch models in future without a code change, set GROQ_MODEL (and
 * optionally GROQ_FALLBACK_MODEL) in Vercel env vars.
 * Check https://console.groq.com/docs/deprecations for upcoming shutdowns.
 */
export const ORACLE_MODEL = process.env.GROQ_MODEL || 'openai/gpt-oss-120b'
export const ORACLE_FALLBACK_MODEL = process.env.GROQ_FALLBACK_MODEL || 'openai/gpt-oss-20b'

interface RetryOptions {
  maxRetries?: number
  initialDelay?: number
  maxDelay?: number
}

const DEFAULT_OPTIONS: RetryOptions = {
  maxRetries: 3,
  initialDelay: 2000,
  maxDelay: 10000,
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

function getStatus(error: unknown): number | undefined {
  return (error as { status?: number }).status ||
    (error as { statusCode?: number }).statusCode ||
    (error as { error?: { status?: number } }).error?.status
}

/**
 * gpt-oss models "think" before answering, and that thinking counts against the
 * token limit. With the old short limits (120-400 tokens) the thinking would use
 * up the whole budget and the reading would come back empty. So for these models
 * we keep thinking short and add headroom on top of the caller's answer length.
 */
function adaptParamsForModel(
  params: ChatCompletionCreateParamsNonStreaming,
  model: string
): ChatCompletionCreateParamsNonStreaming {
  const adapted: Record<string, unknown> = { ...params, model }
  if (model.startsWith('openai/gpt-oss')) {
    const answerBudget = params.max_completion_tokens ?? params.max_tokens ?? 1024
    delete adapted.max_tokens
    adapted.max_completion_tokens = answerBudget + 1024
    adapted.reasoning_effort = 'low'
    adapted.include_reasoning = false
  }
  return adapted as unknown as ChatCompletionCreateParamsNonStreaming
}

async function callWithRetry(
  params: ChatCompletionCreateParamsNonStreaming,
  options: RetryOptions
) {
  const { maxRetries, initialDelay, maxDelay } = options
  let lastError: unknown = null

  for (let attempt = 0; attempt <= maxRetries!; attempt++) {
    try {
      return await groq.chat.completions.create(params)
    } catch (error: unknown) {
      lastError = error
      const statusCode = getStatus(error)
      const isRetryable = statusCode === 429 || (statusCode !== undefined && statusCode >= 500)

      if (!isRetryable || attempt === maxRetries) {
        throw error
      }

      const delay = Math.min(
        initialDelay! * Math.pow(2, attempt) + Math.random() * 1000,
        maxDelay!
      )
      console.log(`Groq rate limited (attempt ${attempt + 1}/${maxRetries! + 1}), retrying in ${Math.round(delay)}ms...`)
      await sleep(delay)
    }
  }

  throw lastError
}

/**
 * Call Groq with retries. The `model` passed by the caller is ignored in favour
 * of ORACLE_MODEL so the whole app always uses one model. If the main model
 * fails for a non-temporary reason (e.g. it was retired), it tries the backup.
 */
export async function groqChatWithRetry(
  params: ChatCompletionCreateParamsNonStreaming,
  options?: RetryOptions
) {
  const opts = { ...DEFAULT_OPTIONS, ...options }
  try {
    return await callWithRetry(adaptParamsForModel(params, ORACLE_MODEL), opts)
  } catch (error: unknown) {
    const status = getStatus(error)
    console.error(`Groq call failed on ${ORACLE_MODEL} (status ${status ?? 'unknown'}):`, (error as Error)?.message)
    // 400/404 usually means the model was retired or renamed; try the backup once.
    if ((status === 400 || status === 404) && ORACLE_FALLBACK_MODEL !== ORACLE_MODEL) {
      return await callWithRetry(adaptParamsForModel(params, ORACLE_FALLBACK_MODEL), { ...opts, maxRetries: 1 })
    }
    throw error
  }
}

export { groq }
