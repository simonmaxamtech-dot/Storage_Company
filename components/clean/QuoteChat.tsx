'use client'

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import { haptic } from '@/lib/phone'
import { hashText, sound } from '@/lib/sound'
import { CALLBACK_MINUTES, EMAIL, LEAD_ENDPOINT } from '@/lib/site'
import { PLANS, fmt } from '../Pricing'

// A short, friendly back-and-forth instead of a price list: what do you need, do you have a site, when, who are you.
const NEEDS = ['A new website', 'Redo my website', 'Marketing and content', 'Brand and logo', '3D or something interactive', 'Not sure yet']
const HAVE = ['Yes, and it works', 'Yes, but it is old', 'No, starting fresh']
const WHEN = ['As soon as possible', 'This month', 'In 1 to 3 months', 'Just looking']

type Sent = 'idle' | 'sending' | 'sent' | 'draft'

function Bot({ children }: { children: ReactNode }) {
  return (
    <div className="chat-in flex items-end gap-2.5">
      <span aria-hidden className="mb-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full font-pacalix text-[15px] leading-none" style={{ background: 'var(--hot)', color: 'var(--bg)' }}>P</span>
      <div className="max-w-[88%] rounded-[20px] rounded-bl-md px-4 py-3 text-[16px] font-bold leading-snug sm:text-[18px]" style={{ boxShadow: 'inset 0 0 0 1.5px var(--line)', background: 'color-mix(in srgb, var(--bg) 70%, transparent)' }}>
        {children}
      </div>
    </div>
  )
}

function Me({ children }: { children: ReactNode }) {
  return (
    <div className="chat-in flex justify-end">
      <div className="max-w-[88%] rounded-[20px] rounded-br-md px-4 py-3 text-[16px] font-extrabold leading-snug sm:text-[18px]" style={{ background: 'var(--hot)', color: '#1a1200' }}>
        {children}
      </div>
    </div>
  )
}

function Typing() {
  return (
    <div className="chat-in flex items-end gap-2.5" aria-label="Typing">
      <span aria-hidden className="mb-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full font-pacalix text-[15px] leading-none" style={{ background: 'var(--hot)', color: 'var(--bg)' }}>P</span>
      <div className="flex items-center gap-1.5 rounded-[20px] rounded-bl-md px-4 py-4" style={{ boxShadow: 'inset 0 0 0 1.5px var(--line)' }}>
        {[0, 1, 2].map((n) => (
          <span key={n} className="chat-dot h-2 w-2 rounded-full" style={{ background: 'var(--ink)', animationDelay: `${n * 160}ms` }} />
        ))}
      </div>
    </div>
  )
}

function Chips({ options, picked, onPick, multi }: { options: string[]; picked: string[]; onPick: (o: string) => void; multi?: boolean }) {
  return (
    <div className="chat-in flex flex-wrap justify-end gap-2" role={multi ? 'group' : 'radiogroup'}>
      {options.map((o) => {
        const on = picked.includes(o)
        return (
          <button
            key={o}
            onClick={() => onPick(o)}
            aria-pressed={on}
            data-hover="Pick"
            className="rounded-full px-4 py-2.5 text-[15px] font-bold transition-all duration-300 hover:scale-[1.03]"
            style={{ background: on ? 'var(--hot)' : 'transparent', color: on ? '#1a1200' : 'var(--ink)', boxShadow: on ? 'none' : 'inset 0 0 0 1.5px var(--line)' }}
          >
            {o}
          </button>
        )
      })}
    </div>
  )
}

export default function QuoteChat() {
  const [needs, setNeeds] = useState<string[]>([])
  const [have, setHave] = useState('')
  const [when, setWhen] = useState('')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  // How many questions are answered (0 to 5). `typing` is the short pause before the next question appears.
  const [step, setStep] = useState(0)
  const [typing, setTyping] = useState(false)
  const [sent, setSent] = useState<Sent>('idle')
  const end = useRef<HTMLDivElement>(null)
  const first = useRef(true)
  const timer = useRef(0)

  const advance = (to: number) => {
    setStep(to)
    setTyping(true)
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setTyping(false), 650)
  }
  useEffect(() => () => window.clearTimeout(timer.current), [])

  // Keep the newest message in view, so the page follows the conversation as it goes down.
  useEffect(() => {
    if (first.current) {
      first.current = false
      return
    }
    const id = window.setTimeout(() => end.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 80)
    return () => window.clearTimeout(id)
  }, [step, typing, sent])

  const pick = (set: (v: string) => void, v: string, to: number) => {
    set(v)
    haptic(8)
    sound.pluck(hashText(v))
    advance(to)
  }

  const phoneOk = phone.replace(/\D/g, '').length >= 7
  const summary = [
    `Name: ${name}`,
    `Phone: ${phone}`,
    `Needs: ${needs.join(', ')}`,
    `Has a website: ${have}`,
    `Timing: ${when}`,
  ].join('\n')

  const submit = async () => {
    if (sent === 'sending' || !phoneOk) return
    haptic([10, 30, 10])
    sound.knock(0.9)
    setPhone(phone.trim())
    advance(5)
    const draft = () => {
      window.location.href = `mailto:${EMAIL}?subject=${encodeURIComponent(`Call me back: ${name}`)}&body=${encodeURIComponent(summary)}`
      setSent('draft')
    }
    if (!LEAD_ENDPOINT) return draft()
    setSent('sending')
    try {
      const r = await fetch(LEAD_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ name, phone, needs: needs.join(', '), website: have, timing: when, message: summary, _subject: `Call me back: ${name}` }),
      })
      if (!r.ok) throw new Error(String(r.status))
      setSent('sent')
    } catch {
      draft()
    }
  }

  const price = PLANS[0].from ?? 1500
  const q = (n: number) => step === n && !typing

  return (
    <div className="clean-card max-w-[780px]" style={{ ['--brand' as string]: 'var(--hot)', padding: 'clamp(18px,3vw,36px)' } as CSSProperties}>
      <div className="flex flex-col gap-3.5" aria-live="polite">
        <Bot>Hi! 4 quick questions, then Simon calls you back with a fixed price.</Bot>

        {(step > 0 || !typing) && <Bot>What do you need? Pick as many as you like.</Bot>}
        {step === 0 && !typing && (
          <>
            <Chips
              multi
              options={NEEDS}
              picked={needs}
              onPick={(o) => {
                haptic(8)
                sound.pluck(hashText(o))
                setNeeds(needs.includes(o) ? needs.filter((x) => x !== o) : [...needs, o])
              }}
            />
            <div className="flex justify-end">
              <button
                disabled={!needs.length}
                onClick={() => advance(1)}
                data-hover="Next"
                className="rounded-full px-6 py-3 text-[16px] font-extrabold transition-all disabled:opacity-30"
                style={{ background: 'var(--ink)', color: 'var(--bg)' }}
              >
                Next →
              </button>
            </div>
          </>
        )}
        {step > 0 && <Me>{needs.join(', ')}</Me>}

        {step === 1 && typing && <Typing />}
        {step > 1 || q(1) ? <Bot>Do you have a website right now?</Bot> : null}
        {q(1) && <Chips options={HAVE} picked={[have]} onPick={(o) => pick(setHave, o, 2)} />}
        {step > 1 && <Me>{have}</Me>}

        {step === 2 && typing && <Typing />}
        {step > 2 || q(2) ? <Bot>Nice. When would you like it live?</Bot> : null}
        {q(2) && <Chips options={WHEN} picked={[when]} onPick={(o) => pick(setWhen, o, 3)} />}
        {step > 2 && <Me>{when}</Me>}

        {step === 3 && typing && <Typing />}
        {step > 3 || q(3) ? <Bot>Great. What&rsquo;s your name?</Bot> : null}
        {q(3) && (
          <form
            className="chat-in flex justify-end gap-2"
            onSubmit={(e) => {
              e.preventDefault()
              if (!name.trim()) return
              haptic(8)
              setName(name.trim())
              advance(4)
            }}
          >
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              autoComplete="given-name"
              maxLength={60}
              aria-label="Your name"
              className="min-w-0 flex-1 rounded-full bg-transparent px-5 py-3 text-[16px] font-bold outline-none placeholder:opacity-50 sm:max-w-[320px]"
              style={{ boxShadow: 'inset 0 0 0 1.5px var(--line)', color: 'var(--ink)' }}
            />
            <button type="submit" disabled={!name.trim()} className="rounded-full px-6 py-3 text-[16px] font-extrabold transition-all disabled:opacity-30" style={{ background: 'var(--hot)', color: '#1a1200' }}>
              Next →
            </button>
          </form>
        )}
        {step > 3 && <Me>{name}</Me>}

        {step === 4 && typing && <Typing />}
        {step > 4 || q(4) ? <Bot>Thanks, {name}. What&rsquo;s the best phone number for Simon to call you on?</Bot> : null}
        {q(4) && (
          <form
            className="chat-in flex flex-col items-end gap-2"
            onSubmit={(e) => {
              e.preventDefault()
              void submit()
            }}
          >
            <div className="flex w-full justify-end gap-2">
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 403 000 0000"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                maxLength={30}
                aria-label="Your phone number"
                className="min-w-0 flex-1 rounded-full bg-transparent px-5 py-3 text-[16px] font-bold outline-none placeholder:opacity-50 sm:max-w-[320px]"
                style={{ boxShadow: 'inset 0 0 0 1.5px var(--line)', color: 'var(--ink)' }}
              />
              <button type="submit" disabled={!phoneOk} data-hover="Send" className="rounded-full px-6 py-3 text-[16px] font-extrabold transition-all disabled:opacity-30" style={{ background: 'var(--hot)', color: '#1a1200' }}>
                Call me ↗
              </button>
            </div>
            <p className="text-[12.5px] font-bold" style={{ color: 'var(--muted)' }}>
              Only used to call you about this project. <a href="/privacy" className="underline underline-offset-2">Privacy</a>
            </p>
          </form>
        )}
        {step > 4 && <Me>{phone}</Me>}

        {step === 5 && typing && <Typing />}
        {step === 5 && !typing && (
          <>
            {sent === 'draft' ? (
              <Bot>
                One last step: your email app just opened with everything filled in. Press send and Simon will call you on {phone} within {CALLBACK_MINUTES} minutes.
              </Bot>
            ) : sent === 'sending' ? (
              <Typing />
            ) : (
              <Bot>
                All done, {name}. Your details are with Simon, and he&rsquo;ll call you on <b>{phone}</b> within <b>{CALLBACK_MINUTES} minutes</b>.
              </Bot>
            )}
            {(sent === 'sent' || sent === 'draft') && (
              <Bot>
                To give you an idea: projects start from <b>CA$ {fmt(price)}</b>. Simon will give you the exact fixed price on the call, in writing.
              </Bot>
            )}
          </>
        )}
        <div ref={end} aria-hidden />
      </div>
    </div>
  )
}
