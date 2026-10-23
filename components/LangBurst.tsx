'use client'

import { useEffect, useRef } from 'react'
import { live, useStore } from '@/lib/store'
import { lite } from '@/lib/perf'

// A little surprise when the language changes: grains fly in, settle into something from that language's world, then shrink into a small badge in the corner that stays in the site's colours until the language changes again. English has none.
const EMBLEM: Record<string, string> = {
  en: '🍁',
  fr: '🥖',
  es: '💃',
  de: '🥨',
  tr: '🧿',
  ar: '🌙',
  fa: '🌹',
  pt: '🌊',
  it: '🍕',
  ru: '🐻',
  zh: '🐉',
  hi: '🪔',
  ja: '🌸',
}

interface Grain { x: number; y: number; u: number; v: number; vx: number; vy: number; z: number; lum: number }

const ease = (t: number) => t * t * (3 - 2 * t)

export default function LangBurst() {
  const lang = useStore((s) => s.lang)
  const ref = useRef<HTMLCanvasElement>(null)
  const first = useRef(true)

  useEffect(() => {
    const cv = ref.current
    const ctx = cv?.getContext('2d')
    if (!cv || !ctx) return
    const W = window.innerWidth
    const H = window.innerHeight
    const dpr = Math.min(2, window.devicePixelRatio || 1)
    cv.width = W * dpr
    cv.height = H * dpr
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    ctx.clearRect(0, 0, W, H)
    const glyph = EMBLEM[lang]
    const skip = first.current
    first.current = false
    if (skip || !glyph || lang === 'en' || lite() || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    // Draw the emoji big on a scratch canvas and keep the pixels as the target shape.
    const N = 150
    const sc = document.createElement('canvas')
    sc.width = sc.height = N
    const sx = sc.getContext('2d', { willReadFrequently: true })
    if (!sx) return
    sx.font = `${N * 0.8}px "Segoe UI Emoji","Apple Color Emoji","Noto Color Emoji",sans-serif`
    sx.textAlign = 'center'
    sx.textBaseline = 'middle'
    sx.fillText(glyph, N / 2, N / 2 + N * 0.04)
    const px = sx.getImageData(0, 0, N, N).data
    const phone = W < 700
    const big = Math.min(W, H) * (phone ? 0.55 : 0.42)
    const bigX = phone ? W / 2 - big / 2 : W * 0.7 - big / 2
    const bigY = H / 2 - big / 2
    // The badge it settles into: bottom right corner.
    const small = phone ? 96 : 140
    const smallX = W - small - (phone ? 14 : 34)
    const smallY = H - small - (phone ? 90 : 34)
    const grains: Grain[] = []
    for (let y = 0; y < N; y += 2) {
      for (let x = 0; x < N; x += 2) {
        const i = (y * N + x) * 4
        if (px[i + 3] < 120) continue
        const a = Math.random() * Math.PI * 2
        grains.push({
          u: x / N,
          v: y / N,
          x: W / 2 + Math.cos(a) * W,
          y: H / 2 + Math.sin(a) * H,
          vx: 0,
          vy: 0,
          z: Math.random() * 2 - 1,
          lum: (px[i] * 0.3 + px[i + 1] * 0.59 + px[i + 2] * 0.11) / 255,
        })
      }
    }
    if (!grains.length) return

    // Same look as the site's particles: the theme's own colours, with depth, and the grains shy away from the mouse.
    const mouse = { x: -9999, y: -9999 }
    const move = (e: PointerEvent) => {
      mouse.x = e.clientX
      mouse.y = e.clientY
    }
    window.addEventListener('pointermove', move)
    let raf = 0
    // Wait a beat so the page changes language first, then the grains arrive.
    const t0 = performance.now() + 700
    const tick = (now: number) => {
      raf = requestAnimationFrame(tick)
      const t = (now - t0) / 1000
      if (t < 0) return
      const th = live.theme
      ctx.clearRect(0, 0, W, H)
      const shrink = ease(Math.min(1, Math.max(0, (t - 2.4) / 1)))
      const size = big + (small - big) * shrink
      const ox = bigX + (smallX - bigX) * shrink
      const oy = bigY + (smallY - bigY) * shrink
      const fadeIn = Math.min(1, t / 0.25)
      const base = (1 - shrink) * 1 + shrink * 0.85
      const r = (size / N) * (0.8 + shrink * 0.3)
      const mx = mouse.x > -9000 ? (mouse.x - W / 2) / W : 0
      const my = mouse.y > -9000 ? (mouse.y - H / 2) / H : 0
      const reach = 7000 + shrink * 3000
      for (const g of grains) {
        const tx = ox + g.u * size - mx * 26 * g.z
        const ty = oy + g.v * size - my * 26 * g.z
        const dx = g.x - mouse.x
        const dy = g.y - mouse.y
        const d2 = dx * dx + dy * dy
        if (d2 < reach && d2 > 1) {
          const f = (1 - d2 / reach) * 5
          const d = Math.sqrt(d2)
          g.vx += (dx / d) * f
          g.vy += (dy / d) * f
        }
        const k = t < 2.4 ? 0.05 : 0.09
        g.vx = (g.vx + (tx - g.x) * k) * 0.84
        g.vy = (g.vy + (ty - g.y) * k) * 0.84
        g.x += g.vx
        g.y += g.vy
        ctx.globalAlpha = fadeIn * base * (0.55 + 0.45 * g.lum) * (0.7 + 0.3 * g.z)
        ctx.fillStyle = g.lum > 0.45 ? th.accent : th.particle
        ctx.beginPath()
        ctx.arc(g.x, g.y, r * (1 + g.z * 0.35), 0, Math.PI * 2)
        ctx.fill()
      }
    }
    raf = requestAnimationFrame(tick)
    return () => {
      window.removeEventListener('pointermove', move)
      cancelAnimationFrame(raf)
      ctx.clearRect(0, 0, W, H)
    }
  }, [lang])

  return <canvas ref={ref} aria-hidden className="pointer-events-none fixed inset-0 z-40 h-full w-full" />
}
