import React from 'react'
import Link from 'next/link'
import { PlayCircle } from 'lucide-react'

const Videocard = ({ data }) => {
  return (
    <Link href={`/video/${data.id}`} className="group flex flex-col rounded-2xl overflow-hidden bg-white border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer">

        {/* Thumbnail */}
        <div className="relative aspect-video overflow-hidden bg-gray-100">
          <img
            src={data.miniatura?.trim() || '/video-placeholder.svg'}
            alt={data.videoname}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/25 transition-colors duration-200">
            <PlayCircle className="w-10 h-10 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 drop-shadow-lg" />
          </div>
          {data._source === 'firestore' && data.publicado === false && (
            <span className="absolute top-2 left-2 bg-amber-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
              No publicado
            </span>
          )}
        </div>

        {/* Contenido */}
        <div className="p-4">
          <h2 className="text-gray-800 font-semibold text-sm leading-snug line-clamp-2 mb-1">{data.videoname}</h2>
          {data.fecha && (
            <p className="text-gray-400 text-xs">{data.fecha}</p>
          )}
        </div>

    </Link>
  )
}

export default Videocard
