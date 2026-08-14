import React from 'react'
import Link from "next/link";
import { PlayCircle, ShoppingCart } from 'lucide-react';

export const CardSkeleton = () => (
  <div className="rounded-2xl overflow-hidden bg-white border border-gray-100 shadow-sm animate-pulse">
    <div className="aspect-video bg-gray-100" />
    <div className="p-4 space-y-3">
      <div className="h-4 bg-gray-100 rounded-full w-3/4" />
      <div className="h-3 bg-gray-100 rounded-full w-full" />
      <div className="h-3 bg-gray-100 rounded-full w-2/3" />
      <div className="h-10 bg-gray-100 rounded-xl mt-5" />
    </div>
  </div>
)

// active se resuelve en el padre (pages/cursos/index.jsx) para dividir secciones
export const Cursocard = ({ titulo, descripcion, slug, precio, img, active = false, publicado = true }) => {
  // string vacío de Firestore también cae al fallback
  const thumbnail = img?.trim() ? img : '/video-placeholder.svg'
  const tienePrecio = !active && precio != null && Number(precio) > 0

  return (
    <div className="group flex flex-col rounded-2xl overflow-hidden bg-white border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">

      {/* Imagen */}
      <div className="relative aspect-video overflow-hidden flex-shrink-0 bg-gray-100">
        <img
          src={thumbnail}
          alt={titulo}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <span className={`absolute top-2 left-3 text-xs font-medium px-2.5 py-1 rounded-full
          ${active ? 'bg-blue-500 px-3 text-white' : 'bg-black/50 text-white'}`}>
          {active ? 'Activo' : 'Disponible'}
        </span>
        {publicado === false && (
          <span className="absolute top-2 right-2 bg-amber-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
            No publicado
          </span>
        )}
      </div>

      {/* Texto */}
      <div className="px-4 pt-4 pb-0">
        <h2 className="text-gray-800 font-semibold text-md leading-snug mb-1.5">{titulo}</h2>
        <p className="text-gray-400 text-xs leading-relaxed">{descripcion}</p>
      </div>

      {/* Precio + botón */}
      <div className="px-4 pt-3 pb-4">
        {tienePrecio && (
          <p className="text-gray-800 font-bold text-base mb-3">
            ${Number(precio).toLocaleString('es-MX')} <span className="text-xs text-gray-400 font-normal">MXN</span>
          </p>
        )}

        {active ? (
          <Link href={`/cursos/${slug}`} className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors">
            <PlayCircle className="w-4 h-4" />
            Ver Curso
          </Link>
        ) : (
          <Link href="/comprarCursos" className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors">
            <ShoppingCart className="w-4 h-4" />
            Adquirir
          </Link>
        )}
      </div>

    </div>
  )
}
