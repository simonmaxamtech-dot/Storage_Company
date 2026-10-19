import type { Metadata, Viewport } from 'next'
import { Nunito, Space_Grotesk } from 'next/font/google'
import './globals.css'
import { DESCRIPTION, LINKEDIN, OWNER, SITE_NAME, SITE_URL, TITLE } from '@/lib/site'

const display = Nunito({ subsets: ['latin', 'latin-ext'], weight: ['800', '900'], variable: '--font-display', display: 'swap' })
const sans = Space_Grotesk({ subsets: ['latin'], weight: ['400', '500', '600', '700'], variable: '--font-sans', display: 'swap' })

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: TITLE, template: '%s | Radoya Calgary' },
  description: DESCRIPTION,
  applicationName: SITE_NAME,
  authors: [{ name: OWNER, url: SITE_URL }],
  creator: OWNER,
  publisher: SITE_NAME,
  keywords: [
    'Radoya', 'Radoya agency', 'Radoya Calgary', 'Radoya creative agency', 'Radoya marketing agency', 'Radoya web design', 'Radoya Simon Maxam', 'Simon Maxam', 'Simon Maxam Radoya', 'Simon Maxam Calgary',
    'creative and marketing agency Calgary', 'Calgary web design', 'Calgary marketing agency', 'Calgary website design', 'brand identity Calgary', 'content and media Calgary',
    '3D product configurator', 'interactive website', 'AI assistant', 'Alberta',
  ],
  alternates: { canonical: '/' },
  category: 'technology',
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1, 'max-video-preview': -1 },
  },
  openGraph: {
    type: 'website',
    url: '/',
    siteName: SITE_NAME,
    title: TITLE,
    description: DESCRIPTION,
    locale: 'en_CA',
    alternateLocale: ['fr_CA', 'fr_FR', 'es_ES', 'de_DE', 'tr_TR', 'ru_RU', 'ar_AE', 'ja_JP', 'ko_KR', 'zh_CN', 'pt_BR', 'it_IT'],
    images: [{ url: '/logo-panda.png', width: 1254, height: 1254, alt: 'Radoya creative and marketing agency logo' }],
  },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESCRIPTION, images: ['/logo-panda.png'] },
  icons: { icon: '/logo-panda.png', apple: '/logo-panda.png' },
}

// The Instagram and LinkedIn company pages still carry the old name, so they are not claimed as Radoya's own profiles
// here. Once Radoya accounts exist, add their links to ORG_SAME_AS: that is how search engines connect a brand to its profiles.
const ORG_SAME_AS: string[] = []
const PERSON_SAME_AS = [LINKEDIN]

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
      url: `${SITE_URL}/`,
      name: SITE_NAME,
      alternateName: ['Radoya Calgary', 'Radoya Agency', 'Radoya Creative Agency'],
      description: DESCRIPTION,
      inLanguage: 'en',
      publisher: { '@id': `${SITE_URL}/#org` },
    },
    {
      '@type': ['Organization', 'ProfessionalService'],
      '@id': `${SITE_URL}/#org`,
      name: SITE_NAME,
      legalName: 'Radoya',
      slogan: 'Get found. Get chosen.',
      disambiguatingDescription: 'Radoya is a creative and marketing agency in Calgary, Alberta, Canada, founded by Simon Maxam.',
      alternateName: ['Radoya Calgary', 'Radoya Agency', 'Radoya Creative Agency'],
      url: `${SITE_URL}/`,
      logo: `${SITE_URL}/logo-panda.png`,
      image: `${SITE_URL}/logo-panda.png`,
      description: DESCRIPTION,
      email: 'simon0021maxam@gmail.com',
      contactPoint: { '@type': 'ContactPoint', contactType: 'sales', email: 'simon0021maxam@gmail.com', availableLanguage: ['en', 'fr'], areaServed: 'Worldwide' },
      sameAs: ORG_SAME_AS,
      founder: { '@id': `${SITE_URL}/#simon` },
      address: { '@type': 'PostalAddress', addressLocality: 'Calgary', addressRegion: 'AB', addressCountry: 'CA' },
      areaServed: 'Worldwide',
      knowsAbout: ['Web design', 'Digital marketing', 'Content and media', 'Brand identity', '3D', 'Artificial intelligence', 'Interactive experiences', 'Product configurators'],
      makesOffer: ['Website design and development', 'Content and media', 'Brand identity', '3D and interactive experiences', 'AI assistants'].map((n) => ({ '@type': 'Offer', itemOffered: { '@type': 'Service', name: n } })),
    },
    {
      '@type': 'Person',
      '@id': `${SITE_URL}/#simon`,
      name: OWNER,
      url: `${SITE_URL}/`,
      jobTitle: 'Founder and owner',
      alternateName: ['Simon Maxam Radoya', 'Simon Maxam Calgary'],
      email: 'simon0021maxam@gmail.com',
      sameAs: PERSON_SAME_AS,
      worksFor: { '@id': `${SITE_URL}/#org` },
      homeLocation: { '@type': 'Place', name: 'Calgary, Alberta, Canada' },
      knowsAbout: ['3D', 'Web development', 'Architecture visualization', 'Artificial intelligence', 'Unreal Engine', 'Blender'],
    },
  ],
}

export const viewport: Viewport = {
  themeColor: '#08090b',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable}`}>
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        {children}
      </body>
    </html>
  )
}
