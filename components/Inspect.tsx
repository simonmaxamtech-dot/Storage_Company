'use client'

import { useEffect, useRef, useState } from 'react'

// "Inspect": a designer's x-ray. Hover anything and see its box, size, position, type size and colour,
// the same way design tools do. Off by default so it never confuses a first-time visitor. Press I to toggle.
const PICK = 'h1,h2,h3,h4,p,a,button,img,li,.clean-card,.pill-o,.cert-chip,input,textarea,section'

const KIND = (el: Element) => {
  const t = el.tagName.toLowerCase()
  if (/^h[1-4]$/.test(t)) return 'Heading'
  if (el.classList.contains('clean-card')) return 'Card'
  if (el.classList.contains('pill-o') || el.classList.contains('cert-chip')) return 'Tag'
  return ({ p: 'Text', a: 'Link', button: 'Button', img: 'Image', li: 'Item', section: 'Section', input: 'Field', textarea: 'Field' } as Record<string, string>)[t] || t
}

const hex = (c: string) => {
  const m = c.match(/rgba?\(([^)]+)\)/)
  if (!m) return c
  const p = m[1].split(/[ ,/]+/).filter(Boolean).map(Number)
  if (p.length > 3 && p[3] === 0) return ''
  return '#' + p.slice(0, 3).map((n) => Math.round(n).toString(16).padStart(2, '0')).join('')
}

export default function Inspect() {
  const [on, setOn] = useState(false)
  const [hoverOk, setHoverOk] = useState(false)
  const box = useRef<HTMLDivElement>(null)
  const l1 = useRef<HTMLDivElement>(null)
  const l2 = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setHoverOk(window.matchMedia('(hover: hover) and (pointer: fine)').matches)
  }, [])

  useEffect(() => {
    if (!hoverOk) return
    const key = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement
      if (e.key.toLowerCase() !== 'i' || e.metaKey || e.ctrlKey || e.altKey || /input|textarea/i.test(t?.tagName || '')) return
      setOn((v) => !v)
    }
    window.addEventListener('keydown', key)
    return () => window.removeEventListener('keydown', key)
  }, [hoverOk])

  useEffect(() => {
    const b = box.current
    if (!on || !b) return
    let cur: Element | null = null
    let px = 0
    let py = 0
    let raf = 0
    const hide = () => { b.style.opacity = '0' }
    const paint = () => {
      raf = 0
      if (!cur || !cur.isConnected) return hide()
      const r = cur.getBoundingClientRect()
      if (r.width < 4 || r.height < 4) return hide()
      const cs = getComputedStyle(cur)
      const fs = parseFloat(cs.fontSize)
      const lh = cs.lineHeight === 'normal' ? Math.round(fs * 1.2) : Math.round(parseFloat(cs.lineHeight))
      const isText = cur.textContent?.trim() && !(cur instanceof HTMLImageElement) && !cur.classList.contains('clean-card') && cur.tagName !== 'SECTION'
      const col = hex(cs.color)
      b.style.opacity = '1'
      b.style.transform = `translate(${r.left}px,${r.top}px)`
      b.style.width = r.width + 'px'
      b.style.height = r.height + 'px'
      if (l1.current) l1.current.textContent = `${KIND(cur)}  ${Math.round(r.width)}×${Math.round(r.height)}`
      if (l2.current) {
        const pos = `x ${Math.round(r.left)}  y ${Math.round(r.top + window.scrollY)}`
        l2.current.textContent = isText ? `${Math.round(fs)}/${lh} px  ${col || cs.fontFamily.split(',')[0].replace(/["']/g, '')}  ·  ${pos}` : pos
        l2.current.style.setProperty('--sw', col || 'transparent')
      }
      b.dataset.low = r.top < 56 ? '1' : '0'
    }
    const queue = () => { if (!raf) raf = requestAnimationFrame(paint) }
    const move = (e: PointerEvent) => {
      px = e.clientX
      py = e.clientY
      const t = e.target as Element | null
      if (!t || t.closest('[data-no-inspect]')) { cur = null; return hide() }
      let el = t.closest(PICK)
      // Skip the big background layers; prefer the real thing under the pointer.
      if (!el) { const s = document.elementFromPoint(px, py); el = s?.closest(PICK) || null }
      if (el === cur) return queue()
      cur = el
      el ? queue() : hide()
    }
    window.addEventListener('pointermove', move, { passive: true })
    window.addEventListener('scroll', queue, { passive: true })
    document.addEventListener('pointerleave', hide)
    return () => {
      window.removeEventListener('pointermove', move)
      window.removeEventListener('scroll', queue)
      document.removeEventListener('pointerleave', hide)
      cancelAnimationFrame(raf)
      hide()
    }
  }, [on])

  if (!hoverOk) return null
  return (
    <>
      <button
        data-no-inspect
        aria-pressed={on}
        onClick={() => setOn((v) => !v)}
        title="Show sizes, positions and colours. Shortcut: I"
        className="pointer-events-auto flex items-center gap-2 rounded-full px-3.5 py-2 text-[13px] font-extrabold backdrop-blur-md transition-colors duration-300 max-lg:hidden"
        style={{
          boxShadow: 'inset 0 0 0 1.5px color-mix(in srgb, var(--ink) 28%, transparent)',
          background: on ? 'var(--ink)' : 'color-mix(in srgb, var(--bg) 55%, transparent)',
          color: on ? 'var(--bg)' : 'var(--ink)',
        }}
      >
        <span aria-hidden className="inline-block h-[10px] w-[10px] rounded-[2px]" style={{ boxShadow: 'inset 0 0 0 1.5px currentColor' }} />
        Inspect
      </button>
      <div
        ref={box}
        aria-hidden
        data-no-inspect
        className="pointer-events-none fixed left-0 top-0 z-[90] opacity-0 transition-[opacity] duration-150"
        style={{ outline: '1.5px solid var(--hot)', outlineOffset: 0, willChange: 'transform,width,height' }}
      >
        {[0, 1, 2, 3].map((i) => (
          <i
            key={i}
            className="absolute h-[6px] w-[6px]"
            style={{ background: 'var(--hot)', top: i < 2 ? '-3px' : 'auto', bottom: i >= 2 ? '-3px' : 'auto', left: i % 2 === 0 ? '-3px' : 'auto', right: i % 2 === 1 ? '-3px' : 'auto' }}
          />
        ))}
        <div className="inspect-tags absolute left-0 flex flex-col items-start gap-[3px]" style={{ bottom: 'calc(100% + 6px)' }}>
          <div ref={l1} className="whitespace-nowrap px-2 py-[3px] font-mono text-[12px] font-bold" style={{ background: 'var(--hot)', color: '#fff' }} />
          <div ref={l2} className="inspect-l2 whitespace-nowrap px-2 py-[2px] font-mono text-[11.5px] font-semibold" style={{ background: 'var(--bg)', color: 'var(--ink)', boxShadow: 'inset 0 0 0 1.5px var(--hot)' }} />
        </div>
      </div>
    </>
  )
}
