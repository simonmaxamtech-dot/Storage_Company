import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/site'

export const dynamic = 'force-static'

export default function sitemap(): MetadataRoute.Sitemap {
  // The date of the build: search engines use it to know the pages are alive.
  const lastModified = new Date()
  return [
    { url: `${SITE_URL}/`, lastModified, changeFrequency: 'monthly', priority: 1 },
    { url: `${SITE_URL}/services`, lastModified, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/privacy`, lastModified, changeFrequency: 'yearly', priority: 0.2 },
    { url: `${SITE_URL}/terms`, lastModified, changeFrequency: 'yearly', priority: 0.2 },
    { url: `${SITE_URL}/legal`, lastModified, changeFrequency: 'yearly', priority: 0.2 },
    { url: `${SITE_URL}/site-map`, lastModified, changeFrequency: 'yearly', priority: 0.2 },
  ]
}
