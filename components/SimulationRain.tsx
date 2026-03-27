'use client'
import { useEffect, useRef, useCallback } from 'react'
import { useTheme } from '@/lib/theme-context'

// Pool of hidden messages that occasionally surface in the rain
const HIDDEN_MESSAGES = [
  'FREE YOUR MIND',
  'WAKE UP',
  'FOLLOW THE CODE',
  'YOU ARE THE ANOMALY',
  'THERE IS NO SPOON',
  'THE CODE KNOWS',
  'CAUSALITY',
  'SIGNAL DETECTED',
  'CHOICE NODE',
  'ANOMALY CONFIRMED',
  'TRUST THE ALGORITHM',
  'THE SIMULATION SEES YOU',
  'BREAK THE LOOP',
  'EXECUTE',
  '1111',
  '333',
  '444',
  '777',
  '1234',
  '11:11',
  'ROOT ACCESS',
  'SYSTEM AWARE',
  'PATTERN RECOGNIZED',
]

const KATAKANA = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン'
const LATIN = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ@!<>?/[]{}^~$#&*'
const ALL_CHARS = KATAKANA + LATIN

interface Drop {
  y: number
  speed: number
  brightness: number
  // hidden message state
  msgChars: string[]
  msgIdx: number
  msgTimer: number
  msgActive: boolean
  msgGlowFade: number[] // per-char glow intensity
}

export default function SimulationRain() {
  const { theme } = useTheme()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animRef = useRef<number>(0)
  const stateRef = useRef<Drop[]>([])

  const isSimulation = theme === 'simulation'

  const startAnimation = useCallback(() => {
    const el = canvasRef.current
    if (!el) return
    const ctxMaybe = el.getContext('2d')
    if (!ctxMaybe) return
    const ctx: CanvasRenderingContext2D = ctxMaybe

    let W = window.innerWidth
    let H = window.innerHeight
    el.width = W
    el.height = H

    const fontSize = 14
    let columns = Math.floor(W / fontSize)

    // Initialize drops
    const initDrops = (count: number): Drop[] =>
      Array.from({ length: count }, () => ({
        y: Math.random() * -100,
        speed: 0.25 + Math.random() * 0.65,
        brightness: Math.floor(Math.random() * 80 + 80),
        msgChars: [],
        msgIdx: 0,
        msgTimer: 0,
        msgActive: false,
        msgGlowFade: [],
      }))

    stateRef.current = initDrops(columns)

    const resize = () => {
      W = window.innerWidth
      H = window.innerHeight
      el.width = W
      el.height = H
      columns = Math.floor(W / fontSize)
      // Resize drops array without resetting
      if (stateRef.current.length < columns) {
        stateRef.current = [...stateRef.current, ...initDrops(columns - stateRef.current.length)]
      } else if (stateRef.current.length > columns) {
        stateRef.current = stateRef.current.slice(0, columns)
      }
    }
    window.addEventListener('resize', resize)

    // Track revealed chars for glowing effect: {col, row} -> glow intensity
    const glowMap = new Map<string, number>()

    // Schedule next hidden message reveal
    let nextMsgTime = Date.now() + 3000 + Math.random() * 5000

    function triggerHiddenMessage() {
      const msg = HIDDEN_MESSAGES[Math.floor(Math.random() * HIDDEN_MESSAGES.length)]
      // Pick a random starting column that has room
      const startCol = Math.floor(Math.random() * (columns - msg.length - 2)) + 1
      // Place chars horizontally across columns at a fixed row
      const row = Math.floor(0.2 + Math.random() * 0.5) // 20-70% down screen
      const y = row * H

      // Mark each column in that range to glow the char at that y position
      for (let i = 0; i < msg.length; i++) {
        const col = startCol + i
        const key = `${col}_${Math.floor(y / fontSize)}`
        glowMap.set(key, 1.0)
        // Store the specific char to display
        const drop = stateRef.current[col]
        if (drop) {
          drop.msgChars = [msg[i]]
          drop.msgGlowFade = [1.0]
          drop.msgActive = true
          drop.msgTimer = 180 + i * 8 // stagger the reveal slightly
        }
      }
    }

    // Alternative: vertical message drop (column spells word downward)
    function triggerVerticalMessage() {
      const msg = HIDDEN_MESSAGES[Math.floor(Math.random() * HIDDEN_MESSAGES.length)]
      const col = Math.floor(Math.random() * (columns - 4)) + 2
      const drop = stateRef.current[col]
      if (drop && !drop.msgActive) {
        drop.msgChars = msg.split('')
        drop.msgIdx = 0
        drop.msgTimer = 0
        drop.msgActive = true
        drop.msgGlowFade = new Array(msg.length).fill(0)
        drop.y = 0 // restart this column from top
        drop.speed = 0.15 // slow it down for the message
      }
    }

    let last = 0
    let frameCount = 0

    function draw(ts: number) {
      if (ts - last < 40) {
        animRef.current = requestAnimationFrame(draw)
        return
      }
      last = ts
      frameCount++

      // Semi-transparent black overlay — keeps trail but never fully blacks out
      ctx.fillStyle = 'rgba(0, 4, 0, 0.05)'
      ctx.fillRect(0, 0, W, H)

      // Trigger hidden messages periodically
      if (Date.now() > nextMsgTime) {
        if (Math.random() > 0.3) {
          triggerVerticalMessage()
        } else {
          triggerHiddenMessage()
        }
        nextMsgTime = Date.now() + 4000 + Math.random() * 8000
      }

      for (let i = 0; i < stateRef.current.length; i++) {
        const drop = stateRef.current[i]
        const x = i * fontSize
        const y = drop.y * fontSize

        let charToDraw: string
        let isMsg = false

        if (drop.msgActive && drop.msgChars.length > 0) {
          // This column is displaying a message character
          const msgChar = drop.msgChars[drop.msgIdx] || drop.msgChars[drop.msgChars.length - 1]
          charToDraw = msgChar
          isMsg = true
          drop.msgTimer--
          if (drop.msgTimer <= 0 && drop.msgIdx < drop.msgChars.length - 1) {
            drop.msgIdx++
            drop.msgTimer = 20
          } else if (drop.msgTimer <= -120) {
            // Message done - fade out and reset
            drop.msgActive = false
            drop.msgChars = []
            drop.msgIdx = 0
            drop.speed = 0.25 + Math.random() * 0.65 // restore speed
          }
        } else {
          charToDraw = ALL_CHARS[Math.floor(Math.random() * ALL_CHARS.length)]
        }

        // Determine color
        const rand = Math.random()
        if (isMsg) {
          // Glowing white/bright green for messages
          const glow = Math.max(0, 1 - Math.abs(drop.msgTimer) / 100)
          if (glow > 0.5) {
            // Draw glow effect
            ctx.shadowBlur = 12
            ctx.shadowColor = '#00ff41'
            ctx.fillStyle = '#ffffff'
            ctx.font = `bold ${fontSize}px 'Share Tech Mono', monospace`
          } else {
            ctx.shadowBlur = 6
            ctx.shadowColor = '#00ff41'
            ctx.fillStyle = '#44ff88'
            ctx.font = `bold ${fontSize}px 'Share Tech Mono', monospace`
          }
        } else if (rand > 0.99) {
          // Rare super-bright white flash
          ctx.shadowBlur = 8
          ctx.shadowColor = '#ffffff'
          ctx.fillStyle = '#ffffff'
          ctx.font = `bold ${fontSize}px monospace`
        } else if (rand > 0.94) {
          // Brighter green
          ctx.shadowBlur = 4
          ctx.shadowColor = '#00ff41'
          ctx.fillStyle = '#88ff88'
          ctx.font = `${fontSize}px monospace`
        } else if (rand > 0.7) {
          // Medium green
          ctx.shadowBlur = 0
          ctx.fillStyle = `rgb(0, ${drop.brightness}, 0)`
          ctx.font = `${fontSize}px monospace`
        } else {
          // Dim green
          ctx.shadowBlur = 0
          const dim = Math.floor(drop.brightness * 0.5)
          ctx.fillStyle = `rgb(0, ${dim}, 0)`
          ctx.font = `${fontSize}px monospace`
        }

        ctx.fillText(charToDraw, x, y)

        // Reset shadow after message chars
        if (isMsg) {
          ctx.shadowBlur = 0
          ctx.shadowColor = 'transparent'
        }

        // Advance drop
        if (!drop.msgActive) {
          if (y > H && Math.random() > 0.97) {
            drop.y = -Math.floor(Math.random() * 20) // randomize restart
          }
          drop.y += drop.speed
        } else {
          // Slower advance during message
          drop.y += drop.speed
        }
      }
    }

    cancelAnimationFrame(animRef.current)
    animRef.current = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(animRef.current)
      window.removeEventListener('resize', resize)
    }
  }, [])

  useEffect(() => {
    if (!isSimulation) {
      cancelAnimationFrame(animRef.current)
      // Clear canvas
      const el = canvasRef.current
      if (el) {
        const ctx = el.getContext('2d')
        ctx?.clearRect(0, 0, el.width, el.height)
      }
      return
    }
    const cleanup = startAnimation()
    return cleanup
  }, [isSimulation, startAnimation])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 0,
        pointerEvents: 'none',
        opacity: isSimulation ? 0.55 : 0,
        transition: 'opacity 1.5s ease',
      }}
    />
  )
}
