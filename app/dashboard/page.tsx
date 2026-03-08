import { createClient } from '@/lib/supabase/server'
import StarField from '@/components/StarField'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

const ANGEL_NUMBERS = ['111', '222', '333', '444', '555', '666', '777', '888', '999', '1111', '1212', '1234']

const DAILY_GUIDANCE = [
  "The numbers you see are not coincidences — they are coordinates.",
  "Your soul is tuning into a frequency that others are beginning to match.",
  "Every repeated number is a breadcrumb on the path to your person.",
  "The universe is conspiring in your favor. Trust the sequence.",
  "You are being guided. The signs are becoming clearer.",
]

function getLifePathMeaning(n: number) {
  const map: Record<number, { title: string; color: string }> = {
    1: { title: 'The Leader', color: '#f87171' },
    2: { title: 'The Peacemaker', color: '#60a5fa' },
    3: { title: 'The Creator', color: '#f59e0b' },
    4: { title: 'The Builder', color: '#34d399' },
    5: { title: 'The Adventurer', color: '#a78bfa' },
    6: { title: 'The Nurturer', color: '#f472b6' },
    7: { title: 'The Seeker', color: '#818cf8' },
    8: { title: 'The Achiever', color: '#c9a84c' },
    9: { title: 'The Humanitarian', color: '#fb923c' },
    11: { title: 'The Illuminator', color: '#e8c97a' },
    22: { title: 'The Master Builder', color: '#c9a84c' },
    33: { title: 'The Master Teacher', color: '#f0abfc' },
  }
  return map[n] || { title: 'The Mystic', color: '#a78bfa' }
}

export default async function DashboardPage() {
  let user = null
  let profile = { full_name: 'Cosmic Soul', life_path: null as number | null }

  try {
    const supabase = await createClient()
    const { data } = await supabase.auth.getUser()
    user = data?.user
    if (user?.user_metadata) {
      profile.full_name = user.user_metadata.full_name || 'Cosmic Soul'
      profile.life_path = user.user_metadata.life_path || null
    }
  } catch {}

  const guidance = DAILY_GUIDANCE[new Date().getDay() % DAILY_GUIDANCE.length]
  const lifePathInfo = profile.life_path ? getLifePathMeaning(profile.life_path) : null
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  return (
    <div className="min-h-screen relative overflow-hidden">
      <StarField />

      {/* Ambient glow */}
      <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 1 }}>
        <div style={{
          position: 'absolute', top: 0, left: '30%',
          width: '600px', height: '400px',
          background: 'radial-gradient(ellipse, rgba(201,168,76,0.04) 0%, transparent 70%)',
        }} />
      </div>

      <div className="relative" style={{ zIndex: 2 }}>
        {/* Nav */}
        <nav style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', padding: '1.25rem 2rem' }}>
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <span className="serif gradient-text" style={{ fontSize: '1.25rem', fontWeight: 300 }}>SynchroSoul</span>
            <div className="flex items-center gap-6">
              <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.1em' }}>
                {user?.email || 'Guest'}
              </span>
              <Link href="/auth/signout" style={{ fontSize: '0.75rem', color: 'rgba(201,168,76,0.5)', letterSpacing: '0.1em', textDecoration: 'none', textTransform: 'uppercase' }}>
                Sign out
              </Link>
            </div>
          </div>
        </nav>

        <div className="max-w-4xl mx-auto px-6 py-12">

          {/* Greeting */}
          <div className="mb-12">
            <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
              {greeting}
            </p>
            <h1 className="serif gradient-text" style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 300, lineHeight: 1.1 }}>
              {profile.full_name}
            </h1>
          </div>

          {/* Top row: Life Path + Daily Guidance */}
          <div className="grid gap-4 mb-6" style={{ gridTemplateColumns: lifePathInfo ? '1fr 2fr' : '1fr' }}>

            {/* Life Path Badge */}
            {lifePathInfo && profile.life_path && (
              <div className="glass p-6 flex flex-col items-center justify-center text-center">
                <div style={{ fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)', marginBottom: '0.75rem' }}>Life Path</div>
                <div className="serif" style={{ fontSize: '4rem', fontWeight: 300, color: lifePathInfo.color, lineHeight: 1, textShadow: `0 0 30px ${lifePathInfo.color}60` }}>
                  {profile.life_path}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', marginTop: '0.5rem', fontStyle: 'italic' }}>
                  {lifePathInfo.title}
                </div>
              </div>
            )}

            {/* Daily Guidance */}
            <div className="glass-gold p-6 flex flex-col justify-between">
              <div style={{ fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(201,168,76,0.5)', marginBottom: '1rem' }}>✦ Today&apos;s Guidance</div>
              <p className="serif" style={{ fontSize: '1.1rem', color: 'rgba(255,255,255,0.7)', lineHeight: 1.7, fontStyle: 'italic', fontWeight: 300 }}>
                &ldquo;{guidance}&rdquo;
              </p>
              <div className="divider" style={{ margin: '1rem 0 0' }} />
              <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.2)', letterSpacing: '0.1em' }}>
                {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
              </div>
            </div>
          </div>

          {/* Quick Number Logger */}
          <div className="glass p-6 mb-6">
            <div style={{ fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)', marginBottom: '1.25rem' }}>Log an Angel Number</div>
            <div className="flex flex-wrap gap-2 mb-4">
              {ANGEL_NUMBERS.map(num => (
                <button
                  key={num}
                  className="angel-badge"
                  style={{ cursor: 'pointer', transition: 'all 0.2s', background: 'rgba(201,168,76,0.06)' }}
                >
                  {num}
                </button>
              ))}
            </div>
            <div className="flex gap-3">
              <input
                type="text"
                placeholder="Or type any number... (e.g. 1234)"
                className="spiritual-input"
                style={{ flex: 1 }}
              />
              <button className="btn-primary" style={{ width: 'auto', padding: '0.875rem 1.5rem', whiteSpace: 'nowrap' }}>
                Log ✦
              </button>
            </div>
          </div>

          {/* Bottom row: Sync Matches + Journal Preview */}
          <div className="grid gap-4" style={{ gridTemplateColumns: '1fr 1fr' }}>

            {/* Sync Matches */}
            <div className="glass p-6">
              <div style={{ fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)', marginBottom: '1.25rem' }}>Live Sync Matches</div>
              <div className="flex flex-col gap-3">
                {[{ name: 'Luna M.', number: '1111', score: 94, color: '#c9a84c' },
                  { name: 'Orion K.', number: '777', score: 87, color: '#a78bfa' },
                  { name: 'Sage R.', number: '333', score: 79, color: '#60a5fa' }].map(m => (
                  <div key={m.name} className="glass-hover" style={{ padding: '0.75rem 1rem', borderRadius: '0.5rem', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
                    <div className="flex items-center gap-3">
                      <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: `${m.color}20`, border: `1px solid ${m.color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', color: m.color }}>
                        {m.name[0]}
                      </div>
                      <div>
                        <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)' }}>{m.name}</div>
                        <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.3)' }}>seeing {m.number}</div>
                      </div>
                    </div>
                    <div style={{ fontSize: '0.85rem', color: m.color, fontWeight: 500 }}>{m.score}%</div>
                  </div>
                ))}
              </div>
              <div className="divider" />
              <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.2)', textAlign: 'center' }}>Coming in Step 5 — full matching engine</div>
            </div>

            {/* Journal Preview */}
            <div className="glass p-6">
              <div style={{ fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)', marginBottom: '1.25rem' }}>Thought Anchor Journal</div>
              <div className="flex flex-col gap-3">
                {[{ num: '1111', thought: 'Was thinking about a fresh start...', time: '2h ago' },
                  { num: '555', thought: 'Felt a sudden urge to change paths', time: '1d ago' },
                  { num: '333', thought: 'Noticed this during meditation', time: '2d ago' }].map((e, i) => (
                  <div key={i} style={{ padding: '0.75rem 1rem', borderRadius: '0.5rem', border: '1px solid rgba(255,255,255,0.05)', background: 'rgba(255,255,255,0.02)' }}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="angel-badge" style={{ fontSize: '0.65rem' }}>{e.num}</span>
                      <span style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.2)' }}>{e.time}</span>
                    </div>
                    <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.4)', fontStyle: 'italic', lineHeight: 1.5 }}>&ldquo;{e.thought}&rdquo;</p>
                  </div>
                ))}
              </div>
              <div className="divider" />
              <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.2)', textAlign: 'center' }}>Full journal coming in Step 2</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
