// lib/supabase-db.ts
// Unified Supabase data layer - used by all storage modules when user is authenticated

import { createClient } from '@/lib/supabase/client'
import type { AngelLog } from './storage'
import type { DreamEntry } from './dream-storage'
import type { SocialPost } from './social-storage'

// ── Auth Helper ────────────────────────────────────────────────────────────
export async function getCurrentUserId(): Promise<string | null> {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    return user?.id ?? null
  } catch {
    return null
  }
}

export async function isAuthenticated(): Promise<boolean> {
  const id = await getCurrentUserId()
  return id !== null
}

// ── Profile ────────────────────────────────────────────────────────────────
export interface SupabaseProfile {
  id: string
  display_name: string | null
  bio: string | null
  avatar_color: string | null
  avatar_url: string | null
  life_path: number | null
  soul_urge: number | null
  destiny: number | null
  birthdate: string | null
  privacy_mode: boolean
  created_at: string
}

export async function getProfile(): Promise<SupabaseProfile | null> {
  try {
    const supabase = createClient()
    const userId = await getCurrentUserId()
    if (!userId) return null
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()
    if (error) return null
    return data as SupabaseProfile
  } catch {
    return null
  }
}

export async function upsertProfile(updates: Partial<SupabaseProfile>): Promise<boolean> {
  try {
    const supabase = createClient()
    const userId = await getCurrentUserId()
    if (!userId) return false
    const { error } = await supabase
      .from('profiles')
      .upsert({ ...updates, id: userId }, { onConflict: 'id' })
    return !error
  } catch {
    return false
  }
}

export async function getPrivacyMode(): Promise<boolean> {
  const profile = await getProfile()
  return profile?.privacy_mode ?? false
}

export async function setPrivacyMode(enabled: boolean): Promise<boolean> {
  return upsertProfile({ privacy_mode: enabled })
}

// ── Angel Logs ─────────────────────────────────────────────────────────────
export async function getLogsFromDB(): Promise<AngelLog[]> {
  try {
    const supabase = createClient()
    const userId = await getCurrentUserId()
    if (!userId) return []
    const { data, error } = await supabase
      .from('angel_logs')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    if (error || !data) return []
    return data.map(row => ({
      id: row.id,
      number: row.number,
      thought: row.thought ?? '',
      screenshotUrl: row.screenshot_url ?? null,
      truthScore: !!row.screenshot_url,
      miniReading: '',
      readingTitle: '',
      readingColor: '#9b59b6',
      createdAt: row.created_at,
      shared: false,
    }))
  } catch {
    return []
  }
}

export async function saveLogToDB(data: {
  number: string
  thought: string
  screenshotUrl: string | null
}): Promise<string | null> {
  try {
    const supabase = createClient()
    const userId = await getCurrentUserId()
    if (!userId) return null
    const { data: row, error } = await supabase
      .from('angel_logs')
      .insert({
        user_id: userId,
        number: data.number,
        thought: data.thought,
        screenshot_url: data.screenshotUrl,
      })
      .select('id')
      .single()
    if (error || !row) return null
    return row.id
  } catch {
    return null
  }
}

export async function deleteLogFromDB(id: string): Promise<boolean> {
  try {
    const supabase = createClient()
    const userId = await getCurrentUserId()
    if (!userId) return false
    const { error } = await supabase
      .from('angel_logs')
      .delete()
      .eq('id', id)
      .eq('user_id', userId)
    return !error
  } catch {
    return false
  }
}

// ── Dreams ─────────────────────────────────────────────────────────────────
export async function getDreamsFromDB(): Promise<DreamEntry[]> {
  try {
    const supabase = createClient()
    const userId = await getCurrentUserId()
    if (!userId) return []
    const { data, error } = await supabase
      .from('dreams')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    if (error || !data) return []
    return data.map(row => ({
      id: row.id,
      title: row.title ?? '',
      description: row.description ?? '',
      symbols: row.symbols ?? [],
      moods: row.moods ?? [],
      angelNumbers: row.angel_numbers ?? [],
      reading: row.reading ?? '',
      voiceNoteUrl: null,
      createdAt: row.created_at,
    }))
  } catch {
    return []
  }
}

export async function saveDreamToDB(data: {
  title: string
  description: string
  symbols: string[]
  moods: string[]
  angelNumbers: string[]
  reading: string
}): Promise<string | null> {
  try {
    const supabase = createClient()
    const userId = await getCurrentUserId()
    if (!userId) return null
    const { data: row, error } = await supabase
      .from('dreams')
      .insert({
        user_id: userId,
        title: data.title,
        description: data.description,
        symbols: data.symbols,
        moods: data.moods,
        angel_numbers: data.angelNumbers,
        reading: data.reading,
      })
      .select('id')
      .single()
    if (error || !row) return null
    return row.id
  } catch {
    return null
  }
}

export async function deleteDreamFromDB(id: string): Promise<boolean> {
  try {
    const supabase = createClient()
    const userId = await getCurrentUserId()
    if (!userId) return false
    const { error } = await supabase
      .from('dreams')
      .delete()
      .eq('id', id)
      .eq('user_id', userId)
    return !error
  } catch {
    return false
  }
}

// ── Social Posts ───────────────────────────────────────────────────────────
export async function getPostsFromDB(): Promise<SocialPost[]> {
  try {
    const supabase = createClient()
    const userId = await getCurrentUserId()
    // Get all posts from non-private users
    const { data, error } = await supabase
      .from('posts')
      .select('*, profiles!posts_user_id_fkey(display_name, avatar_color, avatar_url, privacy_mode)')
      .order('created_at', { ascending: false })
      .limit(50)
    if (error || !data) return []
    return data
      .filter((row: any) => !row.profiles?.privacy_mode)
      .map((row: any) => ({
        id: row.id,
        authorId: row.user_id,
        authorName: row.author_name ?? row.profiles?.display_name ?? 'Starseed',
        authorAvatar: row.profiles?.display_name?.charAt(0)?.toUpperCase() ?? 'S',
        authorImage: row.author_image ?? row.profiles?.avatar_url ?? undefined,
        authorColor: row.profiles?.avatar_color ?? '#9b59b6',
        content: row.content,
        angelNumber: row.angel_number ?? undefined,
        resonates: row.resonates ?? 0,
        resonatedBy: [],
        createdAt: row.created_at,
        isOwn: row.user_id === userId,
      }))
  } catch {
    return []
  }
}

export async function savePostToDB(data: {
  content: string
  angelNumber?: string
  authorName: string
  authorImage?: string
}): Promise<string | null> {
  try {
    const supabase = createClient()
    const userId = await getCurrentUserId()
    if (!userId) return null
    // Check privacy mode first
    const isPrivate = await getPrivacyMode()
    const { data: row, error } = await supabase
      .from('posts')
      .insert({
        user_id: userId,
        content: data.content,
        angel_number: data.angelNumber ?? null,
        author_name: data.authorName,
        author_image: data.authorImage ?? null,
        resonates: 0,
      })
      .select('id')
      .single()
    if (error || !row) return null
    return row.id
  } catch {
    return null
  }
}

export async function deletePostFromDB(id: string): Promise<boolean> {
  try {
    const supabase = createClient()
    const userId = await getCurrentUserId()
    if (!userId) return false
    const { error } = await supabase
      .from('posts')
      .delete()
      .eq('id', id)
      .eq('user_id', userId)
    return !error
  } catch {
    return false
  }
}

export async function updatePostInDB(id: string, content: string, angelNumber?: string): Promise<boolean> {
  try {
    const supabase = createClient()
    const userId = await getCurrentUserId()
    if (!userId) return false
    const { error } = await supabase
      .from('posts')
      .update({ content, angel_number: angelNumber ?? null })
      .eq('id', id)
      .eq('user_id', userId)
    return !error
  } catch {
    return false
  }
}

export async function resonatePostInDB(id: string): Promise<boolean> {
  try {
    const supabase = createClient()
    const { error } = await supabase.rpc('increment_resonates', { post_id: id })
    return !error
  } catch {
    return false
  }
}
