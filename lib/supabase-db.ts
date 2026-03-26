// lib/supabase-db.ts
// Unified Supabase data layer - used by all storage modules when user is authenticated

import { createClient } from '@/lib/supabase/client'
import type { AngelLog } from './storage'
import type { DreamEntry } from './dream-storage'
import type { SocialPost } from './social-storage'
import { getAngelMeaning } from '@/lib/angel-meanings'

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
  onboarding_complete: boolean
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
    return data.map(row => {
      // Fall back to static meaning only if no AI reading was saved
      const meaning = row.mini_reading ? null : getAngelMeaning(row.number)
      return {
        id: row.id,
        number: row.number,
        thought: row.thought ?? '',
        screenshotUrl: row.screenshot_url ?? null,
        truthScore: !!row.screenshot_url,
        miniReading: row.mini_reading || (meaning?.message ?? ''),
        readingTitle: row.reading_title || (meaning?.title ?? ''),
        readingColor: row.reading_color || (meaning?.color ?? '#9b59b6'),
        createdAt: row.created_at,
        shared: false,
      }
    })
  } catch {
    return []
  }
}

export async function saveLogToDB(data: {
  number: string
  thought: string
  screenshotUrl: string | null
  miniReading?: string
  readingTitle?: string
  readingColor?: string
}): Promise<string | null> {
  try {
    const supabase = createClient()
    const userId = await getCurrentUserId()
    if (!userId) return null

    // If screenshot is base64, upload to Supabase Storage first
    // Storing base64 directly in DB causes row size limit errors and silent failures
    let screenshotStorageUrl: string | null = null
    if (data.screenshotUrl && data.screenshotUrl.startsWith('data:')) {
      try {
        const base64Data = data.screenshotUrl.split(',')[1]
        const mimeType = data.screenshotUrl.split(';')[0].split(':')[1]
        const ext = mimeType.includes('png') ? 'png' : 'jpg'
        const fileName = `${userId}/${Date.now()}.${ext}`
        // Convert base64 to Uint8Array
        const binaryStr = atob(base64Data)
        const bytes = new Uint8Array(binaryStr.length)
        for (let i = 0; i < binaryStr.length; i++) {
          bytes[i] = binaryStr.charCodeAt(i)
        }
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('screenshots')
          .upload(fileName, bytes, { contentType: mimeType, upsert: true })
        if (!uploadError && uploadData) {
          const { data: urlData } = supabase.storage
            .from('screenshots')
            .getPublicUrl(uploadData.path)
          screenshotStorageUrl = urlData.publicUrl
        }
        // If upload fails, we still save the log without screenshot
      } catch {
        // Screenshot upload failed - save log without it
      }
    } else if (data.screenshotUrl && data.screenshotUrl.startsWith('http')) {
      // Already a URL (not base64), use as-is
      screenshotStorageUrl = data.screenshotUrl
    }

    const { data: row, error } = await supabase
      .from('angel_logs')
      .insert({
        user_id: userId,
        number: data.number,
        thought: data.thought,
        screenshot_url: screenshotStorageUrl,
        mini_reading: data.miniReading || null,
        reading_title: data.readingTitle || null,
        reading_color: data.readingColor || null,
      })
      .select('id')
      .single()
    if (error || !row) {
      console.error('[saveLogToDB] Insert error:', error?.message)
      return null
    }
    return row.id
  } catch (err) {
    console.error('[saveLogToDB] Unexpected error:', err)
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

// Numerology compatibility matrix (life path harmony)
const LP_COMPAT: Record<string, number> = {
  '1-1':85,'1-2':70,'1-3':90,'1-4':60,'1-5':88,'1-6':65,'1-7':75,'1-8':80,'1-9':70,
  '2-2':80,'2-3':75,'2-4':85,'2-5':65,'2-6':90,'2-7':80,'2-8':60,'2-9':85,
  '3-3':85,'3-4':65,'3-5':90,'3-6':80,'3-7':70,'3-8':75,'3-9':88,
  '4-4':80,'4-5':60,'4-6':85,'4-7':90,'4-8':88,'4-9':65,
  '5-5':75,'5-6':70,'5-7':80,'5-8':85,'5-9':90,
  '6-6':90,'6-7':75,'6-8':70,'6-9':88,
  '7-7':85,'7-8':70,'7-9':80,
  '8-8':80,'8-9':75,
  '9-9':90,
}
function lpCompat(a: number | null, b: number | null): number {
  if (!a || !b) return 0
  const key = [Math.min(a,b), Math.max(a,b)].join('-')
  return LP_COMPAT[key] || 70
}

// Master / sacred numbers get bonus weight
const SACRED = new Set(['1111','1212','777','333','999','888','444','555','222','1010','1234','1313'])

export async function getLiveSyncMatches(): Promise<LiveSyncMatch[]> {
  try {
    const supabase = createClient()
    const myId = await getCurrentUserId()
    if (!myId) return []

    // Get my recent logs (last 48hrs) with timestamps
    const since48h = new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString()
    const since7d = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
    const { data: myLogs } = await supabase
      .from('angel_logs')
      .select('number, created_at')
      .eq('user_id', myId)
      .gte('created_at', since48h)
    if (!myLogs || myLogs.length === 0) return []

    const myNumbers = [...new Set(myLogs.map((l: any) => l.number as string))]
    // Map number -> timestamps for proximity scoring
    const myTimestamps: Record<string, number[]> = {}
    for (const l of myLogs) {
      if (!myTimestamps[l.number]) myTimestamps[l.number] = []
      myTimestamps[l.number].push(new Date(l.created_at).getTime())
    }

    // Get my life path for compatibility scoring
    const { data: myProfile } = await supabase
      .from('profiles')
      .select('life_path')
      .eq('id', myId)
      .single()
    const myLifePath: number | null = myProfile?.life_path || null

    // Step 1: Get other users logs in last 48hrs
    const { data: otherLogs, error: logsError } = await supabase
      .from('angel_logs')
      .select('user_id, number, created_at')
      .neq('user_id', myId)
      .gte('created_at', since48h)
      .order('created_at', { ascending: false })
      .limit(1000)

    if (logsError) console.error('[SynchroSoul] getLiveSyncMatches logs error:', logsError.message)
    // If no 48hr matches, extend to 7 days
    let resolvedLogs = otherLogs || []
    if (resolvedLogs.length === 0) {
      const { data: extendedLogs } = await supabase
        .from('angel_logs')
        .select('user_id, number, created_at')
        .neq('user_id', myId)
        .gte('created_at', since7d)
        .order('created_at', { ascending: false })
        .limit(500)
      resolvedLogs = extendedLogs || []
    }
    if (resolvedLogs.length === 0) return []

    const otherUserIds = [...new Set(resolvedLogs.map((l: any) => l.user_id as string))]

    // Step 2: Fetch profiles
    const { data: profiles } = await supabase
      .from('profiles')
      .select('id, display_name, avatar_color, avatar_url, life_path, privacy_mode')
      .in('id', otherUserIds)

    const profileMap: Record<string, any> = {}
    for (const p of (profiles || [])) profileMap[p.id] = p

    // Group logs by user with full timestamps
    const userMap: Record<string, any> = {}
    for (const log of resolvedLogs) {
      const uid = log.user_id as string
      const profile = profileMap[uid]
      if (profile?.privacy_mode) continue
      if (!userMap[uid]) {
        userMap[uid] = {
          userId: uid,
          displayName: profile?.display_name || 'Starseed',
          avatarColor: profile?.avatar_color || '#9b59b6',
          avatarUrl: profile?.avatar_url || null,
          lifePath: profile?.life_path || null,
          logs: [],
          lastSeen: log.created_at,
        }
      }
      userMap[uid].logs.push({ number: log.number, ts: new Date(log.created_at).getTime() })
    }

    // Calculate enhanced sync scores
    const matches: LiveSyncMatch[] = []
    for (const uid of Object.keys(userMap)) {
      const u = userMap[uid]
      const theirNumbers = [...new Set(u.logs.map((l: any) => l.number as string))]
      const shared = myNumbers.filter(n => theirNumbers.includes(n))
      if (shared.length === 0) continue

      // ── Scoring components ──────────────────────────────────────────────
      // 1. Shared number ratio (0-40 pts)
      const unionSize = new Set([...myNumbers, ...theirNumbers]).size
      const sharedRatio = shared.length / unionSize
      let score = Math.round(sharedRatio * 40)

      // 2. Sacred/master number bonus (0-20 pts)
      const sacredShared = shared.filter(n => SACRED.has(n))
      score += Math.min(sacredShared.length * 7, 20)

      // 3. Time proximity bonus (0-25 pts)
      // For each shared number, find closest timestamp pair
      let proximityBonus = 0
      for (const num of shared) {
        const myTs = myTimestamps[num] || []
        const theirTs = u.logs.filter((l: any) => l.number === num).map((l: any) => l.ts)
        let minDiff = Infinity
        for (const mt of myTs) {
          for (const tt of theirTs) {
            minDiff = Math.min(minDiff, Math.abs(mt - tt))
          }
        }
        // Within 1hr = 8pts, 6hr = 5pts, 24hr = 2pts
        if (minDiff < 3600000) proximityBonus += 8
        else if (minDiff < 21600000) proximityBonus += 5
        else proximityBonus += 2
      }
      score += Math.min(proximityBonus, 25)

      // 4. Numerology compatibility bonus (0-15 pts)
      const compat = lpCompat(myLifePath, u.lifePath)
      score += Math.round((compat / 100) * 15)

      score = Math.max(10, Math.min(score, 99))

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
        verified: sacredShared.length,
      })
    }

    return matches.sort((a, b) => b.syncScore - a.syncScore).slice(0, 20)
  } catch (e) {
    console.error('getLiveSyncMatches error:', e)
    return []
  }
}

// Send a sync signal (notification) to a matched user
export async function sendSyncSignal(toUserId: string, sharedNumbers: string[], syncScore: number): Promise<boolean> {
  try {
    const supabase = createClient()
    const myId = await getCurrentUserId()
    if (!myId) return false
    const { data: myProfile } = await supabase
      .from('profiles')
      .select('display_name')
      .eq('id', myId)
      .single()
    const fromName = myProfile?.display_name || 'A Starseed'
    const { error } = await supabase
      .from('notifications')
      .insert({
        user_id: toUserId,
        type: 'sync_match',
        title: '✨ Sync Signal Received',
        message: `${fromName} sent you a sync signal! You both logged ${sharedNumbers.slice(0,3).join(', ')} — ${syncScore}% cosmic alignment.`,
        metadata: { fromUserId: myId, fromName, sharedNumbers, syncScore },
        read: false,
      })
    return !error
  } catch { return false }
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


// ── Profile Sync (full profile save/load) ─────────────────────────────────

export async function uploadAvatarImage(base64DataUrl: string, userId: string): Promise<string | null> {
  try {
    const supabase = createClient()
    // Convert base64 data URL to blob
    const matches = base64DataUrl.match(/^data:([A-Za-z-+/]+);base64,(.+)$/)
    if (!matches) return null
    const mimeType = matches[1]
    const base64Data = matches[2]
    const byteCharacters = atob(base64Data)
    const byteNumbers = new Array(byteCharacters.length)
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i)
    }
    const byteArray = new Uint8Array(byteNumbers)
    const blob = new Blob([byteArray], { type: mimeType })
    const ext = mimeType.includes('png') ? 'png' : 'jpg'
    const filePath = `${userId}/avatar.${ext}`
    const { error } = await supabase.storage
      .from('avatars')
      .upload(filePath, blob, { upsert: true, contentType: mimeType })
    if (error) {
      console.error('[SynchroSoul] Avatar upload error:', error.message)
      return null
    }
    const { data } = supabase.storage.from('avatars').getPublicUrl(filePath)
    // Add cache-busting timestamp
    return data.publicUrl + '?t=' + Date.now()
  } catch (e) {
    console.error('[SynchroSoul] uploadAvatarImage exception:', e)
    return null
  }
}

export async function saveFullProfile(data: {
  displayName: string
  bio: string
  avatarColor: string
  avatarImage?: string | null  // base64 or null
  lifePath?: number | null
  soulUrge?: number | null
  destiny?: number | null
  birthdate?: string | null
}): Promise<boolean> {
  try {
    const supabase = createClient()
    const userId = await getCurrentUserId()
    if (!userId) return false
    const updates: any = {
      id: userId,
      display_name: data.displayName,
      bio: data.bio,
      avatar_color: data.avatarColor,
    }
    if (data.avatarImage !== undefined) {
      if (data.avatarImage && data.avatarImage.startsWith('data:')) {
        // Upload base64 to Supabase Storage to avoid row size limits
        const uploadedUrl = await uploadAvatarImage(data.avatarImage, userId)
        updates.avatar_url = uploadedUrl || data.avatarImage
      } else {
        updates.avatar_url = data.avatarImage
      }
    }
    if (data.lifePath !== undefined) updates.life_path = data.lifePath
    if (data.soulUrge !== undefined) updates.soul_urge = data.soulUrge
    if (data.destiny !== undefined) updates.destiny = data.destiny
    if (data.birthdate !== undefined) updates.birthdate = data.birthdate
    const { error } = await supabase
      .from('profiles')
      .upsert(updates, { onConflict: 'id' })
    if (error) console.error('[SynchroSoul] saveFullProfile error:', error.message)
    return !error
  } catch (e) {
    console.error('[SynchroSoul] saveFullProfile exception:', e)
    return false
  }
}

export async function loadFullProfile(): Promise<{
  displayName: string
  bio: string
  avatarColor: string
  avatarImage: string | null
  lifePath: number | null
  soulUrge: number | null
  destiny: number | null
  birthdate: string | null
} | null> {
  try {
    const profile = await getProfile()
    if (!profile) return null
    return {
      displayName: profile.display_name || 'Starseed',
      bio: profile.bio || '',
      avatarColor: profile.avatar_color || '#9b59b6',
      avatarImage: profile.avatar_url || null,
      lifePath: profile.life_path || null,
      soulUrge: profile.soul_urge || null,
      destiny: profile.destiny || null,
      birthdate: profile.birthdate || null,
    }
  } catch {
    return null
  }
}

export async function updateAuthorNameInAllPosts(newName: string): Promise<void> {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    await supabase
      .from('posts')
      .update({ author_name: newName })
      .eq('user_id', user.id)
  } catch (e) {
    console.error('Failed to update author name in posts:', e)
  }
}

export async function updateAuthorImageInAllPosts(newImage: string): Promise<void> {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    await supabase
      .from('posts')
      .update({ author_image: newImage })
      .eq('user_id', user.id)
  } catch (e) {
    console.error('Failed to update author image in posts:', e)
  }
}

