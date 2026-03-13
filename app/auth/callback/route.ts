import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const type = searchParams.get("type");
  const next = searchParams.get("next") ?? "/dashboard";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      // Password reset flow — redirect to update-password page
      if (type === "recovery") {
        return NextResponse.redirect(`${origin}/auth/update-password`);
      }

      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("onboarding_complete, display_name, life_path_number")
          .eq("id", user.id)
          .single();

        // New user — send welcome email in background
        if (!profile || !profile.onboarding_complete) {
          const name =
            profile?.display_name ||
            user.user_metadata?.full_name ||
            user.email?.split("@")[0] ||
            "Seeker";
          // Fire and forget — don't block redirect
          fetch(`${origin}/api/email/welcome`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              to: user.email,
              name,
              lifePathNumber: profile?.life_path_number,
            }),
          }).catch(() => {}); // Silently ignore if email fails

          return NextResponse.redirect(`${origin}/dashboard/onboarding`);
        }
      }
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/auth/login?error=callback_error`);
}
