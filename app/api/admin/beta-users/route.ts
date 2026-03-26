import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin-auth'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (auth) return auth;

  try {
    // Get ALL users from auth
    const { data: usersData, error } = await supabase.auth.admin.listUsers({ perPage: 1000 })
    if (error) throw error

    // Filter ONLY users who were manually granted beta access by admin
    const betaUsers = usersData.users
      .filter((u: any) => u.user_metadata?.beta_granted === true)
      .map((u: any) => ({
        id: u.id,
        email: u.email || '',
        display_name: u.user_metadata?.display_name || u.user_metadata?.full_name || u.email?.split('@')[0] || 'Unknown',
        subscription_tier: u.user_metadata?.beta_tier || 'mystic',
        beta_note: u.user_metadata?.beta_note || '',
        beta_granted_at: u.user_metadata?.beta_granted_at || u.created_at,
        created_at: u.created_at
      }))

    return NextResponse.json({ users: betaUsers })
  } catch (err: any) {
    console.error('Beta users error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (auth) return auth;

  try {
    const body = await req.json()

    // Handle single-user toggle (userId + action) from toggle button
    if (body.userId && body.action) {
      const { userId, action, tier = 'twin-flame' } = body
      const { data: userData } = await supabase.auth.admin.getUserById(userId)
      if (!userData?.user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

      if (action === 'revoke') {
        // Revoke beta access
        await supabase.from('profiles').update({ subscription_tier: 'free' }).eq('id', userId)
        await supabase.auth.admin.updateUserById(userId, {
          user_metadata: {
            ...userData.user.user_metadata,
            beta_granted: false,
            beta_tier: null,
            beta_note: null
          }
        })
        return NextResponse.json({ success: true, action: 'revoked' })
      } else {
        // Grant beta access
        await supabase.from('profiles').update({ subscription_tier: tier }).eq('id', userId)
        await supabase.auth.admin.updateUserById(userId, {
          user_metadata: {
            ...userData.user.user_metadata,
            beta_granted: true,
            beta_tier: tier,
            beta_granted_at: new Date().toISOString()
          }
        })
        return NextResponse.json({ success: true, action: 'granted' })
      }
    }

    // Handle bulk grant (userIds array) from grant-access form
    const { userIds, tier } = body
    if (!userIds?.length) return NextResponse.json({ error: 'No users specified' }, { status: 400 })

    const results = []
    for (const userId of userIds) {
      const { data: userData } = await supabase.auth.admin.getUserById(userId)
      if (!userData?.user) continue

      await supabase.from('profiles').update({ subscription_tier: tier }).eq('id', userId)
      await supabase.auth.admin.updateUserById(userId, {
        user_metadata: {
          ...userData.user.user_metadata,
          beta_granted: true,
          beta_tier: tier,
          beta_granted_at: new Date().toISOString()
        }
      })
      results.push(userId)
    }

    return NextResponse.json({ success: true, updated: results.length })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (auth) return auth;

  try {
    const { userIds } = await req.json()
    if (!userIds?.length) return NextResponse.json({ error: 'No users specified' }, { status: 400 })

    for (const userId of userIds) {
      const { data: userData } = await supabase.auth.admin.getUserById(userId)
      if (!userData?.user) continue

      await supabase.from('profiles').update({ subscription_tier: 'free' }).eq('id', userId)
      await supabase.auth.admin.updateUserById(userId, {
        user_metadata: {
          ...userData.user.user_metadata,
          beta_granted: false,
          beta_tier: null,
          beta_note: null
        }
      })
    }

    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
