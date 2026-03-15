import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { blockedUserId, action } = await req.json();
    if (!blockedUserId) return NextResponse.json({ error: 'Missing blockedUserId' }, { status: 400 });

    if (action === 'unblock') {
      await supabase.from('blocked_users').delete()
        .eq('blocker_id', user.id).eq('blocked_id', blockedUserId);
      return NextResponse.json({ success: true, action: 'unblocked' });
    }

    // Block
    const { error } = await supabase.from('blocked_users').upsert({
      blocker_id: user.id,
      blocked_id: blockedUserId
    }, { onConflict: 'blocker_id,blocked_id' });

    if (error) console.error('Block error:', error);
    return NextResponse.json({ success: true, action: 'blocked' });
  } catch (err) {
    console.error('Block API error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ blocked: [] });

    const { data } = await supabase.from('blocked_users')
      .select('blocked_id').eq('blocker_id', user.id);

    return NextResponse.json({ blocked: (data || []).map((r: any) => r.blocked_id) });
  } catch {
    return NextResponse.json({ blocked: [] });
  }
}
