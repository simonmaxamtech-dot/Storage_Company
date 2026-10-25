// Production domain. Override with NEXT_PUBLIC_SITE_URL when a custom domain is connected. No trailing slash.
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://radoya.com').replace(/\/$/, '')
export const SITE_NAME = 'Radoya'
export const OWNER = 'Simon Maxam'
// Every title and description says what we are and where: "Radoya creative and marketing agency, Calgary".
// That is the phrase to win, and it ties the name to Simon Maxam and to Calgary.
export const TITLE = 'Radoya | Creative & Marketing Agency in Calgary'
export const DESCRIPTION =
  'Radoya is a creative and marketing agency in Calgary. Websites, content, 3D, brand and AI that get small businesses noticed.'

// Placeholder number (555-01xx is reserved for fiction). Replace with the real one before launch.
export const PHONE = '+1 403 555 0142'
export const PHONE_HREF = 'tel:+14035550142'
export const EMAIL = 'simonmaxam.tech@gmail.com'

// The quote chat sends each lead here (a Formspree-style endpoint, e.g. https://formspree.io/f/xxxx that emails Simon).
// Until one is set, the chat falls back to opening a pre-filled email, and says so honestly.
export const LEAD_ENDPOINT = process.env.NEXT_PUBLIC_LEAD_ENDPOINT || ''
export const CALLBACK_MINUTES = 15

export const INSTAGRAM = 'https://www.instagram.com/radoyahq/'
export const LINKEDIN = 'https://www.linkedin.com/in/simonmaxam/'
export const LINKEDIN_COMPANY = 'https://www.linkedin.com/company/raduyahq'
export const FLICKR = 'https://www.flickr.com/photos/radoya/'
export const TIKTOK = 'https://www.tiktok.com/@radoyahq'
// One tap to write to us: opens the visitor's Gmail already addressed to Simon with a subject (mailto: still works for other mail apps).
export const mailto = (subject = 'Hello Radoya') => `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}`
export const gmailCompose = (subject = 'Hello Radoya') => `https://mail.google.com/mail/?view=cm&fs=1&to=${EMAIL}&su=${encodeURIComponent(subject)}`
