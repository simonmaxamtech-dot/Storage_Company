import { SITE_URL } from './site'

// What search engines see for each language version of the home page. Every language lives at its own address (/es, /fr ...),
// English at /. The hreflang list tells Google which version belongs to which language.
export const SEO: Record<string, { title: string; description: string; locale: string }> = {
  fr: { title: 'Radoya | Agence de création et de marketing à Calgary', description: 'Radoya est une agence de création et de marketing à Calgary. Sites web, contenu, 3D, marque et IA pour que les petites entreprises soient remarquées.', locale: 'fr_CA' },
  es: { title: 'Radoya | Agencia creativa y de marketing en Calgary', description: 'Radoya es una agencia creativa y de marketing en Calgary. Sitios web, contenido, 3D, marca e IA para que los pequeños negocios destaquen.', locale: 'es_ES' },
  de: { title: 'Radoya | Kreativ- und Marketingagentur in Calgary', description: 'Radoya ist eine Kreativ- und Marketingagentur in Calgary. Websites, Inhalte, 3D, Marke und KI, damit kleine Unternehmen gefunden werden.', locale: 'de_DE' },
  tr: { title: 'Radoya | Calgary’de yaratıcı ve pazarlama ajansı', description: 'Radoya, Calgary’de bir yaratıcı ve pazarlama ajansıdır. Küçük işletmelerin fark edilmesi için web siteleri, içerik, 3D, marka ve yapay zekâ.', locale: 'tr_TR' },
  ar: { title: 'Radoya | وكالة إبداع وتسويق في كالغاري', description: 'Radoya وكالة إبداع وتسويق في كالغاري. مواقع ويب ومحتوى وثلاثي الأبعاد وهوية وذكاء اصطناعي ليلاحظ الناس أعمالك الصغيرة.', locale: 'ar_AE' },
  fa: { title: 'Radoya | آژانس خلاقیت و بازاریابی در کلگری', description: 'Radoya یک آژانس خلاقیت و بازاریابی در کلگری است. وب‌سایت، محتوا، سه‌بعدی، برند و هوش مصنوعی تا کسب‌وکارهای کوچک دیده شوند.', locale: 'fa_IR' },
  pt: { title: 'Radoya | Agência criativa e de marketing em Calgary', description: 'A Radoya é uma agência criativa e de marketing em Calgary. Sites, conteúdo, 3D, marca e IA para pequenos negócios serem notados.', locale: 'pt_BR' },
  it: { title: 'Radoya | Agenzia creativa e di marketing a Calgary', description: 'Radoya è un’agenzia creativa e di marketing a Calgary. Siti web, contenuti, 3D, brand e IA per far notare le piccole imprese.', locale: 'it_IT' },
  ru: { title: 'Radoya | Креативное и маркетинговое агентство в Калгари', description: 'Radoya — креативное и маркетинговое агентство в Калгари. Сайты, контент, 3D, бренд и ИИ, чтобы малый бизнес заметили.', locale: 'ru_RU' },
  zh: { title: 'Radoya | 卡尔加里的创意与营销机构', description: 'Radoya 是卡尔加里的创意与营销机构。网站、内容、3D、品牌和 AI，让小企业被看见。', locale: 'zh_CN' },
  hi: { title: 'Radoya | कैलगरी में क्रिएटिव और मार्केटिंग एजेंसी', description: 'Radoya कैलगरी की एक क्रिएटिव और मार्केटिंग एजेंसी है। वेबसाइट, कंटेंट, 3D, ब्रांड और AI, ताकि छोटे व्यवसाय नज़र में आएँ।', locale: 'hi_IN' },
  ja: { title: 'Radoya | カルガリーのクリエイティブ＆マーケティング会社', description: 'Radoya はカルガリーのクリエイティブ＆マーケティング会社です。ウェブサイト、コンテンツ、3D、ブランド、AI で小さな会社が見つかるように。', locale: 'ja_JP' },
}

export const SEO_CODES = Object.keys(SEO)

// hreflang links for a page path ('' for home): English plus every translated version, and the default.
export function hreflangs(path = ''): Record<string, string> {
  const out: Record<string, string> = { en: `${SITE_URL}${path || '/'}`, 'x-default': `${SITE_URL}${path || '/'}` }
  if (!path) for (const c of SEO_CODES) out[c] = `${SITE_URL}/${c}`
  return out
}
