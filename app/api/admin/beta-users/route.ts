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
  if ("error" in authResult) return authResult.error

  try {
    const { data, error } = await adminClient
      .from('profiles')
      .select('id, email, display_name, subscription_tier, created_at')
      .neq('subscription_tier', 'free')
      .order('created_at', { ascending: false })

    if (error) throw error

    return NextResponse.json({ success: true, users: data || [] })
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 })
  }
}

// POST - toggle beta access for a user
export async function POST(req: NextRequest) {
  const authResult = await requireAdmin(req)
  if ("error" in authResult) return authResult.error

  try {
    const { userId, action, tier } = await req.json()
    // action: 'grant' | 'revoke'
    // tier: 'mystic' | 'twin_flame' (only needed for grant)

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
    return NextResponse.json({ success: false, error: e.message }, { status: 500 })
  }
}

// DELETE - bulk revoke for selected user IDs
export async function DELETE(req: NextRequest) {
  const authResult = await requireAdmin(req)
  if ("error" in authResult) return authResult.error

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
    return NextResponse.json({ success: false, error: e.message }, { status: 500 })
  }
}
