import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/site'
import { SEO_CODES, hreflangs } from '@/lib/seo-langs'

export const dynamic = 'force-static'

const BRAND = ['radoya-beaver-logo.png', 'radoya-beaver-logo-black-on-white.png', 'radoya-beaver-logo-canada-red-white.png', 'radoya-creative-marketing-agency-calgary.png', 'radoya-services-calgary.png', 'radoya-kora-ramen-3d-website-calgary.jpg', 'radoya-scalex-pizza-3d-website-calgary.jpg'].map((f) => `${SITE_URL}/images/brand/${f}`)

export default function sitemap(): MetadataRoute.Sitemap {
  // The date of the build: search engines use it to know the pages are alive.
  const lastModified = new Date()
  return [
    { url: `${SITE_URL}/`, lastModified, changeFrequency: 'monthly', priority: 1, images: BRAND, alternates: { languages: hreflangs() } },
    ...SEO_CODES.map((c) => ({ url: `${SITE_URL}/${c}`, lastModified, changeFrequency: 'monthly' as const, priority: 0.9, alternates: { languages: hreflangs() } })),
    { url: `${SITE_URL}/about`, lastModified, changeFrequency: 'monthly', priority: 0.9 },
    {
      url: `${SITE_URL}/services`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.8,
      images: BRAND,
    },
    { url: `${SITE_URL}/privacy`, lastModified, changeFrequency: 'yearly', priority: 0.2 },
    { url: `${SITE_URL}/terms`, lastModified, changeFrequency: 'yearly', priority: 0.2 },
    { url: `${SITE_URL}/legal`, lastModified, changeFrequency: 'yearly', priority: 0.2 },
    { url: `${SITE_URL}/site-map`, lastModified, changeFrequency: 'yearly', priority: 0.2 },
  ]
}
