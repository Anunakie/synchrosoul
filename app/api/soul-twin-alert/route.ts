import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import webpush from 'web-push';
import { sendSoulTwinAlertEmail } from '@/lib/email';

export const runtime = 'nodejs';

webpush.setVapidDetails(
  process.env.VAPID_EMAIL || 'mailto:hello@synchrosoul.app',
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
);

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

    // Create in-app notifications
    const notifications = uniqueUserIds.map((matchUserId: string) => ({
      user_id: matchUserId,
      type: 'soul_twin',
      title: 'Soul Twin Alert! ✨',
      message: `Someone just saw ${number} at the same time as you! You may be cosmically connected.`,
      read: false,
      created_at: new Date().toISOString(),
    }));

    notifications.push({
      user_id: userId,
      type: 'soul_twin',
      title: 'Soul Twin Alert! ✨',
      message: `${uniqueUserIds.length} other soul${uniqueUserIds.length > 1 ? 's' : '' } just saw ${number} at the same time as you!`,
      read: false,
      created_at: new Date().toISOString(),
    });

    await serviceClient.from('notifications').insert(notifications);

    // Fetch all target user IDs (matched + current user)
    const allTargetIds = [...uniqueUserIds, userId];

    // ── Push Notifications ──────────────────────────────────────────────────
    const { data: pushSubs } = await serviceClient
      .from('push_subscriptions')
      .select('user_id, subscription')
      .in('user_id', allTargetIds);

    if (pushSubs && pushSubs.length > 0) {
      const pushPromises = pushSubs.map(async (row: { user_id: string; subscription: string }) => {
        try {
          const sub = JSON.parse(row.subscription);
          const isCurrentUser = row.user_id === userId;
          const payload = JSON.stringify({
            title: '✨ Soul Twin Alert!',
            body: isCurrentUser
              ? `${uniqueUserIds.length} soul${uniqueUserIds.length > 1 ? 's' : '' } just saw ${number} at the same time as you!`
              : `Someone just saw ${number} at the same time as you! You may be cosmically connected.`,
            icon: '/icon-192.png',
            badge: '/icon-192.png',
            tag: 'soul-twin-' + number,
            url: '/dashboard/sync',
            number,
            vibrate: [200, 100, 200, 100, 200],
          });
          await webpush.sendNotification(sub, payload);
        } catch (pushErr: unknown) {
          const err = pushErr as { statusCode?: number };
          if (err.statusCode === 410 || err.statusCode === 404) {
            await serviceClient
              .from('push_subscriptions')
              .delete()
              .eq('user_id', row.user_id);
          }
        }
      });
      await Promise.allSettled(pushPromises);
    }

    // ── Email Notifications ─────────────────────────────────────────────────
    // Fetch profiles with email preferences for all target users
    const { data: profiles } = await serviceClient
      .from('profiles')
      .select('id, email_sync')
      .in('id', allTargetIds)
      .eq('email_sync', true);

    if (profiles && profiles.length > 0) {
      const profileIds = profiles.map((p: { id: string }) => p.id);

      // Get emails from auth.users via admin API
      const emailPromises = profileIds.map(async (uid: string) => {
        try {
          const { data: userData } = await serviceClient.auth.admin.getUserById(uid);
          if (!userData?.user?.email) return;

          const email = userData.user.email;
          const name = userData.user.user_metadata?.name ||
                       userData.user.user_metadata?.full_name ||
                       email.split('@')[0];
          const isCurrentUser = uid === userId;
          const matchCount = isCurrentUser ? uniqueUserIds.length : 1;

          await sendSoulTwinAlertEmail({
            to: email,
            name,
            sharedNumber: number,
            matchCount,
          });
        } catch (emailErr) {
          console.error('Failed to send soul twin email to', uid, emailErr);
        }
      });

      await Promise.allSettled(emailPromises);
    }

    return NextResponse.json({
      matches: uniqueUserIds.length,
      pushed: pushSubs?.length || 0,
      emailed: profiles?.length || 0,
    });
  } catch (err) {
    console.error('Soul twin alert error:', err);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
