
import { NextResponse } from "next/server";
import { sendWeeklyDigestEmail } from "@/lib/email";
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(request: Request) {
  try {
    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json({ error: "Email not configured" }, { status: 503 });
    }

    const { to, name, topNumbers, totalLogs, streakDays, lifePathNumber } = await request.json();
    if (!to || !name) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Generate AI weekly message
    let weeklyMessage = "The universe has been sending you signs this week. Trust the numbers you see — they are guiding you toward your highest path.";

    if (process.env.GROQ_API_KEY && topNumbers?.length > 0) {
      try {
        const completion = await groq.chat.completions.create({
          model: "llama-3.3-70b-versatile",
          messages: [
            {
              role: "system",
              content: "You are a mystical numerology guide. Write a short, beautiful, personalized weekly cosmic message (2-3 sentences) based on the angel numbers someone has been seeing. Be poetic, spiritual, and uplifting. Do not use markdown."
            },
            {
              role: "user",
              content: `Name: ${name}. Life Path: ${lifePathNumber || "unknown"}. Most seen angel numbers this week: ${topNumbers.join(", ")}. Total sightings: ${totalLogs}. Streak: ${streakDays} days.`
            }
          ],
          max_tokens: 150,
          temperature: 0.9,
        });
        weeklyMessage = completion.choices[0]?.message?.content || weeklyMessage;
      } catch (e) {
        console.error("Groq error:", e);
      }
    }

    await sendWeeklyDigestEmail({
      to,
      name,
      topNumbers: topNumbers || [],
      totalLogs: totalLogs || 0,
      streakDays: streakDays || 0,
      weeklyMessage,
      lifePathNumber,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Weekly digest email error:", error);
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
  }
}
