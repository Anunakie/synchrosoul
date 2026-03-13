
import { NextResponse } from "next/server";
import { sendMatchAlertEmail } from "@/lib/email";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json({ error: "Email not configured" }, { status: 503 });
    }
    const { targetUserId, matchName, sharedNumber, syncScore } = await request.json();
    if (!targetUserId || !sharedNumber) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const supabase = await createClient();

    // Get target user email and name from auth
    const { data: { user } } = await supabase.auth.admin
      ? { data: { user: null } }
      : { data: { user: null } };

    // Use service role to get user email
    const { createClient: createServiceClient } = await import("@supabase/supabase-js");
    const serviceClient = createServiceClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const { data: targetUser } = await serviceClient.auth.admin.getUserById(targetUserId);
    if (!targetUser?.user?.email) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get display name from profile
    const { data: profile } = await serviceClient
      .from("profiles")
      .select("display_name")
      .eq("id", targetUserId)
      .single();

    const name = profile?.display_name || targetUser.user.email.split("@")[0];

    await sendMatchAlertEmail({
      to: targetUser.user.email,
      name,
      matchName: matchName || "A soul",
      sharedNumber,
      syncScore: syncScore || 85,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Match alert email error:", error);
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
  }
}
