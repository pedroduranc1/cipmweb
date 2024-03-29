import React from 'react'
import Head from 'next/head'
import Contact from '../../components/Contact'
import Footer from '../../components/Footer'
import Navbar from '../../components/Navbar'
import Videofield from '../../minicomponents/Videofield'
import videoslist from '../../db/videos'
import { useRouter } from 'next/router'


export default function Videos() {
  const router = useRouter()

  const { videos } = router.query

  let arr = videos?.replace('%20', ' ');

  let videosarr = []

  //console.log(videosarr)

  if (videos !== '' && videos !== 'cipm') {
    if (arr !== "") {
      videoslist.map((video) => {
        if (arr !== undefined) {
          if (video.videoname.toLowerCase().includes(arr.toLowerCase())) {
            videosarr.push(video)
          }
        }
      })
    }
  }

  return (
    <>
      <Head>
        <title>Videos - CIPM</title>
        <link rel="icon" href="/logo.svg" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <script async custom-element="amp-analytics" src="https://cdn.ampproject.org/v0/amp-analytics-0.1.js"></script>
      </Head>
      <Navbar />
      <div className='relative'>
        <Videofield videoslist={videosarr.length !== 0 ? videosarr : videoslist} />
        <Contact />
        <Footer />
      </div>

    </>
  )
}
