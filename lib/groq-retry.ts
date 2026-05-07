import Groq from 'groq-sdk'
import { ChatCompletionCreateParamsNonStreaming } from 'groq-sdk/resources/chat/completions'

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

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

export async function groqChatWithRetry(
  params: ChatCompletionCreateParamsNonStreaming,
  options?: RetryOptions
) {
  const { maxRetries, initialDelay, maxDelay } = { ...DEFAULT_OPTIONS, ...options }
  
  let lastError: Error | null = null
  
  for (let attempt = 0; attempt <= maxRetries!; attempt++) {
    try {
      const response = await groq.chat.completions.create(params)
      return response
    } catch (error: unknown) {
      lastError = error as Error
      
      // Check if it's a rate limit error (429) or server error (5xx)
      const statusCode = (error as { status?: number }).status || 
                         (error as { statusCode?: number }).statusCode ||
                         (error as { error?: { status?: number } }).error?.status
      
      const isRetryable = statusCode === 429 || (statusCode && statusCode >= 500)
      
      if (!isRetryable || attempt === maxRetries) {
        throw error
      }
      
      // Exponential backoff with jitter
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

export { groq }
