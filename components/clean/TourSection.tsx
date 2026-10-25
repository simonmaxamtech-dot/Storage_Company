'use client'

import { useEffect, useRef, useState } from 'react'
import { useT } from '@/lib/i18n'
import { haptic } from '@/lib/phone'
import { sound } from '@/lib/sound'

// The 3D home tour. The tour itself is a separate little site served from /tour; it is only fetched when someone
// presses the button, so this section costs the page one small picture until then.
// (Next's dev server would hand "/tour/" to the language pages, so while developing we point at the file itself.)
const SRC = process.env.NODE_ENV === 'development' ? '/tour/index.html?embed' : '/tour/?embed'

function go(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
}

function TourFrame({ onClose }: { onClose: () => void }) {
  const t = useT()
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const html = document.documentElement
    const prev = html.style.overflow
    html.style.overflow = 'hidden'
    const key = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    // The tour tells us when someone presses "Book a viewing" or "Close" inside it.
    const msg = (e: MessageEvent) => {
      if (e.origin !== location.origin) return
      const type = e.data?.radoyaTour
      if (type === 'close') onClose()
      if (type === 'book') {
        onClose()
        setTimeout(() => go('contact'), 60)
      }
    }
    window.addEventListener('keydown', key)
    window.addEventListener('message', msg)
    return () => {
      html.style.overflow = prev
      window.removeEventListener('keydown', key)
      window.removeEventListener('message', msg)
    }
  }, [onClose])

  return (
    <div role="dialog" aria-modal="true" aria-label={t('tour.kicker')} className="fixed inset-0 z-[300]" style={{ background: 'var(--bg, #08090b)' }}>
      <iframe
        src={SRC}
        title={t('tour.kicker')}
        allow="accelerometer; gyroscope; fullscreen"
        onLoad={() => setReady(true)}
        className="absolute inset-0 h-full w-full border-0 transition-opacity duration-500"
        style={{ opacity: ready ? 1 : 0 }}
      />
      {!ready && (
        <p className="absolute inset-0 flex items-center justify-center font-pacalix text-[clamp(28px,5vw,64px)] tracking-[0.02em]" style={{ color: 'var(--hot)' }}>
          {t('tour.loading')}
        </p>
      )}
      <button
        onClick={onClose}
        aria-label={t('tour.close')}
        className="absolute bottom-3 left-3 z-10 rounded-full px-4 py-2.5 text-[12.5px] font-extrabold uppercase tracking-[0.12em] backdrop-blur-md sm:bottom-4 sm:left-4"
        style={{ background: 'rgba(8,9,11,0.74)', border: '1px solid rgba(255,255,255,0.16)', color: '#fff' }}
      >
        ← {t('tour.close')}
      </button>
    </div>
  )
}

// The house, drawn as particles: a wireframe of the sample home turned into dots, like everything else on the site.
type V = [number, number, number]
function houseDots() {
  const seg: [V, V, number][] = [] // from, to, how many dots per metre
  const box = (x0: number, x1: number, y0: number, y1: number, z0: number, z1: number, d = 5) => {
    const c: V[] = [[x0, y0, z0], [x1, y0, z0], [x1, y0, z1], [x0, y0, z1], [x0, y1, z0], [x1, y1, z0], [x1, y1, z1], [x0, y1, z1]]
    for (const [i, j] of [[0, 1], [1, 2], [2, 3], [3, 0], [4, 5], [5, 6], [6, 7], [7, 4], [0, 4], [1, 5], [2, 6], [3, 7]]) seg.push([c[i], c[j], d])
  }
  box(-7, 7, 0, 3, -3.5, 3.5) // ground floor
  box(-5.5, 8, 3.2, 6, -3.5, 3.5) // upper floor, sticks out to the right
  box(-6.3, 8.8, 6, 6.35, -4.2, 4.2, 4) // roof slab
  // windows: tall panes on the front of both floors
  for (let x = -6.4; x <= 6.5; x += 1.3) seg.push([[x, 0, 3.5], [x, 3, 3.5], 7])
  for (let x = -4.9; x <= 7.5; x += 1.3) seg.push([[x, 3.2, 3.5], [x, 6, 3.5], 7])
  seg.push([[-7, 1.5, 3.5], [7, 1.5, 3.5], 3], [[-5.5, 4.6, 3.5], [8, 4.6, 3.5], 3])
  // pool and terrace
  box(-4, 4, -0.02, -0.02, 5.5, 8.5, 6)
  box(-9, 10, -0.02, -0.02, -7, 10, 2)
  // two trees
  for (const [tx, tz] of [[-10, 1], [11, 3]] as const) {
    for (let k = 0; k < 3; k++) {
      const y = 1 + k * 1.7
      const r = 2 - k * 0.55
      for (let a = 0; a < 6; a++) seg.push([[tx + Math.cos((a / 6) * 6.283) * r, y, tz + Math.sin((a / 6) * 6.283) * r], [tx, y + 2.2, tz], 3])
    }
    seg.push([[tx, 0, tz], [tx, 1, tz], 5])
  }
  const pts: { p: V; hot: boolean }[] = []
  let seed = 7
  const rnd = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646
  for (const [a, b, d] of seg) {
    const len = Math.hypot(b[0] - a[0], b[1] - a[1], b[2] - a[2])
    const n = Math.max(2, Math.round(len * d))
    // a few windows glow orange, like lit rooms
    const lit = a[2] === 3.5 && b[2] === 3.5 && a[0] === b[0] && rnd() < 0.22
    for (let i = 0; i <= n; i++) {
      const t = i / n
      pts.push({ p: [a[0] + (b[0] - a[0]) * t + (rnd() - 0.5) * 0.06, a[1] + (b[1] - a[1]) * t + (rnd() - 0.5) * 0.06, a[2] + (b[2] - a[2]) * t + (rnd() - 0.5) * 0.06], hot: lit || rnd() < 0.025 })
    }
  }
  return pts
}

function HouseDots() {
  const wrap = useRef<HTMLDivElement>(null)
  const cv = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = cv.current
    const box = wrap.current
    if (!canvas || !box) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const dots = houseDots()
    const hot = getComputedStyle(box).getPropertyValue('--hot').trim() || '#ff7a3d'
    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let w = 0, h = 0, dpr = 1, raf = 0, visible = false
    let ang = -0.5, spin = 0.0016, mx = -9999, my = -9999
    const size = () => {
      dpr = Math.min(2, window.devicePixelRatio || 1)
      w = box.clientWidth
      h = box.clientHeight
      canvas.width = w * dpr
      canvas.height = h * dpr
    }
    const draw = () => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, w, h)
      const sc = Math.min(w / 26, h / 13.5)
      const cs = Math.cos(ang), sn = Math.sin(ang)
      const cx = w / 2, cy = h * 0.58
      for (const d of dots) {
        const x = d.p[0] - 1, y = d.p[1] - 3, z = d.p[2]
        const rx = x * cs + z * sn
        const rz = -x * sn + z * cs
        const f = 34 / (34 + rz) // perspective
        let px = cx + rx * sc * f
        let py = cy - y * sc * f - rz * sc * 0.13 // a little tilt so you look down on it
        const dx = px - mx, dy = py - my
        const dd = dx * dx + dy * dy
        if (dd < 5200) {
          const k = (1 - dd / 5200) * 14
          const m = Math.sqrt(dd) || 1
          px += (dx / m) * k
          py += (dy / m) * k
        }
        ctx.globalAlpha = Math.min(1, 0.35 + f * 0.5)
        ctx.fillStyle = d.hot ? hot : '#ffffff'
        const r = d.hot ? 1.9 : 1.3
        ctx.fillRect(px - r / 2, py - r / 2, r, r)
      }
      ctx.globalAlpha = 1
    }
    const tick = () => {
      ang += spin
      spin += (0.0016 - spin) * 0.05
      draw()
      raf = visible ? requestAnimationFrame(tick) : 0
    }
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting
      if (visible && !raf && !still) raf = requestAnimationFrame(tick)
    })
    size()
    draw()
    io.observe(box)
    const ro = new ResizeObserver(() => { size(); draw() })
    ro.observe(box)
    const move = (e: PointerEvent) => {
      const r = box.getBoundingClientRect()
      mx = e.clientX - r.left
      my = e.clientY - r.top
      spin = 0.006
    }
    const leave = () => { mx = my = -9999 }
    box.addEventListener('pointermove', move)
    box.addEventListener('pointerleave', leave)
    return () => {
      cancelAnimationFrame(raf)
      io.disconnect()
      ro.disconnect()
      box.removeEventListener('pointermove', move)
      box.removeEventListener('pointerleave', leave)
    }
  }, [])
  return (
    <div ref={wrap} className="relative h-full w-full" aria-hidden>
      <canvas ref={cv} className="absolute inset-0 h-full w-full" />
    </div>
  )
}

export function TourCard({ children }: { children?: never }) {
  const t = useT()
  const [open, setOpen] = useState(false)
  const start = () => {
    haptic(12)
    sound.knock(0.7)
    setOpen(true)
  }
  return (
    <>
      <button
        onClick={start}
        data-hover={t('tour.walk')}
        aria-label={t('tour.walk')}
        className="group grid w-full items-center gap-6 py-8 text-left sm:grid-cols-[minmax(0,0.9fr)_minmax(0,1.3fr)] sm:gap-10 sm:py-10"
        style={{ borderTop: '1.5px solid var(--line)', borderBottom: '1.5px solid var(--line)' }}
      >
        <span className="order-2 sm:order-1">
          <span className="block font-pacalix text-[clamp(34px,5.4vw,84px)] leading-[0.96] tracking-[0.015em]">{t('tour.home')}</span>
          <span className="mt-3 block text-[14px] font-bold sm:text-[17px]" style={{ color: 'var(--muted)' }}>{t('tour.meta')}</span>
          <span className="mt-6 inline-flex rounded-full px-6 py-3.5 text-[15px] font-extrabold transition-transform group-hover:scale-105 sm:mt-8 sm:text-[17px]" style={{ background: 'var(--hot)', color: '#1a1200' }}>{t('tour.walk')} →</span>
        </span>
        <span className="order-1 block aspect-[4/3] w-full sm:order-2 sm:aspect-[16/10]">
          <HouseDots />
        </span>
      </button>
      {open && <TourFrame onClose={() => setOpen(false)} />}
    </>
  )
}

export function TourSteps() {
  const t = useT()
  return (
    <div className="mt-10 grid gap-x-10 gap-y-6 sm:grid-cols-3">
      {(['1', '2', '3'] as const).map((n) => (
        <div key={n} className="border-t-[1.5px] pt-4" style={{ borderColor: 'var(--line)' }}>
          <p className="text-[12px] font-extrabold uppercase tracking-[0.2em]" style={{ color: 'var(--hot)' }}>0{n}</p>
          <p className="mt-2 font-pacalix text-[clamp(22px,2.2vw,32px)] leading-[1.05] tracking-[0.015em]">{t(`tour.s${n}h` as Parameters<typeof t>[0])}</p>
          <p className="mt-2 text-[15px] font-bold leading-snug max-sm:hidden" style={{ color: 'var(--muted)' }}>{t(`tour.s${n}t` as Parameters<typeof t>[0])}</p>
        </div>
      ))}
      <button onClick={() => go('contact')} data-hover="Contact" className="w-fit rounded-full px-5 py-2.5 text-[14px] font-extrabold transition-transform hover:scale-105 sm:col-span-3" style={{ boxShadow: 'inset 0 0 0 1.5px var(--hot)', color: 'var(--hot)' }}>
        {t('tour.cta')}
      </button>
    </div>
  )
}
