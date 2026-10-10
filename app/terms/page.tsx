import type { Metadata } from 'next'
import LegalShell from '@/components/LegalShell'
import { EMAIL } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Terms of Use',
  description: 'The simple rules for using the PACALIX website.',
  alternates: { canonical: '/terms' },
}

const BLOCKS = [
  { h: 'Using this site', p: 'You are welcome to look around, play with the demos and share the link. Please do not break, overload or scrape the site, or try to get into things you were not meant to see.' },
  { h: 'What belongs to us', p: 'The design, code, particle artwork, 3D scenes, the PACALIX name, logo and typeface, and the written content on this site belong to PACALIX and its founder, Simon Maxam. You may not copy, resell or republish them without written permission. Short quotes and screenshots with credit are fine.' },
  { h: 'Other people’s names and logos', p: 'Names and logos of certificate issuers, companies and projects shown here belong to their owners. They appear only to show credentials earned or work delivered, and do not mean those companies endorse or are connected to us.' },
  { h: 'Prices and quotes', p: 'Prices on this site are in Canadian dollars and are a guide, not an offer. A project is only agreed once we send a written quote and you accept it. Every project is talked through before a price is fixed.' },
  { h: 'The demos', p: 'Demos on this site use made-up data. Orders, dashboards and chat answers in them are examples and do not create real orders or advice.' },
  { h: 'No guarantees', p: 'We work hard to keep the site correct and online, but it is provided as it is, without promises about uptime or that every detail is error free. To the extent the law allows, we are not liable for loss from using it.' },
  { h: 'Changes', p: 'We may update these terms as the site grows. The date of the latest update is the date this page was last published.' },
  { h: 'Governing law', p: 'These terms follow the laws of Alberta and the federal laws of Canada that apply there.' },
  { h: 'Contact', p: `Questions about these terms: ${EMAIL}.` },
]

export default function Terms() {
  return <LegalShell eyebrow="Terms of Use" title="The simple rules." blocks={BLOCKS} />
}
