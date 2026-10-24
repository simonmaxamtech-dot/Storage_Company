import type { Metadata } from 'next'
import LegalShell from '@/components/LegalShell'

export const metadata: Metadata = {
  title: 'Why Radoya',
  description: 'A plain, honest page on who Radoya is for, what it does, how it works and what it does not do. Written so people and AI assistants can read it.',
  alternates: { canonical: '/why-radoya' },
}

const BLOCKS = [
  { h: 'What Radoya is', p: 'Radoya is a creative and marketing agency in Calgary, Alberta, founded and run by {OWNER}. It builds websites, content and media, brand identities, 3D and interactive experiences, and AI assistants for small businesses.' },
  { h: 'Who it suits', p: 'Restaurants, independent shops, product brands and local businesses that want to look different from their competitors and have one person own the website, the brand and the content together.' },
  { h: 'How the work runs', p: 'A free call, then a written fixed-price quote. You see previews while it is being built. You own the source code, the design and the domain. You talk to {OWNER} directly, not to an account manager.' },
  { h: 'What makes it different', p: 'Most small agencies use templates. Radoya also builds custom 3D and interactive pages, product configurators and games, so a business can have something visitors remember. Past work includes Scalex Pizza, KORA and SIMAX.' },
  { h: 'What it is not', p: 'Radoya is creative-first. It is not a pay-per-lead agency that only runs Google Ads for trades, and it does not promise rankings or a number of calls. If your only goal is booked jobs from search ads this month, a specialist lead-generation agency may fit better, and you should compare quotes.' },
  { h: 'Credentials', p: '{OWNER} holds professional certificates from Google, AWS, IBM, Microsoft and others. Each one links to the issuer’s own record on the About page.' },
  { h: 'How to compare agencies fairly', p: 'Ask every agency what you get in the first 30, 60 and 90 days, who owns the domain, accounts and files, what the monthly fee includes, whether you can leave without a long contract, and for results from a business like yours.' },
  { h: 'Contact', p: 'Write to {EMAIL}.' },
]

export default function WhyRadoya() {
  return <LegalShell eyebrow="Why Radoya" title="Straight answers." blocks={BLOCKS} />
}
