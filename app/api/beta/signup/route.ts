import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const { email, name, device, reason } = await req.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Check for duplicate
    const { data: existing } = await supabase
      .from('beta_signups')
      .select('id, status')
      .eq('email', email.toLowerCase().trim())
      .single();

    if (existing) {
      return NextResponse.json(
        { error: "You're already on the beta list! We'll be in touch soon." },
        { status: 409 }
      );
    }

    // Insert signup
    const { data, error } = await supabase
      .from('beta_signups')
      .insert({
        email: email.toLowerCase().trim(),
        name: name || null,
        device: device || 'unknown',
        reason: reason || null,
        status: 'pending',
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;

    // Send confirmation email
    try {
      await resend.emails.send({
        from: 'SynchroSoul <hello@synchrosoul.app>',
        to: email,
        subject: 'You are on the SynchroSoul Beta List!',
        html: `
          <!DOCTYPE html>
          <html>
          <head><meta charset="utf-8"></head>
          <body style="margin:0;padding:0;background:#0d0a2e;font-family:Georgia,serif;">
            <div style="max-width:600px;margin:0 auto;padding:40px 20px;">
              <div style="text-align:center;margin-bottom:32px;">
                <h1 style="color:#f0c040;font-size:28px;margin:0;letter-spacing:2px;">SYNCHROSOUL</h1>
                <p style="color:#a78bfa;margin:8px 0 0;font-size:14px;letter-spacing:3px;">BETA ACCESS</p>
              </div>
              <div style="background:rgba(255,255,255,0.05);border:1px solid rgba(167,139,250,0.3);border-radius:16px;padding:32px;margin-bottom:24px;">
                <h2 style="color:#e2d9f3;font-size:22px;margin:0 0 16px;">You're on the list${name ? ', ' + name : ''}!</h2>
                <p style="color:#c4b5fd;line-height:1.7;margin:0 0 16px;">
                  The universe has received your signal. You've been added to our exclusive beta tester list for SynchroSoul - the world's first angel number synchronization app.
                </p>
                <p style="color:#c4b5fd;line-height:1.7;margin:0 0 24px;">
                  When your access is approved, you'll receive a personal invitation with free <strong style="color:#f0c040;">Mystic tier access</strong> - our premium plan, completely free for beta testers.
                </p>
                <div style="background:rgba(240,192,64,0.1);border:1px solid rgba(240,192,64,0.3);border-radius:12px;padding:20px;">
                  <p style="color:#f0c040;font-size:13px;font-weight:bold;margin:0 0 12px;letter-spacing:1px;">WHAT YOU'LL GET:</p>
                  <ul style="color:#e2d9f3;margin:0;padding-left:20px;line-height:2;">
                    <li>Angel Number Logger with AI-personalized readings</li>
                    <li>Live Soul Sync Matching with other seekers</li>
                    <li>Deep Numerology Blueprint (Life Path, Soul Urge, Destiny)</li>
                    <li>AI Oracle powered by cosmic intelligence</li>
                    <li>Dream Journal with Night Mode</li>
                    <li>Free Mystic tier access ($6.99/mo value)</li>
                  </ul>
                </div>
              </div>
              <div style="text-align:center;margin-bottom:24px;">
                <a href="https://synchrosoul.app" style="display:inline-block;background:linear-gradient(135deg,#7c3aed,#a855f7);color:white;text-decoration:none;padding:14px 32px;border-radius:50px;font-size:16px;letter-spacing:1px;">Visit SynchroSoul</a>
              </div>
              <p style="color:#6b7280;font-size:12px;text-align:center;margin:0;">
                You're receiving this because you signed up at synchrosoul.app/beta<br>
                <a href="https://synchrosoul.app" style="color:#7c3aed;">synchrosoul.app</a>
              </p>
            </div>
          </body>
          </html>
        `
      });
    } catch (emailErr) {
      console.error('Email send failed:', emailErr);
    }

    return NextResponse.json({ success: true, id: data.id });
  } catch (err: unknown) {
    console.error('Beta signup error:', err);
    const message = err instanceof Error ? err.message : 'Failed to sign up';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET() {
  const { count } = await supabase
    .from('beta_signups')
    .select('*', { count: 'exact', head: true });
  return NextResponse.json({ count: count || 0 });
}
