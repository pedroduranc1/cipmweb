import React from 'react'
import Head from 'next/head'
import  Footer  from '../../components/Footer'
import  Navbar  from '../../components/Navbar'
import Videopage from '../../components/Videopage'

export default function video() {
    return (
        <>
            <Head>
                <title>Video - CIMP</title>
                <link rel="icon" href="/logo.svg"/>
                <meta name="viewport" content="initial-scale=1.0, width=device-width" />
            </Head>
            <Navbar />
            <Videopage />
            <Footer />
        </>
    )
}
