import React from 'react'
import Link from 'next/link'
import Videocard from '../minicomponents/Videocard'
import videoslist from '../db/videos'
import { ArrowRight } from 'lucide-react'

const Videosfield = () => {
  const videos = videoslist.slice(0, 4)

  return (
    <section className="bg-gray-50 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-10 gap-4">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800">Videos que pueden ayudarte</h2>
            <p className="text-gray-400 mt-2">Contenido gratuito para que empieces hoy</p>
          </div>
          <Link href="/videos/cipm">
            <a className="flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-gray-800 transition-colors whitespace-nowrap">
              Ver todos
              <ArrowRight className="w-4 h-4" />
            </a>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {videos.map((video) => (
            <Videocard key={video.id} data={video} />
          ))}
        </div>

      </div>
    </section>
  )
}

export default Videosfield
