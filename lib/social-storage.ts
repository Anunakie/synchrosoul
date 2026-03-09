// lib/social-storage.ts
// Social posts storage - localStorage now, Supabase-ready

export interface SocialPost {
  id: string
  authorId: string
  authorName: string
  authorAvatar: string
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
const USER_ID = 'local_user'

export function getSocialProfile(): UserSocialProfile {
  if (typeof window === 'undefined') return { displayName: 'Starseed', bio: '', avatarColor: '#9b59b6', avatarImage: undefined, joinedAt: new Date().toISOString() }
  const raw = localStorage.getItem(PROFILE_KEY)
  if (raw) return JSON.parse(raw)
  return { displayName: 'Starseed', bio: '', avatarColor: '#9b59b6', avatarImage: undefined, joinedAt: new Date().toISOString() }
}

export function saveSocialProfile(profile: UserSocialProfile): void {
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile))
}

export function getPosts(): SocialPost[] {
  if (typeof window === 'undefined') return []
  const raw = localStorage.getItem(POSTS_KEY)
  return raw ? JSON.parse(raw) : []
}

export function savePost(content: string, angelNumber?: string, lifePathNumber?: number): SocialPost {
  const profile = getSocialProfile()
  const post: SocialPost = {
    id: Date.now().toString(),
    authorId: USER_ID,
    authorName: profile.displayName,
    authorAvatar: profile.displayName.split(' ').map((w: string) => w[0]).join('').toUpperCase().slice(0, 2),
    authorColor: profile.avatarColor,
    content,
    angelNumber,
    lifePathNumber,
    resonates: 0,
    resonatedBy: [],
    createdAt: new Date().toISOString(),
    isOwn: true,
  }
  const posts = getPosts()
  posts.unshift(post)
  localStorage.setItem(POSTS_KEY, JSON.stringify(posts))
  return post
}

export function toggleResonate(postId: string): void {
  const posts = getPosts()
  const post = posts.find(p => p.id === postId)
  if (!post) return
  const idx = post.resonatedBy.indexOf(USER_ID)
  if (idx === -1) {
    post.resonatedBy.push(USER_ID)
    post.resonates++
  } else {
    post.resonatedBy.splice(idx, 1)
    post.resonates--
  }
  localStorage.setItem(POSTS_KEY, JSON.stringify(posts))
}


export function updatePost(postId: string, newContent: string, newAngelNumber?: string): void {
  const posts = getPosts()
  const post = posts.find(p => p.id === postId)
  if (!post) return
  post.content = newContent
  if (newAngelNumber !== undefined) post.angelNumber = newAngelNumber
  localStorage.setItem(POSTS_KEY, JSON.stringify(posts))
}
export function deletePost(postId: string): void {
  const posts = getPosts().filter(p => p.id !== postId)
  localStorage.setItem(POSTS_KEY, JSON.stringify(posts))
}

const COLORS = ['#9b59b6','#3498db','#e74c3c','#2ecc71','#f39c12','#1abc9c','#e91e63','#ff5722']

export function getMockFeedPosts(userNumbers: string[]): SocialPost[] {
  const now = Date.now()
  const mockPosts: SocialPost[] = [
    { id:'m1', authorId:'u1', authorName:'Luna S.', authorAvatar:'LS', authorColor:COLORS[0], content:'Just saw 1111 on my coffee receipt right after thinking about my ex. The universe is wild.', angelNumber:'1111', lifePathNumber:1, resonates:12, resonatedBy:[], createdAt: new Date(now - 1200000).toISOString() },
    { id:'m2', authorId:'u2', authorName:'Orion K.', authorAvatar:'OK', authorColor:COLORS[1], content:'Three days in a row seeing 555. Something big is shifting. Can feel it in my bones.', angelNumber:'555', lifePathNumber:7, resonates:8, resonatedBy:[], createdAt: new Date(now - 3600000).toISOString() },
    { id:'m3', authorId:'u3', authorName:'Sage M.', authorAvatar:'SM', authorColor:COLORS[2], content:'My numerology reading said I am a life path 3 and honestly it explains everything about me lol', angelNumber:'333', lifePathNumber:3, resonates:21, resonatedBy:[], createdAt: new Date(now - 7200000).toISOString() },
    { id:'m4', authorId:'u4', authorName:'Nova T.', authorAvatar:'NT', authorColor:COLORS[3], content:'Woke up at 4:44am. Checked my phone. 444 notifications. I am not okay (in the best way)', angelNumber:'444', lifePathNumber:4, resonates:34, resonatedBy:[], createdAt: new Date(now - 10800000).toISOString() },
    { id:'m5', authorId:'u5', authorName:'River A.', authorAvatar:'RA', authorColor:COLORS[4], content:'Does anyone else feel like 1111 is a portal? Like time literally slows down when I see it', angelNumber:'1111', lifePathNumber:5, resonates:19, resonatedBy:[], createdAt: new Date(now - 14400000).toISOString() },
    { id:'m6', authorId:'u6', authorName:'Zephyr L.', authorAvatar:'ZL', authorColor:COLORS[5], content:'777 three times today. Bought a lottery ticket. Did not win. But spiritually I am rich.', angelNumber:'777', lifePathNumber:7, resonates:45, resonatedBy:[], createdAt: new Date(now - 18000000).toISOString() },
    { id:'m7', authorId:'u7', authorName:'Iris W.', authorAvatar:'IW', authorColor:COLORS[6], content:'The thought anchor journal feature is changing my life. I can see patterns in what I was thinking when I see each number.', angelNumber:'222', lifePathNumber:2, resonates:16, resonatedBy:[], createdAt: new Date(now - 21600000).toISOString() },
    { id:'m8', authorId:'u8', authorName:'Phoenix R.', authorAvatar:'PR', authorColor:COLORS[7], content:'Saw 999 the day I finally quit my job. Completion energy is real. New chapter loading.', angelNumber:'999', lifePathNumber:9, resonates:28, resonatedBy:[], createdAt: new Date(now - 28800000).toISOString() },
    { id:'m9', authorId:'u1', authorName:'Luna S.', authorAvatar:'LS', authorColor:COLORS[0], content:'Life path 1 gang where are you. We are literally built different and the numbers keep confirming it', angelNumber:'111', lifePathNumber:1, resonates:7, resonatedBy:[], createdAt: new Date(now - 36000000).toISOString() },
    { id:'m10', authorId:'u3', authorName:'Sage M.', authorAvatar:'SM', authorColor:COLORS[2], content:'1212 is my most seen number lately. Spiritual growth era activated. Who else?', angelNumber:'1212', lifePathNumber:3, resonates:11, resonatedBy:[], createdAt: new Date(now - 43200000).toISOString() },
  ]
  // Boost posts that share user numbers
  return mockPosts.sort((a, b) => {
    const aMatch = a.angelNumber && userNumbers.includes(a.angelNumber) ? 1 : 0
    const bMatch = b.angelNumber && userNumbers.includes(b.angelNumber) ? 1 : 0
    if (bMatch !== aMatch) return bMatch - aMatch
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  })
}
