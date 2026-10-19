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
      <section className="sr-only" aria-label="About Raduya">
        <h2>Raduya — creative and marketing agency in Calgary</h2>
        <p>
          Raduya is a creative and marketing agency in Calgary, Alberta, Canada, founded and owned by Simon Maxam.
          Raduya builds websites, content and media, brand identities, 3D product configurators, real-time
          experiences and AI assistants that help businesses get found and get chosen.
        </p>
        <p>
          The name Raduya combines &ldquo;radu&rdquo;, from the Latin radius (a ray of light), with &ldquo;ya&rdquo;
          (you): a ray of light on you. Raduya was created by Simon Maxam in Calgary.
        </p>
        <AboutLocales />
        <a href="/services">Raduya services: web design, marketing and 3D experiences in Calgary</a>
      </section>
    </>
  )
}
