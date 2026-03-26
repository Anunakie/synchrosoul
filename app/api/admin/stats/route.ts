import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin-auth'
import { createClient } from '@supabase/supabase-js'

const serviceClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
)

export async function GET(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (auth) return auth;

  try {
    // Total users
    const { data: allUsersData } = await serviceClient.auth.admin.listUsers({ perPage: 1000 })
    const totalUsers = allUsersData?.users?.length ?? 0

    // Subscription breakdown from profiles
    const { data: profiles } = await serviceClient
      .from('profiles')
      .select('id, display_name, subscription_tier, created_at');

    const tierCounts: Record<string, number> = { free: 0, mystic: 0, 'twin-flame': 0 }
    profiles?.forEach((p: { subscription_tier?: string }) => {
      const tier = (p.subscription_tier || 'free');
      tierCounts[tier] = (tierCounts[tier] || 0) + 1;
    });

    // Build a map of userId -> subscription_tier from profiles
    const profileTierMap: Record<string, string> = {}
    profiles?.forEach((p: any) => {
      profileTierMap[p.id] = p.subscription_tier || 'free'
    })

    // Recent 10 signups with email + tier
    const { data: recentUsersRaw } = await serviceClient.auth.admin.listUsers({ perPage: 1000 })
    const sortedUsers = (recentUsersRaw?.users ?? [])
      .sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 10)

    const recentSignups = sortedUsers.map((u: any) => ({
      id: u.id,
      email: u.email,
      created_at: u.created_at,
      display_name: u.user_metadata?.display_name || u.user_metadata?.full_name || null,
      subscription_tier: (profileTierMap[u.id] && profileTierMap[u.id] !== 'free') ? profileTierMap[u.id] : (u.user_metadata?.beta_tier || profileTierMap[u.id] || 'free')
    }))

    const { data: recentLogs } = await serviceClient
      .from('angel_logs')
      .select('id, number, created_at')
      .order('created_at', { ascending: false })
      .limit(10)

    const { count: totalLogs } = await serviceClient
      .from('angel_logs')
      .select('id', { count: 'exact', head: true })

    const { count: totalPosts } = await serviceClient
      .from('posts')
      .select('id', { count: 'exact', head: true })

    return NextResponse.json({
      totalUsers,
      tierCounts,
      totalLogs: totalLogs ?? 0,
      totalPosts: totalPosts ?? 0,
      recentSignups,
      recentLogs: recentLogs ?? [],
    })
  } catch (err: any) {
    console.error('Admin stats error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
