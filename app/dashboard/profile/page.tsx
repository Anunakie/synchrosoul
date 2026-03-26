'use client'
import { useState, useEffect, useRef } from 'react'
import { getSocialProfile, saveSocialProfile, getPosts, savePost, deletePost, updatePost, toggleResonate, syncAuthorNameInPosts, syncAuthorImageInPosts, UserSocialProfile, SocialPost } from '@/lib/social-storage'
import { loadFullProfile, saveFullProfile, getCurrentUserId } from '@/lib/supabase-db'
import { getNumerologyProfile } from '@/lib/storage'
import { getLogs } from '@/lib/storage'
import { LIFE_PATH_DATA } from '@/lib/numerology'

const AVATAR_COLORS = ['#9b59b6','#3498db','#e74c3c','#2ecc71','#f39c12','#1abc9c','#e91e63','#ff5722','#c9a84c','#607d8b']
const AVATAR_IMG_KEY = 'synchrosoul_avatar_image'

function getTimeAgo(iso: string): string {
  const mins = Math.floor((Date.now() - new Date(iso).getTime()) / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return mins + 'm ago'
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return hrs + 'h ago'
  return Math.floor(hrs / 24) + 'd ago'
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserSocialProfile>({ displayName: 'Starseed', bio: '', avatarColor: '#9b59b6', joinedAt: new Date().toISOString() })
  const [avatarImage, setAvatarImage] = useState<string | null>(null)
  const [posts, setPosts] = useState<SocialPost[]>([])
  const [numerology, setNumerology] = useState<any>(null)
  const [userNumbers, setUserNumbers] = useState<string[]>([])
  const [earnedBadges, setEarnedBadges] = useState<{id:string,emoji:string,name:string,desc:string,color:string}[]>([])
  const [editing, setEditing] = useState(false)
  const [editName, setEditName] = useState('')
  const [editBio, setEditBio] = useState('')
  const [editColor, setEditColor] = useState('#9b59b6')
  const [editImage, setEditImage] = useState<string | null>(null)
  const [imageExplicitlyRemoved, setImageExplicitlyRemoved] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
    const [composing, setComposing] = useState(false)
  const [postText, setPostText] = useState('')
  const [postNumber, setPostNumber] = useState('')
  const [posting, setPosting] = useState(false)
  const [uploadHover, setUploadHover] = useState(false)
  const [syncing, setSyncing] = useState(true)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    ;(async () => {
      setSyncing(true)
      try {
        const userId = await getCurrentUserId()
        if (userId) {
          // Load from Supabase first (cross-device source of truth)
          const cloudProfile = await loadFullProfile()
          if (cloudProfile) {
            // Merge: use localStorage bio as fallback if cloud bio is empty
            const localSocialProfile = getSocialProfile()
            const mergedBio = cloudProfile.bio || localSocialProfile.bio || ''
            const mergedName = cloudProfile.displayName !== 'Starseed' ? cloudProfile.displayName : (localSocialProfile.displayName || cloudProfile.displayName)
            const p: UserSocialProfile = {
              displayName: mergedName,
              bio: mergedBio,
              avatarColor: cloudProfile.avatarColor,
              avatarImage: cloudProfile.avatarImage || undefined,
              joinedAt: new Date().toISOString(),
            }
            setProfile(p)
            setEditName(p.displayName)
            setEditBio(p.bio)
            setEditColor(p.avatarColor)
            saveSocialProfile(p)
            const cloudAvatar = cloudProfile.avatarImage
            const localAvatar = localStorage.getItem(AVATAR_IMG_KEY)
            const avatar = cloudAvatar || localAvatar
            setAvatarImage(avatar)
            setEditImage(avatar)
            if (cloudAvatar && cloudAvatar !== localAvatar) {
              localStorage.setItem(AVATAR_IMG_KEY, cloudAvatar)
            }
            // If cloud bio was empty but localStorage had one, push merged profile to Supabase
            if (!cloudProfile.bio && mergedBio) {
              saveFullProfile({
                displayName: mergedName,
                bio: mergedBio,
                avatarColor: p.avatarColor,
                avatarImage: avatar,
                lifePath: cloudProfile.lifePath,
                soulUrge: cloudProfile.soulUrge,
                destiny: cloudProfile.destiny,
              }).catch(console.error)
            }
            if (cloudProfile.lifePath) {
              setNumerology({ lifePath: cloudProfile.lifePath, soulUrge: cloudProfile.soulUrge, destiny: cloudProfile.destiny })
            } else {
              getNumerologyProfile().then(n => { if (n) setNumerology(n) })
            }
          } else {
            // No cloud profile yet - use localStorage and push to cloud
            const p = getSocialProfile()
            setProfile(p)
            setEditName(p.displayName)
            setEditBio(p.bio)
            setEditColor(p.avatarColor)
            const img = localStorage.getItem(AVATAR_IMG_KEY)
            setAvatarImage(img)
            setEditImage(img)
            const numProfile = await getNumerologyProfile()
            if (numProfile) setNumerology(numProfile)
            // Push to Supabase
            await saveFullProfile({
              displayName: p.displayName,
              bio: p.bio,
              avatarColor: p.avatarColor,
              avatarImage: img,
              lifePath: numProfile?.lifePath || null,
              soulUrge: numProfile?.soulUrge || null,
              destiny: numProfile?.destiny || null,
            })
          }
        } else {
          const p = getSocialProfile()
          setProfile(p)
          setEditName(p.displayName)
          setEditBio(p.bio)
          setEditColor(p.avatarColor)
          const img = localStorage.getItem(AVATAR_IMG_KEY)
          setAvatarImage(img)
          setEditImage(img)
          getNumerologyProfile().then(n => { if (n) setNumerology(n) })
        }
      } catch (e) {
        console.error('Profile load error:', e)
        const p = getSocialProfile()
        setProfile(p)
        setEditName(p.displayName)
        setEditBio(p.bio)
        setEditColor(p.avatarColor)
        const img = localStorage.getItem(AVATAR_IMG_KEY)
        setAvatarImage(img)
        setEditImage(img)
      } finally {
        setSyncing(false)
      }
      getPosts().then(all => setPosts(all.filter(p => p.isOwn)))
      const logs = await getLogs()
      setUserNumbers([...new Set(logs.map((l: any) => l.number))] as string[])
      // Compute earned badges
      const BADGE_DEFS = [
        { id: 'first_log', emoji: '👁️', name: 'First Sighting', desc: 'Logged your first angel number', color: '#c9a84c' },
        { id: 'logs_10', emoji: '📖', name: 'Seeker', desc: 'Logged 10 angel numbers', color: '#4299e1' },
        { id: 'logs_50', emoji: '🔮', name: 'Oracle', desc: 'Logged 50 angel numbers', color: '#9b59b6' },
        { id: 'logs_100', emoji: '💫', name: 'Starseed', desc: 'Logged 100 angel numbers', color: '#b794f4' },
        { id: 'streak_3', emoji: '🔥', name: 'Trinity Streak', desc: '3-day logging streak', color: '#f87171' },
        { id: 'streak_7', emoji: '⚡', name: 'Sacred Week', desc: '7-day logging streak', color: '#ecc94b' },
        { id: 'truth_first', emoji: '📸', name: 'Truth Seeker', desc: 'First Angel Approved entry', color: '#34d399' },
        { id: 'truth_10', emoji: '✅', name: 'Verified Mystic', desc: '10 Angel Approved entries', color: '#48bb78' },
        { id: 'early_adopter', emoji: '🚀', name: 'Early Adopter', desc: 'Joined in the first wave', color: '#ffd700' },
      ]
      const logCount = logs.length
      const logDates = [...new Set(logs.map((l: any) => new Date(l.createdAt).toDateString()))].sort(
        (a, b) => new Date(a).getTime() - new Date(b).getTime()
      )
      let streak = logDates.length > 0 ? 1 : 0
      let cur = 1
      for (let i = 1; i < logDates.length; i++) {
        const ms = new Date(logDates[i]).getTime() - new Date(logDates[i-1]).getTime(); const diff = ms / 86400000
        if (diff === 1) { cur++; streak = Math.max(streak, cur) } else cur = 1
      }
      const verified = logs.filter((l: any) => l.screenshotUrl).length
      const earned = BADGE_DEFS.filter(b => {
        if (b.id === 'first_log' || b.id === 'early_adopter') return logCount >= 1
        if (b.id === 'logs_10') return logCount >= 10
        if (b.id === 'logs_50') return logCount >= 50
        if (b.id === 'logs_100') return logCount >= 100
        if (b.id === 'streak_3') return streak >= 3
        if (b.id === 'streak_7') return streak >= 7
        if (b.id === 'truth_first') return verified >= 1
        if (b.id === 'truth_10') return verified >= 10
        return false
      })
      setEarnedBadges(earned)
    })()
  }, [])

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) { alert('Image must be under 5MB'); return }
    const reader = new FileReader()
    reader.onload = (ev) => {
      const result = ev.target?.result as string
      setEditImage(result)
      setImageExplicitlyRemoved(false)
    }
    reader.readAsDataURL(file)
  }

  const removeImage = () => {
    setEditImage(null)
    setImageExplicitlyRemoved(true)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const saveProfile = async () => {
    if (isSaving) return
    setIsSaving(true)
    try {
      const updated = { ...profile, displayName: editName || profile.displayName, bio: editBio, avatarColor: editColor }
      // Save to localStorage (wrapped to prevent QuotaExceededError from blocking save)
      try {
        saveSocialProfile(updated)
      } catch (e) {
        console.warn('saveSocialProfile failed:', e)
      }
      setProfile(updated)
      // Determine the definitive final image
      const finalImage = imageExplicitlyRemoved ? null : (editImage || avatarImage || null)
      // Update localStorage with image (may fail on mobile if image is large - that is ok)
      try {
        if (finalImage) {
          localStorage.setItem(AVATAR_IMG_KEY, finalImage)
          setAvatarImage(finalImage)
        } else {
          localStorage.removeItem(AVATAR_IMG_KEY)
          setAvatarImage(null)
        }
      } catch (e) {
        console.warn('localStorage avatar save failed (quota?):', e)
        // Still update state even if localStorage fails
        setAvatarImage(finalImage)
      }
      // Save to Supabase for cross-device sync
      const numProfile = await getNumerologyProfile()
      const saved = await saveFullProfile({
        displayName: updated.displayName,
        bio: updated.bio,
        avatarColor: updated.avatarColor,
        avatarImage: finalImage,
        lifePath: numProfile?.lifePath || null,
        soulUrge: numProfile?.soulUrge || null,
        destiny: numProfile?.destiny || null,
      })
      if (saved) {
        // After Supabase save, reload the avatar URL (may have been uploaded to Storage)
        // so localStorage gets the CDN URL instead of base64
        try {
          const { loadFullProfile } = await import('@/lib/supabase-db')
          const freshProfile = await loadFullProfile()
          if (freshProfile?.avatarImage) {
            localStorage.setItem(AVATAR_IMG_KEY, freshProfile.avatarImage)
            setAvatarImage(freshProfile.avatarImage)
          }
        } catch (e) {
          console.warn('Could not reload avatar URL after save:', e)
        }
      }
      // Sync author name and image across all posts
      await syncAuthorNameInPosts(updated.displayName)
      await syncAuthorImageInPosts(finalImage || '')
      setImageExplicitlyRemoved(false)
      setEditing(false)
    } catch (e) {
      console.error('Failed to save profile:', e)
      alert('Save failed. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  const handlePost = async () => {
    const text = postText.trim()
    if (!text || posting) return
    setPosting(true)
    try {
      await new Promise(r => setTimeout(r, 300))
      await savePost({ content: text, angelNumber: postNumber.trim() || undefined })
      getPosts().then(all => setPosts(all.filter(p => p.isOwn)))
      setPostText('')
      setPostNumber('')
      setComposing(false)
    } catch (err) {
      console.error('Post failed:', err)
    } finally {
      setPosting(false)
    }
  }

  const handleResonate = async (postId: string) => {
    await toggleResonate(postId)
    getPosts().then(all => setPosts(all.filter(p => p.isOwn)))
  }

  const handleDelete = async (postId: string) => {
    deletePost(postId)
    getPosts().then(all => setPosts(all.filter(p => p.isOwn)))
  }

  const initials = profile.displayName.split(' ').map((w: string) => w[0]).join('').toUpperCase().slice(0, 2)
  const lpData = numerology?.lifePath ? LIFE_PATH_DATA[numerology.lifePath] : null

  return (
    <div style={{ minHeight: '100vh', background: 'transparent', color: '#f0e6ff', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ maxWidth: 640, margin: '0 auto', padding: '2rem 1rem 6rem' }}>

        {/* Profile Card */}
        <div style={{ background: 'rgba(8,6,28,0.85)', border: '1px solid rgba(200,180,255,0.18)', borderRadius: '1.25rem', padding: '1.5rem', marginBottom: '1.5rem', backdropFilter: 'blur(12px)', boxShadow: '0 4px 24px rgba(0,0,0,0.4)' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>

            {/* Avatar */}
            {editing ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  onMouseEnter={() => setUploadHover(true)}
                  onMouseLeave={() => setUploadHover(false)}
                  style={{ width: 80, height: 80, borderRadius: '50%', background: editImage ? 'transparent' : editColor + '33', border: '3px solid ' + editColor, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', overflow: 'hidden', position: 'relative', transition: 'opacity 0.2s' }}
                >
                  {editImage ? (
                    <img src={editImage} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: uploadHover ? 0.5 : 1 }} />
                  ) : (
                    <span style={{ fontSize: '1.4rem', fontWeight: 700, color: editColor, opacity: uploadHover ? 0.5 : 1 }}>{initials}</span>
                  )}
                  {uploadHover && (
                    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.4)', borderRadius: '50%' }}>
                      <span style={{ fontSize: '1.2rem' }}>+</span>
                    </div>
                  )}
                </div>
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
                <div style={{ display: 'flex', gap: '0.3rem' }}>
                  <button onClick={() => fileInputRef.current?.click()} style={{ fontSize: '0.65rem', padding: '0.2rem 0.5rem', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '0.4rem', color: 'rgba(255,255,255,0.5)', cursor: 'pointer' }}>Upload</button>
                  {editImage && (
                    <button onClick={removeImage} style={{ fontSize: '0.65rem', padding: '0.2rem 0.5rem', background: 'rgba(231,76,60,0.1)', border: '1px solid rgba(231,76,60,0.2)', borderRadius: '0.4rem', color: '#e74c3c', cursor: 'pointer' }}>Remove</button>
                  )}
                </div>
              </div>
            ) : (
              <div style={{ position: 'relative', flexShrink: 0 }}>
                <div style={{ width: 72, height: 72, borderRadius: '50%', background: avatarImage ? 'transparent' : profile.avatarColor + '33', border: '3px solid ' + profile.avatarColor, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', fontWeight: 700, color: profile.avatarColor, overflow: 'hidden' }}>
                  {avatarImage ? <img src={avatarImage} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : initials}
                </div>
                <button
                  onClick={() => { setEditing(true); setTimeout(() => fileInputRef.current?.click(), 100) }}
                  title="Upload profile photo"
                  style={{ position: 'absolute', bottom: 0, right: 0, width: 24, height: 24, borderRadius: '50%', background: '#1a1a2e', border: '2px solid ' + profile.avatarColor, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: '0.7rem', color: profile.avatarColor, lineHeight: 1 }}
                >+</button>
              </div>
            )}

            <div style={{ flex: 1, minWidth: 0 }}>
              {editing ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                  <input
                    value={editName}
                    onChange={e => setEditName(e.target.value)}
                    onInput={e => setEditName((e.target as HTMLInputElement).value)}
                    placeholder="Display name"
                    style={{ width: '100%', boxSizing: 'border-box', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '0.6rem', padding: '0.55rem 0.75rem', color: '#f0e6ff', fontSize: '0.95rem', outline: 'none', WebkitAppearance: 'none' } as React.CSSProperties}
                  />
                  <textarea
                    value={editBio}
                    onChange={e => setEditBio(e.target.value)}
                    onInput={e => setEditBio((e.target as HTMLTextAreaElement).value)}
                    placeholder="Your spiritual bio..."
                    rows={3}
                    style={{ width: '100%', boxSizing: 'border-box', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '0.6rem', padding: '0.55rem 0.75rem', color: '#f0e6ff', fontSize: '0.875rem', outline: 'none', resize: 'none', fontFamily: 'inherit', lineHeight: 1.5, WebkitAppearance: 'none' } as React.CSSProperties}
                  />
                  <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                    {AVATAR_COLORS.map(c => (
                      <div key={c} onClick={() => setEditColor(c)} style={{ width: 22, height: 22, borderRadius: '50%', background: c, cursor: 'pointer', border: editColor === c ? '2px solid white' : '2px solid transparent', transition: 'transform 0.15s', transform: editColor === c ? 'scale(1.2)' : 'scale(1)' }} />
                    ))}
                  </div>

                    <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                      <button
                        onClick={saveProfile}
                        onTouchEnd={(e) => { e.preventDefault(); e.stopPropagation(); saveProfile(); }}
                        disabled={isSaving}
                        style={{ flex: 1, padding: '1rem', background: isSaving ? 'rgba(201,168,76,0.08)' : 'rgba(201,168,76,0.2)', border: '2px solid rgba(201,168,76,0.5)', borderRadius: '0.75rem', color: '#c9a84c', fontSize: '1rem', cursor: isSaving ? 'not-allowed' : 'pointer', fontWeight: 700, WebkitAppearance: 'none', touchAction: 'manipulation', minHeight: '56px', userSelect: 'none', WebkitUserSelect: 'none' } as React.CSSProperties}
                      >{isSaving ? 'Saving...' : 'Save Profile'}</button>
                      <button
                        onClick={() => { if (!isSaving) setEditing(false); }}
                        onTouchEnd={(e) => { e.preventDefault(); e.stopPropagation(); if (!isSaving) setEditing(false); }}
                        disabled={isSaving}
                        style={{ flex: 1, padding: '1rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '0.75rem', color: 'rgba(255,255,255,0.6)', fontSize: '1rem', cursor: isSaving ? 'not-allowed' : 'pointer', WebkitAppearance: 'none', touchAction: 'manipulation', minHeight: '56px', userSelect: 'none', WebkitUserSelect: 'none' } as React.CSSProperties}
                      >Cancel</button>
                    </div>

                </div>
              ) : (
                <>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <h2 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 700, color: '#f0e6ff' }}>{profile.displayName}</h2>
                    <button onClick={() => setEditing(true)} style={{ background: 'none', border: 'none', color: 'rgba(220,200,255,0.58)', cursor: 'pointer', fontSize: '0.8rem', padding: '0.1rem 0.4rem' }}>Edit</button>
                  </div>
                  {profile.bio
                    ? <p style={{ margin: '0.3rem 0 0', fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)' }}>{profile.bio}</p>
                    : <p style={{ margin: '0.3rem 0 0', fontSize: '0.8rem', color: 'rgba(220,200,255,0.5)', fontStyle: 'italic' }}>Add a spiritual bio...</p>
                  }
                </>
              )}
            </div>
          </div>

          {/* Numerology badges */}
          {numerology && (
            <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ fontSize: '0.65rem', color: 'rgba(220,200,255,0.58)', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>COSMIC BLUEPRINT</div>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {numerology.lifePath && (
                  <div style={{ padding: '0.3rem 0.75rem', borderRadius: '999px', background: (lpData?.color || '#c9a84c') + '20', border: '1px solid ' + (lpData?.color || '#c9a84c') + '50', fontSize: '0.75rem', color: lpData?.color || '#c9a84c', fontWeight: 600 }}>Life Path {numerology.lifePath}</div>
                )}
                {numerology.soulUrge && (
                  <div style={{ padding: '0.3rem 0.75rem', borderRadius: '999px', background: 'rgba(155,89,182,0.15)', border: '1px solid rgba(155,89,182,0.4)', fontSize: '0.75rem', color: '#9b59b6', fontWeight: 600 }}>Soul Urge {numerology.soulUrge}</div>
                )}
                {numerology.destiny && (
                  <div style={{ padding: '0.3rem 0.75rem', borderRadius: '999px', background: 'rgba(52,152,219,0.15)', border: '1px solid rgba(52,152,219,0.4)', fontSize: '0.75rem', color: '#3498db', fontWeight: 600 }}>Destiny {numerology.destiny}</div>
                )}
              </div>
            </div>
          )}

          {/* Earned Badges */}
          {earnedBadges.length > 0 && (
            <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <div style={{ fontSize: '0.65rem', color: 'rgba(220,200,255,0.58)', letterSpacing: '0.1em' }}>COSMIC BADGES</div>
                <a href="/dashboard/badges" style={{ fontSize: '0.65rem', color: '#c9a84c', textDecoration: 'none' }}>View all</a>
              </div>
              <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                {earnedBadges.map(badge => (
                  <div key={badge.id} title={badge.name + ': ' + badge.desc} style={{ width: '2.2rem', height: '2.2rem', borderRadius: '50%', background: 'rgba(8,6,28,0.9)', border: '1px solid ' + badge.color + '55', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', filter: 'drop-shadow(0 0 6px ' + badge.color + '66)', cursor: 'default' }}>
                    {badge.emoji}
                  </div>
                ))}
              </div>
            </div>
          )}

                    {/* Stats */}
          <div style={{ marginTop: '1rem', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem' }}>
            <div style={{ textAlign: 'center', padding: '0.5rem', background: 'rgba(8,6,28,0.75)', borderRadius: '0.5rem' }}>
              <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#c9a84c' }}>{posts.length}</div>
              <div style={{ fontSize: '0.65rem', color: 'rgba(220,200,255,0.62)' }}>POSTS</div>
            </div>
            <div style={{ textAlign: 'center', padding: '0.5rem', background: 'rgba(8,6,28,0.75)', borderRadius: '0.5rem' }}>
              <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#9b59b6' }}>{userNumbers.length}</div>
              <div style={{ fontSize: '0.65rem', color: 'rgba(220,200,255,0.62)' }}>NUMBERS</div>
            </div>
            <div style={{ textAlign: 'center', padding: '0.5rem', background: 'rgba(8,6,28,0.75)', borderRadius: '0.5rem' }}>
              <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#3498db' }}>{posts.reduce((s, p) => s + p.resonates, 0)}</div>
              <div style={{ fontSize: '0.65rem', color: 'rgba(220,200,255,0.62)' }}>RESONATES</div>
            </div>
          </div>
        </div>

        {/* Compose — Share cosmic moment */}
        {!composing && (
          <button
            onClick={() => setComposing(true)}
            onTouchEnd={e => { e.preventDefault(); setComposing(true) }}
            style={{ width: '100%', padding: '0.9rem', background: 'linear-gradient(135deg, rgba(201,168,76,0.15), rgba(155,89,182,0.15))', border: '1px solid rgba(201,168,76,0.3)', borderRadius: '1rem', color: '#c9a84c', fontSize: '0.95rem', fontWeight: 600, cursor: 'pointer', marginBottom: '1.5rem', letterSpacing: '0.05em', WebkitAppearance: 'none', display: 'block', boxSizing: 'border-box' } as React.CSSProperties}
          >
            + Share a cosmic moment
          </button>
        )}

        {composing && (
          <div style={{ background: 'rgba(8,6,28,0.88)', border: '1px solid rgba(201,168,76,0.3)', borderRadius: '1rem', padding: '1rem', marginBottom: '1.5rem', backdropFilter: 'blur(12px)', boxSizing: 'border-box' }}>
            <textarea
              value={postText}
              onChange={e => setPostText(e.target.value)}
              onInput={e => setPostText((e.target as HTMLTextAreaElement).value)}
              placeholder="What are the numbers showing you today?"
              rows={4}
              style={{ width: '100%', boxSizing: 'border-box', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(200,180,255,0.15)', borderRadius: '0.75rem', padding: '0.75rem', color: '#f0e6ff', fontSize: '1rem', outline: 'none', resize: 'none', fontFamily: 'inherit', display: 'block', marginBottom: '0.75rem', WebkitAppearance: 'none', lineHeight: 1.5 } as React.CSSProperties}
            />
            <input
              value={postNumber}
              onChange={e => setPostNumber(e.target.value.replace(/[^0-9]/g, ''))}
              onInput={e => setPostNumber((e.target as HTMLInputElement).value.replace(/[^0-9]/g, ''))}
              placeholder="Tag an angel number (e.g. 1111)"
              maxLength={6}
              style={{ width: '100%', boxSizing: 'border-box', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(201,168,76,0.2)', borderRadius: '0.6rem', padding: '0.6rem 0.75rem', color: '#c9a84c', fontSize: '0.9rem', outline: 'none', display: 'block', marginBottom: '0.75rem', fontFamily: 'inherit', WebkitAppearance: 'none' } as React.CSSProperties}
            />
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                onClick={() => { setComposing(false); setPostText(''); setPostNumber('') }}
                onTouchEnd={e => { e.preventDefault(); setComposing(false); setPostText(''); setPostNumber('') }}
                style={{ flex: 1, padding: '0.7rem', background: 'none', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '0.75rem', color: 'rgba(220,200,255,0.7)', fontSize: '0.9rem', cursor: 'pointer', fontFamily: 'inherit', WebkitAppearance: 'none' } as React.CSSProperties}
              >Cancel</button>
              <button
                onClick={handlePost}
                onTouchEnd={e => { e.preventDefault(); if (!posting) handlePost() }}
                style={{ flex: 2, padding: '0.7rem', background: 'linear-gradient(135deg, rgba(201,168,76,0.25), rgba(155,89,182,0.25))', border: '1px solid rgba(201,168,76,0.4)', borderRadius: '0.75rem', color: '#c9a84c', fontSize: '0.9rem', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', WebkitAppearance: 'none', opacity: posting ? 0.6 : 1 } as React.CSSProperties}
              >
                {posting ? 'Posting...' : '✦ Post'}
              </button>
            </div>
          </div>
        )}

        {/* Posts */}
        {posts.length === 0 && (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'rgba(220,200,255,0.5)' }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>✦</div>
            <p style={{ fontSize: '0.85rem' }}>Your cosmic moments will appear here</p>
          </div>
        )}

        {posts.map(post => (
          <div key={post.id} style={{ background: 'rgba(8,6,28,0.88)', border: '1px solid rgba(200,180,255,0.18)', borderRadius: '1rem', padding: '1rem', marginBottom: '0.75rem', backdropFilter: 'blur(12px)', boxShadow: '0 4px 20px rgba(0,0,0,0.4)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.6rem' }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: post.authorImage ? 'transparent' : post.authorColor + '33', border: '2px solid ' + post.authorColor, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700, color: post.authorColor, flexShrink: 0, overflow: 'hidden' }}>
                {post.authorImage ? <img src={post.authorImage} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : post.authorAvatar}
              </div>
              <div style={{ flex: 1 }}>
                <span style={{ fontWeight: 600, fontSize: '0.85rem', color: '#f0e6ff' }}>{post.authorName}</span>
                <span style={{ fontSize: '0.72rem', color: 'rgba(220,200,255,0.62)', marginLeft: '0.5rem' }}>{getTimeAgo(post.createdAt)}</span>
              </div>
              {post.angelNumber && (
                <span style={{ fontSize: '0.72rem', padding: '0.15rem 0.5rem', borderRadius: '999px', background: 'rgba(201,168,76,0.15)', border: '1px solid rgba(201,168,76,0.3)', color: '#c9a84c', fontWeight: 600 }}>{post.angelNumber}</span>
              )}
            </div>
            <p style={{ margin: '0 0 0.75rem', fontSize: '0.88rem', color: 'rgba(255,255,255,0.8)', lineHeight: 1.5 }}>{post.content}</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <button
                onClick={() => handleResonate(post.id)}
                style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', background: post.resonatedBy.includes('local_user') ? 'rgba(201,168,76,0.15)' : 'none', border: post.resonatedBy.includes('local_user') ? '1px solid rgba(201,168,76,0.3)' : '1px solid rgba(255,255,255,0.08)', borderRadius: '999px', padding: '0.25rem 0.6rem', color: post.resonatedBy.includes('local_user') ? '#c9a84c' : 'rgba(220,200,255,0.68)', fontSize: '0.75rem', cursor: 'pointer' }}
              >✦ {post.resonates}</button>
              <button
                onClick={() => handleDelete(post.id)}
                onTouchEnd={e => { e.preventDefault(); handleDelete(post.id) }}
                style={{ marginLeft: 'auto', background: 'none', border: 'none', color: 'rgba(255,255,255,0.2)', fontSize: '0.72rem', cursor: 'pointer' }}
              >delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
