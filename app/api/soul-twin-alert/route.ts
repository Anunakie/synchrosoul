import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    const { number, userId } = await request.json();

    if (!number || !userId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const serviceClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Find others who logged the same number in the last 30 minutes
    const thirtyMinsAgo = new Date(Date.now() - 30 * 60 * 1000).toISOString();

    const { data: matches } = await serviceClient
      .from('angel_logs')
      .select('user_id, created_at')
      .eq('number', number)
      .neq('user_id', userId)
      .gte('created_at', thirtyMinsAgo);

    if (!matches || matches.length === 0) {
      return NextResponse.json({ matches: 0 });
    }

    // Deduplicate by user_id
    const uniqueUserIds = [...new Set(matches.map((m: { user_id: string }) => m.user_id))];

    // Create notifications for each matched user
    const notifications = uniqueUserIds.map((matchUserId: string) => ({
      user_id: matchUserId,
      type: 'soul_twin',
      title: 'Soul Twin Alert! ✨',
      message: `Someone just saw ${number} at the same time as you! You may be cosmically connected.`,
      read: false,
      created_at: new Date().toISOString(),
    }));

    // Also create notification for the current user if there are matches
    notifications.push({
      user_id: userId,
      type: 'soul_twin',
      title: 'Soul Twin Alert! ✨',
      message: `${uniqueUserIds.length} other soul${uniqueUserIds.length > 1 ? 's' : ''} just saw ${number} at the same time as you!`,
      read: false,
      created_at: new Date().toISOString(),
    });

    await serviceClient.from('notifications').insert(notifications);

    return NextResponse.json({ matches: uniqueUserIds.length });
  } catch (err) {
    console.error('Soul twin alert error:', err);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
