import type { Metadata } from 'next'
import LegalShell from '@/components/LegalShell'
import { INSTAGRAM, LINKEDIN_COMPANY } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Site Map',
  description: 'Every page and section of the PACALIX site in one list.',
  alternates: { canonical: '/site-map' },
}

const GROUPS = [
  { h: 'The 3D site', links: [['Home', '/'], ['About', '/#about'], ['Certifications', '/#credentials'], ['Work and live demos', '/#work'], ['Prices', '/#pricing'], ['Contact', '/#contact']] },
  { h: 'Studio', links: [['Services', '/services']] },
  { h: 'Legal', links: [['Privacy Policy', '/privacy'], ['Use of Cookies', '/privacy#cookies'], ['Terms of Use', '/terms'], ['Legal', '/legal']] },
  { h: 'Elsewhere', links: [['Instagram', INSTAGRAM], ['LinkedIn', LINKEDIN_COMPANY]] },
]

export default function SiteMap() {
  return (
    <LegalShell eyebrow="Site Map" title="Everything, in one list.">
      {GROUPS.map((g) => (
        <section key={g.h} className="py-6" style={{ borderTop: '1px solid var(--line)' }}>
          <h2 className="text-[21px] font-extrabold">{g.h}</h2>
          <ul className="mt-3 grid gap-2 text-[17px] font-semibold sm:grid-cols-2">
            {g.links.map(([l, h]) => (
              <li key={l}>
                <a href={h} className="underline decoration-2 underline-offset-4">{l}</a>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </LegalShell>
  )
}
