import Link from 'next/link'
import StarField from '@/components/StarField'

const ANGEL_NUMBERS = ['1111', '555', '333', '777', '222', '444', '888', '999']

export default function LandingPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
      <StarField />

      {/* Ambient glow orbs */}
      <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 1 }}>
        <div style={{
          position: 'absolute', top: '20%', left: '15%',
          width: '400px', height: '400px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(167,139,250,0.06) 0%, transparent 70%)',
        }} />
        <div style={{
          position: 'absolute', bottom: '25%', right: '10%',
          width: '500px', height: '500px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(201,168,76,0.05) 0%, transparent 70%)',
        }} />
      </div>

      {/* Content */}
      <div className="relative flex flex-col items-center text-center px-6 max-w-3xl mx-auto" style={{ zIndex: 2 }}>

        {/* Eyebrow */}
        <div className="animate-fade-in-up mb-8" style={{ opacity: 0 }}>
          <span className="angel-badge">Angel Number Dating</span>
        </div>

        {/* Logo mark */}
        <div className="animate-fade-in-up delay-100 mb-8" style={{ opacity: 0 }}>
          <div className="relative inline-flex items-center justify-center">
            <div className="w-16 h-16 rounded-full animate-float" style={{
              background: 'radial-gradient(circle, rgba(201,168,76,0.15) 0%, transparent 70%)',
              border: '1px solid rgba(201,168,76,0.2)',
            }}>
              <span style={{ fontSize: '1.75rem', lineHeight: '4rem', display: 'block' }}>✦</span>
            </div>
            <div className="absolute inset-0 rounded-full animate-pulse-ring" style={{
              border: '1px solid rgba(201,168,76,0.15)',
            }} />
          </div>
        </div>

        {/* Title */}
        <h1 className="animate-fade-in-up delay-200 serif gradient-text text-glow-gold mb-4"
          style={{ fontSize: 'clamp(3rem, 8vw, 6rem)', lineHeight: 1.05, opacity: 0, fontWeight: 300 }}>
          SynchroSoul
        </h1>

        {/* Subtitle */}
        <p className="animate-fade-in-up delay-300 serif mb-6"
          style={{ fontSize: 'clamp(1.1rem, 2.5vw, 1.5rem)', color: 'rgba(255,255,255,0.45)', fontStyle: 'italic', opacity: 0 }}>
          The universe speaks in numbers
        </p>

        {/* Divider */}
        <div className="animate-fade-in-up delay-300 divider w-32 mx-auto" style={{ opacity: 0 }} />

        {/* Description */}
        <p className="animate-fade-in-up delay-400 mb-12"
          style={{ fontSize: '0.95rem', color: 'rgba(255,255,255,0.4)', lineHeight: 1.8, maxWidth: '480px', opacity: 0 }}>
          Log the angel numbers you encounter. Connect with souls experiencing
          the same cosmic signals. Discover if it&apos;s fate.
        </p>

        {/* CTA Buttons */}
        <div className="animate-fade-in-up delay-500 flex flex-col sm:flex-row gap-3 w-full max-w-xs mx-auto mb-16" style={{ opacity: 0 }}>
          <Link href="/auth/signup" className="w-full">
            <button className="btn-primary">Begin Your Journey</button>
          </Link>
          <Link href="/auth/login" className="w-full">
            <button className="btn-ghost">Sign In</button>
          </Link>
        </div>

        {/* Feature row */}
        <div className="animate-fade-in-up delay-600 grid grid-cols-3 gap-6 w-full max-w-lg mx-auto mb-16" style={{ opacity: 0 }}>
          {[
            { icon: '◈', label: 'Log Numbers', desc: 'One tap to capture every sign' },
            { icon: '◉', label: 'Sync & Match', desc: 'Find your cosmic counterpart' },
            { icon: '◇', label: 'Numerology', desc: 'Discover your soul blueprint' },
          ].map((f) => (
            <div key={f.label} className="flex flex-col items-center gap-2">
              <span style={{ fontSize: '1.25rem', color: 'rgba(201,168,76,0.6)' }}>{f.icon}</span>
              <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)', fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase' }}>{f.label}</span>
              <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.25)', lineHeight: 1.5 }}>{f.desc}</span>
            </div>
          ))}
        </div>

        {/* Angel number pills */}
        <div className="animate-fade-in-up delay-600 flex flex-wrap justify-center gap-2" style={{ opacity: 0 }}>
          {ANGEL_NUMBERS.map((num) => (
            <span key={num} className="angel-badge">{num}</span>
          ))}
        </div>

        {/* Footer line */}
        <p className="mt-12 animate-fade-in-up delay-600" style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.15)', letterSpacing: '0.2em', textTransform: 'uppercase', opacity: 0 }}>
          Are you listening?
        </p>
      </div>
    </main>
  )
}
