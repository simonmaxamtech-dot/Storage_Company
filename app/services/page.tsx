import type { Metadata } from 'next'
import { EMAIL, INSTAGRAM, LINKEDIN_COMPANY, SITE_URL } from '@/lib/site'

const PATH = '/services'
const PAGE_TITLE = 'Web Design & 3D Experiences in Calgary'
const PAGE_DESC = 'PACALIX builds interactive websites, 3D product configurators, brand identities and AI assistants for businesses in Calgary and worldwide.'

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESC,
  alternates: { canonical: PATH },
  openGraph: { type: 'website', url: PATH, title: `${PAGE_TITLE} | PACALIX`, description: PAGE_DESC, siteName: 'PACALIX' },
}

const SERVICES = [
  { h: 'Interactive websites', p: 'Sites that feel alive: motion, 3D and particles that respond as people scroll, built to load fast and rank in search.' },
  { h: '3D product configurators', p: 'Let customers rotate, recolour and customise a product in the browser, then send the choice straight to you as an order or enquiry.' },
  { h: 'Architecture and space visualization', p: 'Walkable real-time 3D for buildings, interiors and sites, so clients can see a space before it is built.' },
  { h: 'Brand identity', p: 'A mark, a wordmark and a system that holds together on a screen, a card and a sign. We start from the idea behind the name.' },
  { h: 'AI assistants', p: 'A helper trained on your own content that answers customer questions on your site, in your voice.' },
  { h: 'Dashboards and ordering', p: 'Clear data views and low-friction ordering flows, for the parts of a business that people use every day.' },
]

const STEPS = [
  { h: 'Talk', p: 'We start with what you do, who it is for, and what a visitor should do next.' },
  { h: 'Sketch', p: 'A quick concept and a small working demo, so you see and feel it before it is final.' },
  { h: 'Build', p: 'Design and code together. You see progress at every stage and can change course early.' },
  { h: 'Launch', p: 'Deployed on fast global hosting with search-ready structure, and handed over with notes you can follow.' },
]

const FAQ = [
  { q: 'Where is PACALIX based?', a: 'Calgary, Alberta, Canada. We work with clients anywhere, and all communication is online.' },
  { q: 'Who runs PACALIX?', a: 'PACALIX was founded by Simon Maxam, who designs and builds every project personally.' },
  { q: 'How long does a website take?', a: 'A focused interactive site usually takes a few weeks. A configurator or a 3D space takes longer, and we give you a clear timeline before starting.' },
  { q: 'What does it cost?', a: 'Pricing depends on scope. Email a short description of your idea and you get a clear quote in Canadian dollars, usually within a day.' },
  { q: 'Why the beaver?', a: 'The name nods to Palaeocastor, an ancient beaver. Beavers are builders, and that is how we work: carefully, and made to last.' },
]

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Service',
      '@id': `${SITE_URL}${PATH}#service`,
      name: PAGE_TITLE,
      serviceType: 'Web design and 3D development',
      provider: { '@id': `${SITE_URL}/#org` },
      areaServed: [{ '@type': 'City', name: 'Calgary' }, { '@type': 'Country', name: 'Canada' }],
      description: PAGE_DESC,
      url: `${SITE_URL}${PATH}`,
    },
    {
      '@type': 'FAQPage',
      mainEntity: FAQ.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'PACALIX', item: `${SITE_URL}/` },
        { '@type': 'ListItem', position: 2, name: 'Services', item: `${SITE_URL}${PATH}` },
      ],
    },
  ],
}

export default function Services() {
  return (
    <main className="mx-auto max-w-[980px] px-6 py-10 sm:px-10 sm:py-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <nav aria-label="Breadcrumb" className="flex items-center justify-between">
        <a href="/" className="flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/wordmark.png" width={1200} height={224} alt="PACALIX" className="h-[22px] w-auto" />
        </a>
        <a href={`mailto:${EMAIL}`} className="rounded-full px-5 py-2.5 text-[14px] font-extrabold" style={{ background: 'var(--ink)', color: 'var(--bg)' }}>
          Email us
        </a>
      </nav>

      <header className="mt-16 sm:mt-24">
        <p className="text-[14px] font-bold uppercase tracking-[0.14em]" style={{ color: 'var(--muted)' }}>Services</p>
        <h1 className="mt-4 font-[family-name:var(--font-display)] text-[clamp(40px,7vw,84px)] font-black leading-[0.98]">
          Web design and 3D experiences, built in Calgary.
        </h1>
        <p className="mt-6 max-w-[640px] text-[19px] font-semibold leading-snug" style={{ color: 'var(--muted)' }}>
          PACALIX is a small creative technology studio founded by Simon Maxam. We make websites and interactive 3D work that people remember, for businesses in Calgary and around the world.
        </p>
      </header>

      <section aria-labelledby="what" className="mt-20">
        <h2 id="what" className="font-[family-name:var(--font-display)] text-[clamp(28px,4vw,44px)] font-black">What we build</h2>
        <div className="mt-8 grid gap-5 sm:grid-cols-2">
          {SERVICES.map((s) => (
            <article key={s.h} className="rounded-3xl p-6" style={{ border: '1px solid var(--line)' }}>
              <h3 className="text-[21px] font-extrabold">{s.h}</h3>
              <p className="mt-2 text-[16px] font-semibold leading-snug" style={{ color: 'var(--muted)' }}>{s.p}</p>
            </article>
          ))}
        </div>
      </section>

      <section aria-labelledby="how" className="mt-20">
        <h2 id="how" className="font-[family-name:var(--font-display)] text-[clamp(28px,4vw,44px)] font-black">How a project goes</h2>
        <ol className="mt-8 grid gap-5 sm:grid-cols-4">
          {STEPS.map((s, i) => (
            <li key={s.h}>
              <span className="text-[14px] font-extrabold" style={{ color: 'var(--hot)' }}>0{i + 1}</span>
              <h3 className="mt-1 text-[20px] font-extrabold">{s.h}</h3>
              <p className="mt-2 text-[15px] font-semibold leading-snug" style={{ color: 'var(--muted)' }}>{s.p}</p>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="faq" className="mt-20">
        <h2 id="faq" className="font-[family-name:var(--font-display)] text-[clamp(28px,4vw,44px)] font-black">Questions</h2>
        <dl className="mt-8">
          {FAQ.map((f) => (
            <div key={f.q} className="py-5" style={{ borderTop: '1px solid var(--line)' }}>
              <dt className="text-[19px] font-extrabold">{f.q}</dt>
              <dd className="mt-1.5 text-[16px] font-semibold leading-snug" style={{ color: 'var(--muted)' }}>{f.a}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="mt-20 rounded-[32px] p-8 text-center sm:p-12" style={{ border: '1px solid var(--line)' }}>
        <h2 className="font-[family-name:var(--font-display)] text-[clamp(28px,4vw,48px)] font-black">Let&apos;s build something rare.</h2>
        <p className="mx-auto mt-3 max-w-[480px] text-[17px] font-semibold" style={{ color: 'var(--muted)' }}>Send a few lines about your idea. You will hear back within a day.</p>
        <a href={`mailto:${EMAIL}?subject=${encodeURIComponent('New project')}`} className="mt-7 inline-block rounded-full px-8 py-4 text-[17px] font-extrabold" style={{ background: 'var(--ink)', color: 'var(--bg)' }}>
          {EMAIL}
        </a>
      </section>

      <footer className="mt-16 flex flex-wrap items-center justify-between gap-4 text-[14px] font-bold" style={{ color: 'var(--muted)' }}>
        <a href="/" className="underline decoration-2 underline-offset-4">← Back to the 3D site</a>
        <span className="flex gap-5">
          <a href={INSTAGRAM} target="_blank" rel="noopener noreferrer" className="underline decoration-2 underline-offset-4">Instagram</a>
          <a href={LINKEDIN_COMPANY} target="_blank" rel="noopener noreferrer" className="underline decoration-2 underline-offset-4">LinkedIn</a>
        </span>
      </footer>
    </main>
  )
}
