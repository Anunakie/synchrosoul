import { type SongRecommendationData } from '@/components/SongRecommendationCard'

const STORAGE_KEY = 'synchrosoul_song_recommendations'

// Save a song recommendation for a specific log entry
export function saveSongRecommendation(logId: string, recommendation: SongRecommendationData): void {
  if (typeof window === 'undefined') return
  try {
    const existing = getSavedRecommendations()
    existing[logId] = recommendation
    // Keep only the last 100 recommendations to avoid localStorage bloat
    const keys = Object.keys(existing)
    if (keys.length > 100) {
      const toRemove = keys.slice(0, keys.length - 100)
      for (const k of toRemove) delete existing[k]
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(existing))
  } catch {
    // localStorage may be full or unavailable
  }
}

// Get a saved song recommendation for a specific log entry
export function getSongRecommendation(logId: string): SongRecommendationData | null {
  if (typeof window === 'undefined') return null
  try {
    const all = getSavedRecommendations()
    return all[logId] || null
  } catch {
    return null
  }
}

// Get all saved recommendations
function getSavedRecommendations(): Record<string, SongRecommendationData> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return {}
    return JSON.parse(raw)
  } catch {
    return {}
  }
}
