import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const serviceClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const { healerId, verified, notes } = await req.json();

    if (!healerId) {
      return NextResponse.json({ error: 'healerId required' }, { status: 400 });
    }

    const updateData: Record<string, unknown> = {
      verified: !!verified,
      updated_at: new Date().toISOString(),
    };

    if (notes !== undefined) {
      updateData.verification_notes = notes;
    }

    // Bump truth score when verified
    if (verified) {
      const { data: current } = await serviceClient
        .from('healers')
        .select('truth_score')
        .eq('id', healerId)
        .single();
      updateData.truth_score = Math.min((current?.truth_score || 40) + 10, 100);
    }

    const { data, error } = await serviceClient
      .from('healers')
      .update(updateData)
      .eq('id', healerId)
      .select('id, name, verified, truth_score')
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, healer: data });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
