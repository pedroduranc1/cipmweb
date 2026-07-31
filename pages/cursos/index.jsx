import React, { useEffect } from 'react'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import { useAuth } from '../../hooks/useAuth'
import { Cursocard } from '../../minicomponents/Cursocard'
import Link from 'next/link'
import { useQuery } from 'react-query'
import { Cursos } from "../../db/Cursos";
import { useRouter } from 'next/router'
import {
  PlusCircle,
  Video,
  Pencil,
  Trash2,
  UserCheck,
  UserX,
  AlertCircle,
  Settings2,
} from 'lucide-react'
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '../../src/components/ui/accordion'

const cursoCtrl = new Cursos();

// Acciones del panel de administrador agrupadas por categoría
const ADMIN_ACTIONS = {
  cursos: [
    { label: 'Crear Curso',    href: '/crear-curso',    Icon: PlusCircle },
    { label: 'Modificar Curso', href: '/modificar-curso', Icon: Pencil },
    { label: 'Eliminar Curso',  href: '/eliminar-curso',  Icon: Trash2 },
  ],
  videos: [
    { label: 'Agregar Video',   href: '/agregar-video',   Icon: Video },
    { label: 'Modificar Video', href: '/modificar-video', Icon: Pencil },
    { label: 'Eliminar Video',  href: '/eliminar-video',  Icon: Trash2 },
  ],
  clientes: [
    { label: 'Activar Curso a Cliente',   href: '/activar-cursos',   Icon: UserCheck },
    { label: 'Desactivar Curso a Cliente', href: '/desactivar-cursos', Icon: UserX },
  ],
}

// Genera una fila de cards placeholder durante la carga inicial
const SkeletonGrid = () => (
  <>
    {Array.from({ length: 4 }).map((_, i) => (
      <div key={i} className="rounded-lg overflow-hidden shadow-md animate-pulse bg-white">
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
    ))}
  </>
)

const CursosPage = () => {
  const { User, loading } = useAuth();
  const router = useRouter();

  const { data: CursosData, isLoading, isError } = useQuery(
    "Cursos",
    () => cursoCtrl.getCursos()
  )

  // Redirige al inicio si el usuario no está autenticado (espera a que auth cargue)
  useEffect(() => {
    if (!loading && !User) {
      router.push("/")
    }
  }, [User, loading])

  const isAdmin = User?.role === "admin"

  return (
    <>
      <Navbar />

      <div className="w-[80%] mx-auto">

        {/* ── Panel de administrador ──────────────────────────────── */}
        {isAdmin && (
          <Accordion type="single" collapsible className="my-6 rounded-xl border border-gray-200 bg-gray-50 px-5">
            <AccordionItem value="admin" className="border-0">
              <AccordionTrigger>
                <span className="flex items-center gap-2 text-gray-500">
                  <Settings2 className="w-4 h-4" />
                  Panel de Administrador
                </span>
              </AccordionTrigger>
              <AccordionContent>
                {/* Grid de 1 col en mobile, 3 en desktop — una columna por sección */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-1">

                  {/* Sección: Cursos */}
                  <div>
                    <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">Cursos</p>
                    <div className="flex flex-col gap-2">
                      {ADMIN_ACTIONS.cursos.map(({ label, href, Icon }) => (
                        <Link key={href} href={href}>
                          <a className="inline-flex items-center gap-2 px-3 py-2 rounded-md
                                        bg-white border border-gray-200 text-sm text-gray-700
                                        hover:bg-gray-100 hover:border-gray-300 transition-all shadow-sm w-full">
                            <Icon className="w-4 h-4 shrink-0" />
                            {label}
                          </a>
                        </Link>
                      ))}
                    </div>
                  </div>

                  {/* Sección: Videos */}
                  <div>
                    <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">Videos</p>
                    <div className="flex flex-col gap-2">
                      {ADMIN_ACTIONS.videos.map(({ label, href, Icon }) => (
                        <Link key={href} href={href}>
                          <a className="inline-flex items-center gap-2 px-3 py-2 rounded-md
                                        bg-white border border-gray-200 text-sm text-gray-700
                                        hover:bg-gray-100 hover:border-gray-300 transition-all shadow-sm w-full">
                            <Icon className="w-4 h-4 shrink-0" />
                            {label}
                          </a>
                        </Link>
                      ))}
                    </div>
                  </div>

                  {/* Sección: Clientes */}
                  <div>
                    <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">Clientes</p>
                    <div className="flex flex-col gap-2">
                      {ADMIN_ACTIONS.clientes.map(({ label, href, Icon }) => (
                        <Link key={href} href={href}>
                          <a className="inline-flex items-center gap-2 px-3 py-2 rounded-md
                                        bg-white border border-gray-200 text-sm text-gray-700
                                        hover:bg-gray-100 hover:border-gray-300 transition-all shadow-sm w-full">
                            <Icon className="w-4 h-4 shrink-0" />
                            {label}
                          </a>
                        </Link>
                      ))}
                    </div>
                  </div>

                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        )}

        {/* ── Encabezado del catálogo ─────────────────────────────── */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-700">Cursos Disponibles</h2>
          <p className="text-sm text-gray-400 mt-1">
            {CursosData ? `${CursosData.length} curso${CursosData.length !== 1 ? 's' : ''} disponibles` : ''}
          </p>
        </div>

        {/* ── Estado de error ─────────────────────────────────────── */}
        {isError && (
          <div className="flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700 mb-6">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p className="text-sm">No se pudieron cargar los cursos. Intenta recargar la página.</p>
          </div>
        )}

        {/* ── Grid de cursos ──────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-5 mb-16">
          {isLoading
            ? <SkeletonGrid />
            : CursosData?.map(curso => (
                <Cursocard
                  key={curso.id}
                  slug={curso.id}
                  img={curso.ImgUrl}
                  titulo={curso.Titulo}
                  descripcion={curso.Descripcion}
                  precio={curso.precio}
                />
              ))
          }
        </div>

      </div>

      <Footer />
    </>
  )
}

export default CursosPage
