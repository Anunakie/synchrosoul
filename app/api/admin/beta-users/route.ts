import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin-auth'
import { createClient } from '@supabase/supabase-js'

const adminClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
)

// GET - list all beta users (non-free tier)
export async function GET(req: NextRequest) {
  const authResult = await requireAdmin(req)
  if ('error' in authResult) return authResult.error

  try {
    // Step 1: Get all profiles with non-free subscription tier
    const { data: profiles, error: profilesError } = await adminClient
      .from('profiles')
      .select('id, display_name, subscription_tier, created_at')
      .neq('subscription_tier', 'free')
      .order('created_at', { ascending: false })

    if (profilesError) throw profilesError
    if (!profiles || profiles.length === 0) {
      return NextResponse.json({ success: true, users: [] })
    }

    // Step 2: Get emails from auth.users for these profile IDs
    const { data: authData, error: authError } = await adminClient.auth.admin.listUsers({
      perPage: 1000
    })
    if (authError) throw authError

    // Step 3: Build a map of id -> email
    const emailMap: Record<string, string> = {}
    for (const u of authData.users) {
      emailMap[u.id] = u.email || ''
    }

    // Step 4: Merge profiles with emails
    const users = profiles.map(p => ({
      id: p.id,
      display_name: p.display_name || 'Unnamed',
      email: emailMap[p.id] || '(no email)',
      subscription_tier: p.subscription_tier,
      created_at: p.created_at
    }))

    return NextResponse.json({ success: true, users })
  } catch (e: any) {
    console.error('beta-users GET error:', e)
    return NextResponse.json({ success: false, error: e.message }, { status: 500 })
  }
}

// POST - toggle beta access for a user
export async function POST(req: NextRequest) {
  const authResult = await requireAdmin(req)
  if ('error' in authResult) return authResult.error

  try {
    const { userId, action, tier } = await req.json()
    if (!userId || !action) {
      return NextResponse.json({ success: false, error: 'userId and action required' }, { status: 400 })
    }

    const newTier = action === 'revoke' ? 'free' : (tier || 'mystic')

    const { error } = await adminClient
      .from('profiles')
      .update({ subscription_tier: newTier })
      .eq('id', userId)

    if (error) throw error

    return NextResponse.json({
      success: true,
      message: action === 'revoke' ? 'Beta access revoked' : `Beta access granted (${newTier})`
    })
  } catch (e: any) {
    console.error('beta-users POST error:', e)
    return NextResponse.json({ success: false, error: e.message }, { status: 500 })
  }
}

// DELETE - bulk revoke for selected user IDs
export async function DELETE(req: NextRequest) {
  const authResult = await requireAdmin(req)
  if ('error' in authResult) return authResult.error

  try {
    const { userIds } = await req.json()
    if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
      return NextResponse.json({ success: false, error: 'userIds array required' }, { status: 400 })
    }

    const { error } = await adminClient
      .from('profiles')
      .update({ subscription_tier: 'free' })
      .in('id', userIds)

    if (error) throw error

    return NextResponse.json({ success: true, message: `Revoked access for ${userIds.length} user(s)` })
  } catch (e: any) {
    console.error('beta-users DELETE error:', e)
    return NextResponse.json({ success: false, error: e.message }, { status: 500 })
  }
}
