import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { ChevronRight, Home } from 'lucide-react'

const STATIC_LABELS = {
  cursos:              'Cursos',
  videos:              'Videos',
  contactos:           'Contacto',
  login:               'Login',
  registro:            'Registro',
  'crear-curso':       'Crear Curso',
  'modificar-curso':   'Modificar Curso',
  'eliminar-curso':    'Eliminar Curso',
  'agregar-video':     'Agregar Video',
  'modificar-video':   'Modificar Video',
  'eliminar-video':    'Eliminar Video',
  'activar-cursos':    'Activar Cursos',
  'desactivar-cursos': 'Desactivar Cursos',
  'comprarCursos':     'Comprar Curso',
  video:               'Video',
}

const HIDDEN_SEGMENTS = new Set(['cipm'])

const Breadcrumb = ({ labels = {} }) => {
  const router = useRouter()
  const [path, setPath] = useState('')

  useEffect(() => {
    setPath(window.location.pathname)
  }, [router.asPath])

  const segments = path
    .split('/')
    .filter(s => Boolean(s) && !HIDDEN_SEGMENTS.has(s))

  if (segments.length === 0) return null

  const getLabel = (segment) => {
    if (labels[segment]) return labels[segment]
    if (STATIC_LABELS[segment]) return STATIC_LABELS[segment]
    return segment.charAt(0).toUpperCase() + segment.slice(1)
  }

  const crumbs = segments.map((segment, i) => ({
    label: getLabel(segment),
    href: '/' + segments.slice(0, i + 1).join('/'),
  }))

  return (
    <nav aria-label="Breadcrumb" className="max-w-7xl mx-auto px-4 sm:px-6 mt-4 mb-2">
      <ol className="flex items-center flex-wrap gap-1 text-sm text-gray-400">

        <li>
          <Link href="/" className="flex items-center gap-1 hover:text-gray-600 transition-colors">
            <Home className="w-3.5 h-3.5" />
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
                  <Link href={crumb.href} className="hover:text-gray-600 transition-colors">
                    {crumb.label}
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
