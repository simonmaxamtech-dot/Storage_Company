'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { SEO_CODES } from '@/lib/seo-langs'
import { ASK_BRAND, ASK_PROMPT, ASK_TARGETS, type AskTarget } from '@/lib/askai'

// `inline`: sits in the home page's bottom bar (rendered by Overlay). Without it, a small floating button for the other pages.
export default function AskAI({ inline = false }: { inline?: boolean }) {
  const path = usePathname() || '/'
  const [open, setOpen] = useState(false)
  const [note, setNote] = useState('')
  const box = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const away = (e: PointerEvent) => { if (!box.current?.contains(e.target as Node)) setOpen(false) }
    const esc = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('pointerdown', away)
    document.addEventListener('keydown', esc)
    return () => { document.removeEventListener('pointerdown', away); document.removeEventListener('keydown', esc) }
  }, [open])

  async function go(t: AskTarget) {
    if (t.url) {
      window.open(t.url(ASK_PROMPT), '_blank', 'noopener,noreferrer')
      setNote('')
    } else {
      let copied = false
      try { await navigator.clipboard.writeText(ASK_PROMPT); copied = true } catch { /* clipboard blocked */ }
      window.open(t.home, '_blank', 'noopener,noreferrer')
      setNote(copied ? `Question copied. Paste it into ${t.name}.` : `Open ${t.name} and ask: “${ASK_PROMPT}”`)
    }
  }

  // The home page (and its language pages) carry their own copy in the bottom bar.
  const onHome = path === '/' || SEO_CODES.some((c) => path === `/${c}` || path === `/${c}/`)
  if (!inline && onHome) return null

  return (
    <div
      ref={box}
      className={inline ? 'pointer-events-auto relative' : 'fixed bottom-4 right-4 z-[60] sm:bottom-6 sm:right-6'}
    >
      <div
        role="dialog"
        aria-label={`Ask an AI why ${ASK_BRAND}`}
        aria-hidden={!open}
        className="absolute bottom-full right-0 mb-3 w-[min(78vw,230px)] origin-bottom-right overflow-hidden rounded-2xl shadow-[0_24px_60px_-18px_rgba(0,0,0,0.9)] transition-all duration-200 ease-out"
        style={{
          background: '#111214',
          color: 'var(--ink)',
          border: '1px solid var(--line)',
          opacity: open ? 1 : 0,
          transform: open ? 'none' : 'translateY(10px) scale(0.95)',
          pointerEvents: open ? 'auto' : 'none',
        }}
      >
        <p className="px-4 pb-2 pt-3.5 font-[family-name:var(--font-display)] text-[17px] font-black leading-tight">
          Ask an AI why {ASK_BRAND}
        </p>
        <ul className="pb-1.5">
          {ASK_TARGETS.map((t) => (
            <li key={t.id}>
              <button
                type="button"
                tabIndex={open ? 0 : -1}
                onClick={() => go(t)}
                className="group flex w-full items-center gap-3 px-4 py-2 text-left text-[15px] font-bold transition-colors duration-150 hover:bg-white/10"
                style={{ borderTop: '1px solid var(--line)' }}
              >
                <span className="flex-1">{t.name}</span>
                <span aria-hidden className="opacity-50 transition-all duration-150 group-hover:translate-x-0.5 group-hover:opacity-100">→</span>
              </button>
            </li>
          ))}
        </ul>
        {note && <p role="status" className="px-4 pb-3 text-[12px] font-semibold" style={{ color: 'var(--muted)' }}>{note}</p>}
      </div>

      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="rounded-full px-3.5 py-2 text-[13px] font-black backdrop-blur-md transition-colors duration-200 hover:bg-white/10"
        style={{ boxShadow: 'inset 0 0 0 1.5px color-mix(in srgb, var(--ink) 28%, transparent)', background: open ? 'rgba(255,255,255,0.12)' : 'color-mix(in srgb, var(--bg) 55%, transparent)', color: 'var(--ink)' }}
      >
        Ask AI
      </button>
    </div>
  )
}
