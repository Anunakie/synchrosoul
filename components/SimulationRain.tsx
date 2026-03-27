'use client'
import { useEffect, useRef } from 'react'
import { useTheme } from '@/lib/theme-context'

const HIDDEN_MESSAGES = [
  'FREE YOUR MIND', 'WAKE UP', 'FOLLOW THE CODE', 'YOU ARE THE ANOMALY',
  'THERE IS NO SPOON', 'THE CODE KNOWS', 'CAUSALITY', 'SIGNAL DETECTED',
  'CHOICE NODE', 'ANOMALY CONFIRMED', 'TRUST THE ALGORITHM',
  'THE SIMULATION SEES YOU', 'BREAK THE LOOP', 'EXECUTE', 'ROOT ACCESS',
  '1111', '333', '444', '777', '1234', '11:11', 'SYSTEM AWARE',
  'PATTERN RECOGNIZED', 'YOU SEE IT NOW',
]

const CHARS = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ@!<>?/[]{}^~$#'

export default function SimulationRain() {
  const { theme } = useTheme()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const activeRef = useRef(false)
  const rafRef = useRef<number>(0)

  useEffect(() => {
    const el = canvasRef.current
    if (!el) return

    if (theme !== 'simulation') {
      activeRef.current = false
      cancelAnimationFrame(rafRef.current)
      const ctx = el.getContext('2d')
      if (ctx) ctx.clearRect(0, 0, el.width, el.height)
      return
    }

    const ctx = el.getContext('2d')
    if (!ctx) return
    activeRef.current = true

    const FS = 14
    let W = window.innerWidth
    let H = window.innerHeight
    el.width = W
    el.height = H
    let cols = Math.floor(W / FS)

    // Each column: y position, speed, and optional glitch message state
    interface Col {
      y: number
      speed: number
      // glitch state: when active, this column shows message chars slowly
      glitch: string[]
      gi: number          // current char index in glitch
      gTimer: number      // frames until next char advance
      gFade: number       // 0-1 glow fade
    }

    const makeCols = (n: number): Col[] =>
      Array.from({ length: n }, () => ({
        y: Math.random() * -50,
        speed: 0.3 + Math.random() * 0.6,
        glitch: [], gi: 0, gTimer: 0, gFade: 0,
      }))

    let columns = makeCols(cols)

    const onResize = () => {
      W = window.innerWidth; H = window.innerHeight
      el.width = W; el.height = H
      const newCols = Math.floor(W / FS)
      if (newCols > columns.length) {
        columns = [...columns, ...makeCols(newCols - columns.length)]
      } else {
        columns = columns.slice(0, newCols)
      }
      cols = newCols
    }
    window.addEventListener('resize', onResize)

    // Schedule glitch messages
    let nextGlitch = Date.now() + 3000 + Math.random() * 5000

    const fireGlitch = () => {
      const msg = HIDDEN_MESSAGES[Math.floor(Math.random() * HIDDEN_MESSAGES.length)]
      const col = Math.floor(1 + Math.random() * (columns.length - 2))
      const c = columns[col]
      if (c && c.glitch.length === 0) {
        c.glitch = msg.split('')
        c.gi = 0
        c.gTimer = 0
        c.gFade = 1.0
        c.y = Math.random() * 5   // restart near top
        c.speed = 0.12             // slow down during message
      }
    }

    let last = 0
    const draw = (ts: number) => {
      if (!activeRef.current) return
      rafRef.current = requestAnimationFrame(draw)

      if (ts - last < 42) return  // ~24fps cap
      last = ts

      // Gentle fade — keeps persistent trails without ever going pure black
      ctx.fillStyle = 'rgba(0, 3, 0, 0.04)'
      ctx.fillRect(0, 0, W, H)

      // Trigger glitch messages
      if (Date.now() > nextGlitch) {
        fireGlitch()
        nextGlitch = Date.now() + 5000 + Math.random() * 9000
      }

      for (let i = 0; i < columns.length; i++) {
        const c = columns[i]
        const x = i * FS
        const y = c.y * FS

        let ch: string
        let isGlitch = false

        if (c.glitch.length > 0) {
          // Advance message timer
          c.gTimer++
          if (c.gTimer >= 14 && c.gi < c.glitch.length - 1) {
            c.gi++
            c.gTimer = 0
          } else if (c.gi >= c.glitch.length - 1) {
            // Linger then clear
            c.gFade -= 0.008
            if (c.gFade <= 0) {
              c.glitch = []; c.gi = 0; c.gFade = 0
              c.speed = 0.3 + Math.random() * 0.6  // restore speed
            }
          }
          ch = c.glitch[c.gi] || ' '
          isGlitch = true
        } else {
          ch = CHARS[Math.floor(Math.random() * CHARS.length)]
        }

        // Set colour & glow
        const rnd = Math.random()
        if (isGlitch) {
          const alpha = Math.max(0.3, c.gFade)
          ctx.shadowBlur = 14
          ctx.shadowColor = `rgba(0,255,65,${alpha})`
          ctx.fillStyle = c.gFade > 0.7
            ? `rgba(255,255,255,${alpha})`
            : `rgba(68,255,100,${alpha})`
          ctx.font = `bold ${FS}px 'Share Tech Mono', monospace`
        } else if (rnd > 0.993) {
          ctx.shadowBlur = 8; ctx.shadowColor = '#fff'
          ctx.fillStyle = '#ffffff'
          ctx.font = `bold ${FS}px monospace`
        } else if (rnd > 0.96) {
          ctx.shadowBlur = 3; ctx.shadowColor = '#00ff41'
          ctx.fillStyle = '#88ff88'
          ctx.font = `${FS}px monospace`
        } else {
          const br = 60 + Math.floor(Math.random() * 100)
          ctx.shadowBlur = 0; ctx.shadowColor = 'transparent'
          ctx.fillStyle = `rgb(0,${br},0)`
          ctx.font = `${FS}px monospace`
        }

        ctx.fillText(ch, x, y)
        if (isGlitch) { ctx.shadowBlur = 0; ctx.shadowColor = 'transparent' }

        // Advance position — always reset when past bottom
        c.y += c.speed
        if (c.y * FS > H + FS) {
          c.y = -(1 + Math.random() * 10)  // reset to just above top
        }
      }
    }

    cancelAnimationFrame(rafRef.current)
    rafRef.current = requestAnimationFrame(draw)

    return () => {
      activeRef.current = false
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener('resize', onResize)
    }
  }, [theme])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0, left: 0,
        width: '100vw', height: '100vh',
        zIndex: 0,
        pointerEvents: 'none',
        display: 'block',
      }}
    />
  )
}
