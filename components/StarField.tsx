'use client';

import { useEffect, useRef } from 'react';

interface Star {
  x: number;
  y: number;
  radius: number;
  opacity: number;
  twinkleSpeed: number;
  twinkleOffset: number;
  color: string;
  isBright: boolean;
}

interface ShootingStar {
  x: number;
  y: number;
  vx: number;
  vy: number;
  length: number;
  opacity: number;
  life: number;
  maxLife: number;
}

interface NebulaCloud {
  x: number;
  y: number;
  radiusX: number;
  radiusY: number;
  color: string;
  opacity: number;
  rotation: number;
}

export default function StarField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    // ── Stars ──────────────────────────────────────────────────────────────
    const starColors = [
      '#ffffff', '#ffffff', '#ffffff',
      '#e8e8ff', '#d0d0ff', '#c8d8ff',
      '#ffd0ff', '#ffccee', '#aaddff',
      '#ffe8cc',
    ];

    const stars: Star[] = Array.from({ length: 900 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() < 0.85 ? Math.random() * 0.9 + 0.2 : Math.random() * 2.2 + 1,
      opacity: Math.random() * 0.6 + 0.3,
      twinkleSpeed: Math.random() * 0.015 + 0.003,
      twinkleOffset: Math.random() * Math.PI * 2,
      color: starColors[Math.floor(Math.random() * starColors.length)],
      isBright: Math.random() < 0.04,
    }));

    // ── Nebula clouds ──────────────────────────────────────────────────────
    const nebulae: NebulaCloud[] = [
      // Central pink/magenta nebula
      { x: width * 0.38, y: height * 0.42, radiusX: width * 0.22, radiusY: height * 0.28, color: '#cc44aa', opacity: 0.18, rotation: -0.3 },
      { x: width * 0.42, y: height * 0.38, radiusX: width * 0.14, radiusY: height * 0.18, color: '#ee22cc', opacity: 0.22, rotation: 0.2 },
      { x: width * 0.35, y: height * 0.50, radiusX: width * 0.10, radiusY: height * 0.14, color: '#ff44bb', opacity: 0.15, rotation: 0.5 },
      // Blue nebula right
      { x: width * 0.68, y: height * 0.30, radiusX: width * 0.20, radiusY: height * 0.22, color: '#2244cc', opacity: 0.20, rotation: 0.4 },
      { x: width * 0.72, y: height * 0.25, radiusX: width * 0.12, radiusY: height * 0.14, color: '#4466ff', opacity: 0.18, rotation: -0.2 },
      // Purple center
      { x: width * 0.50, y: height * 0.45, radiusX: width * 0.30, radiusY: height * 0.35, color: '#6622aa', opacity: 0.14, rotation: 0.1 },
      // Blue cluster bottom-left
      { x: width * 0.18, y: height * 0.72, radiusX: width * 0.14, radiusY: height * 0.12, color: '#1133bb', opacity: 0.22, rotation: -0.5 },
      { x: width * 0.15, y: height * 0.75, radiusX: width * 0.08, radiusY: height * 0.08, color: '#3366ff', opacity: 0.20, rotation: 0.3 },
      // Teal accent
      { x: width * 0.60, y: height * 0.20, radiusX: width * 0.08, radiusY: height * 0.07, color: '#11aacc', opacity: 0.14, rotation: 0.0 },
      // Deep purple overlay
      { x: width * 0.50, y: height * 0.50, radiusX: width * 0.55, radiusY: height * 0.55, color: '#220044', opacity: 0.25, rotation: 0.0 },
    ];

    // ── Shooting stars ─────────────────────────────────────────────────────
    const shootingStars: ShootingStar[] = [];

    function spawnShootingStar() {
      const angle = (Math.random() * 30 + 15) * (Math.PI / 180);
      const speed = Math.random() * 8 + 6;
      shootingStars.push({
        x: Math.random() * width * 0.7,
        y: Math.random() * height * 0.4,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        length: Math.random() * 120 + 60,
        opacity: 1,
        life: 0,
        maxLife: Math.random() * 60 + 40,
      });
    }

    // ── Draw nebula ────────────────────────────────────────────────────────
    function drawNebulae() {
      nebulae.forEach(n => {
        ctx.save();
        ctx.translate(n.x, n.y);
        ctx.rotate(n.rotation);
        ctx.scale(1, n.radiusY / n.radiusX);
        const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, n.radiusX);
        grad.addColorStop(0, hexToRgba(n.color, n.opacity));
        grad.addColorStop(0.4, hexToRgba(n.color, n.opacity * 0.5));
        grad.addColorStop(1, hexToRgba(n.color, 0));
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(0, 0, n.radiusX, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });
    }

    // ── Draw bright star glow ──────────────────────────────────────────────
    function drawBrightStar(x: number, y: number, r: number, color: string, opacity: number) {
      // Outer glow
      const glow = ctx.createRadialGradient(x, y, 0, x, y, r * 12);
      glow.addColorStop(0, hexToRgba(color, opacity * 0.9));
      glow.addColorStop(0.2, hexToRgba(color, opacity * 0.4));
      glow.addColorStop(1, hexToRgba(color, 0));
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(x, y, r * 12, 0, Math.PI * 2);
      ctx.fill();

      // Cross spike horizontal
      const spike = ctx.createLinearGradient(x - r * 20, y, x + r * 20, y);
      spike.addColorStop(0, hexToRgba(color, 0));
      spike.addColorStop(0.5, hexToRgba(color, opacity * 0.6));
      spike.addColorStop(1, hexToRgba(color, 0));
      ctx.strokeStyle = spike;
      ctx.lineWidth = r * 0.8;
      ctx.beginPath();
      ctx.moveTo(x - r * 20, y);
      ctx.lineTo(x + r * 20, y);
      ctx.stroke();

      // Cross spike vertical
      const spikeV = ctx.createLinearGradient(x, y - r * 20, x, y + r * 20);
      spikeV.addColorStop(0, hexToRgba(color, 0));
      spikeV.addColorStop(0.5, hexToRgba(color, opacity * 0.6));
      spikeV.addColorStop(1, hexToRgba(color, 0));
      ctx.strokeStyle = spikeV;
      ctx.lineWidth = r * 0.8;
      ctx.beginPath();
      ctx.moveTo(x, y - r * 20);
      ctx.lineTo(x, y + r * 20);
      ctx.stroke();

      // Core
      ctx.fillStyle = hexToRgba('#ffffff', opacity);
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }

    // ── Utility ────────────────────────────────────────────────────────────
    function hexToRgba(hex: string, alpha: number): string {
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      return `rgba(${r},${g},${b},${alpha})`;
    }

    // ── Main render loop ───────────────────────────────────────────────────
    let frame = 0;
    let lastShoot = 0;

    function render() {
      frame++;

      // Background
      const bg = ctx.createRadialGradient(width * 0.5, height * 0.4, 0, width * 0.5, height * 0.5, Math.max(width, height) * 0.85);
      bg.addColorStop(0, '#0d0820');
      bg.addColorStop(0.4, '#080518');
      bg.addColorStop(0.7, '#050310');
      bg.addColorStop(1, '#020108');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, width, height);

      // Nebulae
      drawNebulae();

      // Stars
      stars.forEach(s => {
        const twinkle = Math.sin(frame * s.twinkleSpeed + s.twinkleOffset) * 0.35 + 0.65;
        const finalOpacity = s.opacity * twinkle;

        if (s.isBright) {
          drawBrightStar(s.x, s.y, s.radius, s.color, finalOpacity);
        } else {
          // Small glow for medium stars
          if (s.radius > 1.2) {
            const miniGlow = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.radius * 4);
            miniGlow.addColorStop(0, hexToRgba(s.color, finalOpacity * 0.5));
            miniGlow.addColorStop(1, hexToRgba(s.color, 0));
            ctx.fillStyle = miniGlow;
            ctx.beginPath();
            ctx.arc(s.x, s.y, s.radius * 4, 0, Math.PI * 2);
            ctx.fill();
          }
          ctx.fillStyle = hexToRgba(s.color, finalOpacity);
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      // Shooting stars
      if (frame - lastShoot > 180 + Math.random() * 240) {
        spawnShootingStar();
        lastShoot = frame;
      }

      for (let i = shootingStars.length - 1; i >= 0; i--) {
        const ss = shootingStars[i];
        ss.x += ss.vx;
        ss.y += ss.vy;
        ss.life++;
        ss.opacity = 1 - ss.life / ss.maxLife;

        if (ss.life >= ss.maxLife) {
          shootingStars.splice(i, 1);
          continue;
        }

        const tailX = ss.x - ss.vx * (ss.length / Math.sqrt(ss.vx * ss.vx + ss.vy * ss.vy));
        const tailY = ss.y - ss.vy * (ss.length / Math.sqrt(ss.vx * ss.vx + ss.vy * ss.vy));

        const grad = ctx.createLinearGradient(tailX, tailY, ss.x, ss.y);
        grad.addColorStop(0, `rgba(255,255,255,0)`);
        grad.addColorStop(0.7, `rgba(200,180,255,${ss.opacity * 0.5})`);
        grad.addColorStop(1, `rgba(255,255,255,${ss.opacity})`);

        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(tailX, tailY);
        ctx.lineTo(ss.x, ss.y);
        ctx.stroke();

        // Head glow
        const headGlow = ctx.createRadialGradient(ss.x, ss.y, 0, ss.x, ss.y, 6);
        headGlow.addColorStop(0, `rgba(255,255,255,${ss.opacity})`);
        headGlow.addColorStop(1, `rgba(200,180,255,0)`);
        ctx.fillStyle = headGlow;
        ctx.beginPath();
        ctx.arc(ss.x, ss.y, 6, 0, Math.PI * 2);
        ctx.fill();
      }

      animFrameRef.current = requestAnimationFrame(render);
    }

    render();

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      // Reposition nebulae
      nebulae[0].x = width * 0.38; nebulae[0].y = height * 0.42;
      nebulae[1].x = width * 0.42; nebulae[1].y = height * 0.38;
      nebulae[2].x = width * 0.35; nebulae[2].y = height * 0.50;
      nebulae[3].x = width * 0.68; nebulae[3].y = height * 0.30;
      nebulae[4].x = width * 0.72; nebulae[4].y = height * 0.25;
      nebulae[5].x = width * 0.50; nebulae[5].y = height * 0.45;
      nebulae[6].x = width * 0.18; nebulae[6].y = height * 0.72;
      nebulae[7].x = width * 0.15; nebulae[7].y = height * 0.75;
      nebulae[8].x = width * 0.60; nebulae[8].y = height * 0.20;
      nebulae[9].x = width * 0.50; nebulae[9].y = height * 0.50;
    };

    window.addEventListener('resize', handleResize);
    return () => {
      cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full"
      style={{ zIndex: 0, pointerEvents: 'none' }}
    />
  );
}
