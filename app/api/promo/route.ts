import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const runtime = 'nodejs'

// Valid promo codes and their grants
const PROMO_CODES: Record<string, { tier: string; durationDays: number; name: string }> = {
  'SYNCHROBETA': { tier: 'twin-flame', durationDays: 30, name: 'Beta Tester' },
  'SYNCHROMYSTIC': { tier: 'mystic', durationDays: 30, name: 'Mystic Trial' },
}

export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json()

    if (!code || typeof code !== 'string') {
      return NextResponse.json({ error: 'Please enter a promo code' }, { status: 400 })
    }

    const normalizedCode = code.trim().toUpperCase()
    const promo = PROMO_CODES[normalizedCode]

    if (!promo) {
      return NextResponse.json({ error: 'Invalid promo code' }, { status: 400 })
    }

    // Get auth token from request
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const token = authHeader.replace('Bearer ', '')
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { global: { headers: { Authorization: `Bearer ${token}` } } }
    )

    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    if (authError || !user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    // Calculate expiry
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + promo.durationDays)

    // Update user's subscription tier
    const adminSupabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
    )

    const { error: updateError } = await adminSupabase
      .from('profiles')
      .update({
        subscription_tier: promo.tier,
        subscription_status: 'active',
        subscription_period_end: expiresAt.toISOString(),
        promo_code_used: normalizedCode,
      })
      .eq('id', user.id)

    if (updateError) {
      console.error('Promo update error:', updateError)
      return NextResponse.json({ error: 'Failed to apply promo code' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      tier: promo.tier,
      name: promo.name,
      expiresAt: expiresAt.toISOString(),
      message: `✨ ${promo.name} activated! You now have ${promo.tier === 'twin-flame' ? 'Twin Flame' : 'Mystic'} access for ${promo.durationDays} days.`
    })

  } catch (error) {
    console.error('Promo code error:', error)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}
