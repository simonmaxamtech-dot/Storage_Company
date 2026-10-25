import type { Metadata, Viewport } from 'next'
import { Nunito, Space_Grotesk } from 'next/font/google'
import './globals.css'
import AskAI from '@/components/AskAI'
import { DESCRIPTION, INSTAGRAM, LINKEDIN, LINKEDIN_COMPANY, OWNER, SITE_NAME, SITE_URL, TIKTOK, TITLE } from '@/lib/site'

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
  icons: { icon: [{ url: '/favicon.ico', sizes: '48x48' }, { url: '/icon-48.png', sizes: '48x48', type: 'image/png' }, { url: '/icon-192.png', sizes: '192x192', type: 'image/png' }, { url: '/icon-512.png', sizes: '512x512', type: 'image/png' }], apple: '/apple-icon.png' },
}

// Every Radoya profile links back to the site and to each other; listing them here is how search engines connect the brand to them.
const ORG_SAME_AS: string[] = [LINKEDIN_COMPANY, INSTAGRAM, TIKTOK]
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
      email: 'simonmaxam.tech@gmail.com',
      contactPoint: { '@type': 'ContactPoint', contactType: 'sales', email: 'simonmaxam.tech@gmail.com', availableLanguage: ['en', 'fr'], areaServed: 'Worldwide' },
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
      jobTitle: 'Founder and CEO',
      alternateName: ['Simon Maxam Radoya', 'Simon Maxam Calgary'],
      email: 'simonmaxam.tech@gmail.com',
      sameAs: PERSON_SAME_AS,
      worksFor: { '@id': `${SITE_URL}/#org` },
      homeLocation: { '@type': 'Place', name: 'Calgary, Alberta, Canada' },
      description: 'Simon Maxam is the founder and owner of Radoya in Calgary. He holds professional certificates from Google and IBM, has business and technology knowledge and 3D design skills, was a musician with six years of guitar and double bass, and won third place nationwide in Türkiye at TÜBİTAK in 2024.',
      award: 'Third place nationwide in Türkiye, TÜBİTAK, 2024',
      hasCredential: [
        { '@type': 'EducationalOccupationalCredential', name: 'Google professional certificates', credentialCategory: 'certificate', recognizedBy: { '@type': 'Organization', name: 'Google' } },
        { '@type': 'EducationalOccupationalCredential', name: 'IBM professional certificates', credentialCategory: 'certificate', recognizedBy: { '@type': 'Organization', name: 'IBM' } },
      ],
      knowsAbout: ['3D', '3D design', 'Technology', 'Business', 'Music', 'Web development', 'Architecture visualization', 'Artificial intelligence', 'Unreal Engine', 'Blender'],
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
        <AskAI />
      </body>
    </html>
  )
}
