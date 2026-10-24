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
      {open && (
        <div
          role="dialog"
          aria-label={`Ask an AI why ${ASK_BRAND}`}
          className="w-[min(86vw,270px)] rounded-2xl p-3 shadow-2xl"
          style={{ background: 'rgba(24,23,21,0.96)', border: '1px solid var(--line)', backdropFilter: 'blur(14px)' }}
        >
          <p className="px-2 pb-2 pt-1 font-mono text-[11px] uppercase tracking-[0.14em]" style={{ color: 'var(--muted)' }}>
            ( Ask an AI why {ASK_BRAND} )
          </p>
          <ul>
            {ASK_TARGETS.map((t) => (
              <li key={t.id}>
                <button
                  type="button"
                  onClick={() => go(t)}
                  className="flex w-full items-center gap-3 rounded-xl px-2 py-2.5 text-left text-[17px] font-bold transition-colors hover:bg-white/10"
                >
                  <span aria-hidden className="grid h-8 w-8 place-items-center text-[26px] leading-none" style={{ color: MARK[t.id].color }}>{MARK[t.id].glyph}</span>
                  {t.name}
                </button>
              </li>
            ))}
          </ul>
          {note && <p role="status" className="px-2 pb-1 pt-2 text-[13px] font-semibold" style={{ color: 'var(--muted)' }}>{note}</p>}
        </div>
      )}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex items-center gap-2 rounded-full px-4 py-2.5 text-[15px] font-extrabold transition-transform hover:scale-[1.04]"
        style={{ background: 'rgba(14,14,13,0.88)', border: '1px solid var(--line)', backdropFilter: 'blur(10px)', color: 'var(--ink)' }}
      >
        <span aria-hidden style={{ color: 'var(--hot)' }}>✦</span> Ask AI
      </button>
    </div>
  )
}
