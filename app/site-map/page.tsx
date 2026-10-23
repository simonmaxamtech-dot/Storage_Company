import type { Metadata } from 'next'
import LegalShell from '@/components/LegalShell'
import SiteMapList from '@/components/SiteMapList'
import { INSTAGRAM, LINKEDIN_COMPANY } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Site Map',
  description: 'Every page and section of the Radoya site in one list.',
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
      <SiteMapList groups={GROUPS} />
    </LegalShell>
  )
}
