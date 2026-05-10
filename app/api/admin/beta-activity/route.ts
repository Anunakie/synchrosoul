import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin-auth'
import { createClient } from '@supabase/supabase-js'

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export async function GET(req: NextRequest) {
  const auth = await requireAdmin(req)
  if (auth) return auth

  const supabaseAdmin = getSupabase()

  try {
    // Get all users with profiles
    const { data: users } = await supabaseAdmin
      .from('profiles')
      .select('id, display_name, subscription_tier, created_at, avatar_url')
      .order('created_at', { ascending: false })

    if (!users) return NextResponse.json({ activity: [] })

    // Get auth emails
    const { data: authUsers } = await supabaseAdmin.auth.admin.listUsers()
    const emailMap: Record<string, string> = {}
    authUsers?.users?.forEach(u => { if (u.email) emailMap[u.id] = u.email })

    // Filter out the admin user
    const adminEmail = 'dezekiel@live.com'
    const nonAdminUsers = users.filter(u => (emailMap[u.id] || '').toLowerCase() !== adminEmail)

    // Get activity counts for each user
    const activity = await Promise.all(nonAdminUsers.map(async (profile) => {
      // Angel logs count and last log
      const { count: angelLogCount } = await supabaseAdmin
        .from('angel_logs')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', profile.id)

      const { data: lastLog } = await supabaseAdmin
        .from('angel_logs')
        .select('number, created_at, thought')
        .eq('user_id', profile.id)
        .order('created_at', { ascending: false })
        .limit(1)

      // Posts count
      const { count: postCount } = await supabaseAdmin
        .from('posts')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', profile.id)

      // Dreams count - try dreams table, gracefully handle if it doesn't exist
      let dreamCount = 0
      try {
        const { count } = await supabaseAdmin
          .from('dreams')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', profile.id)
        dreamCount = count || 0
      } catch {
        // dreams table might not exist
      }

      // Recent angel logs (last 5)
      const { data: recentLogs } = await supabaseAdmin
        .from('angel_logs')
        .select('number, created_at, thought')
        .eq('user_id', profile.id)
        .order('created_at', { ascending: false })
        .limit(5)

      return {
        id: profile.id,
        email: emailMap[profile.id] || 'unknown',
        display_name: profile.display_name,
        subscription_tier: profile.subscription_tier || 'free',
        signed_up: profile.created_at,
        avatar_url: profile.avatar_url,
        angel_logs: angelLogCount || 0,
        posts: postCount || 0,
        dreams: dreamCount,
        last_activity: lastLog?.[0]?.created_at || null,
        last_number: lastLog?.[0]?.number || null,
        last_thought: lastLog?.[0]?.thought || null,
        recent_logs: recentLogs || [],
      }
    }))

    // Sort by last activity (most recent first), then by signup date
    activity.sort((a, b) => {
      if (a.last_activity && b.last_activity) return new Date(b.last_activity).getTime() - new Date(a.last_activity).getTime()
      if (a.last_activity) return -1
      if (b.last_activity) return 1
      return new Date(b.signed_up).getTime() - new Date(a.signed_up).getTime()
    })

    return NextResponse.json({ activity })
  } catch (err: any) {
    console.error('Beta activity error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
