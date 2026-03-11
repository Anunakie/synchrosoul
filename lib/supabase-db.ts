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
    // Simple query - no FK join needed, author data is stored in posts table
    const { data, error } = await supabase
      .from('posts')
      .select('id, user_id, content, angel_number, author_name, author_image, resonates, created_at, is_public')
      .eq('is_public', true)
      .order('created_at', { ascending: false })
      .limit(50)
    if (error) {
      console.error('[SynchroSoul] getPostsFromDB error:', error.message)
      return []
    }
    if (!data) return []
    return data.map((row: any) => ({
      id: row.id,
      authorId: row.user_id,
      authorName: row.author_name ?? 'Starseed',
      authorAvatar: (row.author_name ?? 'S').charAt(0).toUpperCase(),
      authorImage: row.author_image ?? undefined,
      authorColor: '#9b59b6',
      content: row.content,
      angelNumber: row.angel_number ?? undefined,
      resonates: row.resonates ?? 0,
      resonatedBy: [],
      createdAt: row.created_at,
      isOwn: row.user_id === userId,
    }))
  } catch (e) {
    console.error('[SynchroSoul] getPostsFromDB exception:', e)
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
    if (error) {
      console.error('[SynchroSoul] savePostToDB error:', error.message, error.details, error.hint)
      return null
    }
    if (!row) return null
    return row.id
  } catch (e) {
    console.error('[SynchroSoul] savePostToDB exception:', e)
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

// ─── Live Sync Matching ─────────────────────────────────────────────────────
export interface LiveSyncMatch {
  userId: string
  displayName: string
  avatarColor: string
  avatarUrl: string | null
  sharedNumbers: string[]
  allNumbers: string[]
  syncScore: number
  lifePath: number | null
  lastSeen: string
  verified: number
}

export async function getLiveSyncMatches(): Promise<LiveSyncMatch[]> {
  try {
    const supabase = createClient()
    const myId = await getCurrentUserId()
    if (!myId) return []

    // Get my recent logs (last 48hrs)
    const since48h = new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString()
    const { data: myLogs } = await supabase
      .from('angel_logs')
      .select('number')
      .eq('user_id', myId)
      .gte('created_at', since48h)
    const myNumbers = [...new Set((myLogs || []).map((l: any) => l.number as string))]
    if (myNumbers.length === 0) return []

    // Get other users' logs in last 48hrs (excluding me, excluding private)
    const { data: otherLogs } = await supabase
      .from('angel_logs')
      .select('user_id, number, created_at, profiles!angel_logs_user_id_fkey(display_name, avatar_color, avatar_url, life_path, privacy_mode)')
      .neq('user_id', myId)
      .gte('created_at', since48h)
      .order('created_at', { ascending: false })

    if (!otherLogs || otherLogs.length === 0) return []

    // Group by user
    const userMap: Record<string, any> = {}
    for (const log of otherLogs) {
      const profile = (log as any).profiles
      if (profile?.privacy_mode) continue // skip private users
      const uid = log.user_id as string
      if (!userMap[uid]) {
        userMap[uid] = {
          userId: uid,
          displayName: profile?.display_name || 'Starseed',
          avatarColor: profile?.avatar_color || '#9b59b6',
          avatarUrl: profile?.avatar_url || null,
          lifePath: profile?.life_path || null,
          numbers: [],
          lastSeen: log.created_at,
        }
      }
      userMap[uid].numbers.push(log.number)
    }

    // Calculate sync scores
    const matches: LiveSyncMatch[] = []
    for (const uid of Object.keys(userMap)) {
      const u = userMap[uid]
      const theirNumbers = [...new Set(u.numbers as string[])]
      const shared = myNumbers.filter(n => theirNumbers.includes(n))
      if (shared.length === 0) continue

      // Sync score: shared numbers weight + numerology bonus
      let score = Math.round((shared.length / Math.max(myNumbers.length, theirNumbers.length)) * 70)
      // Bonus for master numbers
      if (shared.some(n => ['1111','1212','777','333','999'].includes(n))) score += 15
      // Numerology bonus
      if (u.lifePath) score += 10
      score = Math.min(score, 99)

      matches.push({
        userId: uid,
        displayName: u.displayName,
        avatarColor: u.avatarColor,
        avatarUrl: u.avatarUrl,
        sharedNumbers: shared,
        allNumbers: theirNumbers as string[],
        syncScore: score,
        lifePath: u.lifePath,
        lastSeen: u.lastSeen,
        verified: shared.length,
      })
    }

    return matches.sort((a, b) => b.syncScore - a.syncScore).slice(0, 20)
  } catch (e) {
    console.error('getLiveSyncMatches error:', e)
    return []
  }
}

// ─── Social Feed (all non-private users) ────────────────────────────────────
export interface FeedPost {
  id: string
  userId: string
  content: string
  angelNumber: string | null
  createdAt: string
  resonates: number
  authorName: string
  authorColor: string
  authorAvatar: string | null
  authorLifePath: number | null
  isOwn: boolean
}

export async function getAllPostsFromDB(limit = 50): Promise<FeedPost[]> {
  try {
    const supabase = createClient()
    const myId = await getCurrentUserId()

    const { data, error } = await supabase
      .from('posts')
      .select('id, user_id, content, angel_number, author_name, author_image, created_at, resonates, is_public')
      .eq('is_public', true)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) {
      console.error('[SynchroSoul] getAllPostsFromDB error:', error.message)
      return []
    }
    if (!data) return []

    return data
      .map((p: any) => ({
        id: p.id,
        userId: p.user_id,
        content: p.content,
        angelNumber: p.angel_number,
        createdAt: p.created_at,
        resonates: p.resonates || 0,
        authorName: p.author_name || 'Starseed',
        authorColor: '#9b59b6',
        authorAvatar: p.author_image || null,
        authorLifePath: null,
        isOwn: p.user_id === myId,
      }))
  } catch (e) {
    console.error('getAllPostsFromDB error:', e)
    return []
  }
}

export async function resonatePostDB(postId: string): Promise<boolean> {
  try {
    const supabase = createClient()
    const { error } = await supabase.rpc('increment_resonates', { post_id: postId })
    return !error
  } catch { return false }
}

// ─── Notifications (Supabase realtime) ──────────────────────────────────────
export interface AppNotification {
  id: string
  type: 'sync_match' | 'streak' | 'guidance' | 'moon' | 'oracle' | 'general'
  title: string
  body: string
  read: boolean
  createdAt: string
  color: string
  emoji: string
}

export async function getNotificationsFromDB(): Promise<AppNotification[]> {
  try {
    const supabase = createClient()
    const myId = await getCurrentUserId()
    if (!myId) return []
    const { data } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', myId)
      .order('created_at', { ascending: false })
      .limit(30)
    return (data || []).map((n: any) => ({
      id: n.id,
      type: n.type || 'general',
      title: n.title,
      body: n.body,
      read: n.read || false,
      createdAt: n.created_at,
      color: n.color || '#a78bfa',
      emoji: n.emoji || '✨',
    }))
  } catch { return [] }
}

export async function markNotificationRead(id: string): Promise<void> {
  try {
    const supabase = createClient()
    await supabase.from('notifications').update({ read: true }).eq('id', id)
  } catch {}
}

export async function markAllNotificationsRead(): Promise<void> {
  try {
    const supabase = createClient()
    const myId = await getCurrentUserId()
    if (!myId) return
    await supabase.from('notifications').update({ read: true }).eq('user_id', myId)
  } catch {}
}
