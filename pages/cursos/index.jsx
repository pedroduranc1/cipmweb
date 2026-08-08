import React, { useEffect } from 'react'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import { useAuth } from '../../hooks/useAuth'
import { Cursocard, CardSkeleton } from '../../minicomponents/Cursocard'
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
import Breadcrumb from '../../components/Breadcrumb'

const cursoCtrl = new Cursos();

const ADMIN_ACTIONS = {
  cursos: [
    { label: 'Crear Curso',     href: '/crear-curso',    Icon: PlusCircle },
    { label: 'Modificar Curso', href: '/modificar-curso', Icon: Pencil },
    { label: 'Eliminar Curso',  href: '/eliminar-curso',  Icon: Trash2 },
  ],
  videos: [
    { label: 'Agregar Video',   href: '/agregar-video',   Icon: Video },
    { label: 'Modificar Video', href: '/modificar-video', Icon: Pencil },
    { label: 'Eliminar Video',  href: '/eliminar-video',  Icon: Trash2 },
  ],
  clientes: [
    { label: 'Activar Curso a Cliente',    href: '/activar-cursos',   Icon: UserCheck },
    { label: 'Desactivar Curso a Cliente', href: '/desactivar-cursos', Icon: UserX },
  ],
}

const SkeletonMasonry = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
    {Array.from({ length: 4 }).map((_, i) => (
      <CardSkeleton key={i} />
    ))}
  </div>
)

const MasonrySection = ({ cursos, activeSlugs, title, count }) => (
  <section className="mb-14">
    <div className="mb-5">
      <h2 className="text-xl font-bold text-gray-700">{title}</h2>
      <p className="text-sm text-gray-400 mt-0.5">
        {count} curso{count !== 1 ? 's' : ''}
      </p>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {cursos.map(curso => (
        <Cursocard
          key={curso.id}
          slug={curso.id}
          img={curso.ImgUrl}
          titulo={curso.Titulo}
          descripcion={curso.Descripcion}
          precio={curso.precio}
          active={activeSlugs.has(curso.id)}
          publicado={curso.publicado ?? true}
        />
      ))}
    </div>
  </section>
)

const CursosPage = () => {
  const { User, loading } = useAuth();
  const router = useRouter();

  const isAdmin = User?.role === "admin"

  const { data: CursosData, isLoading: isLoadingCursos, isError } = useQuery(
    ["Cursos", isAdmin],
    () => cursoCtrl.getCursos(isAdmin),
    { enabled: !loading }
  )

  const { data: clienteData, isLoading: isLoadingCliente } = useQuery(
    ["cursos-cliente", User?.uid],
    () => cursoCtrl.getCursosCliente(User?.uid),
    { enabled: !!User?.uid }
  )

  useEffect(() => {
    if (!loading && !User) router.push("/")
  }, [User, loading])
  const isLoading = isLoadingCursos || isLoadingCliente

  // Set de slugs adquiridos para lookup O(1)
  const activeSlugs = new Set(clienteData?.cursos ?? [])

  const cursosAdquiridos = CursosData?.filter(c => activeSlugs.has(c.id)) ?? []
  const cursosDisponibles = CursosData?.filter(c => !activeSlugs.has(c.id)) ?? []

  return (
    <>
      <Navbar />
      <Breadcrumb />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-6 mb-12">

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
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-1">
                  {Object.entries(ADMIN_ACTIONS).map(([key, actions]) => (
                    <div key={key}>
                      <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">
                        {key}
                      </p>
                      <div className="flex flex-col gap-2">
                        {actions.map(({ label, href, Icon }) => (
                          <Link key={href} href={href} className="inline-flex items-center gap-2 px-3 py-2 rounded-md
                                          bg-white border border-gray-200 text-sm text-gray-700
                                          hover:bg-gray-100 hover:border-gray-300 transition-all shadow-sm w-full">
                              <Icon className="w-4 h-4 shrink-0" />
                              {label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        )}

        {/* ── Error ───────────────────────────────────────────────── */}
        {isError && (
          <div className="flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700 mb-6">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p className="text-sm">No se pudieron cargar los cursos. Intenta recargar la página.</p>
          </div>
        )}

        {/* ── Contenido ───────────────────────────────────────────── */}
        {isLoading ? (
          <>
            <div className="mb-5">
              <div className="h-6 w-48 bg-gray-100 rounded-full animate-pulse mb-2" />
              <div className="h-4 w-24 bg-gray-100 rounded-full animate-pulse" />
            </div>
            <SkeletonMasonry />
          </>
        ) : (
          <>
            {/* Mis cursos — solo si tiene al menos uno */}
            {cursosAdquiridos.length > 0 && (
              <MasonrySection
                title="Mis Cursos"
                count={cursosAdquiridos.length}
                cursos={cursosAdquiridos}
                activeSlugs={activeSlugs}
              />
            )}

            {/* Cursos disponibles */}
            {cursosDisponibles.length > 0 && (
              <MasonrySection
                title="Cursos Disponibles"
                count={cursosDisponibles.length}
                cursos={cursosDisponibles}
                activeSlugs={activeSlugs}
              />
            )}
          </>
        )}

      </div>

      <Footer />
    </>
  )
}

export default CursosPage
