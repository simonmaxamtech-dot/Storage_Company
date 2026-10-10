'use client'

import { useState, type CSSProperties } from 'react'
import { live } from '@/lib/store'
import { haptic } from '@/lib/phone'
import { hashText, sound } from '@/lib/sound'
import { INSTAGRAM, LINKEDIN_COMPANY, PHONE, PHONE_HREF } from '@/lib/site'
import { ISSUER, Mark, PROFESSIONAL, COURSES, TOTAL, type Cert, type IssuerId } from '../Credentials'
import { PLANS, fmt, useCount } from '../Pricing'

// The Clean design: short, calm sections. Each one has a single accent colour and sets its own palette, so nothing
// here depends on the particle scene behind the page (which stops drawing once the hero has scrolled away).
function tone(bg: string, ink: string, accent: string): CSSProperties {
  return {
    ['--bg' as string]: bg,
    ['--ink' as string]: ink,
    ['--hot' as string]: accent,
    ['--muted' as string]: `color-mix(in srgb, ${ink} 68%, transparent)`,
    ['--line' as string]: `color-mix(in srgb, ${ink} 15%, transparent)`,
    color: ink,
  }
}

const rule: CSSProperties = { borderTop: '1.5px solid var(--line)' }
const pad = 'px-6 sm:px-10 lg:pl-[8vw] lg:pr-[6vw]'

function Kicker({ children }: { children: string }) {
  return (
    <p className="inline-flex items-center gap-2.5 text-[12px] font-extrabold uppercase tracking-[0.2em] sm:text-[13px]" style={{ color: 'var(--hot)' }}>
      <span aria-hidden className="inline-block h-[12px] w-[7px] -rotate-[14deg] rounded-full" style={{ background: 'var(--hot)' }} />
      {children}
    </p>
  )
}

const go = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })

/* ── Certificates: the "wow" ─────────────────────────────────────────────── */
const ORDER: IssuerId[] = ['microsoft', 'aws', 'adobe', 'siemens', 'github', 'london', 'linkedin']
const LOGOS: IssuerId[] = ['google', 'microsoft', 'aws', 'ibm', 'adobe', 'siemens']

export function CleanCerts({ onOpen }: { onOpen: (c: Cert) => void }) {
  const [all, setAll] = useState(false)
  const list = [...COURSES].sort((a, b) => ORDER.indexOf(a.issuer) - ORDER.indexOf(b.issuer))
  return (
    <section
      data-section
      id="credentials"
      className={`relative pb-16 pt-40 sm:pb-24 sm:pt-48 ${pad}`}
      style={{ ...tone('#080d1c', '#f2f5ff', '#6c9bff'), background: 'linear-gradient(to bottom, transparent 0, #080d1c 130px)' }}
    >
      <div className="mx-auto w-full max-w-[1100px]">
        <Kicker>Credentials</Kicker>
        <h2 className="mt-4 font-display text-[clamp(38px,6.2vw,88px)] leading-[0.98] tracking-[-0.02em]">
          Certified by <span style={{ color: 'var(--hot)' }}>the best.</span>
        </h2>
        <p className="mt-3 text-[16px] font-bold sm:text-[18px]" style={{ color: 'var(--muted)' }}>
          {TOTAL} certificates from the companies that build the internet.
        </p>

        <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3 sm:gap-x-9">
          {LOGOS.map((id) => (
            <Mark key={id} id={id} size={22} />
          ))}
        </div>

        <ul className="mt-9 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {PROFESSIONAL.map((c) => (
            <li key={c.img}>
              <button
                onClick={() => {
                  onOpen(c)
                  haptic(10)
                }}
                onPointerEnter={() => sound.pluck(hashText(c.title))}
                data-hover="Open"
                className="clean-tile group flex h-full min-h-[148px] w-full flex-col items-start justify-between gap-6 rounded-[18px] p-4 text-left sm:min-h-[190px] sm:p-5"
                style={{ ['--tile' as string]: c.brand ?? ISSUER[c.issuer].color } as CSSProperties}
              >
                <Mark id={c.issuer} size={24} />
                <span className="block font-display text-[clamp(17px,1.9vw,24px)] leading-[1.08]">{c.title.replace(/^(Google|IBM|AWS) /, '')}</span>
              </button>
            </li>
          ))}
        </ul>

        <p className="mt-5 flex flex-wrap gap-x-6 gap-y-1 text-[13px] font-bold sm:text-[14px]" style={{ color: 'var(--muted)' }}>
          <span>★ TÜBİTAK · 3rd place in Türkiye</span>
          <span>★ Waterloo Newtonian Medal</span>
        </p>

        <div className="mt-8 pt-6" style={rule}>
          <button
            onClick={() => {
              setAll(!all)
              sound.pluck(hashText(all ? 'less' : 'more'))
            }}
            aria-expanded={all}
            className="rounded-full px-5 py-2.5 text-[14px] font-extrabold transition-transform hover:scale-105"
            style={{ background: 'var(--hot)', color: '#06101f' }}
          >
            {all ? 'Hide the rest' : `See all ${TOTAL}`}
          </button>
          {all && (
            <ul className="plan-in mt-6 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {list.map((c) => (
                <li key={c.img}>
                  <button
                    onClick={() => {
                      onOpen(c)
                      haptic(8)
                    }}
                    data-hover="Open"
                    className="clean-tile flex w-full items-center gap-3 rounded-[12px] px-3.5 py-3 text-left"
                    style={{ ['--tile' as string]: ISSUER[c.issuer].color } as CSSProperties}
                  >
                    <span aria-hidden className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: ISSUER[c.issuer].color }} />
                    <span className="min-w-0 text-[15px] font-bold leading-tight">
                      {c.short}
                      <span className="block text-[12px] font-bold" style={{ color: 'var(--muted)' }}>{ISSUER[c.issuer].name}</span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  )
}

/* ── Work ────────────────────────────────────────────────────────────────── */
export interface Project {
  name: string
  kind: string
  host: string
  color: string
  url: string
  text: string
}

export function CleanWork({ projects }: { projects: Project[] }) {
  return (
    <section data-section id="work" className={`py-16 sm:py-24 ${pad}`} style={{ ...tone('#120b08', '#fff3ea', '#ff7a3d'), background: '#120b08' }}>
      <div className="mx-auto w-full max-w-[1100px]">
        <Kicker>Work</Kicker>
        <h2 className="mt-4 font-display text-[clamp(38px,6.2vw,88px)] leading-[0.98] tracking-[-0.02em]">
          Built, <span style={{ color: 'var(--hot)' }}>live.</span>
        </h2>
        <ul className="mt-8" style={rule}>
          {projects.map((p, i) => (
            <li key={p.name} style={{ borderBottom: '1.5px solid var(--line)' }}>
              <a
                href={p.url}
                target="_blank"
                rel="noopener noreferrer"
                data-hover="Visit"
                className="clean-row group flex items-center gap-4 py-5 sm:gap-8 sm:py-7"
              >
                <span aria-hidden className="w-9 font-display text-[22px] leading-none sm:w-14 sm:text-[34px]" style={{ color: 'var(--hot)' }}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-display text-[clamp(26px,4vw,52px)] leading-[1]">{p.name}</span>
                  <span className="mt-1 block text-[13px] font-bold sm:text-[15px]" style={{ color: 'var(--muted)' }}>
                    <span className="max-sm:hidden">{p.text}</span>
                    <span className="sm:hidden">{p.kind}</span>
                  </span>
                </span>
                <span className="clean-go shrink-0 rounded-full px-4 py-2 text-[13px] font-extrabold sm:px-5 sm:text-[14px]">Visit ↗</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

/* ── Pricing ─────────────────────────────────────────────────────────────── */
export function CleanPricing() {
  const [pi, setPi] = useState(1)
  const [oi, setOi] = useState(1)
  const plan = PLANS[pi]
  const picked = plan.options[Math.min(oi, plan.options.length - 1)]
  const shown = useCount(picked.price)
  const choose = (i: number) => {
    setPi(i)
    setOi(i === 1 ? 1 : 0)
    haptic(10)
    sound.pluck(hashText(PLANS[i].name))
  }
  return (
    <section data-section id="pricing" className={`py-16 sm:py-24 ${pad}`} style={{ ...tone('#07130e', '#eefaf3', '#3ddc9a'), background: '#07130e' }}>
      <div className="mx-auto w-full max-w-[1100px]">
        <Kicker>Pricing</Kicker>
        <h2 className="mt-4 font-display text-[clamp(38px,6.2vw,88px)] leading-[0.98] tracking-[-0.02em]">
          Clear <span style={{ color: 'var(--hot)' }}>prices.</span>
        </h2>

        <div role="tablist" aria-label="Plans" className="mt-8 grid grid-cols-4 gap-1.5 rounded-full p-1.5 sm:inline-grid sm:grid-cols-[repeat(4,auto)]" style={{ boxShadow: 'inset 0 0 0 1.5px var(--line)' }}>
          {PLANS.map((p, i) => {
            const on = i === pi
            return (
              <button
                key={p.name}
                role="tab"
                aria-selected={on}
                data-hover={on ? '' : 'Show'}
                onClick={() => choose(i)}
                className="rounded-full px-1 py-2.5 text-[13px] font-extrabold transition-colors duration-300 sm:px-6 sm:text-[15px]"
                style={{ background: on ? 'var(--ink)' : 'transparent', color: on ? 'var(--bg)' : 'var(--ink)' }}
              >
                {p.name}
              </button>
            )
          })}
        </div>

        <div key={plan.name} className="plan-in mt-7 grid gap-8 rounded-[24px] p-6 sm:p-9 lg:grid-cols-[1.1fr_1fr] lg:gap-14" style={{ background: 'color-mix(in srgb, var(--hot) 7%, var(--bg))', boxShadow: 'inset 0 0 0 1.5px color-mix(in srgb, var(--hot) 24%, transparent)' }}>
          <div>
            <p className="text-[15px] font-bold" style={{ color: 'var(--muted)' }}>{plan.blurb}</p>
            <p className="mt-3 font-display text-[clamp(56px,9vw,112px)] leading-[0.92] tracking-[-0.02em]">
              <span className="align-top text-[0.42em]">CA$</span>
              {fmt(shown)}
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {plan.options.map((o, i) => {
                const on = i === Math.min(oi, plan.options.length - 1)
                return (
                  <button
                    key={o.team}
                    aria-pressed={on}
                    data-hover="Select"
                    onClick={() => {
                      setOi(i)
                      haptic(8)
                      sound.pluck(hashText(o.team))
                    }}
                    className="rounded-full px-3.5 py-2 text-[13px] font-bold transition-colors duration-300"
                    style={{ background: on ? 'var(--hot)' : 'transparent', color: on ? '#04140c' : 'var(--ink)', boxShadow: on ? 'none' : 'inset 0 0 0 1.5px var(--line)' }}
                  >
                    {o.team}
                  </button>
                )
              })}
            </div>
          </div>
          <div className="flex flex-col justify-between gap-6">
            <ul className="space-y-2.5">
              {plan.includes.slice(0, 4).map((t) => (
                <li key={t} className="flex gap-3 text-[15px] font-bold leading-snug sm:text-[16px]">
                  <span aria-hidden className="mt-[3px] shrink-0 font-display text-[16px]" style={{ color: 'var(--hot)' }}>✓</span>
                  {t}
                </li>
              ))}
            </ul>
            <button
              data-hover="Start"
              onClick={() => go('contact')}
              className="self-start rounded-full px-7 py-3.5 text-[16px] font-extrabold transition-transform hover:scale-105"
              style={{ background: 'var(--hot)', color: '#04140c' }}
            >
              Start a project
            </button>
          </div>
        </div>
        <p className="mt-4 text-[13px] font-bold" style={{ color: 'var(--muted)' }}>Canadian dollars. Every project is talked through before a price is fixed.</p>
      </div>
    </section>
  )
}

/* ── Contact ─────────────────────────────────────────────────────────────── */
const KINDS = ['A website', '3D visuals', 'A product in 3D', 'A game', 'Architecture', 'Something strange']

export function CleanContact({ email }: { email: string }) {
  const [picked, setPicked] = useState<string[]>([])
  const brief = `Hi PACALIX, I'd like to build ${picked.length ? picked.join(', ').toLowerCase() : 'something'}.`
  const send = () => {
    haptic([10, 30, 10])
    live.shake = 0.6
    sound.knock(0.9)
    window.location.href = `mailto:${email}?subject=${encodeURIComponent('New project')}&body=${encodeURIComponent(brief)}`
  }
  return (
    <section data-section id="contact" className={`py-16 pb-28 sm:py-24 sm:pb-32 ${pad}`} style={{ ...tone('#0b0b0d', '#fff9ea', '#ffc233'), background: '#0b0b0d' }}>
      <div className="mx-auto w-full max-w-[1100px]">
        <Kicker>Contact</Kicker>
        <h2 className="mt-4 font-display text-[clamp(38px,6.2vw,88px)] leading-[0.98] tracking-[-0.02em]">
          Reach <span style={{ color: 'var(--hot)' }}>us.</span>
        </h2>
        <p className="mt-6 text-[15px] font-bold" style={{ color: 'var(--muted)' }}>What are we making?</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {KINDS.map((k) => {
            const on = picked.includes(k)
            return (
              <button
                key={k}
                aria-pressed={on}
                onClick={() => {
                  setPicked(on ? picked.filter((p) => p !== k) : [...picked, k])
                  sound.pluck(hashText(k))
                  haptic(8)
                }}
                className="rounded-full px-4 py-2 text-[14px] font-bold transition-all duration-300"
                style={{ background: on ? 'var(--hot)' : 'transparent', color: on ? '#1a1200' : 'var(--ink)', boxShadow: on ? 'none' : 'inset 0 0 0 1.5px var(--line)' }}
              >
                {k}
              </button>
            )
          })}
        </div>
        <p className="mt-6 max-w-[620px] font-display text-[clamp(22px,3vw,34px)] leading-[1.15]">“{brief}”</p>
        <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-4">
          <button onClick={send} data-hover="Go" className="rounded-full px-7 py-3.5 text-[16px] font-extrabold transition-transform hover:scale-105" style={{ background: 'var(--hot)', color: '#1a1200' }}>
            Send it
          </button>
          <a href={`mailto:${email}`} className="text-[14px] font-bold underline decoration-2 underline-offset-4" style={{ color: 'var(--muted)' }}>{email}</a>
        </div>
        <p className="mt-8 flex flex-wrap gap-x-6 gap-y-2 pt-6 text-[14px] font-bold" style={{ ...rule, color: 'var(--muted)' }}>
          <a href={PHONE_HREF} className="hover:underline">{PHONE}</a>
          <a href={INSTAGRAM} target="_blank" rel="noopener noreferrer" className="hover:underline">Instagram</a>
          <a href={LINKEDIN_COMPANY} target="_blank" rel="noopener noreferrer" className="hover:underline">LinkedIn</a>
          <span>Clients worldwide · replies within a day</span>
        </p>
      </div>
    </section>
  )
}
