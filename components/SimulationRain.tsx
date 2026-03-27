'use client'
import { useEffect, useRef } from 'react'
import { useTheme } from '@/lib/theme-context'

export default function SimulationRain() {
  const { theme } = useTheme()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animRef = useRef<number>(0)

  useEffect(() => {
    if (theme !== 'simulation') return
    const el = canvasRef.current
    if (!el) return
    const ctx = el.getContext('2d')
    if (!ctx) return

    let W = window.innerWidth
    let H = window.innerHeight
    el.width = W
    el.height = H

    const resize = () => {
      W = window.innerWidth
      H = window.innerHeight
      el.width = W
      el.height = H
    }
    window.addEventListener('resize', resize)

    const chars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ@!<>?/[]{}^~'
    const fontSize = 14
    const columns = Math.floor(W / fontSize)
    const drops: number[] = Array(columns).fill(1)
    const speeds: number[] = drops.map(() => 0.3 + Math.random() * 0.7)

    function draw() {
      ctx!.fillStyle = 'rgba(0, 5, 0, 0.04)'
      ctx!.fillRect(0, 0, W, H)

      for (let i = 0; i < drops.length; i++) {
        const char = chars[Math.floor(Math.random() * chars.length)]
        const x = i * fontSize
        const y = drops[i] * fontSize
        const rand = Math.random()

        if (rand > 0.98) {
          ctx!.fillStyle = '#ffffff'
          ctx!.font = `bold ${fontSize}px monospace`
        } else if (rand > 0.9) {
          ctx!.fillStyle = '#88ff88'
          ctx!.font = `${fontSize}px monospace`
        } else {
          const intensity = Math.floor(Math.random() * 80 + 80)
          ctx!.fillStyle = `rgb(0, ${intensity}, 0)`
          ctx!.font = `${fontSize}px monospace`
        }

        ctx!.fillText(char, x, y)
        if (y > H && Math.random() > 0.975) drops[i] = 0
        drops[i] += speeds[i]
      }
    }

    let last = 0
    function animate(ts: number) {
      if (ts - last > 45) { draw(); last = ts }
      animRef.current = requestAnimationFrame(animate)
    }
    animRef.current = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(animRef.current)
      window.removeEventListener('resize', resize)
    }
  }, [theme])

  if (theme !== 'simulation') return null

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
        opacity: 0.4,
      }}
    />
  )
}
