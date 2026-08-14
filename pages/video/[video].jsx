import React from 'react'
import Head from 'next/head'
import Footer from '../../components/Footer'
import Navbar from '../../components/Navbar'
import Videopage from '../../components/Videopage'
import videoslist from '../../db/videos'
import { useRouter } from 'next/router'
import Breadcrumb from '../../components/Breadcrumb'

export default function VideoDetail() {
  const router = useRouter()
  const { video: videoId } = router.query
  const videoselec = videoslist[videoId - 1]

  return (
    <>
      <Head>
        <title>{videoselec ? `${videoselec.videoname} - CIPM` : 'Video - CIPM'}</title>
        <link rel="icon" href="/logo.svg" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>

      <Navbar />
      <Breadcrumb labels={{ [videoId]: videoselec?.videoname }} />
      <Videopage />
      <Footer />
    </>
  )
}
