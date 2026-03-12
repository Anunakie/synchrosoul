import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(req: NextRequest) {
  try {
    const { referralCode, referredUserId, referredEmail, referredName } = await req.json()
    if (!referralCode || !referredUserId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const supabase = await createClient()

    // Find referrer by code
    const { data: referrer } = await supabase
      .from("profiles")
      .select("id, display_name")
      .eq("referral_code", referralCode)
      .single()

    if (!referrer) {
      return NextResponse.json({ error: "Invalid referral code" }, { status: 404 })
    }

    if (referrer.id === referredUserId) {
      return NextResponse.json({ error: "Cannot refer yourself" }, { status: 400 })
    }

    // Check if referral already exists
    const { data: existing } = await supabase
      .from("referrals")
      .select("id")
      .eq("referred_user_id", referredUserId)
      .single()

    if (existing) {
      return NextResponse.json({ message: "Referral already tracked" })
    }

    // Insert referral record
    const { error } = await supabase
      .from("referrals")
      .insert({
        referrer_id: referrer.id,
        referred_user_id: referredUserId,
        referred_email: referredEmail || "",
        referred_name: referredName || "Starseed",
        referral_code: referralCode,
        status: "signed_up",
        commission_rate: 0.25,
      })

    if (error) {
      console.error("Referral insert error:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("Referral track error:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
