'use client'

import { useEffect, useRef, useState } from 'react'
import { live } from '@/lib/store'
import { haptic } from '@/lib/phone'
import { hashText, sound } from '@/lib/sound'

// Prices are in Canadian dollars, before tax. Edit this list to change the plans: the section builds itself from it.
// "from" is the starting price of a fixed quote; null means "scoped together". Each plan has a form that grows with it:
// an idea, a tree, a world, a universe.
export interface Plan {
  name: string
  form: string
  badge?: string
  blurb: string
  who: string
  time: string
  from: number | null
  includes: string[]
}

export const PLANS: Plan[] = [
  {
    name: 'Launch',
    form: 'an idea',
    blurb: 'A sharp, fast site that makes you look like the real thing from day one.',
    who: 'Founders, creators and local businesses',
    time: '1 to 2 weeks',
    from: 1500,
    includes: ['One custom-designed page', 'Mobile-first and fast', 'One light 3D moment', 'Contact form and basic SEO', 'Source files and handover'],
  },
  {
    name: 'Studio',
    form: 'a tree',
    badge: 'Most chosen',
    blurb: 'A full site with real 3D, built to win clients.',
    who: 'Studios, agencies and growing brands',
    time: '3 to 5 weeks',
    from: 3900,
    includes: ['Everything in Launch', 'Up to 6 custom pages', 'A custom 3D model or scene', 'Motion, touch and sound design', 'Analytics and speed tuning', '30 days of support'],
  },
  {
    name: 'Brand',
    form: 'a world',
    blurb: 'A whole brand world: identity, site and 3D from one team.',
    who: 'Companies launching or relaunching',
    time: '6 to 10 weeks',
    from: 9500,
    includes: ['Everything in Studio', 'Brand identity and custom typeface', 'A real-time 3D product or world', 'Content and SEO plan', 'An editor your team can use', '90 days of support'],
  },
  {
    name: 'Custom',
    form: 'a universe',
    blurb: 'Large, multi-language or unusual builds, scoped together with you.',
    who: 'Large brands and ambitious ideas',
    time: 'Scoped together',
    from: null,
    includes: ['Everything in Brand', 'Multi-language rollout', 'Unreal Engine, XR and apps', 'Procurement and legal support', 'A dedicated team'],
  },
]

export const fmt = (n: number) => Math.round(n).toLocaleString('en-CA')

// The number counts to its new value instead of jumping.
export function useCount(target: number) {
  const [v, setV] = useState(target)
  const cur = useRef(target)
  useEffect(() => {
    let raf = 0
    const from = cur.current
    const t0 = performance.now()
    const run = (now: number) => {
      const k = Math.min(1, (now - t0) / 700)
      const e = 1 - Math.pow(1 - k, 3)
      cur.current = from + (target - from) * e
      setV(cur.current)
      if (k < 1) raf = requestAnimationFrame(run)
    }
    raf = requestAnimationFrame(run)
    return () => cancelAnimationFrame(raf)
  }, [target])
  return v
}

export default function Pricing() {
  const [pi, setPi] = useState(1)
  const plan = PLANS[pi]
  const shown = useCount(plan.from ?? 0)

  // The 3D form on the other side of the screen follows the plan.
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
    <div className="max-w-[640px]">
      <div role="tablist" aria-label="Plans" className="flex flex-wrap gap-x-5 gap-y-1">
        {PLANS.map((p, i) => {
          const on = i === pi
          return (
            <button
              key={p.name}
              role="tab"
              aria-selected={on}
              data-hover={on ? '' : 'Show'}
              onClick={() => choose(i)}
              className="group relative py-1 text-left"
            >
              <span
                className="font-display text-[clamp(24px,3.4vw,42px)] leading-[1.15] tracking-[-0.01em] transition-colors duration-500"
                style={{ color: on ? 'var(--ink)' : 'color-mix(in srgb, var(--ink) 38%, transparent)' }}
              >
                {p.name}
              </span>
              {p.badge && (
                <span aria-label={p.badge} title={p.badge} className="ml-1.5 inline-block h-[9px] w-[9px] rounded-full align-top" style={{ background: 'var(--ink)' }} />
              )}
            </button>
          )
        })}
      </div>

      <div key={plan.name} className="plan-in mt-7">
        <p className="text-[17px] font-bold" style={{ color: 'var(--muted)' }}>
          {plan.badge ? `${plan.badge}. ` : ''}{plan.blurb} <span className="whitespace-nowrap">Shown as {plan.form}.</span>
        </p>
        <ul className="mt-5 space-y-2.5">
          {plan.includes.map((t) => (
            <li key={t} className="flex gap-3 text-[16px] font-bold leading-snug">
              <span aria-hidden className="mt-[5px] inline-block h-[12px] w-[7px] shrink-0 -rotate-[14deg] rounded-full" style={{ background: 'var(--ink)' }} />
              {t}
            </li>
          ))}
        </ul>
        <p className="mt-6 text-[14px] font-bold" style={{ color: 'var(--muted)' }}>Made for {plan.who.toLowerCase()}. Delivery: {plan.time.toLowerCase()}.</p>
      </div>

      <div className="mt-9 flex flex-wrap items-end gap-x-8 gap-y-5">
        <div>
          <p className="font-display text-[clamp(52px,8vw,104px)] leading-[0.95] tracking-[-0.02em]">
            {plan.from === null ? (
              'Let’s talk'
            ) : (
              <>
                <span className="text-[0.32em] align-top">From CA$</span>
                {fmt(shown)}
              </>
            )}
          </p>
          <p className="mt-1 text-[14px] font-bold" style={{ color: 'var(--muted)' }}>
            {plan.name} · fixed quote in writing · Canadian dollars
          </p>
        </div>
        <button
          data-hover="Start"
          onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
          className="mb-1 rounded-full px-7 py-3.5 text-[16px] font-bold"
          style={{ background: 'var(--ink)', color: 'var(--bg)' }}
        >
          Start a project
        </button>
      </div>
      <p className="mt-5 text-[14px] font-bold" style={{ color: 'var(--muted)' }}>We work with clients around the world.</p>
    </div>
  )
}
