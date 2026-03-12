import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'SynchroSoul — Angel Number Dating & Spiritual Matching'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          background: 'linear-gradient(135deg, #050510 0%, #0a0520 50%, #050510 100%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'serif',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Purple nebula glow */}
        <div style={{
          position: 'absolute', top: '-50px', left: '-50px',
          width: '500px', height: '500px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(150,80,255,0.2) 0%, transparent 70%)',
        }} />
        {/* Pink nebula glow */}
        <div style={{
          position: 'absolute', bottom: '-50px', right: '-50px',
          width: '450px', height: '450px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,80,180,0.15) 0%, transparent 70%)',
        }} />
        {/* Floating numbers */}
        {[['1111', '5%', '15%'], ['333', '88%', '12%'], ['555', '3%', '72%'], ['777', '87%', '68%']].map(([n, l, t]) => (
          <div key={n} style={{
            position: 'absolute', left: l, top: t,
            fontSize: '28px', color: 'rgba(200,170,255,0.2)',
            letterSpacing: '0.2em',
          }}>{n}</div>
        ))}
        {/* Gold star */}
        <div style={{ fontSize: '52px', color: 'rgba(201,168,76,0.9)', marginBottom: '16px' }}>✦</div>
        {/* Title */}
        <div style={{
          fontSize: '80px', fontWeight: 'bold',
          color: 'rgba(220,200,255,0.95)',
          letterSpacing: '0.02em', marginBottom: '16px',
        }}>SynchroSoul</div>
        {/* Subtitle */}
        <div style={{
          fontSize: '30px', color: 'rgba(180,150,255,0.8)',
          marginBottom: '20px', letterSpacing: '0.01em',
        }}>Angel Number Dating & Spiritual Matching</div>
        {/* Tagline */}
        <div style={{
          fontSize: '20px', color: 'rgba(201,168,76,0.75)',
          letterSpacing: '0.15em',
        }}>LOG 1111  ·  MATCH SOULS  ·  DISCOVER YOUR NUMEROLOGY</div>
        {/* Badge */}
        <div style={{
          marginTop: '32px',
          padding: '10px 40px',
          borderRadius: '999px',
          border: '1px solid rgba(201,168,76,0.35)',
          background: 'rgba(201,168,76,0.08)',
          fontSize: '16px', color: 'rgba(201,168,76,0.8)',
          letterSpacing: '0.2em',
        }}>FREE  ·  SPIRITUAL  ·  COSMIC</div>
      </div>
    ),
    { ...size }
  )
}
