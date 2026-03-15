import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
  try {
    const { email, tier = 'mystic', note = '' } = await req.json()

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    // Find user by email in auth.users
    const { data: users, error: userError } = await supabase.auth.admin.listUsers()
    if (userError) throw userError

    const user = users.users.find((u: any) => u.email?.toLowerCase() === email.toLowerCase())
    if (!user) {
      return NextResponse.json({ error: `No user found with email: ${email}` }, { status: 404 })
    }

    // Update their profile subscription_tier
    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        subscription_tier: tier,
        updated_at: new Date().toISOString()
      })
      .eq('id', user.id)

    if (updateError) throw updateError

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
  try {
    const { email } = await req.json()
    if (!email) return NextResponse.json({ error: 'Email required' }, { status: 400 })

    const { data: users, error: userError } = await supabase.auth.admin.listUsers()
    if (userError) throw userError

    const user = users.users.find((u: any) => u.email?.toLowerCase() === email.toLowerCase())
    if (!user) return NextResponse.json({ error: `No user found: ${email}` }, { status: 404 })

    const { error } = await supabase
      .from('profiles')
      .update({ subscription_tier: 'free', updated_at: new Date().toISOString() })
      .eq('id', user.id)

    if (error) throw error

    return NextResponse.json({ success: true, message: `Access revoked for ${email}` })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
