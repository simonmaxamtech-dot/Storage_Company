import type { Metadata } from 'next'
import { EMAIL } from '@/lib/site'

const PAGE_TITLE = 'Privacy and cookies'

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: 'What PACALIX stores on your device and what it does not: no tracking, no ad cookies.',
  alternates: { canonical: '/privacy' },
  robots: { index: true, follow: true },
}

const BLOCKS = [
  { h: 'No tracking', p: 'This site does not use analytics, advertising cookies or third-party trackers, and it does not follow you around the web.' },
  { h: 'What is saved on your device', p: 'A few small settings are kept in your browser so the site remembers you: which design you picked (Clean or Classic), whether sound is on, and your best score in the small games. This stays on your device and is never sent to us. Clear your browser data and it is gone.' },
  { h: 'When you contact us', p: 'The contact form opens your own email app with a draft. Nothing is sent until you press send there. If you write to us, we use your message only to reply to you and keep it only as long as the conversation needs it.' },
  { h: 'Motion sensors', p: 'On phones, tilt and shake are optional. They run only after you tap to turn them on, are processed on your device, and are never recorded.' },
  { h: 'Questions', p: `Write to ${EMAIL} and you will get a real answer.` },
]

export default function Privacy() {
  return (
    <main className="mx-auto max-w-[760px] px-6 py-10 sm:px-10 sm:py-16">
      <nav aria-label="Breadcrumb" className="flex items-center justify-between">
        <a href="/" className="flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/wordmark.png" width={1200} height={224} alt="PACALIX" className="h-[22px] w-auto" />
        </a>
        <a href="/" className="text-[14px] font-bold underline decoration-2 underline-offset-4" style={{ color: 'var(--muted)' }}>← Back to the 3D site</a>
      </nav>
      <header className="mt-16 sm:mt-24">
        <p className="text-[14px] font-bold uppercase tracking-[0.14em]" style={{ color: 'var(--muted)' }}>Privacy and cookies</p>
        <h1 className="mt-4 font-[family-name:var(--font-display)] text-[clamp(40px,7vw,80px)] font-black leading-[0.98]">Short and honest.</h1>
      </header>
      <div className="mt-12">
        {BLOCKS.map((b) => (
          <section key={b.h} className="py-6" style={{ borderTop: '1px solid var(--line)' }}>
            <h2 className="text-[21px] font-extrabold">{b.h}</h2>
            <p className="mt-2 text-[17px] font-semibold leading-snug" style={{ color: 'var(--muted)' }}>{b.p}</p>
          </section>
        ))}
      </div>
      <p className="mt-10 text-[14px] font-bold" style={{ color: 'var(--muted)' }}>© {new Date().getFullYear()} PACALIX. All rights reserved.</p>
    </main>
  )
}
