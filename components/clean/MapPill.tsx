'use client'

import { useState } from 'react'
import { haptic } from '@/lib/phone'
import { sound } from '@/lib/sound'

// A pill that opens into a small map. The map only loads when it is opened, so it costs nothing on first load.
export default function MapPill({ place = 'Calgary, Alberta, Canada' }: { place?: string }) {
  const [open, setOpen] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const toggle = () => {
    haptic(8)
    sound.knock(0.5)
    setOpen(!open)
    if (open) setLoaded(false)
  }
  const src = `https://maps.google.com/maps?q=${encodeURIComponent(place)}&z=11&ie=UTF8&output=embed`

  return (
    <div className="mt-8 w-full max-w-[420px]">
      <div
        className="relative overflow-hidden transition-all duration-500 ease-out"
        style={{
          height: open ? 'min(420px, calc(100vw - 48px))' : 52,
          width: open ? '100%' : 190,
          borderRadius: open ? 28 : 26,
          boxShadow: 'inset 0 0 0 1.5px var(--line)',
          background: 'color-mix(in srgb, var(--bg) 70%, transparent)',
        }}
      >
        {open && (
          <>
            <iframe
              title={`Map of ${place}`}
              src={src}
              loading="lazy"
              onLoad={() => setLoaded(true)}
              className={`absolute inset-0 h-full w-full border-0 transition-opacity duration-700 ${loaded ? 'opacity-100' : 'opacity-0'}`}
              style={{ filter: 'invert(92%) hue-rotate(180deg) grayscale(0.6) contrast(0.95)' }}
            />
            {!loaded && (
              <span className="absolute inset-0 grid place-items-center text-[13px] font-extrabold uppercase tracking-[0.2em]" style={{ color: 'var(--muted)' }}>
                Loading map
              </span>
            )}
          </>
        )}
        <button
          onClick={toggle}
          aria-expanded={open}
          data-hover={open ? 'Close' : 'Map'}
          aria-label={open ? 'Close map' : 'View on map'}
          className={
            open
              ? 'absolute right-3 top-3 z-10 grid h-10 w-10 place-items-center rounded-full text-[18px] font-extrabold transition-transform active:scale-90'
              : 'absolute inset-0 flex items-center justify-center gap-2.5 text-[16px] font-extrabold transition-transform hover:scale-[1.03]'
          }
          style={open ? { background: 'var(--hot)', color: '#1a1200' } : { color: 'var(--ink)' }}
        >
          {open ? (
            '✕'
          ) : (
            <>
              <span aria-hidden className="inline-block h-[12px] w-[7px] -rotate-[14deg] rounded-full" style={{ background: 'var(--hot)' }} />
              View on map
            </>
          )}
        </button>
      </div>
      <p className="mt-3 text-[13px] font-bold" style={{ color: 'var(--muted)' }}>Based in Calgary, working with people everywhere.</p>
    </div>
  )
}
