import Link from 'next/link'
import StarField from '@/components/StarField'
import StickyNav from '@/components/StickyNav'

export default function HomePage() {
  return (
    <main style={{ background: '#050510', color: '#fff', fontFamily: 'inherit', overflowX: 'hidden' }}>
      <StarField />
      <StickyNav />

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
      {/* ── SOCIAL PROOF ─────────────────────────────────────────────────── */}
      <section style={{
        padding: '4rem 1.5rem 2rem',
        maxWidth: '960px', margin: '0 auto',
        position: 'relative', zIndex: 10,
      }}>
        <h2 style={{
          fontFamily: 'Cormorant Garamond, serif',
          fontSize: 'clamp(1.5rem, 3vw, 2rem)',
          color: 'rgba(220,200,255,0.85)',
          textAlign: 'center', fontWeight: 300,
          letterSpacing: '0.05em', marginBottom: '2.5rem',
        }}>What the Universe Brought Together</h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '1.25rem',
        }}>
          {[
            { initials: 'LM', name: 'Luna M.', quote: 'I logged 1111 and within minutes found my soul twin. We both saw it at 11:11am. Absolute chills. This app is pure magic.' },
            { initials: 'SR', name: 'Sage R.', quote: 'The numerology reading was spot-on. My life path 7 explains everything about why I see 777 constantly. Finally, clarity.' },
            { initials: 'RK', name: 'River K.', quote: 'Finally an app that gets the spiritual side of connection. Met someone who sees the same numbers as me. We talk every day now.' },
          ].map(({ initials, name, quote }) => (
            <div key={name} style={{
              background: 'rgba(8,6,28,0.88)',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: '1.5rem',
              backdropFilter: 'blur(12px)',
              padding: '1.75rem',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                <div style={{
                  width: '2.5rem', height: '2.5rem', borderRadius: '50%',
                  background: 'linear-gradient(135deg, rgba(201,168,76,0.3), rgba(167,139,250,0.3))',
                  border: '1px solid rgba(201,168,76,0.3)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'Cormorant Garamond, serif', fontSize: '0.9rem',
                  color: 'rgba(201,168,76,0.9)', fontWeight: 600,
                }}>{initials}</div>
                <div>
                  <div style={{ fontSize: '0.85rem', color: 'rgba(220,200,255,0.8)', fontWeight: 500 }}>{name}</div>
                  <div style={{ fontSize: '0.65rem', color: 'rgba(201,168,76,0.6)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Verified Member</div>
                </div>
                <div style={{ marginLeft: 'auto', color: 'rgba(201,168,76,0.5)', fontSize: '1rem' }}>&#10022;</div>
              </div>
              <p style={{
                color: 'rgba(180,160,255,0.65)',
                lineHeight: 1.7, margin: 0, fontStyle: 'italic',
                fontFamily: 'Cormorant Garamond, serif', fontSize: '1rem',
              }}>&ldquo;{quote}&rdquo;</p>
            </div>
          ))}
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


      {/* ── SEO: ANGEL NUMBERS GUIDE ─────────────────────────────────────── */}
      <section style={{
        padding: '5rem 2rem', maxWidth: '1100px', margin: '0 auto',
        position: 'relative', zIndex: 10,
      }}>
        <h2 style={{
          fontFamily: 'Cormorant Garamond, serif',
          fontSize: 'clamp(2rem, 4vw, 3rem)',
          color: 'rgba(220,200,255,0.85)', textAlign: 'center',
          fontWeight: 300, marginBottom: '1rem',
        }}>What Are Angel Numbers?</h2>
        <p style={{
          textAlign: 'center', color: 'rgba(180,150,255,0.65)',
          fontSize: '1.05rem', lineHeight: 1.8, maxWidth: '700px',
          margin: '0 auto 3.5rem', fontFamily: 'Inter, sans-serif',
        }}>
          Angel numbers are repeating number sequences — like 1111, 555, or 333 — that carry
          spiritual meaning and divine guidance. When you notice the same numbers repeatedly,
          the universe may be sending you a message.
        </p>

        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1.25rem',
        }}>
          {[
            { num: '1111', title: 'New Beginnings', color: 'rgba(201,168,76,0.8)', desc: 'A portal is opening. Your thoughts are manifesting rapidly. Stay positive and aligned with your highest self.' },
            { num: '222', title: 'Divine Balance', color: 'rgba(150,200,255,0.8)', desc: 'Trust the process. You are exactly where you need to be. Partnerships and harmony are highlighted.' },
            { num: '333', title: 'Ascended Masters', color: 'rgba(200,150,255,0.8)', desc: 'You are surrounded by divine support. Your creativity and self-expression are being amplified.' },
            { num: '444', title: 'Angelic Protection', color: 'rgba(150,255,200,0.8)', desc: 'Your angels are near. You are safe, supported, and on the right path. Build your foundations.' },
            { num: '555', title: 'Major Change', color: 'rgba(255,180,100,0.8)', desc: 'Transformation is coming. Release what no longer serves you and embrace the new chapter unfolding.' },
            { num: '777', title: 'Spiritual Awakening', color: 'rgba(255,150,200,0.8)', desc: 'You are in deep alignment with the universe. Luck, wisdom, and spiritual growth surround you.' },
            { num: '888', title: 'Infinite Abundance', color: 'rgba(255,220,100,0.8)', desc: 'Financial and spiritual abundance flows to you. The cycle of giving and receiving is in perfect balance.' },
            { num: '999', title: 'Divine Completion', color: 'rgba(200,180,255,0.8)', desc: 'A major chapter is closing. Release the old with gratitude and prepare for your next soul mission.' },
          ].map(({ num, title, color, desc }) => (
            <article key={num} style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(200,180,255,0.08)',
              borderRadius: '16px', padding: '1.5rem',
              backdropFilter: 'blur(10px)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <span style={{
                  fontFamily: 'Cormorant Garamond, serif',
                  fontSize: '1.6rem', color, letterSpacing: '0.1em',
                }}>{num}</span>
                <h3 style={{
                  fontFamily: 'Cormorant Garamond, serif',
                  fontSize: '1.1rem', color: 'rgba(220,200,255,0.8)',
                  fontWeight: 400, margin: 0,
                }}>{title}</h3>
              </div>
              <p style={{
                color: 'rgba(180,160,255,0.55)', fontSize: '0.85rem',
                lineHeight: 1.7, margin: 0, fontFamily: 'Inter, sans-serif',
              }}>{desc}</p>
            </article>
          ))}
        </div>
      </section>


      {/* ── TESTIMONIALS ─────────────────────────────────────────────── */}
      <section style={{
        padding: '4rem 2rem 3rem', maxWidth: '900px', margin: '0 auto',
        position: 'relative', zIndex: 10,
      }}>
        <p style={{
          textAlign: 'center', fontSize: '0.7rem', letterSpacing: '0.2em',
          textTransform: 'uppercase', color: 'rgba(201,168,76,0.6)',
          marginBottom: '0.75rem',
        }}>Soul Stories</p>
        <h2 style={{
          fontFamily: 'Cormorant Garamond, serif',
          fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)',
          color: 'rgba(220,200,255,0.85)', textAlign: 'center',
          fontWeight: 300, marginBottom: '2.5rem',
        }}>What the Universe Brought Together</h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '1.5rem',
        }}>
          {[
            {
              quote: "I logged 1111 three times in one day. SynchroSoul showed me someone who logged it at the exact same minute. We've been talking every day since. It feels fated.",
              name: 'Luna M.',
              detail: 'Life Path 7 • Logged 1111',
              color: 'rgba(180,140,255,0.15)',
              border: 'rgba(180,140,255,0.2)',
            },
            {
              quote: "The Thought Anchor Journal changed how I see synchronicities. I started noticing patterns in what I was thinking every time 444 appeared. Mind-blowing.",
              name: 'Sage R.',
              detail: 'Life Path 4 • Logged 444',
              color: 'rgba(201,168,76,0.1)',
              border: 'rgba(201,168,76,0.2)',
            },
            {
              quote: "I was skeptical at first. Then I matched with someone who saw 333 the same morning I did, and we share the same Soul Urge number. Coincidence? I think not.",
              name: 'River K.',
              detail: 'Life Path 3 • Logged 333',
              color: 'rgba(100,200,255,0.08)',
              border: 'rgba(100,200,255,0.15)',
            },
          ].map(({ quote, name, detail, color, border }, i) => (
            <div key={i} style={{
              background: color,
              border: `1px solid ${border}`,
              borderRadius: '16px',
              padding: '1.75rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
            }}>
              <p style={{
                color: 'rgba(220,200,255,0.8)',
                fontSize: '0.95rem',
                lineHeight: 1.8,
                fontFamily: 'Cormorant Garamond, serif',
                fontStyle: 'italic',
                margin: 0,
              }}>&ldquo;{quote}&rdquo;</p>
              <div>
                <p style={{ color: 'rgba(201,168,76,0.9)', fontSize: '0.85rem', fontWeight: 600, margin: '0 0 0.2rem' }}>{name}</p>
                <p style={{ color: 'rgba(180,160,255,0.5)', fontSize: '0.75rem', letterSpacing: '0.05em', margin: 0 }}>{detail}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── SEO: FAQ ─────────────────────────────────────────────────────── */}
      <section style={{
        padding: '4rem 2rem 5rem', maxWidth: '800px', margin: '0 auto',
        position: 'relative', zIndex: 10,
      }}>
        <h2 style={{
          fontFamily: 'Cormorant Garamond, serif',
          fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)',
          color: 'rgba(220,200,255,0.85)', textAlign: 'center',
          fontWeight: 300, marginBottom: '2.5rem',
        }}>Frequently Asked Questions</h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {[
            {
              q: 'How does SynchroSoul match people using angel numbers?',
              a: 'When you log an angel number, SynchroSoul compares it with numbers logged by other users in the past 24-48 hours. A Sync Score is calculated based on shared numbers, numerology compatibility (Life Path, Soul Urge), and timing proximity — creating meaningful cosmic connections.'
            },
            {
              q: 'What is a Life Path number in numerology?',
              a: 'Your Life Path number is calculated from your birthdate by reducing all digits to a single number (or master number 11, 22, 33). It reveals your core personality, strengths, and life purpose. SynchroSoul calculates yours automatically when you sign up.'
            },
            {
              q: 'Is SynchroSoul free to use?',
              a: 'Yes! SynchroSoul is free to join. You can log angel numbers, keep a thought anchor journal, view your numerology profile, and browse sync matches at no cost. Premium Mystic and Twin Flame tiers unlock AI Oracle readings, deep numerology reports, and advanced matching features.'
            },
            {
              q: 'What is a Truth Score and Angel Approved badge?',
              a: 'When you upload a screenshot of the angel number you saw (a clock, license plate, receipt, etc.), SynchroSoul awards your entry an Angel Approved badge and increases your Truth Score. This adds authenticity to your logs and boosts your visibility in sync matching.'
            },
            {
              q: 'Can I use SynchroSoul on my phone?',
              a: 'Yes! SynchroSoul is a Progressive Web App (PWA). On iPhone, open it in Safari and tap Share → Add to Home Screen. On Android, open in Chrome and tap Install App. It works like a native app with offline support.'
            },
            {
              q: 'What is the Thought Anchor Journal?',
              a: 'The Thought Anchor Journal lets you record what you were thinking or feeling the moment you saw an angel number. Over time, patterns emerge — revealing what the universe is responding to in your life. All entries are private unless you choose to share them.'
            },
          ].map(({ q, a }, i) => (
            <div key={i} style={{
              background: 'rgba(255,255,255,0.025)',
              border: '1px solid rgba(200,180,255,0.07)',
              borderRadius: '12px', padding: '1.5rem',
            }}>
              <h3 style={{
                fontFamily: 'Cormorant Garamond, serif',
                fontSize: '1.15rem', color: 'rgba(220,200,255,0.85)',
                fontWeight: 400, margin: '0 0 0.75rem',
              }}>{q}</h3>
              <p style={{
                color: 'rgba(180,160,255,0.6)', fontSize: '0.9rem',
                lineHeight: 1.75, margin: 0, fontFamily: 'Inter, sans-serif',
              }}>{a}</p>
            </div>
          ))}
        </div>
      </section>


      {/* ── SHARE THE MAGIC ──────────────────────────────────────────────── */}
      <section style={{
        padding: '3rem 2rem',
        textAlign: 'center',
        position: 'relative', zIndex: 10,
      }}>
        <p style={{
          fontFamily: 'Cormorant Garamond, serif',
          fontSize: '1.1rem',
          color: 'rgba(200,180,255,0.6)',
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          marginBottom: '0.75rem',
        }}>Share the Magic</p>
        <p style={{
          color: 'rgba(255,255,255,0.5)',
          fontSize: '0.95rem',
          marginBottom: '1.5rem',
        }}>Know someone who keeps seeing angel numbers?</p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <a
            href="https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fsynchrosoul.app"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex', alignItems: 'center', gap: '0.5rem',
              padding: '0.75rem 1.5rem',
              background: 'rgba(24,119,242,0.15)',
              border: '1px solid rgba(24,119,242,0.4)',
              borderRadius: '50px',
              color: '#6ba3f5',
              textDecoration: 'none',
              fontSize: '0.95rem',
              fontWeight: 500,
              transition: 'all 0.2s',
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
            Share on Facebook
          </a>
          <a
            href="https://twitter.com/intent/tweet?url=https%3A%2F%2Fsynchrosoul.app&text=I%20found%20an%20app%20that%20matches%20you%20with%20people%20seeing%20the%20same%20angel%20numbers%20%F0%9F%94%AE%20If%20you%20keep%20seeing%201111%2C%20555%2C%20333...%20this%20is%20for%20you."
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex', alignItems: 'center', gap: '0.5rem',
              padding: '0.75rem 1.5rem',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '50px',
              color: 'rgba(255,255,255,0.8)',
              textDecoration: 'none',
              fontSize: '0.95rem',
              fontWeight: 500,
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.259 5.63zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
            Share on X
          </a>
          <a
            href="https://wa.me/?text=I%20found%20an%20app%20that%20matches%20you%20with%20people%20seeing%20the%20same%20angel%20numbers%20%F0%9F%94%AE%20https%3A%2F%2Fsynchrosoul.app"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex', alignItems: 'center', gap: '0.5rem',
              padding: '0.75rem 1.5rem',
              background: 'rgba(37,211,102,0.1)',
              border: '1px solid rgba(37,211,102,0.3)',
              borderRadius: '50px',
              color: '#4ade80',
              textDecoration: 'none',
              fontSize: '0.95rem',
              fontWeight: 500,
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Share on WhatsApp
          </a>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────────────────── */}
      <footer style={{
        borderTop: '1px solid rgba(200,180,255,0.06)',
        padding: '3rem 2rem 2rem',
        position: 'relative', zIndex: 10,
      }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <span style={{ color: 'rgba(201,168,76,0.6)', fontSize: '0.9rem' }}>&#10022;</span>
            <span style={{ fontFamily: 'Cormorant Garamond, serif', color: 'rgba(200,180,255,0.5)', fontSize: '1.1rem' }}>SynchroSoul</span>
          </div>
          <p style={{ color: 'rgba(200,180,255,0.3)', fontSize: '0.8rem', letterSpacing: '0.08em', textAlign: 'center', marginBottom: '1.5rem' }}>
            Where angel numbers become connections
          </p>
          <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
            {[
              { href: '/auth/login', label: 'Sign In' },
              { href: '/auth/signup', label: 'Get Started' },
              { href: '/dashboard', label: 'Dashboard' },
            ].map(({ href, label }) => (
              <a key={href} href={href} style={{
                color: 'rgba(180,160,255,0.35)', fontSize: '0.75rem',
                textDecoration: 'none', letterSpacing: '0.1em',
                textTransform: 'uppercase',
                transition: 'color 0.2s',
              }}>{label}</a>
            ))}
          </div>
          <p style={{ color: 'rgba(200,180,255,0.15)', fontSize: '0.7rem', textAlign: 'center', letterSpacing: '0.05em' }}>
            &copy; {new Date().getFullYear()} SynchroSoul. The universe is always speaking. Are you listening?
          </p>
        </div>
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
