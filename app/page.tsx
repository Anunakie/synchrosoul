import Link from 'next/link'
import StarField from '@/components/StarField'

export default function HomePage() {
  return (
    <main style={{ background: '#050510', color: '#fff', fontFamily: 'inherit', overflowX: 'hidden' }}>
      <StarField />

      {/* ── NAV ─────────────────────────────────────────────────────────── */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '1.25rem 2.5rem',
        borderBottom: '1px solid rgba(200,180,255,0.07)',
        backdropFilter: 'blur(20px)',
        background: 'rgba(5,5,16,0.6)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ color: 'rgba(201,168,76,0.9)', fontSize: '1.1rem' }}>✦</span>
          <span style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.25rem', color: 'rgba(220,200,255,0.9)', letterSpacing: '0.05em' }}>SynchroSoul</span>
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <Link href="/auth/login" style={{
            fontSize: '0.8rem', letterSpacing: '0.1em', textTransform: 'uppercase',
            color: 'rgba(200,180,255,0.5)', textDecoration: 'none',
          }}>Sign In</Link>
          <Link href="/auth/signup" style={{
            fontSize: '0.8rem', letterSpacing: '0.1em', textTransform: 'uppercase',
            padding: '0.5rem 1.25rem', borderRadius: '9999px',
            background: 'rgba(200,150,255,0.12)',
            border: '1px solid rgba(200,150,255,0.35)',
            color: 'rgba(220,180,255,0.9)', textDecoration: 'none',
          }}>Begin</Link>
        </div>
      </nav>

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section style={{
        minHeight: '100vh', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        textAlign: 'center', padding: '8rem 2rem 4rem',
        position: 'relative', zIndex: 10,
      }}>
        {/* Floating angel numbers */}
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
          {[['1111', '8%', '15%', '0.06'], ['333', '88%', '20%', '0.05'], ['555', '5%', '70%', '0.07'],
            ['777', '90%', '65%', '0.05'], ['444', '50%', '8%', '0.04'], ['222', '75%', '85%', '0.06']
          ].map(([n, l, t, o]) => (
            <div key={n} style={{
              position: 'absolute', left: l, top: t,
              fontFamily: 'Cormorant Garamond, serif',
              fontSize: 'clamp(1.5rem, 3vw, 2.5rem)',
              color: `rgba(200,170,255,${o})`,
              letterSpacing: '0.2em', userSelect: 'none',
            }}>{n}</div>
          ))}
        </div>

        {/* Gold orb */}
        <div style={{
          width: '6rem', height: '6rem', borderRadius: '50%', marginBottom: '2.5rem',
          background: 'radial-gradient(circle, rgba(201,168,76,0.25) 0%, rgba(201,168,76,0.05) 60%, transparent 100%)',
          border: '1px solid rgba(201,168,76,0.3)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 0 60px rgba(201,168,76,0.15)',
          animation: 'float 6s ease-in-out infinite',
        }}>
          <span style={{ fontSize: '2rem', color: 'rgba(201,168,76,0.8)' }}>✦</span>
        </div>

        <div style={{
          display: 'inline-block', padding: '0.3rem 1rem', borderRadius: '9999px',
          background: 'rgba(201,168,76,0.08)', border: '1px solid rgba(201,168,76,0.25)',
          color: 'rgba(201,168,76,0.7)', fontSize: '0.7rem',
          letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '1.5rem',
        }}>Angel Number Sync Dating</div>

        <h1 style={{
          fontFamily: 'Cormorant Garamond, serif',
          fontSize: 'clamp(3rem, 8vw, 6rem)',
          fontWeight: 300, lineHeight: 1.1,
          color: 'rgba(230,215,255,0.95)',
          marginBottom: '1.5rem', letterSpacing: '-0.01em',
        }}>
          You keep seeing<br />
          <span style={{ color: 'rgba(201,168,76,0.85)', fontStyle: 'italic' }}>the same numbers.</span>
        </h1>

        <p style={{
          fontSize: 'clamp(1rem, 2vw, 1.2rem)',
          color: 'rgba(200,180,255,0.5)',
          maxWidth: '520px', lineHeight: 1.7, marginBottom: '3rem',
        }}>
          The universe is trying to connect you with someone.<br />
          SynchroSoul matches you with people seeing the same angel numbers — in real time.
        </p>

        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          <Link href="/auth/signup" style={{
            padding: '0.9rem 2.5rem', borderRadius: '9999px',
            background: 'linear-gradient(135deg, rgba(180,120,255,0.25), rgba(100,80,200,0.25))',
            border: '1px solid rgba(200,150,255,0.4)',
            color: 'rgba(230,210,255,0.95)', textDecoration: 'none',
            fontSize: '0.9rem', letterSpacing: '0.08em',
            boxShadow: '0 0 40px rgba(180,120,255,0.15)',
          }}>Begin Your Journey ✦</Link>
          <Link href="/dashboard" style={{
            padding: '0.9rem 2.5rem', borderRadius: '9999px',
            background: 'transparent',
            border: '1px solid rgba(200,180,255,0.2)',
            color: 'rgba(200,180,255,0.6)', textDecoration: 'none',
            fontSize: '0.9rem', letterSpacing: '0.08em',
          }}>Try Without Account</Link>
        </div>

        {/* Scroll indicator */}
        <div style={{ position: 'absolute', bottom: '2.5rem', left: '50%', transform: 'translateX(-50%)', textAlign: 'center' }}>
          <p style={{ fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(200,180,255,0.25)', marginBottom: '0.5rem' }}>Scroll</p>
          <div style={{ width: '1px', height: '3rem', background: 'linear-gradient(to bottom, rgba(200,180,255,0.3), transparent)', margin: '0 auto' }} />
        </div>
      </section>

      {/* ── SECTION 1: WHAT IS THIS ──────────────────────────────────────── */}
      <section style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center',
        padding: '6rem 2rem', position: 'relative', zIndex: 10,
        borderTop: '1px solid rgba(200,180,255,0.06)',
      }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', width: '100%' }}>

          {/* Section label */}
          <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
            <div style={{
              display: 'inline-block', padding: '0.3rem 1rem', borderRadius: '9999px',
              background: 'rgba(180,120,255,0.08)', border: '1px solid rgba(180,120,255,0.2)',
              color: 'rgba(180,120,255,0.7)', fontSize: '0.7rem',
              letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '1.5rem',
            }}>The Concept</div>
            <h2 style={{
              fontFamily: 'Cormorant Garamond, serif',
              fontSize: 'clamp(2.5rem, 5vw, 4rem)',
              fontWeight: 300, color: 'rgba(230,215,255,0.9)',
              lineHeight: 1.2, marginBottom: '1.25rem',
            }}>The universe speaks<br />in patterns.</h2>
            <p style={{ color: 'rgba(200,180,255,0.45)', fontSize: '1.05rem', maxWidth: '560px', margin: '0 auto', lineHeight: 1.7 }}>
              Angel numbers are repeating sequences — 1111, 333, 555 — that appear when the universe is trying to get your attention. SynchroSoul is the first app built around this phenomenon.
            </p>
          </div>

          {/* Three concept cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {[
              {
                icon: '◈', color: 'rgba(180,120,255,0.8)',
                glow: 'rgba(180,120,255,0.15)',
                title: 'You See a Number',
                body: 'You glance at the clock: 11:11. Your receipt total: $3.33. Your eyes keep landing on 555. These aren\'t coincidences — they\'re signals.',
              },
              {
                icon: '◉', color: 'rgba(201,168,76,0.8)',
                glow: 'rgba(201,168,76,0.15)',
                title: 'You Log the Moment',
                body: 'Tap the number. Capture what you were thinking. The universe is listening — and so is SynchroSoul. Your private Thought Anchor Journal holds every moment.',
              },
              {
                icon: '✦', color: 'rgba(100,200,255,0.8)',
                glow: 'rgba(100,200,255,0.15)',
                title: 'You Find Your Match',
                body: 'Someone across the city just logged 1111 too. Your Sync Score lights up. The numbers brought you here — maybe they\'re bringing you to each other.',
              },
            ].map(card => (
              <div key={card.title} style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(200,180,255,0.1)',
                borderRadius: '1.5rem', padding: '2.5rem',
                backdropFilter: 'blur(10px)',
                transition: 'border-color 0.3s',
              }}>
                <div style={{
                  width: '3.5rem', height: '3.5rem', borderRadius: '50%',
                  background: card.glow,
                  border: `1px solid ${card.color}44`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.4rem', color: card.color,
                  marginBottom: '1.5rem',
                  boxShadow: `0 0 30px ${card.glow}`,
                }}>{card.icon}</div>
                <h3 style={{
                  fontFamily: 'Cormorant Garamond, serif',
                  fontSize: '1.5rem', fontWeight: 400,
                  color: 'rgba(230,215,255,0.9)', marginBottom: '0.75rem',
                }}>{card.title}</h3>
                <p style={{ color: 'rgba(200,180,255,0.45)', fontSize: '0.9rem', lineHeight: 1.7 }}>{card.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 2: FEATURES ──────────────────────────────────────────── */}
      <section style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center',
        padding: '6rem 2rem', position: 'relative', zIndex: 10,
        borderTop: '1px solid rgba(200,180,255,0.06)',
      }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', width: '100%' }}>

          <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
            <div style={{
              display: 'inline-block', padding: '0.3rem 1rem', borderRadius: '9999px',
              background: 'rgba(100,200,255,0.08)', border: '1px solid rgba(100,200,255,0.2)',
              color: 'rgba(100,200,255,0.7)', fontSize: '0.7rem',
              letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '1.5rem',
            }}>Features</div>
            <h2 style={{
              fontFamily: 'Cormorant Garamond, serif',
              fontSize: 'clamp(2.5rem, 5vw, 4rem)',
              fontWeight: 300, color: 'rgba(230,215,255,0.9)',
              lineHeight: 1.2, marginBottom: '1.25rem',
            }}>Everything the cosmos<br />needs from you.</h2>
            <p style={{ color: 'rgba(200,180,255,0.45)', fontSize: '1.05rem', maxWidth: '500px', margin: '0 auto', lineHeight: 1.7 }}>
              Simple, beautiful tools designed around the way angel numbers actually work in your life.
            </p>
          </div>

          {/* Feature rows */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

            {/* Row 1: two wide cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
              <div style={{
                background: 'linear-gradient(135deg, rgba(180,120,255,0.08), rgba(100,80,200,0.04))',
                border: '1px solid rgba(180,120,255,0.15)',
                borderRadius: '1.5rem', padding: '2.5rem',
              }}>
                <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⚡</div>
                <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.6rem', fontWeight: 400, color: 'rgba(230,215,255,0.9)', marginBottom: '0.75rem' }}>
                  Angel Number Logger
                </h3>
                <p style={{ color: 'rgba(200,180,255,0.45)', fontSize: '0.9rem', lineHeight: 1.7, marginBottom: '1.25rem' }}>
                  One tap to log any number. Quick-tap grid for the most common sequences. Add what you were thinking — your private Thought Anchor. Upload a screenshot for the Angel Approved badge.
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {['1111', '555', '333', '777', '444'].map(n => (
                    <span key={n} style={{
                      padding: '0.2rem 0.6rem', borderRadius: '9999px',
                      background: 'rgba(180,120,255,0.1)', border: '1px solid rgba(180,120,255,0.2)',
                      color: 'rgba(200,160,255,0.7)', fontSize: '0.75rem', letterSpacing: '0.1em',
                    }}>{n}</span>
                  ))}
                </div>
              </div>

              <div style={{
                background: 'linear-gradient(135deg, rgba(201,168,76,0.08), rgba(150,120,40,0.04))',
                border: '1px solid rgba(201,168,76,0.15)',
                borderRadius: '1.5rem', padding: '2.5rem',
              }}>
                <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>📖</div>
                <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.6rem', fontWeight: 400, color: 'rgba(230,215,255,0.9)', marginBottom: '0.75rem' }}>
                  Thought Anchor Journal
                </h3>
                <p style={{ color: 'rgba(200,180,255,0.45)', fontSize: '0.9rem', lineHeight: 1.7, marginBottom: '1.25rem' }}>
                  A beautiful private timeline of every number you\'ve seen. Date-grouped entries with your thoughts, mini cosmic readings, and screenshot thumbnails. Searchable by number or keyword.
                </p>
                <div style={{
                  padding: '0.75rem 1rem', borderRadius: '0.75rem',
                  background: 'rgba(201,168,76,0.06)', border: '1px solid rgba(201,168,76,0.15)',
                  fontSize: '0.8rem', color: 'rgba(201,168,76,0.6)', fontStyle: 'italic',
                }}>"100% private unless you choose to share"</div>
              </div>
            </div>

            {/* Row 2: three smaller cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem' }}>
              {[
                {
                  emoji: '🔢', color: 'rgba(100,200,255,0.8)', bg: 'rgba(100,200,255,0.08)', border: 'rgba(100,200,255,0.15)',
                  title: 'Numerology Profile',
                  body: 'Enter your birthdate on signup. Instantly see your Life Path, Soul Urge, and Destiny numbers as beautiful cosmic badges on your profile.',
                },
                {
                  emoji: '✓', color: 'rgba(68,255,170,0.8)', bg: 'rgba(68,255,170,0.08)', border: 'rgba(68,255,170,0.15)',
                  title: 'Truth Score',
                  body: 'Upload a screenshot of the number you saw. Get the green Angel Approved badge. Verified sightings carry more weight in matching.',
                },
                {
                  emoji: '⚡', color: 'rgba(255,180,100,0.8)', bg: 'rgba(255,180,100,0.08)', border: 'rgba(255,180,100,0.15)',
                  title: 'Live Sync Matching',
                  body: 'See who logged the same numbers in the last 48 hours. Your Sync Score shows number harmony and numerology overlap in real time.',
                },
              ].map(f => (
                <div key={f.title} style={{
                  background: f.bg, border: `1px solid ${f.border}`,
                  borderRadius: '1.5rem', padding: '2rem',
                }}>
                  <div style={{ fontSize: '1.75rem', marginBottom: '1rem' }}>{f.emoji}</div>
                  <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.3rem', fontWeight: 400, color: 'rgba(230,215,255,0.9)', marginBottom: '0.5rem' }}>{f.title}</h3>
                  <p style={{ color: 'rgba(200,180,255,0.45)', fontSize: '0.85rem', lineHeight: 1.6 }}>{f.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 3: HOW IT WORKS / CTA ────────────────────────────────── */}
      <section style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center',
        padding: '6rem 2rem', position: 'relative', zIndex: 10,
        borderTop: '1px solid rgba(200,180,255,0.06)',
      }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', width: '100%' }}>

          <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
            <div style={{
              display: 'inline-block', padding: '0.3rem 1rem', borderRadius: '9999px',
              background: 'rgba(255,180,100,0.08)', border: '1px solid rgba(255,180,100,0.2)',
              color: 'rgba(255,180,100,0.7)', fontSize: '0.7rem',
              letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '1.5rem',
            }}>How It Works</div>
            <h2 style={{
              fontFamily: 'Cormorant Garamond, serif',
              fontSize: 'clamp(2.5rem, 5vw, 4rem)',
              fontWeight: 300, color: 'rgba(230,215,255,0.9)',
              lineHeight: 1.2, marginBottom: '1.25rem',
            }}>Three steps to<br />your cosmic match.</h2>
          </div>

          {/* Steps */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0', position: 'relative' }}>
            {/* Vertical line */}
            <div style={{
              position: 'absolute', left: '1.75rem', top: '3rem', bottom: '3rem',
              width: '1px',
              background: 'linear-gradient(to bottom, rgba(200,180,255,0.2), rgba(200,180,255,0.05))',
            }} />

            {[
              {
                num: '01', color: 'rgba(180,120,255,0.9)',
                title: 'Log what you see',
                body: 'Open SynchroSoul the moment you spot a repeating number. Tap it, add your thought, optionally upload proof. Takes 10 seconds.',
              },
              {
                num: '02', color: 'rgba(201,168,76,0.9)',
                title: 'Build your cosmic profile',
                body: 'Your numerology numbers are calculated from your birthdate. Your logged numbers paint a picture of where you are in your journey right now.',
              },
              {
                num: '03', color: 'rgba(100,200,255,0.9)',
                title: 'Meet your sync',
                body: 'The Live Sync dashboard shows people who are seeing the same numbers as you — right now. When the numbers align, reach out. The universe already made the introduction.',
              },
            ].map((step, i) => (
              <div key={step.num} style={{
                display: 'flex', gap: '2rem', alignItems: 'flex-start',
                padding: '2.5rem 0',
                borderBottom: i < 2 ? '1px solid rgba(200,180,255,0.06)' : 'none',
              }}>
                <div style={{
                  width: '3.5rem', height: '3.5rem', borderRadius: '50%', flexShrink: 0,
                  background: 'rgba(5,5,16,0.9)',
                  border: `1px solid ${step.color}44`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'Cormorant Garamond, serif',
                  fontSize: '1rem', color: step.color, letterSpacing: '0.05em',
                  position: 'relative', zIndex: 1,
                }}>{step.num}</div>
                <div style={{ flex: 1, paddingTop: '0.5rem' }}>
                  <h3 style={{
                    fontFamily: 'Cormorant Garamond, serif',
                    fontSize: '1.75rem', fontWeight: 400,
                    color: 'rgba(230,215,255,0.9)', marginBottom: '0.75rem',
                  }}>{step.title}</h3>
                  <p style={{ color: 'rgba(200,180,255,0.45)', fontSize: '1rem', lineHeight: 1.7 }}>{step.body}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Final CTA */}
          <div style={{
            marginTop: '5rem', textAlign: 'center',
            padding: '4rem 2rem',
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(200,180,255,0.1)',
            borderRadius: '2rem',
            backdropFilter: 'blur(10px)',
          }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1.5rem' }}>✦</div>
            <h2 style={{
              fontFamily: 'Cormorant Garamond, serif',
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              fontWeight: 300, color: 'rgba(230,215,255,0.9)',
              marginBottom: '1rem',
            }}>The numbers led you here.</h2>
            <p style={{ color: 'rgba(200,180,255,0.45)', fontSize: '1rem', marginBottom: '2.5rem', lineHeight: 1.7 }}>
              Maybe that wasn\'t an accident either.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/auth/signup" style={{
                padding: '1rem 3rem', borderRadius: '9999px',
                background: 'linear-gradient(135deg, rgba(180,120,255,0.25), rgba(100,80,200,0.25))',
                border: '1px solid rgba(200,150,255,0.4)',
                color: 'rgba(230,210,255,0.95)', textDecoration: 'none',
                fontSize: '0.95rem', letterSpacing: '0.08em',
                boxShadow: '0 0 50px rgba(180,120,255,0.15)',
              }}>Create Your Profile ✦</Link>
              <Link href="/dashboard" style={{
                padding: '1rem 3rem', borderRadius: '9999px',
                background: 'transparent',
                border: '1px solid rgba(200,180,255,0.2)',
                color: 'rgba(200,180,255,0.6)', textDecoration: 'none',
                fontSize: '0.95rem', letterSpacing: '0.08em',
              }}>Try the Logger First</Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────────────────── */}
      <footer style={{
        borderTop: '1px solid rgba(200,180,255,0.06)',
        padding: '2.5rem', textAlign: 'center',
        position: 'relative', zIndex: 10,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
          <span style={{ color: 'rgba(201,168,76,0.6)', fontSize: '0.9rem' }}>✦</span>
          <span style={{ fontFamily: 'Cormorant Garamond, serif', color: 'rgba(200,180,255,0.4)', fontSize: '1rem' }}>SynchroSoul</span>
        </div>
        <p style={{ color: 'rgba(200,180,255,0.2)', fontSize: '0.75rem', letterSpacing: '0.1em' }}>
          The universe is always speaking. Are you listening?
        </p>
      </footer>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-12px); }
        }
      `}</style>
    </main>
  )
}
