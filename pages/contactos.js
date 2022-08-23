import React from 'react'
import Head from 'next/head'
import Contact from '../components/Contact'
import Footer from '../components/Footer'
import Navbar from '../components/Navbar'
import Heros from '../components/Heros'

 const Contactos = () => {
  let fullpage = true
  return (
    <>
      <Head>
        <title>Contactos - CIMP</title>
        <link rel="icon" href="logo.svg"/>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <Navbar />
      <Heros />
      <Contact />
      <Footer />
    </>
  )
}

export default Contactos;