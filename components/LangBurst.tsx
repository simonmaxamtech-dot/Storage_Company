'use client'

import { useEffect, useRef } from 'react'
import { useStore } from '@/lib/store'
import { lite } from '@/lib/perf'

// A little surprise when the language changes: grains fly out of the page and settle into something from that language's world, then blow away.
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

interface Grain { x: number; y: number; hx: number; hy: number; vx: number; vy: number; c: string; r: number }

export default function LangBurst() {
  const lang = useStore((s) => s.lang)
  const ref = useRef<HTMLCanvasElement>(null)
  const first = useRef(true)

  useEffect(() => {
    if (first.current) {
      first.current = false
      return
    }
    const cv = ref.current
    const glyph = EMBLEM[lang]
    if (!cv || !glyph || lite() || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const ctx = cv.getContext('2d')
    if (!ctx) return
    const dpr = Math.min(2, window.devicePixelRatio || 1)
    const W = window.innerWidth
    const H = window.innerHeight
    cv.width = W * dpr
    cv.height = H * dpr
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

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
    const size = Math.min(W, H) * (W < 700 ? 0.55 : 0.42)
    const ox = W < 700 ? W / 2 - size / 2 : W * 0.7 - size / 2
    const oy = H / 2 - size / 2
    const grains: Grain[] = []
    for (let y = 0; y < N; y += 2) {
      for (let x = 0; x < N; x += 2) {
        const i = (y * N + x) * 4
        if (px[i + 3] < 120) continue
        const a = Math.random() * Math.PI * 2
        grains.push({
          hx: ox + (x / N) * size,
          hy: oy + (y / N) * size,
          x: W / 2 + Math.cos(a) * W,
          y: H / 2 + Math.sin(a) * H,
          vx: 0,
          vy: 0,
          c: `rgb(${px[i]},${px[i + 1]},${px[i + 2]})`,
          r: (size / N) * 1.1,
        })
      }
    }
    if (!grains.length) return

    let raf = 0
    const t0 = performance.now()
    const tick = (now: number) => {
      const t = (now - t0) / 1000
      ctx.clearRect(0, 0, W, H)
      const out = t > 2.4
      const fade = out ? Math.max(0, 1 - (t - 2.4) / 0.7) : Math.min(1, t / 0.25)
      for (const g of grains) {
        if (out) {
          g.vx += (g.hx - W / 2) * 0.002
          g.vy += (g.hy - H / 2) * 0.002 - 0.03
          g.x += g.vx
          g.y += g.vy
        } else {
          g.x += (g.hx - g.x) * 0.09
          g.y += (g.hy - g.y) * 0.09
        }
        ctx.globalAlpha = fade
        ctx.fillStyle = g.c
        ctx.beginPath()
        ctx.arc(g.x, g.y, g.r, 0, Math.PI * 2)
        ctx.fill()
      }
      if (t < 3.2) raf = requestAnimationFrame(tick)
      else ctx.clearRect(0, 0, W, H)
    }
    raf = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(raf)
      ctx.clearRect(0, 0, W, H)
    }
  }, [lang])

  return <canvas ref={ref} aria-hidden className="pointer-events-none fixed inset-0 z-40 h-full w-full" />
}
