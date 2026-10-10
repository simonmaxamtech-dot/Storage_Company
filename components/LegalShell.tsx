import type { ReactNode } from 'react'

export interface LegalBlock {
  id?: string
  h: string
  p: ReactNode
}

// One plain page layout for the small pages every site needs: privacy, cookies, terms, legal, site map.
export default function LegalShell({ eyebrow, title, blocks, children }: { eyebrow: string; title: string; blocks?: LegalBlock[]; children?: ReactNode }) {
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
        <p className="text-[14px] font-bold uppercase tracking-[0.14em]" style={{ color: 'var(--muted)' }}>{eyebrow}</p>
        <h1 className="mt-4 font-[family-name:var(--font-display)] text-[clamp(40px,7vw,80px)] font-black leading-[0.98]">{title}</h1>
      </header>
      <div className="mt-12">
        {blocks?.map((b) => (
          <section key={b.h} id={b.id} className="py-6" style={{ borderTop: '1px solid var(--line)' }}>
            <h2 className="text-[21px] font-extrabold">{b.h}</h2>
            <div className="mt-2 text-[17px] font-semibold leading-snug" style={{ color: 'var(--muted)' }}>{b.p}</div>
          </section>
        ))}
        {children}
      </div>
      <nav aria-label="Legal" className="mt-12 flex flex-wrap gap-x-5 gap-y-2 pt-6 text-[14px] font-bold" style={{ borderTop: '1px solid var(--line)', color: 'var(--muted)' }}>
        <a href="/privacy" className="underline decoration-2 underline-offset-4">Privacy Policy</a>
        <a href="/privacy#cookies" className="underline decoration-2 underline-offset-4">Use of Cookies</a>
        <a href="/terms" className="underline decoration-2 underline-offset-4">Terms of Use</a>
        <a href="/legal" className="underline decoration-2 underline-offset-4">Legal</a>
        <a href="/site-map" className="underline decoration-2 underline-offset-4">Site Map</a>
      </nav>
      <p className="mt-6 text-[14px] font-bold" style={{ color: 'var(--muted)' }}>© {new Date().getFullYear()} PACALIX. All rights reserved.</p>
    </main>
  )
}
