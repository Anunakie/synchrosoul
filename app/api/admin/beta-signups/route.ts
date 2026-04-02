import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { requireAdmin } from '@/lib/admin-auth'

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export async function GET(req: NextRequest) {
  const authError = await requireAdmin(req)
  if (authError) return authError

  const { searchParams } = new URL(req.url)
  const status = searchParams.get('status') || 'all'

  let query = getSupabase()
    .from('beta_signups')
    .select('*')
    .order('created_at', { ascending: false })

  if (status !== 'all') {
    query = query.eq('status', status)
  }

  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ signups: data || [], total: data?.length || 0 })
}

export async function PATCH(req: NextRequest) {
  const authError = await requireAdmin(req)
  if (authError) return authError


  const { id, status, notes } = await req.json()
  if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 })

  const updateData: Record<string, string> = { status }
  if (notes !== undefined) updateData.notes = notes

  const { data, error } = await getSupabase()
    .from('beta_signups')
    .update(updateData)
    .eq('id', id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true, signup: data })
}

export async function DELETE(req: NextRequest) {
  const authError = await requireAdmin(req)
  if (authError) return authError

  const { id } = await req.json()
  if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 })

  const { error } = await getSupabase().from('beta_signups').delete().eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
