// Production domain. Override with NEXT_PUBLIC_SITE_URL if needed. No trailing slash.
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://pacalix.com').replace(/\/$/, '')
export const SITE_NAME = 'PACALIX'
export const OWNER = 'Simon Maxam'
export const TITLE = 'PACALIX | Websites | 3D Experiences | Brand | AI'
export const DESCRIPTION =
  'PACALIX is a Calgary creative and marketing agency founded by Simon Maxam. Websites, media, 3D experiences, brand identity and AI tools.'

// Placeholder number (555-01xx is reserved for fiction). Replace with the real one before launch.
export const PHONE = '+1 403 555 0142'
export const PHONE_HREF = 'tel:+14035550142'
export const EMAIL = 'simon0021maxam@gmail.com'

// The quote chat sends each lead here (a Formspree-style endpoint, e.g. https://formspree.io/f/xxxx that emails Simon).
// Until one is set, the chat falls back to opening a pre-filled email, and says so honestly.
export const LEAD_ENDPOINT = process.env.NEXT_PUBLIC_LEAD_ENDPOINT || ''
export const CALLBACK_MINUTES = 15

export const INSTAGRAM = 'https://www.instagram.com/pacalixhq/'
export const LINKEDIN = 'https://www.linkedin.com/in/simonmaxam/'
export const LINKEDIN_COMPANY = 'https://www.linkedin.com/company/pacalix/'
