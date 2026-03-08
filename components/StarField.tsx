'use client'
import { useEffect, useRef } from 'react'

interface Star {
  x: number
  y: number
  size: number
  opacity: number
  twinkleSpeed: number
  twinkleOffset: number
  vx: number
  vy: number
}

interface Constellation {
  name: string
  stars: { x: number; y: number }[]
  cx: number
  cy: number
  rotation: number
  rotationSpeed: number
  vx: number
  vy: number
  pulsePhase: number
  pulseSpeed: number
  active: boolean
  activationTimer: number
  color: string
}

const ANGEL_CONSTELLATIONS = [
  {
    name: '1111',
    // 4 stars in a vertical line
    stars: [{ x: 0, y: -45 }, { x: 0, y: -15 }, { x: 0, y: 15 }, { x: 0, y: 45 }],
    color: '#c9a84c',
  },
  {
    name: '333',
    // equilateral triangle
    stars: [{ x: 0, y: -35 }, { x: -30, y: 20 }, { x: 30, y: 20 }],
    color: '#a78bfa',
  },
  {
    name: '777',
    // 7 stars - big dipper style
    stars: [{ x: -40, y: 10 }, { x: -20, y: -5 }, { x: 0, y: -15 }, { x: 20, y: -5 }, { x: 35, y: 15 }, { x: 20, y: 35 }, { x: 0, y: 40 }],
    color: '#fbbf24',
  },
  {
    name: '555',
    // pentagon
    stars: [
      { x: 0, y: -38 },
      { x: 36, y: -12 },
      { x: 22, y: 32 },
      { x: -22, y: 32 },
      { x: -36, y: -12 },
    ],
    color: '#34d399',
  },
  {
    name: '222',
    // two pairs
    stars: [{ x: -25, y: -15 }, { x: -25, y: 15 }, { x: 25, y: -15 }, { x: 25, y: 15 }],
    color: '#60a5fa',
  },
  {
    name: '444',
    // square
    stars: [{ x: -28, y: -28 }, { x: 28, y: -28 }, { x: 28, y: 28 }, { x: -28, y: 28 }],
    color: '#f472b6',
  },
  {
    name: '888',
    // figure 8 / infinity
    stars: [{ x: -30, y: -20 }, { x: 0, y: -30 }, { x: 30, y: -20 }, { x: 0, y: 0 }, { x: -30, y: 20 }, { x: 0, y: 30 }, { x: 30, y: 20 }],
    color: '#c084fc',
  },
  {
    name: '999',
    // spiral-like
    stars: [{ x: 0, y: -40 }, { x: 28, y: -28 }, { x: 40, y: 0 }, { x: 28, y: 28 }, { x: 0, y: 40 }, { x: -20, y: 20 }, { x: -20, y: -20 }, { x: 0, y: 0 }],
    color: '#fb923c',
  },
]

export default function StarField() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationId: number
    let stars: Star[] = []
    let constellations: Constellation[] = []
    let time = 0

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      initStars()
      initConstellations()
    }

    const initStars = () => {
      const count = Math.floor((canvas.width * canvas.height) / 6000)
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 1.5 + 0.3,
        opacity: Math.random() * 0.5 + 0.1,
        twinkleSpeed: Math.random() * 0.02 + 0.005,
        twinkleOffset: Math.random() * Math.PI * 2,
        vx: (Math.random() - 0.5) * 0.05,
        vy: (Math.random() - 0.5) * 0.05,
      }))
    }

    const initConstellations = () => {
      constellations = ANGEL_CONSTELLATIONS.map((def) => ({
        name: def.name,
        stars: def.stars.map(s => ({ ...s })),
        cx: Math.random() * canvas.width * 0.8 + canvas.width * 0.1,
        cy: Math.random() * canvas.height * 0.8 + canvas.height * 0.1,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.0003,
        vx: (Math.random() - 0.5) * 0.15,
        vy: (Math.random() - 0.5) * 0.15,
        pulsePhase: Math.random() * Math.PI * 2,
        pulseSpeed: Math.random() * 0.01 + 0.005,
        active: Math.random() > 0.5,
        activationTimer: Math.random() * 300,
        color: def.color,
      }))
    }

    const drawStar = (x: number, y: number, size: number, opacity: number, color = 'white') => {
      ctx.beginPath()
      ctx.arc(x, y, size, 0, Math.PI * 2)
      ctx.fillStyle = color === 'white'
        ? `rgba(255,255,255,${opacity})`
        : color + Math.round(opacity * 255).toString(16).padStart(2, '0')
      ctx.fill()
      // glow
      if (opacity > 0.4) {
        ctx.beginPath()
        ctx.arc(x, y, size * 3, 0, Math.PI * 2)
        const grad = ctx.createRadialGradient(x, y, 0, x, y, size * 3)
        grad.addColorStop(0, color === 'white' ? `rgba(255,255,255,${opacity * 0.3})` : color + '40')
        grad.addColorStop(1, 'transparent')
        ctx.fillStyle = grad
        ctx.fill()
      }
    }

    const drawConstellation = (c: Constellation) => {
      const pulse = Math.sin(time * c.pulseSpeed + c.pulsePhase) * 0.5 + 0.5
      const baseOpacity = c.active ? 0.3 + pulse * 0.5 : 0.05 + pulse * 0.08
      const starOpacity = c.active ? 0.6 + pulse * 0.4 : 0.1 + pulse * 0.1

      // Transform stars
      const transformed = c.stars.map(s => {
        const rx = s.x * Math.cos(c.rotation) - s.y * Math.sin(c.rotation)
        const ry = s.x * Math.sin(c.rotation) + s.y * Math.cos(c.rotation)
        return { x: c.cx + rx, y: c.cy + ry }
      })

      // Draw lines between stars
      ctx.strokeStyle = c.color + Math.round(baseOpacity * 255).toString(16).padStart(2, '0')
      ctx.lineWidth = c.active ? 0.8 : 0.3
      ctx.beginPath()
      transformed.forEach((s, i) => {
        if (i === 0) ctx.moveTo(s.x, s.y)
        else ctx.lineTo(s.x, s.y)
      })
      if (c.stars.length > 2) ctx.closePath()
      ctx.stroke()

      // Draw stars
      transformed.forEach(s => {
        drawStar(s.x, s.y, c.active ? 2 + pulse : 1, starOpacity, c.color)
      })

      // Draw label when active
      if (c.active && pulse > 0.7) {
        ctx.font = `${10 + pulse * 4}px monospace`
        ctx.fillStyle = c.color + Math.round((pulse - 0.7) * 3 * 255).toString(16).padStart(2, '0')
        ctx.textAlign = 'center'
        ctx.fillText(c.name, c.cx, c.cy - 55)
      }
    }

    const animate = () => {
      time++
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Background gradient
      const bg = ctx.createRadialGradient(
        canvas.width * 0.5, canvas.height * 0.3, 0,
        canvas.width * 0.5, canvas.height * 0.5, canvas.width * 0.8
      )
      bg.addColorStop(0, '#0d0b1e')
      bg.addColorStop(0.5, '#080614')
      bg.addColorStop(1, '#030208')
      ctx.fillStyle = bg
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Draw background stars
      stars.forEach(s => {
        s.x += s.vx
        s.y += s.vy
        if (s.x < 0) s.x = canvas.width
        if (s.x > canvas.width) s.x = 0
        if (s.y < 0) s.y = canvas.height
        if (s.y > canvas.height) s.y = 0
        const twinkle = Math.sin(time * s.twinkleSpeed + s.twinkleOffset) * 0.3 + 0.7
        drawStar(s.x, s.y, s.size, s.opacity * twinkle)
      })

      // Draw constellations
      constellations.forEach(c => {
        c.cx += c.vx
        c.cy += c.vy
        c.rotation += c.rotationSpeed
        c.activationTimer--

        // Bounce off edges
        if (c.cx < 80 || c.cx > canvas.width - 80) c.vx *= -1
        if (c.cy < 80 || c.cy > canvas.height - 80) c.vy *= -1

        // Toggle active state
        if (c.activationTimer <= 0) {
          c.active = !c.active
          c.activationTimer = c.active
            ? 200 + Math.random() * 400
            : 100 + Math.random() * 300
        }

        drawConstellation(c)
      })

      animationId = requestAnimationFrame(animate)
    }

    resize()
    animate()
    window.addEventListener('resize', resize)

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full"
      style={{ zIndex: 0 }}
    />
  )
}
