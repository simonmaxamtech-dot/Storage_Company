import type { Metadata } from 'next'
import LegalShell from '@/components/LegalShell'
import { EMAIL, OWNER } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Legal',
  description: 'Who runs PACALIX, copyright and trademark notices.',
  alternates: { canonical: '/legal' },
}

const BLOCKS = [
  { h: 'Who we are', p: `PACALIX is a creative studio founded by ${OWNER} in Calgary, Alberta, Canada. Contact: ${EMAIL}.` },
  { h: 'Copyright', p: `Copyright © ${new Date().getFullYear()} PACALIX. All rights reserved. No part of this site may be reproduced without written permission.` },
  { h: 'Trademarks', p: 'PACALIX and the PACALIX logo and typeface are our marks. AWS, IBM, Google, Microsoft, GitHub, Siemens, Adobe, LinkedIn, University of London, TÜBİTAK, the University of Waterloo and any other names or logos shown are the property of their owners, used only to identify credentials and projects. We are not affiliated with or endorsed by them.' },
  { h: 'Certificates and awards', p: 'Certificates shown were earned by Simon Maxam and each links to the issuer’s own record where one exists.' },
  { h: 'Client work', p: 'Projects in the work section are shown with the permission of their owners. Their names, brands and content belong to them.' },
  { h: 'Fonts, software and hosting', p: 'The PACALIX typeface was made for this brand. The site is built with open-source tools such as Next.js, React and Three.js, and runs on Cloudflare.' },
  { h: 'Reporting a problem', p: `If something on the site looks wrong or infringes your rights, write to ${EMAIL} and we will fix it quickly.` },
]

export default function Legal() {
  return <LegalShell eyebrow="Legal" title="The fine print." blocks={BLOCKS} />
}
