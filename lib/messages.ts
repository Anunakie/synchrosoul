// lib/messages.ts
import { createClient } from '@/lib/supabase/client'
import { getCurrentUserId } from '@/lib/supabase-db'

export interface Message {
  id: string
  conversationId: string
  senderId: string
  content: string
  angelNumber: string | null
  createdAt: string
  readAt: string | null
}

export interface Conversation {
  id: string
  user1Id: string
  user2Id: string
  user1Name: string
  user2Name: string
  user1Avatar: string
  user2Avatar: string
  lastMessageAt: string
  lastMessagePreview: string
  createdAt: string
  // computed
  otherUserId: string
  otherUserName: string
  otherUserAvatar: string
  unreadCount?: number
}

function mapConversation(row: any, myId: string): Conversation {
  const isUser1 = row.user1_id === myId
  return {
    id: row.id,
    user1Id: row.user1_id,
    user2Id: row.user2_id,
    user1Name: row.user1_name || 'Soul',
    user2Name: row.user2_name || 'Soul',
    user1Avatar: row.user1_avatar || '',
    user2Avatar: row.user2_avatar || '',
    lastMessageAt: row.last_message_at,
    lastMessagePreview: row.last_message_preview || '',
    createdAt: row.created_at,
    otherUserId: isUser1 ? row.user2_id : row.user1_id,
    otherUserName: isUser1 ? (row.user2_name || 'Soul') : (row.user1_name || 'Soul'),
    otherUserAvatar: isUser1 ? (row.user2_avatar || '') : (row.user1_avatar || ''),
  }
}

function mapMessage(row: any): Message {
  return {
    id: row.id,
    conversationId: row.conversation_id,
    senderId: row.sender_id,
    content: row.content,
    angelNumber: row.angel_number || null,
    createdAt: row.created_at,
    readAt: row.read_at || null,
  }
}

export async function getConversations(): Promise<Conversation[]> {
  try {
    const supabase = createClient()
    const myId = await getCurrentUserId()
    if (!myId) return []
    const { data, error } = await supabase
      .from('conversations')
      .select('*')
      .or('user1_id.eq.' + myId + ',user2_id.eq.' + myId)
      .order('last_message_at', { ascending: false })
    if (error || !data) return []
    return data.map(row => mapConversation(row, myId))
  } catch { return [] }
}

export async function getOrCreateConversation(
  otherUserId: string,
  myName: string,
  myAvatar: string,
  otherName: string,
  otherAvatar: string
): Promise<string | null> {
  try {
    const supabase = createClient()
    const myId = await getCurrentUserId()
    if (!myId) return null

    // Check if conversation already exists (in either user order)
    const { data: existing } = await supabase
      .from('conversations')
      .select('id')
      .or(`and(user1_id.eq.${myId},user2_id.eq.${otherUserId}),and(user1_id.eq.${otherUserId},user2_id.eq.${myId})`)
      .maybeSingle()

    if (existing?.id) return existing.id

    // Create new conversation
    const { data: created, error } = await supabase
      .from('conversations')
      .insert({
        user1_id: myId,
        user2_id: otherUserId,
        user1_name: myName,
        user2_name: otherName,
        user1_avatar: myAvatar,
        user2_avatar: otherAvatar,
        last_message_at: new Date().toISOString(),
        last_message_preview: '',
      })
      .select('id')
      .single()

    if (error) {
      console.error('[Messages] create conversation error:', error)
      return null
    }
    return created?.id || null
  } catch (e) {
    console.error('[Messages] getOrCreateConversation exception:', e)
    return null
  }
}

export async function getMessages(conversationId: string): Promise<Message[]> {
  try {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true })
    if (error || !data) return []
    return data.map(mapMessage)
  } catch { return [] }
}

export async function sendMessage(data: {
  conversationId: string
  content: string
  angelNumber?: string
}): Promise<Message | null> {
  try {
    const supabase = createClient()
    const myId = await getCurrentUserId()
    if (!myId) return null
    const { data: row, error } = await supabase
      .from('messages')
      .insert({
        conversation_id: data.conversationId,
        sender_id: myId,
        content: data.content,
        angel_number: data.angelNumber || null,
      })
      .select()
      .single()
    if (error || !row) {
      console.error('[Messages] sendMessage error:', error)
      return null
    }
    // Update conversation preview
    await supabase
      .from('conversations')
      .update({
        last_message_at: new Date().toISOString(),
        last_message_preview: data.content.slice(0, 80),
      })
      .eq('id', data.conversationId)
    return mapMessage(row)
  } catch { return null }
}

export async function markMessagesRead(conversationId: string): Promise<void> {
  try {
    const supabase = createClient()
    const myId = await getCurrentUserId()
    if (!myId) return
    await supabase
      .from('messages')
      .update({ read_at: new Date().toISOString() })
      .eq('conversation_id', conversationId)
      .neq('sender_id', myId)
      .is('read_at', null)
  } catch {}
}

export async function getUnreadCount(): Promise<number> {
  try {
    const supabase = createClient()
    const myId = await getCurrentUserId()
    if (!myId) return 0
    // Get all conversations for this user
    const { data: convs } = await supabase
      .from('conversations')
      .select('id')
      .or('user1_id.eq.' + myId + ',user2_id.eq.' + myId)
    if (!convs || convs.length === 0) return 0
    const convIds = convs.map((c: any) => c.id)
    const { count } = await supabase
      .from('messages')
      .select('id', { count: 'exact', head: true })
      .in('conversation_id', convIds)
      .neq('sender_id', myId)
      .is('read_at', null)
    return count || 0
  } catch { return 0 }
}

export function subscribeToMessages(
  conversationId: string,
  onMessage: (msg: Message) => void
) {
  const supabase = createClient()
  const channel = supabase
    .channel('messages:' + conversationId)
    .on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'messages', filter: 'conversation_id=eq.' + conversationId },
      (payload) => onMessage(mapMessage(payload.new))
    )
    .subscribe()
  return () => { supabase.removeChannel(channel) }
}

export function subscribeToConversations(
  myId: string,
  onUpdate: () => void
) {
  const supabase = createClient()
  const channel = supabase
    .channel('conversations:' + myId)
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'conversations' },
      onUpdate
    )
    .subscribe()
  return () => { supabase.removeChannel(channel) }
}
