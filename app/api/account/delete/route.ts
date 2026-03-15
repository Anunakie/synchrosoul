import { createClient } from '@/lib/supabase/server'
import { createClient as createAdminClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function POST() {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const userId = user.id

    // Use service role to delete all user data
    const adminClient = createAdminClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Delete all user data from all tables
    await adminClient.from('messages').delete().eq('sender_id', userId)
    await adminClient.from('posts').delete().eq('user_id', userId)
    await adminClient.from('angel_logs').delete().eq('user_id', userId)
    await adminClient.from('dreams').delete().eq('user_id', userId)
    await adminClient.from('notifications').delete().eq('user_id', userId)
    await adminClient.from('push_subscriptions').delete().eq('user_id', userId)
    await adminClient.from('referrals').delete().eq('referred_id', userId)
    await adminClient.from('referrals').delete().eq('referrer_id', userId)
    await adminClient.from('healer_bookings').delete().eq('user_id', userId)
    await adminClient.from('healers').delete().eq('user_id', userId)
    await adminClient.from('profiles').delete().eq('id', userId)

    // Delete the auth user (must be last)
    const { error: deleteError } = await adminClient.auth.admin.deleteUser(userId)
    if (deleteError) {
      console.error('Error deleting auth user:', deleteError)
      return NextResponse.json({ error: 'Failed to delete account' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err: any) {
    console.error('Account deletion error:', err)
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 })
  }
}
