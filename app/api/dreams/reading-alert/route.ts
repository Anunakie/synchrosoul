import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import webpush from 'web-push';

export const runtime = 'nodejs';

// Oracle-branded nudge telling a FREE user that a deeper, personalized reading
// is waiting in a paid tier after they log a dream or number.
//   - in-app entry: notifications table (read by NotificationBell)
//   - web-push: push_subscriptions + web-push (same pattern as soul-twin-alert)
// Web-push only fires when VAPID keys + a stored subscription exist; otherwise
// the in-app entry still lands and the route succeeds gracefully.
//
// Throttle (per user, per kind): fire on the 1st log, the 3rd log, then every
// 3rd log after that (logs #1, #3, #6, #9, #12 ...). Counting is server-side so
// it stays consistent across all of a user's devices.

let vapidConfigured = false;
function tryConfigureVapid(): boolean {
  if (vapidConfigured) return true;
  const pub = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  const priv = process.env.VAPID_PRIVATE_KEY;
  if (!pub || !priv) return false;
  webpush.setVapidDetails(
    process.env.VAPID_EMAIL || 'mailto:hello@synchrosoul.app',
    pub,
    priv
  );
  vapidConfigured = true;
  return true;
}

// 1st, 3rd, then every 3rd from then on => #1, #3, #6, #9 ...
function shouldNotify(count: number): boolean {
  if (count <= 0) return true; // fail-open if count is unknown
  if (count === 1) return true;
  return count >= 3 && count % 3 === 0;
}

export async function POST(request: Request) {
  try {
    const { userId, kind, label } = await request.json();

    if (!userId) {
      return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
    }

    const source = kind === 'number' ? 'number' : 'dream';

    const serviceClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // ── Throttle: count this user's logs of this kind (current one included) ──
    // Fail-open: if the count query errors, we still send the nudge.
    let logCount = 0;
    try {
      const table = source === 'number' ? 'angel_logs' : 'dreams';
      const { count } = await serviceClient
        .from(table)
        .select('id', { count: 'exact', head: true })
        .eq('user_id', userId);
      logCount = count ?? 0;
    } catch {
      logCount = 0; // unknown -> fail-open
    }

    if (!shouldNotify(logCount)) {
      return NextResponse.json({ success: true, throttled: true, count: logCount });
    }

    const title = 'A deeper Oracle reading is waiting \u2728';
    const body = source === 'number'
      ? `The Oracle sensed something deeper in your number${label ? ` ${label}` : ''}. Unlock your full personalized reading \uD83D\uDD2E`
      : 'A deeper Oracle reading is waiting for your dream from last night \uD83C\uDF19';

    // ── In-app notification entry (read by NotificationBell) ──
    const { error: insertError } = await serviceClient
      .from('notifications')
      .insert({
        user_id: userId,
        type: 'oracle',
        title,
        body,
        read: false,
        color: '#c9a84c',
        emoji: '\uD83D\uDD2E',
        url: '/dashboard/upgrade',
        created_at: new Date().toISOString(),
      });

    if (insertError) {
      console.error('Dream reading-alert notification insert error:', insertError);
    }

    // ── Web-push (best-effort; needs VAPID keys + a stored subscription) ──
    let pushed = 0;
    if (tryConfigureVapid()) {
      const { data: pushSubs } = await serviceClient
        .from('push_subscriptions')
        .select('user_id, subscription')
        .eq('user_id', userId);

      if (pushSubs && pushSubs.length > 0) {
        const payload = JSON.stringify({
          title,
          body,
          icon: '/icon-192.png',
          badge: '/icon-192.png',
          tag: 'oracle-reading-' + source,
          url: '/dashboard/upgrade',
          vibrate: [200, 100, 200],
        });
        const pushPromises = pushSubs.map(async (row: { user_id: string; subscription: string }) => {
          try {
            const sub = JSON.parse(row.subscription);
            await webpush.sendNotification(sub, payload);
            pushed++;
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
    }

    return NextResponse.json({ success: !insertError, pushed, count: logCount });
  } catch (err) {
    console.error('Dream reading-alert error:', err);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
