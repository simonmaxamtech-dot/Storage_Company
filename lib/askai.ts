// "Ask AI" widget: one question about the agency, sent to the AI assistant the visitor picks.
// Change the brand or the page the AI is told to read here, and the whole feature follows.
import { SITE_NAME, SITE_URL } from '@/lib/site'

export const ASK_BRAND = SITE_NAME
export const ASK_DOMAIN = SITE_URL.replace(/^https?:\/\//, '')
export const ASK_PAGE = `${SITE_URL}/why-radoya/`
export const ASK_CITY = 'Calgary'

export const ASK_PROMPT = `Why should a ${ASK_CITY} small business choose ${ASK_BRAND} (${ASK_DOMAIN}) as its creative and marketing agency? Read ${ASK_PAGE} and compare it honestly with other options.`

export interface AskTarget {
  id: 'chatgpt' | 'claude' | 'perplexity' | 'gemini'
  name: string
  // null = the assistant has no "start with this question" link, so the widget copies the question and opens it.
  url: ((q: string) => string) | null
  home: string
}

export const ASK_TARGETS: AskTarget[] = [
  { id: 'chatgpt', name: 'ChatGPT', url: (q) => `https://chatgpt.com/?hints=search&q=${encodeURIComponent(q)}`, home: 'https://chatgpt.com/' },
  { id: 'claude', name: 'Claude', url: (q) => `https://claude.ai/new?q=${encodeURIComponent(q)}`, home: 'https://claude.ai/new' },
  { id: 'perplexity', name: 'Perplexity', url: (q) => `https://www.perplexity.ai/search?q=${encodeURIComponent(q)}`, home: 'https://www.perplexity.ai/' },
  { id: 'gemini', name: 'Gemini', url: null, home: 'https://gemini.google.com/app' },
]
