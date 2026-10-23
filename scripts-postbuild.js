// After the build: each language page says its own language in <html lang>, so search engines read it right.
const fs = require('fs')
for (const c of ['fr', 'es', 'de', 'tr', 'ar', 'fa', 'pt', 'it', 'ru', 'zh', 'hi', 'ja']) {
  const f = `out/${c}.html`
  if (fs.existsSync(f)) fs.writeFileSync(f, fs.readFileSync(f, 'utf8').replace('<html lang="en"', `<html lang="${c}"`))
}
