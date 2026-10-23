import type { Metadata } from 'next'
import HomeBody from '@/components/HomeBody'
import { hreflangs } from '@/lib/seo-langs'

export const metadata: Metadata = { alternates: { canonical: '/', languages: hreflangs() } }

export default function Home() {
  return <HomeBody />
}
