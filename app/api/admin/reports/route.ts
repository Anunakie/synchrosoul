import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('reports')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100);

    if (error) {
      // Table may not exist yet
      console.error('Reports fetch error:', error);
      return NextResponse.json({ reports: [], error: error.message });
    }

    return NextResponse.json({ reports: data || [] });
  } catch (err) {
    console.error('Admin reports GET error:', err);
    return NextResponse.json({ reports: [], error: 'Failed to fetch reports' });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { id, status, admin_notes } = await req.json();

    if (!id || !status) {
      return NextResponse.json({ error: 'Missing id or status' }, { status: 400 });
    }

    const updateData: Record<string, string> = { status };
    if (admin_notes) updateData.admin_notes = admin_notes;

    const { error } = await supabaseAdmin
      .from('reports')
      .update(updateData)
      .eq('id', id);

    if (error) {
      console.error('Report update error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Admin reports PATCH error:', err);
    return NextResponse.json({ error: 'Failed to update report' }, { status: 500 });
  }
}
