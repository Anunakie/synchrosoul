
import { Resend } from "resend";

// Lazy initialization — avoids build-time error when key is missing
function getResend() {
  if (!process.env.RESEND_API_KEY) throw new Error("RESEND_API_KEY not configured");
  return new Resend(process.env.RESEND_API_KEY);
}

const FROM_EMAIL = "SynchroSoul <hello@synchrosoul.app>";

// ─── Shared Styles ───────────────────────────────────────────────────────────
const baseStyle = `
  font-family: Georgia, serif;
  background: #050510;
  color: #e8e0ff;
  margin: 0;
  padding: 0;
`;

const containerStyle = `
  max-width: 600px;
  margin: 0 auto;
  background: linear-gradient(135deg, #0d0b2e 0%, #1a0a3e 50%, #0d0b2e 100%);
  border: 1px solid rgba(201,168,76,0.3);
  border-radius: 16px;
  overflow: hidden;
`;

const headerStyle = `
  background: linear-gradient(135deg, #1a0a3e, #2d1b69);
  padding: 40px 32px;
  text-align: center;
  border-bottom: 1px solid rgba(201,168,76,0.3);
`;

const bodyStyle = `
  padding: 40px 32px;
`;

const footerStyle = `
  padding: 24px 32px;
  text-align: center;
  border-top: 1px solid rgba(201,168,76,0.2);
  font-size: 12px;
  color: rgba(232,224,255,0.4);
`;

const buttonStyle = `
  display: inline-block;
  background: linear-gradient(135deg, #c9a84c, #f0d080);
  color: #050510;
  text-decoration: none;
  padding: 14px 32px;
  border-radius: 50px;
  font-weight: bold;
  font-size: 16px;
  margin: 24px 0;
`;

const numberBadgeStyle = `
  display: inline-block;
  background: rgba(201,168,76,0.15);
  border: 1px solid rgba(201,168,76,0.5);
  color: #c9a84c;
  padding: 8px 20px;
  border-radius: 50px;
  font-size: 24px;
  font-weight: bold;
  letter-spacing: 4px;
  margin: 8px 4px;
`;

// ─── Welcome Email ────────────────────────────────────────────────────────────
export async function sendWelcomeEmail({
  to,
  name,
  lifePathNumber,
}: {
  to: string;
  name: string;
  lifePathNumber?: number;
}) {
  const lifePath = lifePathNumber || "";
  const lifePathMsg = lifePath
    ? `<p style="color:rgba(232,224,255,0.7);font-size:15px;line-height:1.7;">Your Life Path number is <span style="${numberBadgeStyle}">${lifePath}</span> — a sacred blueprint written in the stars at the moment of your birth.</p>`
    : "";

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="${baseStyle}">
  <div style="${containerStyle}">
    <div style="${headerStyle}">
      <div style="font-size:48px;margin-bottom:12px;">✨</div>
      <h1 style="color:#c9a84c;font-size:28px;margin:0 0 8px;letter-spacing:2px;">Welcome to SynchroSoul</h1>
      <p style="color:rgba(232,224,255,0.6);margin:0;font-size:15px;">The universe has been expecting you</p>
    </div>
    <div style="${bodyStyle}">
      <h2 style="color:#e8e0ff;font-size:22px;margin:0 0 16px;">Hello, ${name} 🌟</h2>
      <p style="color:rgba(232,224,255,0.8);font-size:16px;line-height:1.8;">
        You have just taken the first step on a sacred journey. SynchroSoul is your cosmic companion — 
        a place where angel numbers become bridges between souls.
      </p>
      ${lifePathMsg}
      <p style="color:rgba(232,224,255,0.8);font-size:16px;line-height:1.8;">
        Every time you see a repeating number — 1111, 333, 555 — the universe is speaking. 
        Now you have a place to listen, record, and connect with others hearing the same message.
      </p>
      <div style="text-align:center;margin:32px 0;">
        <div style="${numberBadgeStyle}">1111</div>
        <div style="${numberBadgeStyle}">333</div>
        <div style="${numberBadgeStyle}">555</div>
        <div style="${numberBadgeStyle}">777</div>
      </div>
      <div style="text-align:center;">
        <a href="https://synchrosoul.app/dashboard" style="${buttonStyle}">Open Your Portal ✨</a>
      </div>
      <div style="background:rgba(201,168,76,0.08);border:1px solid rgba(201,168,76,0.2);border-radius:12px;padding:20px;margin-top:32px;">
        <h3 style="color:#c9a84c;margin:0 0 12px;font-size:16px;">Your first steps:</h3>
        <p style="color:rgba(232,224,255,0.7);margin:6px 0;font-size:14px;">🔢 Log your first angel number sighting</p>
        <p style="color:rgba(232,224,255,0.7);margin:6px 0;font-size:14px;">📖 Write your first thought anchor</p>
        <p style="color:rgba(232,224,255,0.7);margin:6px 0;font-size:14px;">🔮 Explore your numerology profile</p>
        <p style="color:rgba(232,224,255,0.7);margin:6px 0;font-size:14px;">💫 Find your sync matches</p>
      </div>
    </div>
    <div style="${footerStyle}">
      <p>You are receiving this because you joined SynchroSoul.</p>
      <p><a href="https://synchrosoul.app" style="color:rgba(201,168,76,0.6);text-decoration:none;">synchrosoul.app</a></p>
    </div>
  </div>
</body>
</html>`;

  return getResend().emails.send({
    from: FROM_EMAIL,
    to,
    subject: "Welcome to SynchroSoul ✨ The universe has been expecting you",
    html,
  });
}

// ─── Match Alert Email ────────────────────────────────────────────────────────
export async function sendMatchAlertEmail({
  to,
  name,
  matchName,
  sharedNumber,
  syncScore,
}: {
  to: string;
  name: string;
  matchName: string;
  sharedNumber: string;
  syncScore: number;
}) {
  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="${baseStyle}">
  <div style="${containerStyle}">
    <div style="${headerStyle}">
      <div style="font-size:48px;margin-bottom:12px;">💫</div>
      <h1 style="color:#c9a84c;font-size:28px;margin:0 0 8px;letter-spacing:2px;">Soul Sync Detected</h1>
      <p style="color:rgba(232,224,255,0.6);margin:0;font-size:15px;">The universe just connected two souls</p>
    </div>
    <div style="${bodyStyle}">
      <h2 style="color:#e8e0ff;font-size:22px;margin:0 0 16px;">Hello, ${name} 🌙</h2>
      <p style="color:rgba(232,224,255,0.8);font-size:16px;line-height:1.8;">
        Something magical just happened. <strong style="color:#c9a84c;">${matchName}</strong> is seeing the same angel number as you — 
        and the universe is whispering that this is no coincidence.
      </p>
      <div style="text-align:center;margin:32px 0;">
        <div style="font-size:14px;color:rgba(232,224,255,0.5);margin-bottom:8px;">SHARED ANGEL NUMBER</div>
        <div style="font-size:48px;font-weight:bold;color:#c9a84c;letter-spacing:8px;">${sharedNumber}</div>
        <div style="margin-top:16px;">
          <span style="background:rgba(139,92,246,0.2);border:1px solid rgba(139,92,246,0.5);color:#a78bfa;padding:6px 16px;border-radius:50px;font-size:14px;">
            ${syncScore}% Sync Score
          </span>
        </div>
      </div>
      <div style="background:rgba(201,168,76,0.08);border:1px solid rgba(201,168,76,0.2);border-radius:12px;padding:20px;margin:24px 0;text-align:center;">
        <p style="color:rgba(232,224,255,0.7);margin:0;font-size:15px;font-style:italic;">
          "When two souls see the same number at the same moment, the universe is drawing them together."
        </p>
      </div>
      <div style="text-align:center;">
        <a href="https://synchrosoul.app/dashboard/sync" style="${buttonStyle}">View Your Match 💫</a>
      </div>
    </div>
    <div style="${footerStyle}">
      <p>You are receiving this because you have sync notifications enabled.</p>
      <p><a href="https://synchrosoul.app/dashboard/settings" style="color:rgba(201,168,76,0.6);text-decoration:none;">Manage notifications</a> &nbsp;|&nbsp; <a href="https://synchrosoul.app" style="color:rgba(201,168,76,0.6);text-decoration:none;">synchrosoul.app</a></p>
    </div>
  </div>
</body>
</html>`;

  return getResend().emails.send({
    from: FROM_EMAIL,
    to,
    subject: `💫 Soul Sync: You and ${matchName} both saw ${sharedNumber}`,
    html,
  });
}

// ─── Weekly Cosmic Digest ─────────────────────────────────────────────────────
export async function sendWeeklyDigestEmail({
  to,
  name,
  topNumbers,
  totalLogs,
  streakDays,
  weeklyMessage,
  lifePathNumber,
}: {
  to: string;
  name: string;
  topNumbers: string[];
  totalLogs: number;
  streakDays: number;
  weeklyMessage: string;
  lifePathNumber?: number;
}) {
  const numberBadges = topNumbers
    .slice(0, 5)
    .map((n) => `<span style="${numberBadgeStyle}">${n}</span>`)
    .join("");

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="${baseStyle}">
  <div style="${containerStyle}">
    <div style="${headerStyle}">
      <div style="font-size:48px;margin-bottom:12px;">🌌</div>
      <h1 style="color:#c9a84c;font-size:28px;margin:0 0 8px;letter-spacing:2px;">Your Weekly Cosmic Digest</h1>
      <p style="color:rgba(232,224,255,0.6);margin:0;font-size:15px;">A message from the universe, just for you</p>
    </div>
    <div style="${bodyStyle}">
      <h2 style="color:#e8e0ff;font-size:22px;margin:0 0 16px;">Hello, ${name} ✨</h2>
      <p style="color:rgba(232,224,255,0.8);font-size:16px;line-height:1.8;">
        Here is your cosmic summary for the past week. The numbers you have been seeing carry a message — 
        and the universe wants you to hear it.
      </p>

      <!-- Stats Row -->
      <div style="display:flex;gap:16px;margin:24px 0;">
        <div style="flex:1;background:rgba(201,168,76,0.08);border:1px solid rgba(201,168,76,0.2);border-radius:12px;padding:16px;text-align:center;">
          <div style="font-size:32px;font-weight:bold;color:#c9a84c;">${totalLogs}</div>
          <div style="font-size:12px;color:rgba(232,224,255,0.5);margin-top:4px;">SIGHTINGS</div>
        </div>
        <div style="flex:1;background:rgba(139,92,246,0.08);border:1px solid rgba(139,92,246,0.2);border-radius:12px;padding:16px;text-align:center;">
          <div style="font-size:32px;font-weight:bold;color:#a78bfa;">${streakDays}</div>
          <div style="font-size:12px;color:rgba(232,224,255,0.5);margin-top:4px;">DAY STREAK</div>
        </div>
        ${lifePathNumber ? `
        <div style="flex:1;background:rgba(99,102,241,0.08);border:1px solid rgba(99,102,241,0.2);border-radius:12px;padding:16px;text-align:center;">
          <div style="font-size:32px;font-weight:bold;color:#818cf8;">${lifePathNumber}</div>
          <div style="font-size:12px;color:rgba(232,224,255,0.5);margin-top:4px;">LIFE PATH</div>
        </div>` : ""}
      </div>

      <!-- Top Numbers -->
      ${topNumbers.length > 0 ? `
      <div style="margin:24px 0;">
        <h3 style="color:#c9a84c;font-size:16px;margin:0 0 12px;">Your Most Seen Numbers This Week</h3>
        <div style="text-align:center;">${numberBadges}</div>
      </div>` : ""}

      <!-- Weekly Message -->
      <div style="background:linear-gradient(135deg,rgba(139,92,246,0.1),rgba(201,168,76,0.1));border:1px solid rgba(201,168,76,0.3);border-radius:12px;padding:24px;margin:24px 0;">
        <h3 style="color:#c9a84c;font-size:16px;margin:0 0 12px;">Your Cosmic Message</h3>
        <p style="color:rgba(232,224,255,0.85);font-size:15px;line-height:1.8;margin:0;font-style:italic;">${weeklyMessage}</p>
      </div>

      <div style="text-align:center;">
        <a href="https://synchrosoul.app/dashboard" style="${buttonStyle}">Open Your Portal 🌌</a>
      </div>
    </div>
    <div style="${footerStyle}">
      <p>You are receiving this weekly digest from SynchroSoul.</p>
      <p><a href="https://synchrosoul.app/dashboard/settings" style="color:rgba(201,168,76,0.6);text-decoration:none;">Unsubscribe from digest</a> &nbsp;|&nbsp; <a href="https://synchrosoul.app" style="color:rgba(201,168,76,0.6);text-decoration:none;">synchrosoul.app</a></p>
    </div>
  </div>
</body>
</html>`;

  return getResend().emails.send({
    from: FROM_EMAIL,
    to,
    subject: `🌌 Your Weekly Cosmic Digest — ${topNumbers[0] || "111"} is calling`,
    html,
  });
}

// ─── Soul Twin Alert Email ────────────────────────────────────────────────────
export async function sendSoulTwinAlertEmail({
  to,
  name,
  sharedNumber,
  matchCount,
}: {
  to: string;
  name: string;
  sharedNumber: string;
  matchCount: number;
}) {
  const plural = matchCount > 1 ? `${matchCount} souls` : 'another soul';
  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="${baseStyle}">
  <div style="${containerStyle}">
    <div style="${headerStyle}">
      <div style="font-size:56px;margin-bottom:12px;">✨</div>
      <h1 style="color:#c9a84c;font-size:28px;margin:0 0 8px;letter-spacing:2px;">Soul Twin Alert</h1>
      <p style="color:rgba(232,224,255,0.6);margin:0;font-size:15px;">The universe just aligned two paths</p>
    </div>
    <div style="${bodyStyle}">
      <h2 style="color:#e8e0ff;font-size:22px;margin:0 0 16px;">Hello, ${name} 🌙</h2>
      <p style="color:rgba(232,224,255,0.8);font-size:16px;line-height:1.8;">
        Something extraordinary just happened — <strong style="color:#c9a84c;">${plural}</strong> logged the same angel number as you within the last 30 minutes.
        This is not a coincidence. The universe is drawing you together.
      </p>
      <div style="text-align:center;margin:36px 0;">
        <div style="font-size:13px;color:rgba(232,224,255,0.4);letter-spacing:0.15em;text-transform:uppercase;margin-bottom:12px;">Your Shared Angel Number</div>
        <div style="display:inline-block;background:linear-gradient(135deg,rgba(201,168,76,0.15),rgba(139,92,246,0.15));border:1px solid rgba(201,168,76,0.5);border-radius:16px;padding:20px 40px;">
          <div style="font-size:52px;font-weight:bold;color:#c9a84c;letter-spacing:10px;">${sharedNumber}</div>
        </div>
      </div>
      <div style="background:rgba(139,92,246,0.08);border:1px solid rgba(139,92,246,0.25);border-radius:12px;padding:20px;margin:24px 0;text-align:center;">
        <p style="color:rgba(232,224,255,0.75);margin:0;font-size:15px;font-style:italic;line-height:1.7;">
          &ldquo;When two souls witness the same sacred number in the same moment,<br>the cosmos is weaving their stories together.&rdquo;
        </p>
      </div>
      <p style="color:rgba(232,224,255,0.7);font-size:15px;line-height:1.8;text-align:center;">
        Open SynchroSoul now to see who you are synced with and start a conversation.
      </p>
      <div style="text-align:center;margin-top:8px;">
        <a href="https://synchrosoul.app/dashboard/sync" style="${buttonStyle}">See Your Soul Twin ✨</a>
      </div>
    </div>
    <div style="${footerStyle}">
      <p>You are receiving this because you have Soul Twin alerts enabled.</p>
      <p>
        <a href="https://synchrosoul.app/dashboard/settings" style="color:rgba(201,168,76,0.6);text-decoration:none;">Manage notifications</a>
        &nbsp;&bull;&nbsp;
        <a href="https://synchrosoul.app" style="color:rgba(201,168,76,0.6);text-decoration:none;">synchrosoul.app</a>
      </p>
    </div>
  </div>
</body>
</html>`;

  return getResend().emails.send({
    from: FROM_EMAIL,
    to,
    subject: `✨ Soul Twin Alert: ${matchCount > 1 ? matchCount + ' souls' : 'Someone'} just saw ${sharedNumber} at the same time as you`,
    html,
  });
}
