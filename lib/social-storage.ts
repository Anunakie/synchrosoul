// lib/social-storage.ts
import {
  getCurrentUserId,
  getPostsFromDB,
  savePostToDB,
  deletePostFromDB,
  updatePostInDB,
  getPrivacyMode,
} from './supabase-db'

export interface SocialPost {
  id: string
  authorId: string
  authorName: string
  authorAvatar: string
  authorImage?: string
  authorColor: string
  content: string
  angelNumber?: string
  lifePathNumber?: number
  resonates: number
  resonatedBy: string[]
  createdAt: string
  isOwn?: boolean
}

export interface UserSocialProfile {
  displayName: string
  bio: string
  avatarColor: string
  avatarImage?: string
  joinedAt: string
}

const POSTS_KEY = 'synchrosoul_posts'
const PROFILE_KEY = 'synchrosoul_social_profile'
const AVATAR_IMG_KEY = 'synchrosoul_avatar_image'
const USER_ID = 'local_user'

export function getSocialProfile(): UserSocialProfile {
  if (typeof window === 'undefined') return { displayName: 'Starseed', bio: '', avatarColor: '#9b59b6', avatarImage: undefined, joinedAt: new Date().toISOString() }
  const raw = localStorage.getItem(PROFILE_KEY)
  const avatarImage = localStorage.getItem(AVATAR_IMG_KEY) || undefined
  if (raw) {
    const profile = JSON.parse(raw)
    return { ...profile, avatarImage }
  }
  return { displayName: 'Starseed', bio: '', avatarColor: '#9b59b6', avatarImage, joinedAt: new Date().toISOString() }
}

export function saveSocialProfile(profile: UserSocialProfile): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile))
}

function getLocalPosts(): SocialPost[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(POSTS_KEY)
    if (!raw) return []
    const posts = JSON.parse(raw) as SocialPost[]
    const avatarImage = localStorage.getItem(AVATAR_IMG_KEY) || undefined
    return posts.map(p => p.authorId === USER_ID ? { ...p, authorImage: avatarImage } : p)
  } catch { return [] }
}

export async function getPosts(): Promise<SocialPost[]> {
  try {
    const userId = await getCurrentUserId()
    if (userId) {
      return await getPostsFromDB()
    }
  } catch {}
  return getLocalPosts()
}

export async function savePost(data: {
  content: string
  angelNumber?: string
}): Promise<SocialPost | null> {
  const profile = await getSocialProfile()
  try {
    const userId = await getCurrentUserId()
    if (userId) {
      // Check privacy mode - still save but mark accordingly
      const isPrivate = await getPrivacyMode()
      const dbId = await savePostToDB({
        content: data.content,
        angelNumber: data.angelNumber,
        authorName: profile.displayName || 'Starseed',
        authorImage: profile.avatarImage,
      })
      if (dbId) {
        return {
          id: dbId,
          authorId: userId,
          authorName: profile.displayName || 'Starseed',
          authorAvatar: (profile.displayName || 'S').charAt(0).toUpperCase(),
          authorImage: profile.avatarImage,
          authorColor: profile.avatarColor || '#9b59b6',
          content: data.content,
          angelNumber: data.angelNumber,
          resonates: 0,
          resonatedBy: [],
          createdAt: new Date().toISOString(),
          isOwn: true,
        }
      }
    }
  } catch {}
  // localStorage fallback
  const post: SocialPost = {
    id: Date.now().toString(36) + Math.random().toString(36).slice(2),
    authorId: USER_ID,
    authorName: profile.displayName || 'Starseed',
    authorAvatar: (profile.displayName || 'S').charAt(0).toUpperCase(),
    authorImage: profile.avatarImage,
    authorColor: profile.avatarColor || '#9b59b6',
    content: data.content,
    angelNumber: data.angelNumber,
    resonates: 0,
    resonatedBy: [],
    createdAt: new Date().toISOString(),
    isOwn: true,
  }
  const existing = getLocalPosts()
  localStorage.setItem(POSTS_KEY, JSON.stringify([post, ...existing]))
  return post
}

export async function deletePost(id: string): Promise<void> {
  try {
    const userId = await getCurrentUserId()
    if (userId) {
      await deletePostFromDB(id)
      return
    }
  } catch {}
  const posts = getLocalPosts().filter(p => p.id !== id)
  localStorage.setItem(POSTS_KEY, JSON.stringify(posts))
}

export async function updatePost(id: string, content: string, angelNumber?: string): Promise<void> {
  try {
    const userId = await getCurrentUserId()
    if (userId) {
      await updatePostInDB(id, content, angelNumber)
      return
    }
  } catch {}
  const posts = getLocalPosts().map(p =>
    p.id === id ? { ...p, content, angelNumber } : p
  )
  localStorage.setItem(POSTS_KEY, JSON.stringify(posts))
}

export async function resonatePost(id: string): Promise<void> {
  try {
    const userId = await getCurrentUserId()
    if (userId) {
      const supabase = (await import('@/lib/supabase/client')).createClient()
      await supabase.from('posts').update({ resonates: 0 }).eq('id', id) // placeholder - use RPC
      return
    }
  } catch {}
  const posts = getLocalPosts().map(p =>
    p.id === id ? { ...p, resonates: p.resonates + 1 } : p
  )
  localStorage.setItem(POSTS_KEY, JSON.stringify(posts))
}

// Compatibility shims
export function getMockFeedPosts(userNumbers: string[]): SocialPost[] {
  const mockNames = ['Luna Star', 'Orion Light', 'Sage River', 'Nova Soul', 'Zara Moon']
  const mockNumbers = ['1111', '333', '555', '777', '444', '222', '888']
  return mockNumbers
    .filter(n => userNumbers.length === 0 || userNumbers.includes(n) || Math.random() > 0.5)
    .slice(0, 4)
    .map((num, i) => ({
      id: 'mock_' + i,
      authorId: 'mock_' + i,
      authorName: mockNames[i % mockNames.length],
      authorAvatar: mockNames[i % mockNames.length].charAt(0),
      authorColor: ['#9b59b6','#3498db','#e74c3c','#2ecc71','#f39c12'][i % 5],
      content: [
        'Just saw ' + num + ' three times today ✨ feeling so aligned',
        'The universe keeps showing me ' + num + ' 💜 what a sign',
        num + ' appeared on my receipt, license plate AND clock today!',
        'Woke up at ' + num.slice(0,2) + ':' + num.slice(2) + ' again... ' + num + ' is following me 🌙',
      ][i % 4],
      angelNumber: num,
      resonates: Math.floor(Math.random() * 20),
      resonatedBy: [],
      createdAt: new Date(Date.now() - i * 3600000).toISOString(),
      isOwn: false,
    }))
}

export async function toggleResonate(postId: string): Promise<void> {
  await resonatePost(postId)
}
