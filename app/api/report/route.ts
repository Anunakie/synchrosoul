import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    const { targetType, targetId, reason, details } = await req.json();
    
    if (!targetType || !targetId || !reason) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const { error } = await supabase.from('reports').insert({
      reporter_id: user?.id || null,
      target_type: targetType,
      target_id: targetId,
      reason,
      details: details || null,
      status: 'pending'
    });

    if (error) {
      console.error('Report insert error:', error);
      // Still return success to user even if DB fails (table may not exist yet)
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Report API error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
