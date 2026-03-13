import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  const serviceClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  try {
    // Total angel logs
    const { count: totalLogs } = await serviceClient
      .from('angel_logs')
      .select('*', { count: 'exact', head: true });

    // Total posts
    const { count: totalPosts } = await serviceClient
      .from('posts')
      .select('*', { count: 'exact', head: true });

    // Subscription breakdown from profiles
    const { data: profiles } = await serviceClient
      .from('profiles')
      .select('id, display_name, subscription_tier, created_at');

    const totalUsers = profiles?.length ?? 0;
    const subBreakdown = { free: 0, mystic: 0, twin_flame: 0 };
    profiles?.forEach((p: { subscription_tier?: string }) => {
      const tier = (p.subscription_tier || 'free') as keyof typeof subBreakdown;
      if (tier in subBreakdown) subBreakdown[tier]++;
      else subBreakdown.free++;
    });
    const payingSubscribers = subBreakdown.mystic + subBreakdown.twin_flame;

    // Recent 10 signups with email
    const { data: recentUsersRaw } = await serviceClient.auth.admin.listUsers({ perPage: 10 });
    const recentSignups = (recentUsersRaw?.users ?? []).map((u) => ({
      email: u.email,
      created_at: u.created_at,
    }));

    // Recent 10 angel logs
    const { data: recentLogs } = await serviceClient
      .from('angel_logs')
      .select('number, created_at, user_id')
      .order('created_at', { ascending: false })
      .limit(10);

    return NextResponse.json({
      totalUsers,
      totalLogs: totalLogs ?? 0,
      totalPosts: totalPosts ?? 0,
      payingSubscribers,
      subBreakdown,
      recentSignups,
      recentLogs: recentLogs ?? [],
    });
  } catch (err) {
    console.error('Admin stats error:', err);
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}
