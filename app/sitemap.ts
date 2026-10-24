import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/site'
import { SEO_CODES, hreflangs } from '@/lib/seo-langs'

export const dynamic = 'force-static'

export default function sitemap(): MetadataRoute.Sitemap {
  // The date of the build: search engines use it to know the pages are alive.
  const lastModified = new Date()
  return [
    { url: `${SITE_URL}/`, lastModified, changeFrequency: 'monthly', priority: 1, alternates: { languages: hreflangs() } },
    ...SEO_CODES.map((c) => ({ url: `${SITE_URL}/${c}`, lastModified, changeFrequency: 'monthly' as const, priority: 0.9, alternates: { languages: hreflangs() } })),
    { url: `${SITE_URL}/about`, lastModified, changeFrequency: 'monthly', priority: 0.9 },
    {
      url: `${SITE_URL}/services`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    { url: `${SITE_URL}/why-radoya`, lastModified, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_URL}/privacy`, lastModified, changeFrequency: 'yearly', priority: 0.2 },
    { url: `${SITE_URL}/terms`, lastModified, changeFrequency: 'yearly', priority: 0.2 },
    { url: `${SITE_URL}/legal`, lastModified, changeFrequency: 'yearly', priority: 0.2 },
    { url: `${SITE_URL}/site-map`, lastModified, changeFrequency: 'yearly', priority: 0.2 },
  ]
}
