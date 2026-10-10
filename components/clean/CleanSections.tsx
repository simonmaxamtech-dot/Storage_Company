'use client'

import { useState, type CSSProperties, type ReactNode } from 'react'
import { live, useStore } from '@/lib/store'
import { haptic } from '@/lib/phone'
import { hashText, sound } from '@/lib/sound'
import { INSTAGRAM, LINKEDIN_COMPANY, PHONE, PHONE_HREF } from '@/lib/site'
import { ISSUER, Mark, PROFESSIONAL, COURSES, TOTAL, type Cert, type IssuerId } from '../Credentials'
import { PLANS, fmt, useCount } from '../Pricing'
import CertObject, { type ObjKind } from '../CertObject'

// The Clean design: short sections, one accent colour each. Every section opens with a "stage" where the particle
// scene shows its own form (a mountain, a pavilion, the chosen plan...), then the content sits on a soft scrim.
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

function Shell({
  id,
  kicker,
  title,
  sub,
  children,
}: {
  id: string
  kicker: string
  title: ReactNode
  sub?: ReactNode
  children: ReactNode
}) {
  return (
    <section data-section id={id} className="relative">
      <div className={`flex min-h-[44svh] flex-col justify-end pb-8 pt-28 sm:min-h-[58svh] sm:pb-12 ${pad}`}>
        <div className="mx-auto w-full max-w-[1100px]">
          <Kicker>{kicker}</Kicker>
          <h2 data-react data-live={id} className="mt-4 font-display text-[clamp(38px,6.2vw,88px)] leading-[0.98] tracking-[-0.02em] lg:max-w-[52%]">
            {title}
          </h2>
          {sub && (
            <p className="mt-3 max-w-[560px] text-[16px] font-bold leading-snug sm:text-[18px] lg:max-w-[46%]" style={{ color: 'var(--muted)' }}>
              {sub}
            </p>
          )}
        </div>
      </div>
      <div className={`pb-20 pt-24 sm:pb-28 ${pad}`} style={{ background: 'linear-gradient(to bottom, transparent 0, color-mix(in srgb, var(--bg) 90%, transparent) 90px, color-mix(in srgb, var(--bg) 90%, transparent) calc(100% - 110px), transparent 100%)' }}>
        <div className="mx-auto w-full max-w-[1100px]">{children}</div>
      </div>
    </section>
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
    <Shell id="credentials" kicker="Credentials" title={<>Certified by <span style={{ color: 'var(--hot)' }}>the best.</span></>} sub={`${TOTAL} certificates from the companies that build the internet.`}>
        <div className="mb-8 flex flex-wrap items-center gap-x-6 gap-y-3 sm:gap-x-9">
          {LOGOS.map((id) => (
            <Mark key={id} id={id} size={22} />
          ))}
        </div>

        <ul className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
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
            style={{ background: 'var(--hot)', color: 'var(--bg)' }}
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
    </Shell>
  )
}

/* ── Work ────────────────────────────────────────────────────────────────── */
export interface Project {
  name: string
  kind: string
  host: string
  color: string
  obj: ObjKind
  url: string
  text: string
}

export interface Demo {
  color: string
  tag: string
  title: string
  line: string
  el: ReactNode
}

export function CleanWork({ projects, demos }: { projects: Project[]; demos: Demo[] }) {
  return (
    <Shell id="work" kicker="Work" title={<>Built, <span style={{ color: 'var(--hot)' }}>live.</span></>} sub="Real sites, running right now.">
      <div className="[scrollbar-width:none] [&::-webkit-scrollbar]:hidden -mx-6 flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-3 sm:mx-0 sm:grid sm:grid-cols-3 sm:gap-5 sm:overflow-visible sm:px-0">
        {projects.map((p, i) => (
          <a
            key={p.name}
            href={p.url}
            target="_blank"
            rel="noopener noreferrer"
            data-hover="Visit"
            className="clean-card group relative flex min-h-[380px] w-[76vw] shrink-0 snap-center flex-col justify-between sm:min-h-[420px] sm:w-auto"
            style={{ ['--brand' as string]: p.color } as CSSProperties}
          >
            <div className="flex items-start justify-between gap-3">
              <span className="work-num font-display text-[clamp(70px,7vw,110px)] leading-[0.85]" aria-hidden>{String(i + 1).padStart(2, '0')}</span>
              <CertObject kind={p.obj} size={140} />
            </div>
            <div>
              <span className="inline-block rounded-full px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.16em]" style={{ background: 'var(--brand)', color: '#14080a' }}>
                Live · {p.kind}
              </span>
              <span className="mt-3.5 block font-display text-[clamp(32px,3.2vw,48px)] leading-[0.98]">{p.name}</span>
              <p className="mt-2.5 text-[14px] font-semibold leading-snug sm:text-[15px]" style={{ color: 'var(--muted)' }}>{p.text}</p>
              <span className="work-go mt-5 inline-block rounded-full px-4 py-2 text-[13px] font-extrabold" style={{ background: 'var(--brand)', color: '#14080a' }}>Visit site ↗</span>
            </div>
          </a>
        ))}
      </div>

      <p className="mt-14 text-[13px] font-extrabold uppercase tracking-[0.2em]" style={{ color: 'var(--hot)' }}>Try it, they are live</p>
      <div className="[scrollbar-width:none] [&::-webkit-scrollbar]:hidden -mx-6 mt-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-3 sm:mx-0 sm:grid sm:grid-cols-3 sm:overflow-visible sm:px-0">
        {demos.map((d) => (
          <div key={d.title} className="flex w-[74vw] shrink-0 snap-center flex-col sm:w-auto">
            <div className="h-[300px] w-full" style={{ borderRadius: 22, boxShadow: '0 24px 60px rgba(0,0,0,0.35)' }}>
              {d.el}
            </div>
            <h3 className="mt-3.5 font-display text-[21px] leading-[1.05]">{d.title}</h3>
            <p className="mt-1 text-[14px] font-bold leading-snug" style={{ color: 'var(--muted)' }}>{d.line}</p>
          </div>
        ))}
      </div>
    </Shell>
  )
}

/* ── About: Simon's face, made of particles, sits behind the heading ──────── */
const STATS = [
  ['27', 'certificates'],
  ['5', 'disciplines'],
  ['7', 'years of guitar'],
]
const SKILLS = ['3D', 'Architecture', 'Code', 'Design', 'Music']

export function CleanAbout() {
  const soundOn = useStore((s) => s.soundOn)
  const listen = async () => {
    if (soundOn) return
    useStore.getState().setTrack(1)
    await sound.enable(1)
    useStore.getState().setSoundOn(true)
  }
  return (
    <Shell
      id="about"
      kicker="Founder"
      title="Simon Maxam"
      sub="I build interactive 3D websites, products and games, and play guitar the same way I code: patient, then suddenly fast."
    >
      <div className="grid grid-cols-3 gap-3">
        {STATS.map(([n, l]) => (
          <div key={l} className="rounded-[18px] px-4 py-4 sm:px-5" style={{ background: 'color-mix(in srgb, var(--hot) 13%, var(--bg))' }}>
            <div className="font-display text-[clamp(34px,5vw,60px)] leading-none" style={{ color: 'var(--hot)' }}>{n}</div>
            <div className="mt-1 text-[13px] font-bold" style={{ color: 'var(--muted)' }}>{l}</div>
          </div>
        ))}
      </div>
      <div className="mt-5 flex flex-wrap gap-2 max-sm:hidden">
        {SKILLS.map((k) => (
          <span key={k} className="rounded-full px-4 py-2 text-[14px] font-bold" style={{ boxShadow: 'inset 0 0 0 1.5px var(--line)' }}>{k}</span>
        ))}
      </div>
      <p className="mt-6 max-w-[640px] text-[15px] font-bold leading-snug max-sm:hidden" style={{ color: 'var(--muted)' }}>
        PACALIX nods to Palaeocastor, an early beaver from 25 million years ago. Dig deep, build it right, leave something that stays standing.
      </p>
      <button onClick={listen} data-hover="Listen" className="mt-6 rounded-full px-6 py-3 text-[15px] font-extrabold transition-transform hover:scale-105" style={{ background: 'var(--hot)', color: 'var(--bg)' }}>
        {soundOn ? 'Playing: watch the particles' : 'Hear my music'}
      </button>
    </Shell>
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
    <Shell id="pricing" kicker="Pricing" title={<>Clear <span style={{ color: 'var(--hot)' }}>prices.</span></>} sub="Pick a plan and watch the form change.">
        <div role="tablist" aria-label="Plans" className="grid grid-cols-4 gap-1.5 rounded-full p-1.5 sm:inline-grid sm:grid-cols-[repeat(4,auto)]" style={{ boxShadow: 'inset 0 0 0 1.5px var(--line)' }}>
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
            <div className="mt-5 flex flex-wrap gap-2 max-sm:hidden">
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
                    style={{ background: on ? 'var(--hot)' : 'transparent', color: on ? 'var(--bg)' : 'var(--ink)', boxShadow: on ? 'none' : 'inset 0 0 0 1.5px var(--line)' }}
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
              style={{ background: 'var(--hot)', color: 'var(--bg)' }}
            >
              Start a project
            </button>
          </div>
        </div>
        <p className="mt-4 text-[13px] font-bold" style={{ color: 'var(--muted)' }}>Canadian dollars. Every project is talked through before a price is fixed.</p>
    </Shell>
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
    <Shell id="contact" kicker="Contact" title={<>Reach <span style={{ color: 'var(--hot)' }}>us.</span></>}>
        <p className="text-[15px] font-bold" style={{ color: 'var(--muted)' }}>What are we making?</p>
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
          <button onClick={send} data-hover="Go" className="rounded-full px-7 py-3.5 text-[16px] font-extrabold transition-transform hover:scale-105" style={{ background: 'var(--hot)', color: 'var(--bg)' }}>
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
    </Shell>
  )
}
