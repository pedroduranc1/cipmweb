import Head from 'next/head'
import Contact from '../components/Contact'
import Footer from '../components/Footer'
import Heros from '../components/Heros'
import Navbar from '../components/Navbar'
import Plans from '../components/Plans'
import Services from '../components/Services'
import Videosfield from '../components/Videosfield'

export default function Home() {
  return (
    <>
      <Head>
        <title>Incio - CIMP</title>
        <link rel="icon" href="logo.svg"/>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <Navbar />
      <Heros />
      <Services />
      <Plans />
      <Videosfield />
      <Contact />
      <Footer />
    </>
  )
}
