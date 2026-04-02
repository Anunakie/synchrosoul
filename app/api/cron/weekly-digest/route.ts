
import { NextResponse } from "next/server";
import { sendWeeklyDigestEmail } from "@/lib/email";
import { createClient } from "@supabase/supabase-js";
import Groq from "groq-sdk";

function getGroq() { return new Groq({ apiKey: process.env.GROQ_API_KEY }); }

export const runtime = "nodejs";

export async function GET(request: Request) {
  // Verify this is called by Vercel Cron
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!process.env.RESEND_API_KEY) {
    return NextResponse.json({ error: "Email not configured" }, { status: 503 });
  }

  const serviceClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // Get all users who have email_digest enabled (default true)
  const { data: profiles } = await serviceClient
    .from("profiles")
    .select("id, display_name, life_path_number, email_digest")
    .neq("email_digest", false);

  if (!profiles?.length) {
    return NextResponse.json({ message: "No users to email" });
  }

  let sent = 0;
  let failed = 0;

  for (const profile of profiles) {
    try {
      // Get user email
      const { data: userData } = await serviceClient.auth.admin.getUserById(profile.id);
      if (!userData?.user?.email) continue;

      // Get this week logs
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);

      const { data: logs } = await serviceClient
        .from("angel_logs")
        .select("number, created_at")
        .eq("user_id", profile.id)
        .gte("created_at", weekAgo.toISOString())
        .order("created_at", { ascending: false });

      if (!logs?.length) continue; // Skip users with no activity

      // Calculate top numbers
      const numberCounts: Record<string, number> = {};
      logs.forEach((l) => {
        numberCounts[l.number] = (numberCounts[l.number] || 0) + 1;
      });
      const topNumbers = Object.entries(numberCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([n]) => n);

      // Calculate streak
      const uniqueDays = new Set(logs.map((l) => l.created_at.split("T")[0]));
      const streakDays = uniqueDays.size;

      // Generate AI message
      let weeklyMessage = "The universe has been sending you signs this week. Trust the numbers you see.";
      if (process.env.GROQ_API_KEY && topNumbers.length > 0) {
        try {
          const completion = await getGroq().chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [
              { role: "system", content: "You are a mystical numerology guide. Write a short, beautiful weekly cosmic message (2-3 sentences). Be poetic and uplifting. No markdown." },
              { role: "user", content: `Name: ${profile.display_name || "Seeker"}. Life Path: ${profile.life_path_number || "unknown"}. Top numbers: ${topNumbers.join(", ")}. Logs: ${logs.length}. Active days: ${streakDays}.` }
            ],
            max_tokens: 150,
            temperature: 0.9,
          });
          weeklyMessage = completion.choices[0]?.message?.content || weeklyMessage;
        } catch (e) {
          console.error("Groq error for user", profile.id, e);
        }
      }

      await sendWeeklyDigestEmail({
        to: userData.user.email,
        name: profile.display_name || userData.user.email.split("@")[0],
        topNumbers,
        totalLogs: logs.length,
        streakDays,
        weeklyMessage,
        lifePathNumber: profile.life_path_number,
      });

      sent++;
      // Small delay to avoid rate limits
      await new Promise((r) => setTimeout(r, 200));
    } catch (err) {
      console.error("Failed to send digest to", profile.id, err);
      failed++;
    }
  }

  return NextResponse.json({ success: true, sent, failed });
}

// POST handler for manual admin trigger (no cron auth required)
export async function POST(request: Request) {
  // Reuse GET logic but skip cron auth check
  const fakeRequest = new Request(request.url, { headers: new Headers({ authorization: `Bearer ${process.env.CRON_SECRET}` }) });
  return GET(fakeRequest);
}
