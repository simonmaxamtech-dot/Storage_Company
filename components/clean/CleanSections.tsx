'use client'

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import { live } from '@/lib/store'
import { haptic } from '@/lib/phone'
import { hashText, sound } from '@/lib/sound'
import { INSTAGRAM, LINKEDIN_COMPANY } from '@/lib/site'
import { ISSUER, Mark, OBJ, PROFESSIONAL, COURSES, TOTAL, type Cert, type IssuerId } from '../Credentials'
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
  big,
  children,
}: {
  id: string
  big?: boolean
  kicker: string
  title: ReactNode
  sub?: ReactNode
  children?: ReactNode
}) {
  return (
    <section data-section id={id} className="relative">
      <div className={`flex flex-col pb-8 pt-28 sm:pb-12 ${big ? 'min-h-[60svh] justify-end sm:min-h-[84svh] sm:justify-center' : 'min-h-[26svh] justify-end sm:min-h-[36svh]'} ${pad}`}>
        <div className="mx-auto w-full max-w-[1100px]">
          <Kicker>{kicker}</Kicker>
          <h2 data-react data-live={id} className={big ? 'mt-5 font-pacalix text-[clamp(56px,7.4vw,150px)] leading-[0.92] tracking-[0.015em]' : 'mt-4 font-pacalix text-[clamp(30px,4.8vw,70px)] leading-[1.02] tracking-[0.015em] lg:max-w-[60%]'}>
            {title}
          </h2>
          {sub && (
            <p className={`max-w-[560px] text-[16px] font-bold leading-snug sm:text-[18px] lg:max-w-[46%] ${big ? 'mt-6' : 'mt-3'}`} style={{ color: 'var(--muted)' }}>
              {sub}
            </p>
          )}
        </div>
      </div>
      {children && (
        <div className={`pb-14 pt-10 sm:pb-20 sm:pt-14 ${pad}`} style={{ background: 'linear-gradient(to bottom, transparent 0, color-mix(in srgb, var(--bg) 62%, transparent) 50px, color-mix(in srgb, var(--bg) 62%, transparent) calc(100% - 60px), transparent 100%)' }}>
          <div className="mx-auto w-full max-w-[1100px]">{children}</div>
        </div>
      )}
    </section>
  )
}

const go = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })

/* ── Certificates: one coloured card per program and per issuer ──────────── */
const ORDER: IssuerId[] = ['london', 'siemens', 'github', 'microsoft', 'aws', 'adobe', 'linkedin']

function Chips({ c }: { c: Cert }) {
  const s = c.skills ?? []
  if (c.look === 'code')
    return (
      <span className="inline-block rounded-lg px-3 py-2 font-mono text-[13px] font-bold" style={{ boxShadow: 'inset 0 0 0 1.5px color-mix(in srgb, var(--brand) 45%, transparent)' }}>
        <span style={{ color: 'var(--muted)' }}>&gt;&gt;&gt; </span>
        <span style={{ color: 'var(--brand2)' }}>import</span> {s.map((k) => k.toLowerCase()).join(', ')}
        <span className="code-caret" style={{ color: 'var(--brand2)' }}>▍</span>
      </span>
    )
  return (
    <span className="flex flex-wrap gap-2">
      {s.map((k, i) => (
        <span key={k} className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-[12px] font-extrabold" style={{ boxShadow: 'inset 0 0 0 1.5px color-mix(in srgb, var(--brand) 55%, transparent)' }}>
          <span className="inline-block h-[9px] w-[3px] rounded-sm" style={{ background: i % 2 && c.brand2 ? 'var(--brand2)' : 'var(--brand)' }} />
          {k}
        </span>
      ))}
    </span>
  )
}

export function CleanCerts({ onOpen }: { onOpen: (c: Cert) => void }) {
  const open = (c: Cert, h = 8) => {
    onOpen(c)
    haptic(h)
  }
  return (
    <Shell id="credentials" kicker="Credentials" title={<>Certified by <span style={{ color: 'var(--hot)' }}>the best.</span></>} sub={`${TOTAL} certificates from the companies that build the internet.`}>
      <div className="grid gap-4 sm:grid-cols-2 sm:gap-5">
        {PROFESSIONAL.map((c) => (
          <button
            key={c.img}
            onClick={() => open(c, 10)}
            onPointerEnter={() => sound.pluck(hashText(c.title))}
            data-hover="Open"
            className="clean-card issuer-pop group flex flex-col items-start gap-4 text-left sm:min-h-[300px] max-sm:gap-2.5"
            style={{ ['--brand' as string]: c.brand ?? ISSUER[c.issuer].color, ['--brand2' as string]: c.brand2 } as CSSProperties}
          >
            <span className="flex w-full items-start justify-between gap-3">
              <span>
                <Mark id={c.issuer} size={44} />
                <span className="mt-2.5 block text-[12px] font-bold uppercase tracking-[0.16em]" style={{ color: 'var(--muted)' }}>
                  {c.courses} courses · {c.date}
                </span>
              </span>
              {OBJ[c.img] && <span className="max-sm:-mb-6 max-sm:-mt-2"><CertObject kind={OBJ[c.img]} size={96} /></span>}
            </span>
            <span className="pill-o px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.16em]">
              Professional Certificate
            </span>
            <span className="block font-display text-[clamp(25px,2.5vw,36px)] leading-[1.02]">{c.title}</span>
            <span className="block max-w-[44ch] text-[15px] font-bold leading-snug max-sm:hidden" style={{ color: 'var(--muted)' }}>{c.text}</span>
            <span className="max-sm:hidden"><Chips c={c} /></span>
            <span className="work-go mt-auto text-[14px] font-extrabold" style={{ color: 'var(--brand)' }}>See certificate ↗</span>
          </button>
        ))}
      </div>

      <p className="mb-5 mt-14 text-[13px] font-extrabold uppercase tracking-[0.2em]" style={{ color: 'var(--hot)' }}>More certificates</p>
      <div className="grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
        {ORDER.map((id) => {
          const list = COURSES.filter((c) => c.issuer === id)
          return (
            <div
              key={id}
              className={`clean-card issuer-pop flex flex-col gap-4 ${list.length > 4 ? 'sm:col-span-2 lg:col-span-3' : ''}`}
              style={{ ['--brand' as string]: ISSUER[id].color } as CSSProperties}
            >
              <div className="flex items-start justify-between gap-3">
                <Mark id={id} size={44} />
                <span className="font-pacalix text-[clamp(34px,3.4vw,52px)] leading-[0.85]" style={{ color: 'var(--brand)' }}>{String(list.length).padStart(2, '0')}</span>
              </div>
              <p className="text-[13px] font-bold uppercase tracking-[0.14em]" style={{ color: 'var(--muted)' }}>{ISSUER[id].line}</p>
              <div className="mt-auto flex flex-wrap gap-2">
                {list.map((c) => (
                  <button
                    key={c.img}
                    onClick={() => open(c)}
                    onPointerEnter={() => sound.pluck(hashText(c.title))}
                    data-hover="Open"
                    className="cert-chip rounded-full px-3.5 py-1.5 text-[13px] font-bold"
                  >
                    {c.short}
                  </button>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      <p className="mt-8 flex flex-wrap gap-x-6 gap-y-1 text-[13px] font-bold sm:text-[14px]" style={{ color: 'var(--muted)' }}>
        <span>★ TÜBİTAK · 3rd place in Türkiye</span>
        <span>★ Waterloo Newtonian Medal</span>
      </p>
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
  note?: string
  tag: string
  title: string
  line: string
  el: ReactNode
}

/* The lab: one big live screen, a list of experiments on the side. Different from the cards on purpose: this one is for playing. */
function DemoLab({ demos }: { demos: Demo[] }) {
  const [i, setI] = useState(0)
  const d = demos[i]
  return (
    <div className="mt-16">
      <p className="text-[13px] font-extrabold uppercase tracking-[0.2em]" style={{ color: 'var(--hot)' }}>Try it, they are live</p>
      <div className="mt-4 grid gap-4 lg:grid-cols-[250px_1fr] lg:gap-6" style={{ ['--brand' as string]: d.color } as CSSProperties}>
        <div className="[scrollbar-width:none] [&::-webkit-scrollbar]:hidden -mx-6 flex gap-2 overflow-x-auto px-6 lg:mx-0 lg:flex-col lg:gap-1 lg:overflow-visible lg:px-0" role="tablist">
          {demos.map((x, n) => (
            <button
              key={x.title}
              role="tab"
              aria-selected={n === i}
              onClick={() => {
                setI(n)
                haptic(8)
              }}
              data-hover="Play"
              className="lab-tab shrink-0 text-left font-mono"
              style={{ ['--brand' as string]: x.color, opacity: n === i ? 1 : 0.55 } as CSSProperties}
            >
              <span className="text-[12px] font-bold" style={{ color: x.color }}>{String(n + 1).padStart(2, '0')}</span>
              <span className="block text-[14px] font-bold leading-tight sm:text-[15px]">{x.tag}</span>
              <span className="hidden text-[12px] font-semibold leading-snug lg:block" style={{ color: 'var(--muted)' }}>{x.title}</span>
            </button>
          ))}
        </div>
        <div>
          <div className="overflow-hidden" style={{ borderRadius: 14, boxShadow: 'inset 0 0 0 1.5px color-mix(in srgb, var(--brand) 55%, transparent), 0 30px 80px rgba(0,0,0,0.45)' }}>
            <div className="flex items-center justify-between gap-3 px-4 py-2.5 font-mono text-[11px] font-bold uppercase tracking-[0.14em]" style={{ background: 'color-mix(in srgb, var(--bg) 80%, black)', color: 'var(--muted)' }}>
              <span className="flex items-center gap-2">
                <span aria-hidden className="inline-block h-[7px] w-[7px] rounded-full" style={{ background: 'var(--brand)', animation: 'pill-pulse 1.4s ease-in-out infinite' }} />
                live · {d.tag}
              </span>
              <span className="truncate normal-case tracking-normal">{d.note ?? 'try it'}</span>
            </div>
            <div key={d.title} className="h-[330px] w-full sm:h-[440px]">{d.el}</div>
          </div>
          <h3 className="mt-4 font-display text-[clamp(22px,2.2vw,30px)] leading-[1.05]">{d.title}</h3>
          <p className="mt-1.5 max-w-[60ch] text-[15px] font-bold leading-snug" style={{ color: 'var(--muted)' }}>{d.line}</p>
        </div>
      </div>
    </div>
  )
}

export function CleanWork({ projects, demos }: { projects: Project[]; demos: Demo[] }) {
  const [obj, setObj] = useState(250)
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)')
    const set = () => setObj(mq.matches ? 400 : 250)
    set()
    mq.addEventListener('change', set)
    return () => mq.removeEventListener('change', set)
  }, [])
  return (
    <Shell id="work" kicker="Work" title={<>Built, <span style={{ color: 'var(--hot)' }}>live.</span></>} sub="Three real projects, designed and built end to end, running right now.">
      <div className="work-list flex flex-col gap-14 sm:gap-24">
        {projects.map((p, i) => (
          <Reveal key={p.name}>
            <a
              href={p.url}
              target="_blank"
              rel="noopener noreferrer"
              data-hover="Visit"
              className="work-row group relative grid items-center gap-2 sm:gap-6 lg:grid-cols-2 lg:gap-10"
              style={{ ['--brand' as string]: p.color } as CSSProperties}
            >
              <div className={`work-stage relative mx-auto flex items-center justify-center ${i % 2 ? 'lg:order-2' : ''}`} style={{ width: obj, height: obj }}>
                <span aria-hidden className="work-glow" />
                <span className="work-obj relative block">
                  <CertObject kind={p.obj} size={obj} />
                </span>
              </div>
              <div className="relative text-center lg:text-left">
                <p className="text-[12px] font-extrabold uppercase tracking-[0.2em]" style={{ color: 'var(--brand)' }}>
                  0{i + 1} <span style={{ color: 'var(--muted)' }}>/ 0{projects.length} · {p.kind}</span>
                </p>
                <span className="mt-3 block font-display text-[clamp(44px,7vw,104px)] leading-[0.95]">{p.name.replace('Ō', 'O')}</span>
                <p className="mx-auto mt-4 max-w-[480px] text-[16px] font-bold leading-snug sm:text-[19px] lg:mx-0" style={{ color: 'var(--muted)' }}>{p.text}</p>
                <span className="work-go mt-6 inline-flex items-center gap-2 rounded-full px-6 py-3 text-[15px] font-extrabold" style={{ background: 'var(--brand)', color: '#14080a' }}>
                  Visit {p.host} ↗
                </span>
              </div>
            </a>
          </Reveal>
        ))}
      </div>

      <DemoLab demos={demos} />
    </Shell>
  )
}

/* ── About: Simon's face, made of particles, sits behind the heading ──────── */
/* Things fade and rise into place once, when they come into view, instead of just being there. */
function useSeen<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  const [seen, setSeen] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return
      setSeen(true)
      io.disconnect()
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.12 })
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return [ref, seen] as const
}

function Reveal({ children, delay = 0, className = '' }: { children: ReactNode; delay?: number; className?: string }) {
  const [ref, seen] = useSeen<HTMLDivElement>()
  return (
    <div ref={ref} className={`rv ${seen ? 'rv-in' : ''} ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  )
}

function Stat({ n, label, delay }: { n: number; label: string; delay: number }) {
  const [ref, seen] = useSeen<HTMLDivElement>()
  const v = useCount(seen ? n : 0)
  return (
    <div ref={ref} className={`rv ${seen ? 'rv-in' : ''} pt-5`} style={{ transitionDelay: `${delay}ms`, borderTop: '1.5px solid color-mix(in srgb, var(--hot) 45%, transparent)' }}>
      <div className="font-pacalix text-[clamp(52px,8vw,120px)] leading-[0.9]" style={{ color: 'var(--hot)' }}>{Math.round(v)}</div>
      <div className="mt-3 text-[14px] font-extrabold sm:text-[16px]" style={{ color: 'var(--ink)' }}>{label}</div>
    </div>
  )
}

const MAKE = [
  { tag: 'Websites', line: 'Fast, clear and built to be found. Yours to own.' },
  { tag: '3D experiences', line: 'Products and whole worlds people can turn, pull apart and play with.' },
  { tag: 'Brand', line: 'A name, a typeface and a look that is unmistakably yours.' },
  { tag: 'AI tools', line: 'Chat, search and helpers that do real work for your team.' },
]

export function CleanAbout() {
  return (
    <Shell
      id="about"
      big
      kicker="Founder"
      title={<>Simon<br />Maxam</>}
      sub="I build interactive 3D websites, products and games, and play guitar the same way I code: patient, then suddenly fast."
    >
      <div className="grid grid-cols-3 gap-4 sm:gap-8">
        <Stat n={27} label="certificates" delay={0} />
        <Stat n={3} label="live sites" delay={120} />
        <Stat n={5} label="disciplines" delay={240} />
      </div>

      <Reveal className="mt-20">
        <p className="text-[13px] font-extrabold uppercase tracking-[0.2em]" style={{ color: 'var(--hot)' }}>What we make</p>
      </Reveal>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        {MAKE.map((m, i) => (
          <Reveal key={m.tag} delay={i * 110}>
            <div className="clean-card flex min-h-[190px] flex-col items-start justify-between gap-6" style={{ ['--brand' as string]: 'var(--hot)' } as CSSProperties}>
              <span className="pill-o px-3.5 py-1.5 text-[12px] font-extrabold uppercase tracking-[0.12em]">{m.tag}</span>
              <p className="max-w-[420px] text-[19px] font-extrabold leading-snug sm:text-[22px]">{m.line}</p>
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal className="mt-20">
        <p className="max-w-[640px] text-[15px] font-bold leading-snug sm:text-[17px]" style={{ color: 'var(--muted)' }}>
          <span style={{ color: 'var(--hot)' }}>Why PACALIX?</span> It nods to Palaeocastor, an early beaver from 25 million years ago. Dig deep, build it right, leave something that stays standing.
        </p>
        <button onClick={() => go('work')} data-hover="Work" className="pill-o mt-6 px-5 py-2.5 text-[14px] font-extrabold transition-transform hover:scale-105">
          See what we built ↓
        </button>
      </Reveal>
    </Shell>
  )
}

/* ── Pricing ─────────────────────────────────────────────────────────────── */
const STEPS = [
  { n: '01', h: 'Talk', t: 'A free first call. You get a fixed quote in writing, usually within a day.' },
  { n: '02', h: 'Build', t: '50% to start. You see a live preview link at every step, not just at the end.' },
  { n: '03', h: 'Launch', t: '50% when you approve. You own the source, the design and the domain.' },
]

export function CleanPricing() {
  const [pi, setPi] = useState(1)
  const plan = PLANS[pi]
  const shown = useCount(plan.from ?? 0)
  useEffect(() => {
    live.plan = pi
    return () => {
      live.plan = 1
    }
  }, [pi])
  const choose = (i: number) => {
    setPi(i)
    haptic(10)
    sound.pluck(hashText(PLANS[i].name))
  }
  return (
    <Shell id="pricing" kicker="Pricing" title={<>Fixed prices. <span style={{ color: 'var(--hot)' }}>No surprises.</span></>} sub="Every project is quoted in writing before we start. Pick the one closest to yours.">
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

        <div key={plan.name} className="plan-in mt-7 grid gap-8 rounded-[24px] p-6 sm:p-9 lg:grid-cols-[1.1fr_1fr] lg:gap-14" style={{ background: 'color-mix(in srgb, var(--bg) 70%, var(--hot) 8%)', boxShadow: 'inset 0 0 0 1.5px color-mix(in srgb, var(--hot) 24%, transparent)' }}>
          <div className="flex flex-col">
            {plan.badge && (
              <span className="pill-o mb-3 self-start px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.16em]" style={{ ['--brand' as string]: 'var(--hot)' } as CSSProperties}>{plan.badge}</span>
            )}
            <p className="text-[16px] font-bold leading-snug sm:text-[18px]" style={{ color: 'var(--muted)' }}>{plan.blurb}</p>
            <div className="mt-4">
              {plan.from === null ? (
                <p className="font-pacalix text-[clamp(44px,7vw,92px)] leading-[0.95]">Let&rsquo;s talk</p>
              ) : (
                <>
                  <p className="text-[12px] font-extrabold uppercase tracking-[0.18em]" style={{ color: 'var(--muted)' }}>Starting from</p>
                  <p className="mt-1 font-pacalix text-[clamp(44px,8vw,104px)] leading-[0.95]">
                    <span className="align-top text-[0.42em]">CA$</span>
                    {fmt(shown)}
                  </p>
                </>
              )}
            </div>
            <dl className="mt-6 grid grid-cols-2 gap-5">
              <div>
                <dt className="text-[11px] font-extrabold uppercase tracking-[0.14em]" style={{ color: 'var(--muted)' }}>Delivery</dt>
                <dd className="mt-1 text-[16px] font-extrabold">{plan.time}</dd>
              </div>
              <div>
                <dt className="text-[11px] font-extrabold uppercase tracking-[0.14em]" style={{ color: 'var(--muted)' }}>Best for</dt>
                <dd className="mt-1 text-[16px] font-extrabold leading-snug">{plan.who}</dd>
              </div>
            </dl>
          </div>
          <div className="flex flex-col justify-between gap-6">
            <ul className="space-y-2.5">
              {plan.includes.map((t) => (
                <li key={t} className="flex gap-3 text-[15px] font-bold leading-snug sm:text-[16px]">
                  <span aria-hidden className="mt-[3px] shrink-0 font-display text-[16px]" style={{ color: 'var(--hot)' }}>✓</span>
                  {t}
                </li>
              ))}
            </ul>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
              <button
                data-hover="Start"
                onClick={() => go('contact')}
                className="rounded-full px-7 py-3.5 text-[16px] font-extrabold transition-transform hover:scale-105"
                style={{ background: 'var(--hot)', color: 'var(--bg)' }}
              >
                {plan.from === null ? 'Tell us the idea' : 'Get my fixed quote'}
              </button>
              <span className="text-[13px] font-bold" style={{ color: 'var(--muted)' }}>Free call. No obligation.</span>
            </div>
          </div>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-3 sm:gap-8">
          {STEPS.map((s, i) => (
            <Reveal key={s.n} delay={i * 110}>
              <div className="pt-4" style={{ borderTop: '1.5px solid color-mix(in srgb, var(--hot) 45%, transparent)' }}>
                <p className="text-[12px] font-extrabold uppercase tracking-[0.2em]" style={{ color: 'var(--hot)' }}>{s.n}</p>
                <p className="mt-1.5 font-display text-[26px] leading-none sm:text-[30px]">{s.h}</p>
                <p className="mt-2.5 text-[14.5px] font-bold leading-snug" style={{ color: 'var(--muted)' }}>{s.t}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <p className="mt-8 text-[13px] font-bold" style={{ color: 'var(--muted)' }}>Canadian dollars, before tax. Hosting and your domain are paid at cost. Not sure which fits? Email us and we will tell you honestly.</p>
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
      <div className="clean-card lg:max-w-[56%]" style={{ ['--brand' as string]: 'var(--hot)', padding: 'clamp(24px,3.4vw,48px)' } as CSSProperties}>
        <p className="font-pacalix text-[clamp(34px,7vw,56px)] leading-[0.98] lg:text-[clamp(40px,4.4vw,72px)]">
          Let&apos;s build<br />it <span style={{ color: 'var(--hot)' }}>together.</span>
        </p>
        <div className="mt-7 flex flex-wrap gap-2">
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
        <p className="mt-5 font-mono text-[13px] font-bold" style={{ color: 'var(--muted)' }}>
          <span style={{ color: 'var(--hot)' }}>&gt; </span>{brief}<span className="code-caret" style={{ color: 'var(--hot)' }}>▍</span>
        </p>
        <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-4">
          <button onClick={send} data-hover="Go" className="rounded-full px-8 py-4 text-[17px] font-extrabold transition-transform hover:scale-105" style={{ background: 'var(--hot)', color: 'var(--bg)' }}>
            Send it ↗
          </button>
          <a href={`mailto:${email}`} className="text-[14px] font-bold underline decoration-2 underline-offset-4" style={{ color: 'var(--muted)' }}>{email}</a>
        </div>
      </div>
    </Shell>
  )
}

/* ── Footer: the wordmark at full width, each letter lifts as you pass over it ── */
export function CleanFooter() {
  const year = new Date().getFullYear()
  return (
    <footer className="relative px-6 pb-28 pt-20 sm:px-10 sm:pb-32 lg:pl-[8vw] lg:pr-[6vw]" style={{ background: 'linear-gradient(to bottom, transparent 0, color-mix(in srgb, var(--bg) 92%, transparent) 120px)' }}>
      <div className="mx-auto w-full max-w-[1100px]">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-8" style={{ borderBottom: '1.5px solid var(--line)' }}>
          <p className="max-w-[420px] text-[15px] font-bold leading-snug" style={{ color: 'var(--muted)' }}>
            Made by hand in Calgary, Canada, for people everywhere.
          </p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[14px] font-extrabold">
            <a href={INSTAGRAM} target="_blank" rel="noopener noreferrer" className="foot-link">Instagram</a>
            <a href={LINKEDIN_COMPANY} target="_blank" rel="noopener noreferrer" className="foot-link">LinkedIn</a>
            <a href="/services" className="foot-link">Services</a>
            <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} data-hover="Top" className="foot-link">Back to top ↑</button>
          </div>
        </div>
        <p aria-label="PACALIX" className="foot-word select-none py-6 font-pacalix text-[clamp(56px,16.4vw,230px)] leading-[0.95]" style={{ color: 'var(--hot)' }}>
          {'PACALIX'.split('').map((l, i) => (
            <span key={i} aria-hidden>{l}</span>
          ))}
        </p>
        <p className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 pt-4 text-[13px] font-bold" style={{ borderTop: '1.5px solid var(--line)', color: 'var(--muted)' }}>
          <span>© {year} PACALIX. All rights reserved.</span>
          <span className="flex flex-wrap gap-x-5 gap-y-1">
            <a href="/privacy" className="foot-link">Privacy Policy</a>
            <a href="/privacy#cookies" className="foot-link">Use of Cookies</a>
            <a href="/terms" className="foot-link">Terms of Use</a>
            <a href="/legal" className="foot-link">Legal</a>
            <a href="/site-map" className="foot-link">Site Map</a>
          </span>
        </p>
      </div>
    </footer>
  )
}
