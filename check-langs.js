// Run after a build (npm run check:langs). Fails if a language page loses its translation, or if the layout rules that keep Arabic/Persian right are changed.
const fs = require('fs')
const bad = []
const en = (fs.readFileSync('out/index.html', 'utf8').match(/aria-label="(Radoya, a creative[^"]*)"/) || [])[1]
for (const c of ['fr', 'es', 'de', 'tr', 'ar', 'fa', 'pt', 'it', 'ru', 'zh', 'hi', 'ja']) {
  const h = fs.readFileSync(`out/${c}.html`, 'utf8')
  if (!h.includes(`<html lang="${c}"`)) bad.push(`${c}: <html lang> wrong`)
  const a = (h.match(/data-live="hero" aria-label="([^"]*)"/) || [])[1]
  if (!a || a === en) bad.push(`${c}: page body is not translated`)
  if (!h.includes(`rel="canonical" href="https://radoya.com/${c}"`)) bad.push(`${c}: canonical missing`)
}
const store = fs.readFileSync('lib/store.ts', 'utf8')
if (!store.includes("document.documentElement.dir = 'ltr'")) bad.push('RTL rule: layout must stay LTR (store.applyLang)')
const css = fs.readFileSync('app/globals.css', 'utf8')
if (!css.includes('html[data-rtl]')) bad.push('RTL rule: text-direction CSS removed (globals.css)')
const sw = fs.readFileSync('components/LangSwitch.tsx', 'utf8')
if (!sw.includes('dir="ltr"')) bad.push('language dropdown must keep dir="ltr" (else it clips)')
const ov = fs.readFileSync('components/Overlay.tsx', 'utf8')
if (!ov.includes("['es', 'pt', 'de', 'fr', 'it', 'tr']")) bad.push('hero font-size rule for long Latin languages removed')
if (bad.length) { console.error('LANGUAGE CHECK FAILED:\n- ' + bad.join('\n- ')); process.exit(1) }
console.log('Language check passed (12 pages translated, RTL + hero rules intact).')
