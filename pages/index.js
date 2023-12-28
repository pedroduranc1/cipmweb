import Head from 'next/head'
import Contact from '../components/Contact'
import Footer from '../components/Footer'
import Heros from '../components/Heros'
import Navbar from '../components/Navbar'
import Plans from '../components/Plans'
import Services from '../components/Services'
import Videosfield from '../components/Videosfield'
import { useAuth } from "../hooks/useAuth";

export default function Home() {

  return (
    <>
      <Head>
        <title>Inicio - CIPM</title>
        <link rel="icon" href="logo.svg" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <script async custom-element="amp-analytics" src="https://cdn.ampproject.org/v0/amp-analytics-0.1.js"></script>

      </Head>
      <div className="relative">
        <Navbar />
        <Heros />
        <Services />
        <Plans />
        <Videosfield />
        <Contact />
        <Footer />
      </div>

    </>
  )
}
