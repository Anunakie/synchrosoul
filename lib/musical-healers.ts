import { createClient } from '@/lib/supabase/client'

export interface MusicalHealer {
  id: string
  user_id: string
  artist_name: string
  bio: string | null
  avatar_url: string | null
  website_url: string | null
  merch_url: string | null
  spotify_url: string | null
  apple_music_url: string | null
  amazon_music_url: string | null
  soundcloud_url: string | null
  youtube_url: string | null
  tidal_url: string | null
  bandcamp_url: string | null
  healing_styles: string[]
  spiritual_themes: string[]
  genres: string[]
  is_verified: boolean
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface MusicalHealerSong {
  id: string
  healer_id: string
  title: string
  description: string | null
  themes: string[]
  moods: string[]
  angel_numbers: string[]
  genre: string | null
  duration_seconds: number | null
  spotify_url: string | null
  apple_music_url: string | null
  amazon_music_url: string | null
  soundcloud_url: string | null
  youtube_url: string | null
  tidal_url: string | null
  bandcamp_url: string | null
  embed_url: string | null
  cover_art_url: string | null
  is_active: boolean
  sort_order: number
  created_at: string
}

export interface SongRecommendation {
  song_id: string
  song_title: string
  song_description: string | null
  song_genre: string | null
  song_embed_url: string | null
  song_cover_art_url: string | null
  healer_id: string
  artist_name: string
  healer_avatar_url: string | null
  ai_reasoning: string | null
}

// Fetch all active musical healers (with main profile avatar fallback)
export async function getMusicalHealers(): Promise<(MusicalHealer & { resolved_avatar_url: string | null; resolved_avatar_color: string })[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('musical_healers')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching musical healers:', error)
    return []
  }

  const healers = data || []

  // Fetch main profile avatars for healers that don't have a custom avatar_url
  const userIds = healers.filter(h => !h.avatar_url).map(h => h.user_id).filter(Boolean)
  let profileMap: Record<string, { avatar_url: string | null; avatar_color: string | null }> = {}

  if (userIds.length > 0) {
    const { data: profiles } = await supabase
      .from('profiles')
      .select('id, avatar_url, avatar_color')
      .in('id', userIds)

    for (const p of (profiles || [])) {
      profileMap[p.id] = { avatar_url: p.avatar_url, avatar_color: p.avatar_color }
    }
  }

  return healers.map(h => ({
    ...h,
    resolved_avatar_url: h.avatar_url || profileMap[h.user_id]?.avatar_url || null,
    resolved_avatar_color: profileMap[h.user_id]?.avatar_color || '#9b59b6',
  }))
}

// Fetch a single musical healer by ID (with main profile avatar fallback)
export async function getMusicalHealer(id: string): Promise<(MusicalHealer & { resolved_avatar_url: string | null; resolved_avatar_color: string }) | null> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('musical_healers')
    .select('*')
    .eq('id', id)
    .eq('is_active', true)
    .single()

  if (error) {
    console.error('Error fetching musical healer:', error)
    return null
  }

  if (!data) return null

  // If no custom avatar, pull from main profile
  let resolved_avatar_url = data.avatar_url
  let resolved_avatar_color = '#9b59b6'

  if (!resolved_avatar_url && data.user_id) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('avatar_url, avatar_color')
      .eq('id', data.user_id)
      .single()

    if (profile) {
      resolved_avatar_url = profile.avatar_url || null
      resolved_avatar_color = profile.avatar_color || '#9b59b6'
    }
  }

  return { ...data, resolved_avatar_url, resolved_avatar_color }
}

// Fetch songs for a specific healer
export async function getHealerSongs(healerId: string): Promise<MusicalHealerSong[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('musical_healer_songs')
    .select('*')
    .eq('healer_id', healerId)
    .eq('is_active', true)
    .order('sort_order', { ascending: true })

  if (error) {
    console.error('Error fetching healer songs:', error)
    return []
  }
  return data || []
}

// Get streaming link for a song (first available)
export function getSongStreamLink(song: MusicalHealerSong): { url: string; platform: string } | null {
  if (song.spotify_url) return { url: song.spotify_url, platform: 'Spotify' }
  if (song.apple_music_url) return { url: song.apple_music_url, platform: 'Apple Music' }
  if (song.amazon_music_url) return { url: song.amazon_music_url, platform: 'Amazon Music' }
  if (song.youtube_url) return { url: song.youtube_url, platform: 'YouTube' }
  if (song.soundcloud_url) return { url: song.soundcloud_url, platform: 'SoundCloud' }
  if (song.tidal_url) return { url: song.tidal_url, platform: 'Tidal' }
  if (song.bandcamp_url) return { url: song.bandcamp_url, platform: 'Bandcamp' }
  return null
}

// Get all streaming links for a song
export function getSongStreamLinks(song: MusicalHealerSong): { url: string; platform: string; emoji: string }[] {
  const links: { url: string; platform: string; emoji: string }[] = []
  if (song.spotify_url) links.push({ url: song.spotify_url, platform: 'Spotify', emoji: '🟢' })
  if (song.apple_music_url) links.push({ url: song.apple_music_url, platform: 'Apple Music', emoji: '🍎' })
  if (song.amazon_music_url) links.push({ url: song.amazon_music_url, platform: 'Amazon Music', emoji: '🎧' })
  if (song.youtube_url) links.push({ url: song.youtube_url, platform: 'YouTube', emoji: '▶️' })
  if (song.soundcloud_url) links.push({ url: song.soundcloud_url, platform: 'SoundCloud', emoji: '☁️' })
  if (song.tidal_url) links.push({ url: song.tidal_url, platform: 'Tidal', emoji: '🌊' })
  if (song.bandcamp_url) links.push({ url: song.bandcamp_url, platform: 'Bandcamp', emoji: '💿' })
  return links
}

// Get all streaming links for a healer
export function getHealerStreamLinks(healer: MusicalHealer): { url: string; platform: string; emoji: string }[] {
  const links: { url: string; platform: string; emoji: string }[] = []
  if (healer.spotify_url) links.push({ url: healer.spotify_url, platform: 'Spotify', emoji: '🟢' })
  if (healer.apple_music_url) links.push({ url: healer.apple_music_url, platform: 'Apple Music', emoji: '🍎' })
  if (healer.amazon_music_url) links.push({ url: healer.amazon_music_url, platform: 'Amazon Music', emoji: '🎧' })
  if (healer.youtube_url) links.push({ url: healer.youtube_url, platform: 'YouTube', emoji: '▶️' })
  if (healer.soundcloud_url) links.push({ url: healer.soundcloud_url, platform: 'SoundCloud', emoji: '☁️' })
  if (healer.tidal_url) links.push({ url: healer.tidal_url, platform: 'Tidal', emoji: '🌊' })
  if (healer.bandcamp_url) links.push({ url: healer.bandcamp_url, platform: 'Bandcamp', emoji: '💿' })
  if (healer.website_url) links.push({ url: healer.website_url, platform: 'Website', emoji: '🌐' })
  if (healer.merch_url) links.push({ url: healer.merch_url, platform: 'Merch', emoji: '🛍️' })
  return links
}
