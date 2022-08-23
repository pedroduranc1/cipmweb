import React from 'react'
import Head from 'next/head'
import { Contact } from '../../components/contact'
import { Footer } from '../../components/Footer'
import { Navbar } from '../../components/Navbar'
import { Videofield } from '../../minicomponents/Videofield'
import videoslist from '../../db/videos'
import { useRouter } from 'next/router'


export default function videos() {
  const router = useRouter()
  const { videos } = router.query

  let arr = videos?.replace('%20', ' ');

  let videosarr = []

  //console.log(videosarr)

  if (videos !== '' && videos !== 'cimp') {
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
        <title>Videos - CIMP</title>
        <link rel="icon" href="/logo.svg" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <Navbar />
      <Videofield videoslist={videosarr.length !== 0 ? videosarr : videoslist} />
      <Contact />
      <Footer />
    </>
  )
}
