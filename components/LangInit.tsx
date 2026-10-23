'use client'

import { useStore } from '@/lib/store'
import { LANGS, type Lang } from '@/lib/i18n'

// Puts the page's language in place before anything below it draws, so the server-built HTML of /es is Spanish all the way.
export default function LangInit({ lang }: { lang: string }) {
  const rtl = LANGS.find((l) => l.code === lang)?.rtl === true
  if (useStore.getState().lang !== lang) useStore.setState({ lang: lang as Lang })
  // The server draws from the store's starting state, so make that the page's language too.
  if (typeof window === 'undefined') Object.assign(useStore.getInitialState(), { lang })
  // Before the page loads: tell the browser the language and text direction, so there is no flash of the wrong one.
  const code = `document.documentElement.lang='${lang}';${rtl ? "document.documentElement.setAttribute('data-rtl','');" : ''}`
  return <script dangerouslySetInnerHTML={{ __html: code }} />
}
