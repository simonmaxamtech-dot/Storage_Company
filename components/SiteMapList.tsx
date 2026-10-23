'use client'

import { usePg } from '@/lib/i18n-pages'

// The site map's groups of links, shown in the visitor's language.
export default function SiteMapList({ groups }: { groups: { h: string; links: string[][] }[] }) {
  const tp = usePg()
  return (
    <>
      {groups.map((g) => (
        <section key={g.h} className="py-6" style={{ borderTop: '1px solid var(--line)' }}>
          <h2 className="text-[21px] font-extrabold">{tp(g.h)}</h2>
          <ul className="mt-3 grid gap-2 text-[17px] font-semibold sm:grid-cols-2">
            {g.links.map(([l, h]) => (
              <li key={l}>
                <a href={h} className="underline decoration-2 underline-offset-4">{tp(l)}</a>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </>
  )
}
