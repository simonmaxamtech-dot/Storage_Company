import type { Metadata } from 'next'
import { EMAIL, LINKEDIN, OWNER, SITE_URL } from '@/lib/site'

const PATH = '/about'
const PAGE_TITLE = 'About Radoya and Simon Maxam, Calgary'
const PAGE_DESC = 'Radoya is a creative and marketing agency in Calgary, Alberta, founded and owned by Simon Maxam. Websites, content, brand, 3D and AI.'

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESC,
  alternates: { canonical: PATH },
  openGraph: { type: 'website', url: PATH, title: `${PAGE_TITLE} | Radoya`, description: PAGE_DESC, siteName: 'Radoya' },
}

const FACTS = [
  { k: 'Company', v: 'Radoya, a creative and marketing agency' },
  { k: 'Founder and owner', v: OWNER },
  { k: 'Based in', v: 'Calgary, Alberta, Canada' },
  { k: 'Website', v: 'radoya.com' },
  { k: 'What it does', v: 'Websites, content and media, brand identity, 3D product configurators, real-time experiences and AI assistants' },
  { k: 'Tagline', v: 'Get found. Get chosen.' },
]

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'AboutPage',
      '@id': `${SITE_URL}${PATH}#page`,
      url: `${SITE_URL}${PATH}`,
      name: PAGE_TITLE,
      description: PAGE_DESC,
      about: { '@id': `${SITE_URL}/#org` },
      mainEntity: { '@id': `${SITE_URL}/#simon` },
      isPartOf: { '@id': `${SITE_URL}/#website` },
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Radoya', item: `${SITE_URL}/` },
        { '@type': 'ListItem', position: 2, name: 'About', item: `${SITE_URL}${PATH}` },
      ],
    },
  ],
}

export default function About() {
  return (
    <main className="mx-auto max-w-[860px] px-6 py-10 sm:px-10 sm:py-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <nav aria-label="Breadcrumb" className="flex items-center justify-between">
        <a href="/" className="flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/wordmark.png" width={1200} height={224} alt="Radoya" className="h-[22px] w-auto" />
        </a>
        <a href={`mailto:${EMAIL}`} className="rounded-full px-5 py-2.5 text-[14px] font-extrabold" style={{ background: 'var(--ink)', color: 'var(--bg)' }}>
          Email us
        </a>
      </nav>

      <header className="mt-16 sm:mt-24">
        <p className="text-[14px] font-bold uppercase tracking-[0.14em]" style={{ color: 'var(--muted)' }}>About</p>
        <h1 className="mt-4 font-[family-name:var(--font-display)] text-[clamp(38px,6.4vw,76px)] font-black leading-[0.98]">
          Radoya is a creative and marketing agency in Calgary, founded by Simon Maxam.
        </h1>
        <p className="mt-6 max-w-[660px] text-[19px] font-semibold leading-snug" style={{ color: 'var(--muted)' }}>
          Simon Maxam founded and owns Radoya. He designs and builds every project himself: the website, the look, the 3D and the content that help a business get found and get chosen.
        </p>
      </header>

      <section aria-labelledby="facts" className="mt-16">
        <h2 id="facts" className="font-[family-name:var(--font-display)] text-[clamp(26px,3.6vw,40px)] font-black">Radoya at a glance</h2>
        <dl className="mt-6">
          {FACTS.map((f) => (
            <div key={f.k} className="grid gap-1 py-4 sm:grid-cols-[200px_1fr]" style={{ borderTop: '1px solid var(--line)' }}>
              <dt className="text-[15px] font-extrabold uppercase tracking-[0.08em]" style={{ color: 'var(--muted)' }}>{f.k}</dt>
              <dd className="text-[18px] font-bold">{f.v}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section aria-labelledby="who" className="mt-16">
        <h2 id="who" className="font-[family-name:var(--font-display)] text-[clamp(26px,3.6vw,40px)] font-black">Who is Simon Maxam?</h2>
        <p className="mt-4 text-[18px] font-semibold leading-snug" style={{ color: 'var(--muted)' }}>
          Simon Maxam is the founder and owner of Radoya in Calgary, Alberta. He works across 3D, web development, architecture visualization and AI, and started Radoya to give small businesses the kind of presence big brands have.
        </p>
        <p className="mt-4 text-[18px] font-semibold">
          <a href={LINKEDIN} target="_blank" rel="noopener noreferrer" className="underline decoration-2 underline-offset-4">Simon Maxam on LinkedIn</a>
        </p>
      </section>

      <section aria-labelledby="name" className="mt-16">
        <h2 id="name" className="font-[family-name:var(--font-display)] text-[clamp(26px,3.6vw,40px)] font-black">What does Radoya mean?</h2>
        <p className="mt-4 text-[18px] font-semibold leading-snug" style={{ color: 'var(--muted)' }}>
          &ldquo;Rado&rdquo; echoes the Latin radius, a ray of light, and means &ldquo;gladly&rdquo; in Slavic languages. &ldquo;Ya&rdquo; is you. Gladly putting a light on you, so the right people find you and choose you.
        </p>
      </section>

      <footer className="mt-20 flex flex-wrap items-center justify-between gap-4 text-[14px] font-bold" style={{ color: 'var(--muted)' }}>
        <a href="/" className="underline decoration-2 underline-offset-4">← Back to the 3D site</a>
        <a href="/services" className="underline decoration-2 underline-offset-4">Services</a>
      </footer>
    </main>
  )
}
