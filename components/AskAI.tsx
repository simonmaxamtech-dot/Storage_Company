'use client'

import { useEffect, useRef, useState } from 'react'
import { ASK_BRAND, ASK_PROMPT, ASK_TARGETS, type AskTarget } from '@/lib/askai'

// Small coloured marks instead of the real logos: no trademarked artwork redrawn by hand.
const MARK: Record<AskTarget['id'], { glyph: string; color: string }> = {
  chatgpt: { glyph: '◍', color: '#10a37f' },
  claude: { glyph: '✺', color: '#d97757' },
  perplexity: { glyph: '✳', color: '#20b8cd' },
  gemini: { glyph: '✦', color: '#8ab4ff' },
}

export default function AskAI() {
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

  return (
    <div ref={box} className="fixed bottom-4 right-4 z-[60] flex flex-col items-end gap-3 sm:bottom-6 sm:right-6">
      <div
        role="dialog"
        aria-label={`Ask an AI why ${ASK_BRAND}`}
        aria-hidden={!open}
        className="w-[min(88vw,300px)] origin-bottom-right overflow-hidden rounded-[26px] shadow-[0_30px_80px_-20px_rgba(0,0,0,0.8)] transition-all duration-300 ease-out"
        style={{
          background: 'var(--ink)',
          color: '#08090b',
          opacity: open ? 1 : 0,
          transform: open ? 'none' : 'translateY(14px) scale(0.92)',
          pointerEvents: open ? 'auto' : 'none',
        }}
      >
        <div className="px-5 pb-3 pt-5">
          <p className="font-[family-name:var(--font-display)] text-[30px] font-black leading-[0.95]">
            Ask an AI
            <br />
            <span style={{ color: 'var(--hot)' }}>why {ASK_BRAND}.</span>
          </p>
        </div>
        <ul className="pb-2">
          {ASK_TARGETS.map((t, n) => (
            <li key={t.id}>
              <button
                type="button"
                tabIndex={open ? 0 : -1}
                onClick={() => go(t)}
                className="group flex w-full items-center gap-3 px-5 py-3 text-left transition-colors duration-200 hover:bg-[var(--hot)]"
                style={{ borderTop: '1px solid rgba(8,9,11,0.12)' }}
              >
                <span className="w-5 text-[12px] font-extrabold opacity-45">0{n + 1}</span>
                <span className="flex-1 font-[family-name:var(--font-display)] text-[22px] font-black">{t.name}</span>
                <span aria-hidden className="text-[22px] font-black transition-transform duration-200 group-hover:translate-x-1">→</span>
              </button>
            </li>
          ))}
        </ul>
        {note && <p role="status" className="px-5 pb-4 text-[13px] font-bold">{note}</p>}
      </div>

      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="group flex items-center gap-2.5 rounded-full py-2 pl-2 pr-5 font-[family-name:var(--font-display)] text-[17px] font-black transition-transform duration-200 hover:scale-[1.05]"
        style={{ background: open ? 'var(--hot)' : 'var(--ink)', color: '#08090b', boxShadow: '0 12px 36px -10px rgba(255,122,61,0.55)' }}
      >
        <span
          aria-hidden
          className="relative grid h-8 w-8 place-items-center rounded-full text-[20px] leading-none text-white transition-transform duration-300"
          style={{ background: 'radial-gradient(circle at 32% 28%, #ffb48a, var(--hot) 55%, #c4491a)', transform: open ? 'rotate(135deg)' : 'none' }}
        >
          +
        </span>
        Ask AI
      </button>
    </div>
  )
}
