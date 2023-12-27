import React from 'react'
import Head from 'next/head'
import Contact from '../components/Contact'
import Footer from '../components/Footer'
import Navbar from '../components/Navbar'
import Heros from '../components/Heros'

const Contactos = () => {
  return (
    <>
      <Head>
        <title>Contactos - CIPM</title>
        <link rel="icon" href="logo.svg" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <script async custom-element="amp-analytics" src="https://cdn.ampproject.org/v0/amp-analytics-0.1.js"></script>
      </Head>
      <Navbar />
      <Heros />
      <Contact />
      <Footer />
    </>
  )
}

export default Contactos;
