import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import HomeBody from '@/components/HomeBody'
import { SEO, SEO_CODES, hreflangs } from '@/lib/seo-langs'
import { SITE_NAME, SITE_URL } from '@/lib/site'

export function generateStaticParams() {
  return SEO_CODES.map((lang) => ({ lang }))
}

export function generateMetadata({ params }: { params: { lang: string } }): Metadata {
  const s = SEO[params.lang]
  if (!s) return {}
  return {
    title: { absolute: s.title },
    description: s.description,
    alternates: { canonical: `/${params.lang}`, languages: hreflangs() },
    openGraph: { type: 'website', url: `${SITE_URL}/${params.lang}`, siteName: SITE_NAME, title: s.title, description: s.description, locale: s.locale },
    twitter: { card: 'summary_large_image', title: s.title, description: s.description },
  }
}

// The same page as the English home, at its own address, opening in that language (the language is read from the address).
export default function LangHome({ params }: { params: { lang: string } }) {
  if (!SEO[params.lang]) notFound()
  return <HomeBody lang={params.lang} />
}
