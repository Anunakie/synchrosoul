import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin-auth'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function findUserByEmail(email: string) {
  // listUsers is paginated - loop through all pages to find the user
  let page = 1
  const perPage = 1000
  while (true) {
    const { data, error } = await supabase.auth.admin.listUsers({ page, perPage })
    if (error) throw error
    const user = data.users.find((u: any) => u.email?.toLowerCase() === email.toLowerCase())
    if (user) return user
    // If we got fewer results than perPage, we've reached the end
    if (data.users.length < perPage) return null
    page++
  }
}

export async function POST(req: NextRequest) {
  const auth = await requireAdmin(req);
  if ('error' in auth) return auth.error;
  try {
    const { email, tier = 'mystic', note = '' } = await req.json()

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    const user = await findUserByEmail(email)
    if (!user) {
      return NextResponse.json({ error: `No user found with email: ${email}` }, { status: 404 })
    }

    // Update their profile subscription_tier
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ subscription_tier: tier })
      .eq('id', user.id)

    if (updateError) throw updateError

    // Mark user as beta_granted in auth user_metadata so we can filter them
    const { error: metaError } = await supabase.auth.admin.updateUserById(user.id, {
      user_metadata: {
        ...user.user_metadata,
        beta_granted: true,
        beta_tier: tier,
        beta_note: note,
        beta_granted_at: new Date().toISOString()
      }
    })
    if (metaError) throw metaError

    console.log(`[BETA ACCESS] Granted ${tier} to ${email} (${user.id}) - Note: ${note}`)

    return NextResponse.json({
      success: true,
      message: `${tier} access granted to ${email}`,
      userId: user.id,
      displayName: user.user_metadata?.display_name || email
    })
  } catch (err: any) {
    console.error('Grant access error:', err)
    return NextResponse.json({ error: err.message || 'Failed to grant access' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  const auth = await requireAdmin(req);
  if ('error' in auth) return auth.error;
  try {
    const { email } = await req.json()
    if (!email) return NextResponse.json({ error: 'Email required' }, { status: 400 })

    const user = await findUserByEmail(email)
    if (!user) {
      return NextResponse.json({ error: `No user found: ${email}` }, { status: 404 })
    }

    // Revoke subscription tier
    const { error } = await supabase
      .from('profiles')
      .update({ subscription_tier: 'free' })
      .eq('id', user.id)

    if (error) throw error

    // Remove beta_granted flag from user_metadata
    const { error: metaError } = await supabase.auth.admin.updateUserById(user.id, {
      user_metadata: {
        ...user.user_metadata,
        beta_granted: false,
        beta_tier: null,
        beta_note: null
      }
    })
    if (metaError) throw metaError

    return NextResponse.json({ success: true, message: `Access revoked for ${email}` })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
