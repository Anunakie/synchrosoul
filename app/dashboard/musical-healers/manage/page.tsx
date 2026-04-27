'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useTheme } from '@/lib/theme-context'
import { getSubscriptionStatus, type SubscriptionTier } from '@/lib/subscription'

const GENRES = ['Ambient Piano', 'Meditation', 'Healing Frequencies', 'New Age', 'Classical', 'Choral', 'Binaural Beats', 'Sound Bath', 'Acoustic', 'Electronic Ambient', 'World Music', 'Jazz', 'Singer-Songwriter', 'Orchestral']
const HEALING_STYLES = ['meditation', 'piano', 'binaural', 'chanting', 'sound healing', 'breathwork', 'yoga', 'reiki', 'chakra', 'crystal singing bowls', 'nature sounds', 'mantras']
const SPIRITUAL_THEMES = ['transformation', 'grounding', 'heart-opening', 'release', 'abundance', 'protection', 'awakening', 'peace', 'love', 'healing', 'courage', 'destiny', 'intuition', 'connection', 'gratitude', 'surrender']
const SONG_MOODS = ['peaceful', 'uplifting', 'introspective', 'empowering', 'melancholic', 'joyful', 'transcendent', 'grounding', 'energizing', 'calming', 'mysterious', 'emotional']
const SONG_HEALING_STYLES = ['meditation', 'breathwork', 'yoga', 'sound bath', 'chakra work', 'reiki', 'visualization', 'prayer', 'journaling', 'ceremony', 'sleep', 'movement', 'grounding', 'manifestation']
const SONG_SPIRITUAL_CONCEPTS = ['synchronicity', 'divine timing', 'karma', 'soul contracts', 'past lives', 'akashic records', 'sacred geometry', 'higher self', 'ascension', 'kundalini', 'shadow work', 'inner child', 'divine feminine', 'divine masculine']
const COMMON_ANGEL_NUMBERS = ['111', '222', '333', '444', '555', '666', '777', '888', '999', '1010', '1111', '1212', '1234']

interface HealerProfile {
  id: string
  artist_name: string
  bio: string
  website_url: string | null
  merch_url: string | null
  spotify_url: string | null
  apple_music_url: string | null
  amazon_music_url: string | null
  youtube_url: string | null
  soundcloud_url: string | null
  tidal_url: string | null
  bandcamp_url: string | null
  genres: string[]
  healing_styles: string[]
  spiritual_themes: string[]
  is_verified: boolean
}

interface Song {
  id: string
  title: string
  description: string
  themes: string[]
  moods: string[]
  angel_numbers: string[]
  genre: string
  spotify_url: string | null
  apple_music_url: string | null
  amazon_music_url: string | null
  youtube_url: string | null
  soundcloud_url: string | null
  tidal_url: string | null
  bandcamp_url: string | null
  embed_url: string | null
  cover_art_url: string | null
  is_active: boolean
  synch_enabled: boolean
  healing_styles: string[]
  spiritual_concepts: string[]
  oracle_tags: string[]
}

const SYNCH_LIMITS: Record<SubscriptionTier, number> = {
  'free': 3,
  'mystic': 10,
  'twin-flame': Infinity,
}

const SONG_LIMITS: Record<SubscriptionTier, number> = {
  'free': 20,
  'mystic': 50,
  'twin-flame': Infinity,
}

export default function ManagePage() {
  const { theme } = useTheme()
  const isSim = theme === 'simulation'
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState<HealerProfile | null>(null)
  const [songs, setSongs] = useState<Song[]>([])
  const [view, setView] = useState<'profile' | 'songs' | 'add-song' | 'edit-song'>('profile')
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [editingSong, setEditingSong] = useState<Song | null>(null)
  const [tier, setTier] = useState<SubscriptionTier>('free')

  // Profile form
  const [artistName, setArtistName] = useState('')
  const [bio, setBio] = useState('')
  const [websiteUrl, setWebsiteUrl] = useState('')
  const [merchUrl, setMerchUrl] = useState('')
  const [spotifyUrl, setSpotifyUrl] = useState('')
  const [appleMusicUrl, setAppleMusicUrl] = useState('')
  const [amazonMusicUrl, setAmazonMusicUrl] = useState('')
  const [youtubeUrl, setYoutubeUrl] = useState('')
  const [soundcloudUrl, setSoundcloudUrl] = useState('')
  const [tidalUrl, setTidalUrl] = useState('')
  const [bandcampUrl, setBandcampUrl] = useState('')
  const [selectedGenres, setSelectedGenres] = useState<string[]>([])
  const [selectedStyles, setSelectedStyles] = useState<string[]>([])
  const [selectedThemes, setSelectedThemes] = useState<string[]>([])

  // Song form
  const [songTitle, setSongTitle] = useState('')
  const [songDesc, setSongDesc] = useState('')
  const [songGenre, setSongGenre] = useState('')
  const [songThemes, setSongThemes] = useState<string[]>([])
  const [songMoods, setSongMoods] = useState<string[]>([])
  const [songAngels, setSongAngels] = useState<string[]>([])
  const [songSpotify, setSongSpotify] = useState('')
  const [songApple, setSongApple] = useState('')
  const [songAmazon, setSongAmazon] = useState('')
  const [songYoutube, setSongYoutube] = useState('')
  const [songSoundcloud, setSongSoundcloud] = useState('')
  const [songTidal, setSongTidal] = useState('')
  const [songBandcamp, setSongBandcamp] = useState('')
  const [songEmbed, setSongEmbed] = useState('')
  const [originalDesc, setOriginalDesc] = useState('')
  const [assigningAngels, setAssigningAngels] = useState(false)
  const [songHealingStyles, setSongHealingStyles] = useState<string[]>([])
  const [songSpiritualConcepts, setSongSpiritualConcepts] = useState<string[]>([])
  const [songOracleTags, setSongOracleTags] = useState<string[]>([])

  useEffect(() => { loadProfile(); loadTier() }, [])

  async function loadTier() {
    try {
      const status = await getSubscriptionStatus()
      setTier(status.tier)
    } catch {
      setTier('free')
    }
  }

  async function loadProfile() {
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { setLoading(false); return }

      const { data: healer } = await supabase
        .from('musical_healers')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (healer) {
        setProfile(healer)
        setArtistName(healer.artist_name || '')
        setBio(healer.bio || '')
        setWebsiteUrl(healer.website_url || '')
        setMerchUrl(healer.merch_url || '')
        setSpotifyUrl(healer.spotify_url || '')
        setAppleMusicUrl(healer.apple_music_url || '')
        setAmazonMusicUrl(healer.amazon_music_url || '')
        setYoutubeUrl(healer.youtube_url || '')
        setSoundcloudUrl(healer.soundcloud_url || '')
        setTidalUrl(healer.tidal_url || '')
        setBandcampUrl(healer.bandcamp_url || '')
        setSelectedGenres(healer.genres || [])
        setSelectedStyles(healer.healing_styles || [])
        setSelectedThemes(healer.spiritual_themes || [])

        const { data: songData } = await supabase
          .from('musical_healer_songs')
          .select('*')
          .eq('healer_id', healer.id)
          .order('created_at', { ascending: false })

        if (songData) setSongs(songData)
      }
    } catch (err) {
      console.error('Load error:', err)
    }
    setLoading(false)
  }

  function toggleItem(item: string, list: string[], setter: (v: string[]) => void) {
    setter(list.includes(item) ? list.filter(i => i !== item) : [...list, item])
  }

  async function saveProfile() {
    if (!profile) return
    setSaving(true)
    setMessage('')
    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('musical_healers')
        .update({
          artist_name: artistName.trim(),
          bio: bio.trim(),
          website_url: websiteUrl.trim() || null,
          merch_url: merchUrl.trim() || null,
          spotify_url: spotifyUrl.trim() || null,
          apple_music_url: appleMusicUrl.trim() || null,
          amazon_music_url: amazonMusicUrl.trim() || null,
          youtube_url: youtubeUrl.trim() || null,
          soundcloud_url: soundcloudUrl.trim() || null,
          tidal_url: tidalUrl.trim() || null,
          bandcamp_url: bandcampUrl.trim() || null,
          genres: selectedGenres,
          healing_styles: selectedStyles,
          spiritual_themes: selectedThemes,
        })
        .eq('id', profile.id)

      if (error) setMessage('Error: ' + error.message)
      else setMessage('Profile saved!')
    } catch {
      setMessage('Error saving profile')
    }
    setSaving(false)
    setTimeout(() => setMessage(''), 3000)
  }

  function resetSongForm() {
    setSongTitle(''); setSongDesc(''); setSongGenre(''); setSongThemes([])
    setSongMoods([]); setSongAngels([]); setSongHealingStyles([]); setSongSpiritualConcepts([]); setSongOracleTags([]); setSongSpotify(''); setSongApple('')
    setSongAmazon(''); setSongYoutube(''); setSongSoundcloud(''); setSongTidal('')
    setSongBandcamp(''); setSongEmbed('')
  }

  function loadSongForEdit(song: Song) {
    setEditingSong(song)
    setSongTitle(song.title)
    setSongDesc(song.description || '')
    setOriginalDesc(song.description || '')
    setSongGenre(song.genre || '')
    setSongThemes((song.themes || []).filter(t => SPIRITUAL_THEMES.includes(t)).slice(0, 3))
    setSongMoods((song.moods || []).filter(m => SONG_MOODS.includes(m)).slice(0, 3))
    setSongAngels(song.angel_numbers || [])
    setSongHealingStyles((song.healing_styles || []).filter(s => SONG_HEALING_STYLES.includes(s)).slice(0, 3))
    setSongSpiritualConcepts((song.spiritual_concepts || []).filter(s => SONG_SPIRITUAL_CONCEPTS.includes(s)).slice(0, 3))
    setSongOracleTags(song.oracle_tags || [])
    setSongSpotify(song.spotify_url || '')
    setSongApple(song.apple_music_url || '')
    setSongAmazon(song.amazon_music_url || '')
    setSongYoutube(song.youtube_url || '')
    setSongSoundcloud(song.soundcloud_url || '')
    setSongTidal(song.tidal_url || '')
    setSongBandcamp(song.bandcamp_url || '')
    setSongEmbed(song.embed_url || '')
    setView('edit-song')
  }

  async function saveSong() {
    if (!profile || !songTitle.trim()) { setMessage('Song title is required'); return }
    if (!songDesc.trim()) { setMessage('Song description is required — this is how the AI matches your music'); return }
    if (songThemes.length > 3) { setMessage('Maximum 3 themes allowed'); return }
    if (songMoods.length > 3) { setMessage('Maximum 3 moods allowed'); return }
    if (songHealingStyles.length > 3) { setMessage('Maximum 3 healing styles allowed'); return }
    if (songSpiritualConcepts.length > 3) { setMessage('Maximum 3 spiritual concepts allowed'); return }
    setSaving(true)
    setMessage('')

    // Determine if we need to assign angel numbers
    const isNew = !editingSong
    const descChanged = editingSong && songDesc.trim() !== originalDesc.trim()
    let assignedAngels = songAngels
    let assignedOracleTags = songOracleTags

    if (isNew || descChanged) {
      setAssigningAngels(true)
      setMessage("🔮 Oracle is reading your song's energy...")
      try {
        const res = await fetch('/api/musical-healers/assign-angels', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title: songTitle.trim(), description: songDesc.trim(), tier }),
        })
        const data = await res.json()
        if (data.angel_numbers && Array.isArray(data.angel_numbers)) {
          assignedAngels = data.angel_numbers
        }
        if (data.oracle_tags && Array.isArray(data.oracle_tags)) {
          setSongOracleTags(data.oracle_tags)
          assignedOracleTags = data.oracle_tags
        }
      } catch (err) {
        console.error('Angel assignment error:', err)
        // Continue with existing or empty angels if API fails
      }
      setAssigningAngels(false)
    }

    const songData = {
      healer_id: profile.id,
      title: songTitle.trim(),
      description: songDesc.trim(),
      genre: songGenre.trim() || null,
      themes: songThemes.slice(0, 3),
      moods: songMoods.slice(0, 3),
      angel_numbers: assignedAngels,
      healing_styles: songHealingStyles.slice(0, 3),
      spiritual_concepts: songSpiritualConcepts.slice(0, 3),
      oracle_tags: assignedOracleTags,
      spotify_url: songSpotify.trim() || null,
      apple_music_url: songApple.trim() || null,
      amazon_music_url: songAmazon.trim() || null,
      youtube_url: songYoutube.trim() || null,
      soundcloud_url: songSoundcloud.trim() || null,
      tidal_url: songTidal.trim() || null,
      bandcamp_url: songBandcamp.trim() || null,
      embed_url: songEmbed.trim() || null,
      is_active: true,
    }

    try {
      const supabase = createClient()
      if (editingSong) {
        const { error } = await supabase
          .from('musical_healer_songs')
          .update(songData)
          .eq('id', editingSong.id)
        if (error) { setMessage('Error: ' + error.message); setSaving(false); return }
        setMessage('Song updated!')
      } else {
        const { error } = await supabase
          .from('musical_healer_songs')
          .insert(songData)
        if (error) { setMessage('Error: ' + error.message); setSaving(false); return }
        setMessage('Song added!')
      }

      resetSongForm()
      setEditingSong(null)
      setView('songs')
      await loadProfile()
    } catch {
      setMessage('Error saving song')
    }
    setSaving(false)
    setTimeout(() => setMessage(''), 3000)
  }

  async function toggleSongActive(song: Song) {
    try {
      const supabase = createClient()
      await supabase.from('musical_healer_songs').update({ is_active: !song.is_active }).eq('id', song.id)
      await loadProfile()
    } catch {
      setMessage('Error updating song')
    }
  }

  async function toggleSynch(song: Song) {
    const synchCount = songs.filter(s => s.synch_enabled).length
    const limit = SYNCH_LIMITS[tier]
    if (!song.synch_enabled && synchCount >= limit) {
      setMessage(`Synch limit reached (${synchCount}/${limit === Infinity ? '∞' : limit}). Upgrade to enable more songs for AI recommendations.`)
      setTimeout(() => setMessage(''), 4000)
      return
    }
    try {
      const supabase = createClient()
      await supabase.from('musical_healer_songs').update({ synch_enabled: !song.synch_enabled }).eq('id', song.id)
      await loadProfile()
    } catch {
      setMessage('Error updating synch status')
    }
  }

  async function deleteSong(song: Song) {
    if (!confirm(`Delete "${song.title}"? This cannot be undone.`)) return
    try {
      const supabase = createClient()
      await supabase.from('musical_healer_songs').delete().eq('id', song.id)
      await loadProfile()
      setMessage('Song deleted')
      setTimeout(() => setMessage(''), 3000)
    } catch {
      setMessage('Error deleting song')
    }
  }

  const accent = isSim ? 'rgba(0,255,65,' : 'rgba(201,168,76,'
  const textColor = isSim ? 'rgba(100,255,120,0.9)' : 'rgba(220,200,255,0.9)'
  const mutedColor = isSim ? 'rgba(0,255,65,0.5)' : 'rgba(200,180,255,0.5)'
  const bgCard = isSim ? 'rgba(0,20,0,0.4)' : 'rgba(8,6,28,0.88)'
  const borderColor = isSim ? 'rgba(0,255,65,0.2)' : 'rgba(201,168,76,0.25)'

  const inputStyle = {
    width: '100%', padding: '0.65rem', borderRadius: '0.75rem',
    background: 'rgba(255,255,255,0.04)', border: `1px solid ${borderColor}`,
    color: textColor, fontSize: '0.85rem', outline: 'none',
    fontFamily: isSim ? 'monospace' : 'inherit',
  }

  const labelStyle = {
    display: 'block' as const, fontSize: '0.7rem', textTransform: 'uppercase' as const,
    letterSpacing: '0.1em', color: mutedColor, marginBottom: '0.4rem',
  }

  const pillBtn = (active: boolean) => ({
    padding: '0.25rem 0.6rem', borderRadius: '999px', fontSize: '0.7rem', cursor: 'pointer' as const,
    background: active ? `${accent}0.2)` : 'rgba(255,255,255,0.04)',
    border: `1px solid ${active ? `${accent}0.5)` : borderColor}`,
    color: active ? textColor : mutedColor,
  })

  if (loading) return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><p style={{ color: mutedColor }}>Loading...</p></div>

  if (!profile) {
    return (
      <div style={{ minHeight: '100vh', padding: '2rem 1rem', maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎵</div>
        <h1 style={{ fontSize: '1.5rem', color: textColor, marginBottom: '1rem' }}>Not a Musical Healer Yet</h1>
        <p style={{ color: mutedColor, marginBottom: '2rem' }}>Apply to become a Musical Healer first.</p>
        <a href="/dashboard/musical-healers/apply" style={{
          display: 'inline-block', padding: '0.75rem 2rem', borderRadius: '999px',
          background: `${accent}0.15)`, border: `1px solid ${accent}0.4)`,
          color: textColor, textDecoration: 'none', fontWeight: 600,
        }}>Apply Now →</a>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', padding: '2rem 1rem', maxWidth: '650px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: textColor }}>
          {isSim ? '>> MANAGE AUDIO NODE' : '🎵 Manage Your Music'}
        </h1>
        {profile.is_verified && <span style={{ fontSize: '0.75rem', padding: '0.2rem 0.75rem', borderRadius: '999px', background: `${accent}0.15)`, border: `1px solid ${accent}0.3)`, color: textColor }}>✓ Verified</span>}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', justifyContent: 'center' }}>
        {(['profile', 'songs'] as const).map(tab => (
          <button key={tab} onClick={() => setView(tab)} style={{
            padding: '0.5rem 1.25rem', borderRadius: '999px', fontSize: '0.85rem', cursor: 'pointer',
            background: view === tab || (tab === 'songs' && (view === 'add-song' || view === 'edit-song')) ? `${accent}0.15)` : 'rgba(255,255,255,0.04)',
            border: `1px solid ${view === tab || (tab === 'songs' && (view === 'add-song' || view === 'edit-song')) ? `${accent}0.4)` : borderColor}`,
            color: view === tab || (tab === 'songs' && (view === 'add-song' || view === 'edit-song')) ? textColor : mutedColor,
            fontWeight: 600,
          }}>{tab === 'profile' ? (isSim ? 'NODE CONFIG' : '👤 Profile') : (isSim ? 'AUDIO DATA' : '🎶 Songs (' + songs.length + ')')}</button>
        ))}
      </div>

      {/* Message */}
      {message && <p style={{ textAlign: 'center', fontSize: '0.85rem', color: message.startsWith('Error') ? '#ff6b6b' : '#44ffaa', marginBottom: '1rem' }}>{message}</p>}

      {/* Profile Tab */}
      {view === 'profile' && (
        <div style={{ background: bgCard, borderRadius: '1.5rem', border: `1px solid ${borderColor}`, padding: '1.5rem' }}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={labelStyle}>Artist Name</label>
            <input value={artistName} onChange={e => setArtistName(e.target.value)} style={inputStyle} />
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label style={labelStyle}>Bio</label>
            <textarea value={bio} onChange={e => setBio(e.target.value)} rows={3} style={{ ...inputStyle, resize: 'vertical' }} />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={labelStyle}>Genres</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
              {GENRES.map(g => <button key={g} onClick={() => toggleItem(g, selectedGenres, setSelectedGenres)} style={pillBtn(selectedGenres.includes(g))}>{g}</button>)}
            </div>
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label style={labelStyle}>Healing Styles</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
              {HEALING_STYLES.map(s => <button key={s} onClick={() => toggleItem(s, selectedStyles, setSelectedStyles)} style={pillBtn(selectedStyles.includes(s))}>{s}</button>)}
            </div>
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label style={labelStyle}>Spiritual Themes</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
              {SPIRITUAL_THEMES.map(t => <button key={t} onClick={() => toggleItem(t, selectedThemes, setSelectedThemes)} style={pillBtn(selectedThemes.includes(t))}>{t}</button>)}
            </div>
          </div>

          <div style={{ height: '1px', background: borderColor, margin: '1.25rem 0' }} />
          <label style={{ ...labelStyle, marginBottom: '0.75rem' }}>Streaming Links</label>
          {[
            { label: 'Spotify', value: spotifyUrl, setter: setSpotifyUrl },
            { label: 'Apple Music', value: appleMusicUrl, setter: setAppleMusicUrl },
            { label: 'Amazon Music', value: amazonMusicUrl, setter: setAmazonMusicUrl },
            { label: 'YouTube', value: youtubeUrl, setter: setYoutubeUrl },
            { label: 'SoundCloud', value: soundcloudUrl, setter: setSoundcloudUrl },
            { label: 'Tidal', value: tidalUrl, setter: setTidalUrl },
            { label: 'Bandcamp', value: bandcampUrl, setter: setBandcampUrl },
          ].map(({ label, value, setter }) => (
            <div key={label} style={{ marginBottom: '0.5rem' }}>
              <label style={{ fontSize: '0.65rem', color: mutedColor, display: 'block', marginBottom: '0.2rem' }}>{label}</label>
              <input value={value} onChange={e => setter(e.target.value)} style={{ ...inputStyle, padding: '0.5rem 0.65rem' }} />
            </div>
          ))}
          <div style={{ marginTop: '0.75rem', marginBottom: '0.5rem' }}>
            <label style={{ fontSize: '0.65rem', color: mutedColor, display: 'block', marginBottom: '0.2rem' }}>Website</label>
            <input value={websiteUrl} onChange={e => setWebsiteUrl(e.target.value)} style={{ ...inputStyle, padding: '0.5rem 0.65rem' }} />
          </div>
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ fontSize: '0.65rem', color: mutedColor, display: 'block', marginBottom: '0.2rem' }}>Merch Store</label>
            <input value={merchUrl} onChange={e => setMerchUrl(e.target.value)} style={{ ...inputStyle, padding: '0.5rem 0.65rem' }} />
          </div>

          <button onClick={saveProfile} disabled={saving} style={{
            width: '100%', padding: '0.75rem', borderRadius: '999px', cursor: saving ? 'not-allowed' : 'pointer',
            background: `${accent}0.15)`, border: `1px solid ${accent}0.4)`,
            color: textColor, fontSize: '0.95rem', fontWeight: 700, opacity: saving ? 0.6 : 1,
          }}>{saving ? 'Saving...' : (isSim ? '>> SAVE NODE CONFIG' : '✦ Save Profile')}</button>
        </div>
      )}

      {/* Songs Tab */}
      {view === 'songs' && (
        <div>
          {/* Synch Tier Info Banner */}
          {(() => {
            const synchCount = songs.filter(s => s.synch_enabled).length
            const synchLimit = SYNCH_LIMITS[tier]
            const songLimit = SONG_LIMITS[tier]
            const synchLimitStr = synchLimit === Infinity ? '∞' : String(synchLimit)
            const songLimitStr = songLimit === Infinity ? '∞' : String(songLimit)
            return (
              <div style={{
                background: `${accent}0.08)`, border: `1px solid ${accent}0.2)`,
                borderRadius: '1rem', padding: '0.75rem 1rem', marginBottom: '1rem',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: textColor, fontWeight: 600 }}>
                      {isSim ? 'SYNCH SLOTS' : '🔮 Synch Slots'}: {synchCount}/{synchLimitStr}
                    </span>
                    <span style={{ fontSize: '0.65rem', color: mutedColor, marginLeft: '0.5rem' }}>
                      Songs: {songs.length}/{songLimitStr}
                    </span>
                  </div>
                  <span style={{ fontSize: '0.6rem', padding: '0.15rem 0.5rem', borderRadius: '999px', background: `${accent}0.12)`, border: `1px solid ${accent}0.25)`, color: textColor, textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
                    {tier === 'twin-flame' ? '✦ Twin Flame' : tier === 'mystic' ? '✦ Mystic' : 'Free'}
                  </span>
                </div>
                <p style={{ fontSize: '0.65rem', color: mutedColor, margin: '0.4rem 0 0', lineHeight: 1.4 }}>
                  {tier === 'twin-flame'
                    ? (isSim ? 'ALL FREQUENCIES ENABLED FOR SYNCH MATRIX' : 'All your songs are eligible for AI recommendations!')
                    : `Synched songs appear in AI reading recommendations. ${synchLimit - synchCount > 0 ? `${synchLimit - synchCount} slot${synchLimit - synchCount !== 1 ? 's' : ''} remaining.` : 'Upgrade to synch more songs.'}`
                  }
                </p>
                {tier !== 'twin-flame' && synchCount >= synchLimit && (
                  <a href="/dashboard/subscription" style={{ display: 'inline-block', marginTop: '0.5rem', fontSize: '0.7rem', padding: '0.3rem 0.75rem', borderRadius: '999px', background: `${accent}0.15)`, border: `1px solid ${accent}0.35)`, color: textColor, textDecoration: 'none', fontWeight: 600 }}>
                    ✦ Upgrade for more Synch slots
                  </a>
                )}
              </div>
            )
          })()}

          <button onClick={() => {
            const songLimit = SONG_LIMITS[tier]
            if (songs.length >= songLimit) {
              setMessage(`Song limit reached (${songs.length}/${songLimit === Infinity ? '∞' : songLimit}). Upgrade to add more songs.`)
              setTimeout(() => setMessage(''), 4000)
              return
            }
            resetSongForm(); setEditingSong(null); setView('add-song')
          }} style={{
            width: '100%', padding: '0.75rem', borderRadius: '999px', cursor: 'pointer', marginBottom: '1rem',
            background: `${accent}0.15)`, border: `1px solid ${accent}0.4)`,
            color: textColor, fontSize: '0.9rem', fontWeight: 700,
          }}>{isSim ? '>> ADD AUDIO DATA' : '+ Add New Song'}</button>

          {songs.length === 0 && <p style={{ textAlign: 'center', color: mutedColor, fontSize: '0.9rem', padding: '2rem 0' }}>No songs yet. Add your first song to get started!</p>}

          {songs.map(song => {
            const synchCount = songs.filter(s => s.synch_enabled).length
            const synchLimit = SYNCH_LIMITS[tier]
            const canSynch = song.synch_enabled || synchCount < synchLimit
            return (
              <div key={song.id} style={{
                background: bgCard, borderRadius: '1rem', border: `1px solid ${song.synch_enabled ? `${accent}0.35)` : borderColor}`,
                padding: '1rem', marginBottom: '0.75rem', opacity: song.is_active ? 1 : 0.5,
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: '1rem', color: textColor, margin: '0 0 0.25rem', fontWeight: 600 }}>
                      {song.synch_enabled && <span style={{ marginRight: '0.3rem' }}>🔮</span>}
                      {song.title}
                    </h3>
                    {song.genre && <span style={{ fontSize: '0.7rem', color: mutedColor }}>{song.genre}</span>}
                  </div>
                  <div style={{ display: 'flex', gap: '0.3rem', flexShrink: 0 }}>
                    {song.synch_enabled && <span style={{ fontSize: '0.6rem', padding: '0.15rem 0.5rem', borderRadius: '999px', background: `${accent}0.15)`, border: `1px solid ${accent}0.3)`, color: textColor, fontWeight: 600 }}>Synched</span>}
                    {!song.is_active && <span style={{ fontSize: '0.6rem', padding: '0.15rem 0.5rem', borderRadius: '999px', background: 'rgba(255,80,80,0.1)', color: 'rgba(255,100,100,0.7)', border: '1px solid rgba(255,80,80,0.2)' }}>Hidden</span>}
                  </div>
                </div>
                {song.description && <p style={{ fontSize: '0.8rem', color: mutedColor, lineHeight: 1.5, margin: '0.5rem 0' }}>{song.description.slice(0, 120)}{song.description.length > 120 ? '...' : ''}</p>}
                {song.angel_numbers?.length > 0 && (
                  <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap', margin: '0.5rem 0' }}>
                    {song.angel_numbers.map(n => <span key={n} style={{ fontSize: '0.65rem', padding: '0.15rem 0.4rem', borderRadius: '999px', background: `${accent}0.1)`, border: `1px solid ${accent}0.25)`, color: textColor, fontWeight: 600 }}>{n}</span>)}
                  </div>
                )}
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem', flexWrap: 'wrap' }}>
                  <button onClick={() => toggleSynch(song)} style={{
                    padding: '0.35rem 0.75rem', borderRadius: '0.5rem', fontSize: '0.75rem', cursor: canSynch || song.synch_enabled ? 'pointer' : 'not-allowed',
                    background: song.synch_enabled ? `${accent}0.15)` : 'rgba(255,255,255,0.05)',
                    border: `1px solid ${song.synch_enabled ? `${accent}0.4)` : borderColor}`,
                    color: song.synch_enabled ? textColor : mutedColor,
                    fontWeight: song.synch_enabled ? 600 : 400,
                    opacity: canSynch || song.synch_enabled ? 1 : 0.5,
                  }}>{song.synch_enabled ? '🔮 Synched' : (canSynch ? '○ Enable Synch' : '🔒 Synch Full')}</button>
                  <button onClick={() => loadSongForEdit(song)} style={{ padding: '0.35rem 0.75rem', borderRadius: '0.5rem', fontSize: '0.75rem', cursor: 'pointer', background: 'rgba(255,255,255,0.05)', border: `1px solid ${borderColor}`, color: mutedColor }}>Edit</button>
                  <button onClick={() => toggleSongActive(song)} style={{ padding: '0.35rem 0.75rem', borderRadius: '0.5rem', fontSize: '0.75rem', cursor: 'pointer', background: 'rgba(255,255,255,0.05)', border: `1px solid ${borderColor}`, color: mutedColor }}>{song.is_active ? 'Hide' : 'Show'}</button>
                  <button onClick={() => deleteSong(song)} style={{ padding: '0.35rem 0.75rem', borderRadius: '0.5rem', fontSize: '0.75rem', cursor: 'pointer', background: 'rgba(255,80,80,0.05)', border: '1px solid rgba(255,80,80,0.15)', color: 'rgba(255,100,100,0.6)' }}>Delete</button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Add/Edit Song Form */}
      {(view === 'add-song' || view === 'edit-song') && (
        <div style={{ background: bgCard, borderRadius: '1.5rem', border: `1px solid ${borderColor}`, padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h2 style={{ fontSize: '1.1rem', color: textColor, margin: 0 }}>{editingSong ? 'Edit Song' : 'Add New Song'}</h2>
            <button onClick={() => { setView('songs'); setEditingSong(null); resetSongForm() }} style={{ background: 'none', border: 'none', color: mutedColor, cursor: 'pointer', fontSize: '0.85rem' }}>← Back</button>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={labelStyle}>Song Title *</label>
            <input value={songTitle} onChange={e => setSongTitle(e.target.value)} placeholder="Name of the song" style={inputStyle} />
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label style={labelStyle}>Description / Healing Intention *</label>
            <textarea value={songDesc} onChange={e => setSongDesc(e.target.value)} placeholder="Describe this song's healing intention, mood, and story. The richer the description, the better the AI can match it to users' readings." rows={4} style={{ ...inputStyle, resize: 'vertical' }} />
            <p style={{ fontSize: '0.65rem', color: mutedColor, marginTop: '0.3rem' }}>💡 The AI uses this description to assign angel numbers and match your music to readings. Be specific about themes, emotions, and healing intentions.</p>
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label style={labelStyle}>Genre</label>
            <input value={songGenre} onChange={e => setSongGenre(e.target.value)} placeholder="e.g. ambient piano, healing frequencies" style={inputStyle} />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={labelStyle}>Themes (max 3)</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
              {SPIRITUAL_THEMES.map(t => {
                const selected = songThemes.includes(t)
                const atLimit = !selected && songThemes.length >= 3
                return <button key={t} onClick={() => !atLimit && toggleItem(t, songThemes, setSongThemes)} style={{
                  ...pillBtn(selected),
                  opacity: atLimit ? 0.3 : 1,
                  cursor: atLimit ? 'not-allowed' : 'pointer',
                }}>{t}</button>
              })}
            </div>
            {songThemes.length >= 3 && <p style={{ fontSize: '0.6rem', color: `${accent}0.6)`, marginTop: '0.3rem' }}>Maximum 3 themes selected</p>}
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label style={labelStyle}>Moods (max 3)</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
              {SONG_MOODS.map(m => {
                const selected = songMoods.includes(m)
                const atLimit = !selected && songMoods.length >= 3
                return <button key={m} onClick={() => !atLimit && toggleItem(m, songMoods, setSongMoods)} style={{
                  ...pillBtn(selected),
                  opacity: atLimit ? 0.3 : 1,
                  cursor: atLimit ? 'not-allowed' : 'pointer',
                }}>{m}</button>
              })}
            </div>
            {songMoods.length >= 3 && <p style={{ fontSize: '0.6rem', color: `${accent}0.6)`, marginTop: '0.3rem' }}>Maximum 3 moods selected</p>}
          </div>

          {/* Healing Styles - Mystic+ only */}
          <div style={{ marginBottom: '1rem' }}>
            <label style={labelStyle}>Healing Styles (max 3) {tier === 'free' ? <span style={{ fontSize: '0.6rem', color: 'rgba(255,180,80,0.7)' }}>— 🔒 Mystic tier</span> : ''}</label>
            {tier === 'free' ? (
              <div style={{ padding: '0.75rem', borderRadius: '0.75rem', background: 'rgba(255,180,80,0.05)', border: '1px solid rgba(255,180,80,0.15)' }}>
                <p style={{ fontSize: '0.7rem', color: 'rgba(255,180,80,0.6)', margin: 0 }}>🔒 Upgrade to Mystic to add healing style tags. These help the Oracle match your music to users seeking specific healing modalities.</p>
                <a href="/dashboard/upgrade" style={{ fontSize: '0.65rem', color: 'rgba(255,180,80,0.8)', marginTop: '0.3rem', display: 'inline-block' }}>Upgrade →</a>
              </div>
            ) : (
              <>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                  {SONG_HEALING_STYLES.map(s => {
                    const selected = songHealingStyles.includes(s)
                    const atLimit = !selected && songHealingStyles.length >= 3
                    return <button key={s} onClick={() => !atLimit && toggleItem(s, songHealingStyles, setSongHealingStyles)} style={{
                      ...pillBtn(selected),
                      opacity: atLimit ? 0.3 : 1,
                      cursor: atLimit ? 'not-allowed' : 'pointer',
                    }}>{s}</button>
                  })}
                </div>
                {songHealingStyles.length >= 3 && <p style={{ fontSize: '0.6rem', color: `${accent}0.6)`, marginTop: '0.3rem' }}>Maximum 3 healing styles selected</p>}
              </>
            )}
          </div>

          {/* Spiritual Concepts - Twin Flame only */}
          <div style={{ marginBottom: '1rem' }}>
            <label style={labelStyle}>Spiritual Concepts (max 3) {tier !== 'twin-flame' ? <span style={{ fontSize: '0.6rem', color: 'rgba(255,180,80,0.7)' }}>— 🔒 Twin Flame tier</span> : ''}</label>
            {tier !== 'twin-flame' ? (
              <div style={{ padding: '0.75rem', borderRadius: '0.75rem', background: 'rgba(255,180,80,0.05)', border: '1px solid rgba(255,180,80,0.15)' }}>
                <p style={{ fontSize: '0.7rem', color: 'rgba(255,180,80,0.6)', margin: 0 }}>🔒 Upgrade to Twin Flame to add spiritual concept tags. These connect your music to deeper metaphysical themes in users' readings.</p>
                <a href="/dashboard/upgrade" style={{ fontSize: '0.65rem', color: 'rgba(255,180,80,0.8)', marginTop: '0.3rem', display: 'inline-block' }}>Upgrade →</a>
              </div>
            ) : (
              <>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                  {SONG_SPIRITUAL_CONCEPTS.map(c => {
                    const selected = songSpiritualConcepts.includes(c)
                    const atLimit = !selected && songSpiritualConcepts.length >= 3
                    return <button key={c} onClick={() => !atLimit && toggleItem(c, songSpiritualConcepts, setSongSpiritualConcepts)} style={{
                      ...pillBtn(selected),
                      opacity: atLimit ? 0.3 : 1,
                      cursor: atLimit ? 'not-allowed' : 'pointer',
                    }}>{c}</button>
                  })}
                </div>
                {songSpiritualConcepts.length >= 3 && <p style={{ fontSize: '0.6rem', color: `${accent}0.6)`, marginTop: '0.3rem' }}>Maximum 3 spiritual concepts selected</p>}
              </>
            )}
          </div>

          {/* Angel Numbers - AI Assigned (read-only) */}
          {editingSong && songAngels.length > 0 && (
            <div style={{ marginBottom: '1rem' }}>
              <label style={labelStyle}>🔮 Angel Number Associations</label>
              <p style={{ fontSize: '0.6rem', color: mutedColor, marginBottom: '0.4rem' }}>Assigned by the Oracle based on your song&apos;s description. Change the description to get new assignments.</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                {songAngels.map(n => <span key={n} style={{ padding: '0.25rem 0.6rem', borderRadius: '999px', fontSize: '0.7rem', background: `${accent}0.15)`, border: `1px solid ${accent}0.3)`, color: textColor, fontWeight: 600 }}>✦ {n}</span>)}
              </div>
            </div>
          )}
          {!editingSong && (
            <div style={{ marginBottom: '1rem', padding: '0.75rem', borderRadius: '0.75rem', background: `${accent}0.05)`, border: `1px solid ${accent}0.15)` }}>
              <p style={{ fontSize: '0.7rem', color: mutedColor, margin: 0 }}>🔮 Angel numbers and Oracle tags will be automatically assigned when you save this song, based on your description.</p>
            </div>
          )}

          {/* Oracle-Assigned Tags (read-only) */}
          {editingSong && songOracleTags.length > 0 && (
            <div style={{ marginBottom: '1rem' }}>
              <label style={labelStyle}>🔮 Oracle-Assigned Tags</label>
              <p style={{ fontSize: '0.6rem', color: mutedColor, marginBottom: '0.4rem' }}>Automatically generated from your song description. Change the description to get new tags. Your tier determines how many tags are assigned (Free: 3, Mystic: 6, Twin Flame: 9).</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                {songOracleTags.map(t => <span key={t} style={{ padding: '0.25rem 0.6rem', borderRadius: '999px', fontSize: '0.7rem', background: 'rgba(160,120,255,0.12)', border: '1px solid rgba(160,120,255,0.25)', color: textColor, fontWeight: 500, fontStyle: 'italic' }}>✦ {t}</span>)}
              </div>
            </div>
          )}

          <div style={{ height: '1px', background: borderColor, margin: '1.25rem 0' }} />
          <label style={{ ...labelStyle, marginBottom: '0.75rem' }}>Song Streaming Links</label>
          {[
            { label: 'Spotify', value: songSpotify, setter: setSongSpotify },
            { label: 'Apple Music', value: songApple, setter: setSongApple },
            { label: 'Amazon Music', value: songAmazon, setter: setSongAmazon },
            { label: 'YouTube', value: songYoutube, setter: setSongYoutube },
            { label: 'SoundCloud', value: songSoundcloud, setter: setSongSoundcloud },
            { label: 'Tidal', value: songTidal, setter: setSongTidal },
            { label: 'Bandcamp', value: songBandcamp, setter: setSongBandcamp },
          ].map(({ label, value, setter }) => (
            <div key={label} style={{ marginBottom: '0.5rem' }}>
              <label style={{ fontSize: '0.65rem', color: mutedColor, display: 'block', marginBottom: '0.2rem' }}>{label}</label>
              <input value={value} onChange={e => setter(e.target.value)} style={{ ...inputStyle, padding: '0.5rem 0.65rem' }} />
            </div>
          ))}
          <div style={{ marginTop: '0.75rem', marginBottom: '1.25rem' }}>
            <label style={{ fontSize: '0.65rem', color: mutedColor, display: 'block', marginBottom: '0.2rem' }}>Embed URL (Spotify/SoundCloud embed)</label>
            <input value={songEmbed} onChange={e => setSongEmbed(e.target.value)} style={{ ...inputStyle, padding: '0.5rem 0.65rem' }} placeholder="Optional: paste an embed URL for in-app listening" />
          </div>

          <button onClick={saveSong} disabled={saving} style={{
            width: '100%', padding: '0.75rem', borderRadius: '999px', cursor: saving ? 'not-allowed' : 'pointer',
            background: `${accent}0.15)`, border: `1px solid ${accent}0.4)`,
            color: textColor, fontSize: '0.95rem', fontWeight: 700, opacity: saving ? 0.6 : 1,
          }}>{saving ? 'Saving...' : editingSong ? (isSim ? '>> UPDATE AUDIO DATA' : '✦ Update Song') : (isSim ? '>> UPLOAD AUDIO DATA' : '✦ Add Song')}</button>
        </div>
      )}

      {/* View Profile Link */}
      {profile && (
        <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
          <a href={`/dashboard/musical-healers/${profile.id}`} style={{ color: mutedColor, fontSize: '0.85rem', textDecoration: 'none' }}>View your public profile →</a>
        </div>
      )}
    </div>
  )
}
