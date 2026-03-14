
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const {
      name, title, bio, city, state, country, modalities, angelNumbers,
      lifePathNumber, photo, website, email, phone, instagram, sessionTypes,
      priceRange, truthScore
    } = body;

    const location = [city, state, country].filter(Boolean).join(', ');

    // Check if healer profile already exists for this user
    const { data: existing } = await supabase
      .from('healers')
      .select('id')
      .eq('user_id', user.id)
      .single();

    let result;
    if (existing) {
      // Update existing
      result = await supabase
        .from('healers')
        .update({
          name, title, bio, city, state, country, location,
          modalities, angel_numbers: angelNumbers,
          life_path_number: lifePathNumber,
          photo, website, email, phone, instagram,
          session_types: sessionTypes, price_range: priceRange,
          truth_score: truthScore,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', user.id)
        .select()
        .single();
    } else {
      // Insert new
      result = await supabase
        .from('healers')
        .insert({
          user_id: user.id,
          name, title, bio, city, state, country, location,
          modalities, angel_numbers: angelNumbers,
          life_path_number: lifePathNumber,
          photo, website, email, phone, instagram,
          session_types: sessionTypes, price_range: priceRange,
          truth_score: truthScore,
          verified: false,
        })
        .select()
        .single();
    }

    if (result.error) {
      console.error('Healer save error:', result.error);
      return NextResponse.json({ error: result.error.message }, { status: 500 });
    }

    return NextResponse.json({ healer: result.data });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { data: healer, error } = await supabase
      .from('healers')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (error || !healer) return NextResponse.json({ healer: null });
    return NextResponse.json({ healer });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
