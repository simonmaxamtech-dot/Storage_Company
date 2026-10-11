import AboutLocales from '@/components/AboutLocales'
import Scene from '@/components/Scene'
import Objects from '@/components/Objects'
import Cursor from '@/components/Cursor'
import Overlay from '@/components/Overlay'

export default function Home() {
  return (
    <>
      <Scene />
      <Objects />
      <Cursor />
      <Overlay />
      <section className="sr-only" aria-label="About Dokeon">
        <h2>Dokeon — creative and marketing agency in Calgary</h2>
        <p>
          Dokeon is a creative and marketing agency in Calgary, Alberta, Canada, founded and owned by Simon Maxam.
          Dokeon builds websites, content and media, brand identities, 3D product configurators, real-time
          experiences and AI assistants that help businesses get found and get chosen.
        </p>
        <p>
          The name Dokeon comes from the Greek dokeo, &ldquo;to appear&rdquo;. Dokeon is not affiliated with other
          companies that use a similar name.
        </p>
        <AboutLocales />
        <a href="/services">Dokeon services: web design, marketing and 3D experiences in Calgary</a>
      </section>
    </>
  )
}
