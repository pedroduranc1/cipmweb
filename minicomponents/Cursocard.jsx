import React, { useEffect, useState } from 'react'
import Link from "next/link";
import { useAuth } from '../hooks/useAuth';
import { useQuery } from 'react-query';
import { Cursos } from "../db/Cursos";

const cursoCtrl = new Cursos();

// Placeholder mientras se determina si el usuario tiene acceso al curso
const CardSkeleton = () => (
  <div className="rounded-lg overflow-hidden shadow-md animate-pulse bg-white">
    <div className="h-44 bg-gray-200" />
    <div className="p-4 space-y-3">
      <div className="h-4 bg-gray-200 rounded w-3/4" />
      <div className="h-3 bg-gray-200 rounded w-full" />
      <div className="h-3 bg-gray-200 rounded w-2/3" />
    </div>
    <div className="px-4 pb-4">
      <div className="h-9 bg-gray-200 rounded-md" />
    </div>
  </div>
)

export const Cursocard = ({ titulo, descripcion, slug, precio, img }) => {
  const { User } = useAuth();
  const [active, setActive] = useState(false)

  // Una sola query por usuario — React Query la deduplica entre todas las cards
  const { data: userCursosData, isLoading } = useQuery(
    `cursos-cliente-${User?.uid}`,
    () => cursoCtrl.getCursosCliente(User?.uid),
    { enabled: !!User?.uid }
  )

  useEffect(() => {
    if (userCursosData?.cursos?.includes(slug)) {
      setActive(true)
    }
  }, [userCursosData, slug])

  // Muestra skeleton hasta saber si el curso está activo o no
  if (isLoading) return <CardSkeleton />

  const thumbnail = img || '/miniaturavideo.svg'

  return (
    <div className="flex flex-col overflow-hidden rounded-lg shadow-md bg-white hover:shadow-lg transition-shadow duration-200 h-full">

      {/* Imagen del curso con altura fija para evitar deformaciones */}
      <div className="relative h-44 overflow-hidden flex-shrink-0">
        <img
          src={thumbnail}
          alt={`Miniatura de ${titulo}`}
          className="w-full h-full object-cover"
        />
        {/* Badge de estado del curso */}
        <span className={`absolute top-2 right-2 text-xs font-semibold px-2 py-0.5 rounded-full
          ${active
            ? 'bg-green-100 text-green-700 border border-green-200'
            : 'bg-gray-100 text-gray-600 border border-gray-200'
          }`}>
          {active ? 'Activo' : 'Disponible'}
        </span>
      </div>

      {/* Contenido de la card */}
      <div className="flex flex-col flex-1 p-4">
        <h2 className="text-gray-700 font-bold text-sm leading-snug mb-2">{titulo}</h2>
        <p className="text-gray-400 text-sm line-clamp-3 flex-1">{descripcion}</p>

        {/* Precio — solo visible cuando el curso no está activo */}
        {!active && (
          <p className="text-gray-600 font-semibold text-sm mt-3">
            Precio: <span className="text-blue-600">${precio}</span>
          </p>
        )}
      </div>

      {/* Acción principal */}
      <div className="px-4 pb-4">
        {active ? (
          <Link href={`/cursos/${slug}`}>
            <a className="block w-full text-center py-2 rounded-md bg-blue-500 text-white text-sm
                          font-medium hover:bg-blue-600 transition-colors">
              Ver Curso
            </a>
          </Link>
        ) : (
          <Link href="/comprarCursos">
            <a className="block w-full text-center py-2 rounded-md bg-blue-500 text-white text-sm
                          font-medium hover:bg-blue-600 transition-colors">
              Comprar
            </a>
          </Link>
        )}
      </div>

    </div>
  )
}
