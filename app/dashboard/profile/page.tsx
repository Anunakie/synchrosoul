'use client'
import { useState, useEffect, useRef } from 'react'
import { getSocialProfile, saveSocialProfile, getPosts, savePost, deletePost, updatePost, toggleResonate, UserSocialProfile, SocialPost } from '@/lib/social-storage'
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
  const [editing, setEditing] = useState(false)
  const [editName, setEditName] = useState('')
  const [editBio, setEditBio] = useState('')
  const [editColor, setEditColor] = useState('#9b59b6')
  const [editImage, setEditImage] = useState<string | null>(null)
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
            const p: UserSocialProfile = {
              displayName: cloudProfile.displayName,
              bio: cloudProfile.bio,
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
      getPosts().then(setPosts)
      const logs = await getLogs()
      setUserNumbers([...new Set(logs.map((l: any) => l.number))] as string[])
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
    }
    reader.readAsDataURL(file)
  }

  const removeImage = () => {
    setEditImage(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const saveProfile = async () => {
    const updated = { ...profile, displayName: editName || profile.displayName, bio: editBio, avatarColor: editColor }
    // Save to localStorage
    saveSocialProfile(updated)
    setProfile(updated)
    if (editImage) {
      localStorage.setItem(AVATAR_IMG_KEY, editImage)
      setAvatarImage(editImage)
    } else {
      localStorage.removeItem(AVATAR_IMG_KEY)
      setAvatarImage(null)
    }
    setEditing(false)
    // Save to Supabase for cross-device sync
    try {
      const numProfile = await getNumerologyProfile()
      await saveFullProfile({
        displayName: updated.displayName,
        bio: updated.bio,
        avatarColor: updated.avatarColor,
        avatarImage: editImage || null,
        lifePath: numProfile?.lifePath || null,
        soulUrge: numProfile?.soulUrge || null,
        destiny: numProfile?.destiny || null,
      })
    } catch (e) {
      console.error('Failed to sync profile to cloud:', e)
    }
  }

  const handlePost = async () => {
    const text = postText.trim()
    if (!text || posting) return
    setPosting(true)
    try {
      await new Promise(r => setTimeout(r, 300))
      await savePost({ content: text, angelNumber: postNumber.trim() || undefined })
      getPosts().then(setPosts)
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
    getPosts().then(setPosts)
  }

  const handleDelete = async (postId: string) => {
    deletePost(postId)
    getPosts().then(setPosts)
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
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      onClick={saveProfile}
                      onTouchEnd={e => { e.preventDefault(); saveProfile() }}
                      style={{ flex: 1, padding: '0.6rem', background: 'rgba(201,168,76,0.2)', border: '1px solid rgba(201,168,76,0.4)', borderRadius: '0.6rem', color: '#c9a84c', fontSize: '0.875rem', cursor: 'pointer', fontWeight: 600, WebkitAppearance: 'none' } as React.CSSProperties}
                    >Save Profile</button>
                    <button
                      onClick={() => setEditing(false)}
                      onTouchEnd={e => { e.preventDefault(); setEditing(false) }}
                      style={{ flex: 1, padding: '0.6rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.6rem', color: 'rgba(255,255,255,0.5)', fontSize: '0.875rem', cursor: 'pointer', WebkitAppearance: 'none' } as React.CSSProperties}
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
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: avatarImage ? 'transparent' : post.authorColor + '33', border: '2px solid ' + post.authorColor, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700, color: post.authorColor, flexShrink: 0, overflow: 'hidden' }}>
                {avatarImage ? <img src={avatarImage} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : post.authorAvatar}
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
