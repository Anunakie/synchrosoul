
import { NextResponse } from "next/server";
import { sendWelcomeEmail } from "@/lib/email";

export async function POST(request: Request) {
  try {
    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json({ error: "Email not configured" }, { status: 503 });
    }
    const { to, name, lifePathNumber } = await request.json();
    if (!to || !name) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    await sendWelcomeEmail({ to, name, lifePathNumber });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Welcome email error:", error);
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
  }
}
