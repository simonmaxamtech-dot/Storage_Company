'use client'

import { useEffect, useState } from 'react'
import { useT } from '@/lib/i18n'
import { haptic } from '@/lib/phone'
import { sound } from '@/lib/sound'

// The 3D home tour. The tour itself is a separate little site served from /tour; it is only fetched when someone
// presses the button, so this section costs the page one small picture until then.
const SRC = '/tour/?embed'

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
        className="group relative block aspect-[4/5] w-full overflow-hidden rounded-[22px] text-left transition-transform duration-300 hover:scale-[1.012] sm:aspect-video"
        style={{ boxShadow: 'inset 0 0 0 1.5px var(--line)', background: '#0d0f12' }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/tour-poster.webp" alt="" loading="lazy" decoding="async" width={1280} height={720} className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]" />
        <span aria-hidden className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(8,9,11,0.82) 0%, rgba(8,9,11,0.1) 55%, transparent 100%)' }} />
        <span className="absolute inset-x-0 bottom-0 flex flex-col items-start gap-4 p-5 sm:flex-row sm:items-end sm:justify-between sm:p-8">
          <span>
            <span className="block font-pacalix text-[clamp(26px,4.2vw,60px)] leading-[0.98] tracking-[0.015em]">{t('tour.home')}</span>
            <span className="mt-2 block text-[13px] font-bold sm:text-[16px]" style={{ color: 'var(--muted)' }}>{t('tour.meta')}</span>
          </span>
          <span className="pill-o flex-none px-5 py-3 text-[14px] font-extrabold transition-transform group-hover:scale-105">{t('tour.walk')} →</span>
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
      <button onClick={() => go('contact')} data-hover="Contact" className="pill-o w-fit px-5 py-2.5 text-[14px] font-extrabold transition-transform hover:scale-105 sm:col-span-3">
        {t('tour.cta')}
      </button>
    </div>
  )
}
