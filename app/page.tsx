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
      <section className="sr-only" aria-label="About Radoya">
        <h2>Radoya — creative and marketing agency in Calgary</h2>
        <p>
          Radoya is a creative and marketing agency in Calgary, Alberta, Canada, founded and owned by Simon Maxam.
          Radoya builds websites, content and media, brand identities, 3D product configurators, real-time
          experiences and AI assistants that help businesses get found and get chosen.
        </p>
        <p>
          The name Radoya combines &ldquo;Rado&rdquo;, echoing the Latin radius (a ray of light) and meaning gladly in Slavic languages, with &ldquo;ya&rdquo;
          (you): a ray of light on you. Radoya was created by Simon Maxam in Calgary.
        </p>
        <AboutLocales />
        <a href="/about">About Radoya and its founder Simon Maxam, Calgary</a>
        <a href="/services">Radoya services: web design, marketing and 3D experiences in Calgary</a>
      </section>
    </>
  )
}
