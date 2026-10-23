'use client'

import { useEffect, useRef, useState } from 'react'
import { LANGS } from '@/lib/i18n'
import { useStore } from '@/lib/store'

// The language picker at the top right, like the country picker on big shops.
export default function LangSwitch() {
  const lang = useStore((s) => s.lang)
  const setLang = useStore((s) => s.setLang)
  const [open, setOpen] = useState(false)
  const box = useRef<HTMLDivElement>(null)
  const cur = LANGS.find((l) => l.code === lang) ?? LANGS[0]

  useEffect(() => {
    if (!open) return
    const away = (e: PointerEvent) => {
      if (!box.current?.contains(e.target as Node)) setOpen(false)
    }
    const esc = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('pointerdown', away)
    document.addEventListener('keydown', esc)
    return () => {
      document.removeEventListener('pointerdown', away)
      document.removeEventListener('keydown', esc)
    }
  }, [open])

  return (
    <div ref={box} className="relative" dir="ltr">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`Language: ${cur.name}`}
        className="flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-[13px] font-extrabold transition-opacity hover:opacity-100"
        style={{ borderColor: 'color-mix(in srgb, var(--ink) 35%, transparent)', opacity: open ? 1 : 0.75 }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
          <circle cx="12" cy="12" r="9" />
          <path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18" />
        </svg>
        {cur.short}
        <svg width="9" height="9" viewBox="0 0 10 10" fill="currentColor" aria-hidden style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform .2s' }}>
          <path d="M1 3l4 4 4-4z" />
        </svg>
      </button>
      {open && (
        <ul
          role="listbox"
          className={`absolute right-0 top-full z-50 mt-2 max-h-[70vh] min-w-[150px] overflow-y-auto rounded-2xl border py-1 text-[15px] font-bold shadow-xl backdrop-blur-md`}
          style={{ background: 'color-mix(in srgb, var(--bg) 92%, transparent)', borderColor: 'color-mix(in srgb, var(--ink) 25%, transparent)' }}
        >
          {LANGS.map((l) => (
            <li key={l.code} role="option" aria-selected={l.code === lang}>
              <button
                lang={l.code}
                onClick={() => {
                  setLang(l.code)
                  setOpen(false)
                }}
                className="flex w-full items-center justify-between gap-4 px-4 py-2 text-left transition-opacity hover:opacity-100"
                style={{ opacity: l.code === lang ? 1 : 0.7 }}
              >
                <span>{l.name}</span>
                {l.code === lang && <span aria-hidden>✓</span>}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
