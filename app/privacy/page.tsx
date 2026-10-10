import type { Metadata } from 'next'
import LegalShell from '@/components/LegalShell'
import { EMAIL } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Privacy Policy and Cookies',
  description: 'What PACALIX stores on your device and what it does not: no tracking, no ad cookies.',
  alternates: { canonical: '/privacy' },
}

const BLOCKS = [
  { h: 'No tracking', p: 'This site does not use analytics, advertising cookies or third-party trackers, and it does not follow you around the web.' },
  { id: 'cookies', h: 'Use of cookies', p: 'We do not set cookies. A few small settings are kept in your browser storage so the site remembers you: which design you picked (Clean or Classic), whether sound is on, and your best score in the small games. They stay on your device, are never sent to us, and are gone when you clear your browser data. Because nothing here tracks you, there is no cookie banner to click.' },
  { h: 'When you contact us', p: 'The contact button opens your own email app with a draft. Nothing is sent until you press send there. If you write to us, we use your message only to reply to you, and keep it only as long as the conversation needs it. We never sell or share it.' },
  { h: 'Motion sensors', p: 'On phones, tilt and shake are optional. They run only after you tap to turn them on, are processed on your device, and are never recorded.' },
  { h: 'Links to other sites', p: 'Our pages link to sites we do not run (Instagram, LinkedIn, client projects). Their own policies apply once you leave.' },
  { h: 'Your rights and questions', p: `You can ask what we hold about you, or ask us to delete it, at any time. Write to ${EMAIL} and you will get a real answer.` },
]

export default function Privacy() {
  return <LegalShell eyebrow="Privacy Policy" title="Short and honest." blocks={BLOCKS} />
}
