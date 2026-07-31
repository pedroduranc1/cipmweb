import React from 'react'
import Link from "next/link";
import { PlayCircle } from 'lucide-react';

export const Cursocard = ({ titulo, descripcion, slug, img, imgSecond, index }) => {
  const thumbnail = img?.trim() ? img : (imgSecond?.trim() ? imgSecond : '/miniaturavideo.svg');

  return (
    <Link href={`/cursos${slug}`}>
      <a className="group flex flex-col rounded-2xl overflow-hidden bg-white border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer">

        {/* Thumbnail */}
        <div className="relative aspect-video overflow-hidden bg-gray-100 flex-shrink-0">
          <img
            src={thumbnail}
            alt={titulo}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {/* Overlay play */}
          <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/30 transition-colors duration-200">
            <PlayCircle className="w-10 h-10 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 drop-shadow-lg" />
          </div>
          {/* Número de clase */}
          {index != null && (
            <span className="absolute top-2 left-2 bg-black/60 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
              {String(index).padStart(2, '0')}
            </span>
          )}
        </div>

        {/* Contenido */}
        <div className="p-4">
          <h2 className="text-gray-800 font-semibold text-sm leading-snug line-clamp-2 mb-1">{titulo}</h2>
          {descripcion && (
            <p className="text-gray-400 text-xs leading-relaxed line-clamp-2">{descripcion}</p>
          )}
        </div>

      </a>
    </Link>
  )
}
