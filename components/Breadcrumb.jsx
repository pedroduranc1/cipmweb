import React from 'react'
import Link from 'next/link'
import { ChevronRight, Home } from 'lucide-react'

// labels: objeto opcional para sobreescribir segmentos dinámicos con texto real
// Ej: { curso: "Toefl Listening", video: "Clase 01 - Introducción" }
const Breadcrumb = ({ labels = {} }) => {
  if (typeof window === 'undefined') return null

  // 'cipm' es el slug por defecto de /videos/cipm — no aporta contexto al breadcrumb
  const HIDDEN_SEGMENTS = new Set(['cipm'])

  const segments = window.location.pathname
    .split('/')
    .filter(s => Boolean(s) && !HIDDEN_SEGMENTS.has(s))

  // Mapa de slugs estáticos a etiquetas legibles
  const STATIC_LABELS = {
    cursos:            'Cursos',
    videos:            'Videos',
    contactos:         'Contacto',
    login:             'Login',
    registro:          'Registro',
    'crear-curso':     'Crear Curso',
    'modificar-curso': 'Modificar Curso',
    'eliminar-curso':  'Eliminar Curso',
    'agregar-video':   'Agregar Video',
    'modificar-video': 'Modificar Video',
    'eliminar-video':  'Eliminar Video',
    'activar-cursos':  'Activar Cursos',
    'desactivar-cursos': 'Desactivar Cursos',
    'comprarCursos':   'Comprar Curso',
    video:             'Video',
  }

  const getLabel = (segment, index) => {
    // Primero busca en labels dinámicos pasados por prop (ej: nombre real del curso)
    if (labels[segment]) return labels[segment]
    // Luego en el mapa estático
    if (STATIC_LABELS[segment]) return STATIC_LABELS[segment]
    // Fallback: capitaliza el segmento tal cual
    return segment.charAt(0).toUpperCase() + segment.slice(1)
  }

  const crumbs = segments.map((segment, i) => ({
    label: getLabel(segment, i),
    href: '/' + segments.slice(0, i + 1).join('/'),
  }))

  return (
    <nav aria-label="Breadcrumb" className="max-w-7xl mx-auto px-4 sm:px-6 mt-4 mb-2">
      <ol className="flex items-center flex-wrap gap-1 text-sm text-gray-400">

        {/* Inicio siempre primero */}
        <li>
          <Link href="/">
            <a className="flex items-center gap-1 hover:text-gray-600 transition-colors">
              <Home className="w-3.5 h-3.5" />
            </a>
          </Link>
        </li>

        {crumbs.map((crumb, i) => {
          const isLast = i === crumbs.length - 1
          return (
            <React.Fragment key={crumb.href}>
              <li className="flex items-center">
                <ChevronRight className="w-3.5 h-3.5 text-gray-300" />
              </li>
              <li>
                {isLast ? (
                  <span className="text-gray-600 font-medium">{crumb.label}</span>
                ) : (
                  <Link href={crumb.href}>
                    <a className="hover:text-gray-600 transition-colors">{crumb.label}</a>
                  </Link>
                )}
              </li>
            </React.Fragment>
          )
        })}

      </ol>
    </nav>
  )
}

export default Breadcrumb
