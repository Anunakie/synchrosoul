'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useTheme } from '@/lib/theme-context'

const GENRES = ['Ambient Piano', 'Meditation', 'Healing Frequencies', 'New Age', 'Classical', 'Choral', 'Binaural Beats', 'Sound Bath', 'Acoustic', 'Electronic Ambient', 'World Music', 'Jazz', 'Singer-Songwriter', 'Orchestral']
const HEALING_STYLES = ['meditation', 'piano', 'binaural', 'chanting', 'sound healing', 'breathwork', 'yoga', 'reiki', 'chakra', 'crystal singing bowls', 'nature sounds', 'mantras']
const SPIRITUAL_THEMES = ['transformation', 'grounding', 'heart-opening', 'release', 'abundance', 'protection', 'awakening', 'peace', 'love', 'healing', 'courage', 'destiny', 'intuition', 'connection', 'gratitude', 'surrender']

export default function ApplyPage() {
  const { theme } = useTheme()
  const isSim = theme === 'simulation'
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [alreadyApplied, setAlreadyApplied] = useState(false)
  const [error, setError] = useState('')

  // Form state
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

  useEffect(() => {
    checkExisting()
  }, [])

  async function checkExisting() {
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { setLoading(false); return }
      const { data } = await supabase
        .from('musical_healers')
        .select('id')
        .eq('user_id', user.id)
        .single()
      if (data) setAlreadyApplied(true)
    } catch {
      // No existing profile
    }
    setLoading(false)
  }

  function toggleItem(item: string, list: string[], setter: (v: string[]) => void) {
    setter(list.includes(item) ? list.filter(i => i !== item) : [...list, item])
  }

  async function handleSubmit() {
    if (!artistName.trim()) { setError('Artist name is required'); return }
    if (!bio.trim()) { setError('Please write a short bio'); return }
    if (selectedGenres.length === 0) { setError('Please select at least one genre'); return }
    setError('')
    setSubmitting(true)

    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { setError('Please sign in first'); setSubmitting(false); return }

      const { error: insertError } = await supabase.from('musical_healers').insert({
        user_id: user.id,
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
        is_active: true,
        is_verified: false,
      })

      if (insertError) {
        setError(insertError.message)
        setSubmitting(false)
        return
      }

      setSubmitted(true)
    } catch (err) {
      setError('Something went wrong. Please try again.')
      console.error(err)
    }
    setSubmitting(false)
  }

  const accent = isSim ? 'rgba(0,255,65,' : 'rgba(201,168,76,'
  const textColor = isSim ? 'rgba(100,255,120,0.9)' : 'rgba(220,200,255,0.9)'
  const mutedColor = isSim ? 'rgba(0,255,65,0.5)' : 'rgba(200,180,255,0.5)'
  const bgCard = isSim ? 'rgba(0,20,0,0.4)' : 'rgba(8,6,28,0.88)'
  const borderColor = isSim ? 'rgba(0,255,65,0.2)' : 'rgba(201,168,76,0.25)'

  if (loading) {
    return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><p style={{ color: mutedColor }}>Loading...</p></div>
  }

  if (alreadyApplied) {
    return (
      <div style={{ minHeight: '100vh', padding: '2rem 1rem', maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎵</div>
        <h1 style={{ fontSize: '1.5rem', color: textColor, marginBottom: '1rem' }}>You&apos;re Already a Musical Healer!</h1>
        <p style={{ color: mutedColor, marginBottom: '2rem' }}>You already have a Musical Healer profile.</p>
        <a href="/dashboard/musical-healers/manage" style={{
          display: 'inline-block', padding: '0.75rem 2rem', borderRadius: '999px',
          background: `${accent}0.15)`, border: `1px solid ${accent}0.4)`,
          color: textColor, textDecoration: 'none', fontWeight: 600,
        }}>Manage Your Profile & Songs →</a>
      </div>
    )
  }

  if (submitted) {
    return (
      <div style={{ minHeight: '100vh', padding: '2rem 1rem', maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>✨</div>
        <h1 style={{ fontSize: '1.5rem', color: textColor, marginBottom: '1rem' }}>
          {isSim ? '>> AUDIO HEALER NODE REGISTERED' : 'Welcome, Musical Healer!'}
        </h1>
        <p style={{ color: mutedColor, marginBottom: '1rem' }}>Your profile has been created. Now add your songs so the AI Oracle can recommend your music to users.</p>
        <a href="/dashboard/musical-healers/manage" style={{
          display: 'inline-block', padding: '0.75rem 2rem', borderRadius: '999px',
          background: `${accent}0.15)`, border: `1px solid ${accent}0.4)`,
          color: textColor, textDecoration: 'none', fontWeight: 600,
        }}>Add Your Songs →</a>
      </div>
    )
  }

  const inputStyle = {
    width: '100%', padding: '0.75rem', borderRadius: '0.75rem',
    background: 'rgba(255,255,255,0.04)', border: `1px solid ${borderColor}`,
    color: textColor, fontSize: '0.9rem', outline: 'none',
    fontFamily: isSim ? 'monospace' : 'inherit',
  }

  const labelStyle = {
    display: 'block', fontSize: '0.75rem', textTransform: 'uppercase' as const,
    letterSpacing: '0.1em', color: mutedColor, marginBottom: '0.5rem',
    fontFamily: isSim ? 'monospace' : 'inherit',
  }

  return (
    <div style={{ minHeight: '100vh', padding: '2rem 1rem', maxWidth: '600px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🎵</div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: textColor, fontFamily: isSim ? 'monospace' : 'Cormorant Garamond, serif' }}>
          {isSim ? '>> REGISTER AUDIO HEALER NODE' : 'Become a Musical Healer'}
        </h1>
        <p style={{ color: mutedColor, marginTop: '0.5rem', fontSize: '0.9rem' }}>
          {isSim ? 'Upload your frequency data to the network.' : 'Share your healing music with the SynchroSoul community. The AI Oracle will recommend your songs based on users\' readings.'}
        </p>
      </div>

      <div style={{ background: bgCard, borderRadius: '1.5rem', border: `1px solid ${borderColor}`, padding: '1.5rem' }}>
        {/* Artist Name */}
        <div style={{ marginBottom: '1.25rem' }}>
          <label style={labelStyle}>{isSim ? 'NODE IDENTIFIER' : 'Artist Name'} *</label>
          <input value={artistName} onChange={e => setArtistName(e.target.value)} placeholder="Your artist or band name" style={inputStyle} />
        </div>

        {/* Bio */}
        <div style={{ marginBottom: '1.25rem' }}>
          <label style={labelStyle}>{isSim ? 'NODE DESCRIPTION' : 'Bio'} *</label>
          <textarea value={bio} onChange={e => setBio(e.target.value)} placeholder="Tell us about your music and healing philosophy..." rows={4}
            style={{ ...inputStyle, resize: 'vertical' }} />
        </div>

        {/* Genres */}
        <div style={{ marginBottom: '1.25rem' }}>
          <label style={labelStyle}>{isSim ? 'FREQUENCY CATEGORIES' : 'Genres'} *</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
            {GENRES.map(g => (
              <button key={g} onClick={() => toggleItem(g, selectedGenres, setSelectedGenres)} style={{
                padding: '0.3rem 0.75rem', borderRadius: '999px', fontSize: '0.75rem', cursor: 'pointer',
                background: selectedGenres.includes(g) ? `${accent}0.2)` : 'rgba(255,255,255,0.04)',
                border: `1px solid ${selectedGenres.includes(g) ? `${accent}0.5)` : borderColor}`,
                color: selectedGenres.includes(g) ? textColor : mutedColor,
              }}>{g}</button>
            ))}
          </div>
        </div>

        {/* Healing Styles */}
        <div style={{ marginBottom: '1.25rem' }}>
          <label style={labelStyle}>{isSim ? 'HEALING PROTOCOLS' : 'Healing Styles'}</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
            {HEALING_STYLES.map(s => (
              <button key={s} onClick={() => toggleItem(s, selectedStyles, setSelectedStyles)} style={{
                padding: '0.3rem 0.75rem', borderRadius: '999px', fontSize: '0.75rem', cursor: 'pointer',
                background: selectedStyles.includes(s) ? `${accent}0.2)` : 'rgba(255,255,255,0.04)',
                border: `1px solid ${selectedStyles.includes(s) ? `${accent}0.5)` : borderColor}`,
                color: selectedStyles.includes(s) ? textColor : mutedColor,
              }}>{s}</button>
            ))}
          </div>
        </div>

        {/* Spiritual Themes */}
        <div style={{ marginBottom: '1.25rem' }}>
          <label style={labelStyle}>{isSim ? 'RESONANCE TAGS' : 'Spiritual Themes'}</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
            {SPIRITUAL_THEMES.map(t => (
              <button key={t} onClick={() => toggleItem(t, selectedThemes, setSelectedThemes)} style={{
                padding: '0.3rem 0.75rem', borderRadius: '999px', fontSize: '0.75rem', cursor: 'pointer',
                background: selectedThemes.includes(t) ? `${accent}0.2)` : 'rgba(255,255,255,0.04)',
                border: `1px solid ${selectedThemes.includes(t) ? `${accent}0.5)` : borderColor}`,
                color: selectedThemes.includes(t) ? textColor : mutedColor,
              }}>{t}</button>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div style={{ height: '1px', background: borderColor, margin: '1.5rem 0' }} />

        {/* Streaming Links */}
        <label style={{ ...labelStyle, marginBottom: '1rem' }}>{isSim ? 'DATA STREAM ENDPOINTS' : 'Streaming Platform Links'}</label>

        {[
          { label: 'Spotify', value: spotifyUrl, setter: setSpotifyUrl, placeholder: 'https://open.spotify.com/artist/...' },
          { label: 'Apple Music', value: appleMusicUrl, setter: setAppleMusicUrl, placeholder: 'https://music.apple.com/artist/...' },
          { label: 'Amazon Music', value: amazonMusicUrl, setter: setAmazonMusicUrl, placeholder: 'https://music.amazon.com/artists/...' },
          { label: 'YouTube', value: youtubeUrl, setter: setYoutubeUrl, placeholder: 'https://youtube.com/@...' },
          { label: 'SoundCloud', value: soundcloudUrl, setter: setSoundcloudUrl, placeholder: 'https://soundcloud.com/...' },
          { label: 'Tidal', value: tidalUrl, setter: setTidalUrl, placeholder: 'https://tidal.com/artist/...' },
          { label: 'Bandcamp', value: bandcampUrl, setter: setBandcampUrl, placeholder: 'https://....bandcamp.com' },
        ].map(({ label, value, setter, placeholder }) => (
          <div key={label} style={{ marginBottom: '0.75rem' }}>
            <label style={{ fontSize: '0.7rem', color: mutedColor, marginBottom: '0.25rem', display: 'block' }}>{label}</label>
            <input value={value} onChange={e => setter(e.target.value)} placeholder={placeholder} style={{ ...inputStyle, padding: '0.6rem 0.75rem' }} />
          </div>
        ))}

        {/* Website & Merch */}
        <div style={{ height: '1px', background: borderColor, margin: '1.5rem 0' }} />
        <div style={{ marginBottom: '0.75rem' }}>
          <label style={{ fontSize: '0.7rem', color: mutedColor, marginBottom: '0.25rem', display: 'block' }}>Website</label>
          <input value={websiteUrl} onChange={e => setWebsiteUrl(e.target.value)} placeholder="https://your-website.com" style={{ ...inputStyle, padding: '0.6rem 0.75rem' }} />
        </div>
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ fontSize: '0.7rem', color: mutedColor, marginBottom: '0.25rem', display: 'block' }}>Merch Store</label>
          <input value={merchUrl} onChange={e => setMerchUrl(e.target.value)} placeholder="https://your-merch.com" style={{ ...inputStyle, padding: '0.6rem 0.75rem' }} />
        </div>

        {/* Error */}
        {error && <p style={{ color: '#ff6b6b', fontSize: '0.85rem', marginBottom: '1rem', textAlign: 'center' }}>{error}</p>}

        {/* Submit */}
        <button onClick={handleSubmit} disabled={submitting} style={{
          width: '100%', padding: '0.85rem', borderRadius: '999px', cursor: submitting ? 'not-allowed' : 'pointer',
          background: `${accent}0.15)`, border: `1px solid ${accent}0.4)`,
          color: textColor, fontSize: '1rem', fontWeight: 700, opacity: submitting ? 0.6 : 1,
          fontFamily: isSim ? 'monospace' : 'Cormorant Garamond, serif',
        }}>
          {submitting
            ? (isSim ? '>> REGISTERING NODE...' : '✦ Creating your profile...')
            : (isSim ? '>> REGISTER AS AUDIO HEALER' : '✦ Become a Musical Healer')}
        </button>
      </div>
    </div>
  )
}
