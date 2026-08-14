import React, { useMemo, useState } from 'react'
import Head from 'next/head'
import Footer from '../../components/Footer'
import Navbar from '../../components/Navbar'
import Videocard from '../../minicomponents/Videocard'
import videoslist from '../../db/videos'
import { useRouter } from 'next/router'
import { Search, X } from 'lucide-react'
import Breadcrumb from '../../components/Breadcrumb'
import { useQuery } from 'react-query'
import { Cursos } from '../../db/Cursos'
import { useAuth } from '../../hooks/useAuth'

const cursoCtrl = new Cursos()
const PAGE_SIZE = 8

export default function Videos() {
  const router = useRouter()
  const { videos: query } = router.query
  const { User } = useAuth()

  const isAdmin = User?.role === 'admin'

  const initialSearch = query && query !== 'cipm' ? query.replace(/%20/g, ' ') : ''
  const [search, setSearch] = useState(initialSearch)
  const [page, setPage] = useState(1)

  const { data: videosSolitarios = [] } = useQuery(
    ["videos-solitarios", isAdmin],
    () => cursoCtrl.getVideosSolitarios(isAdmin),
    { staleTime: 1000 * 60 * 5 }
  )

  const videosFirestore = videosSolitarios.map(v => ({
    id: v.id,
    videoname: v.Titulo,
    miniatura: v.ImgUrl || '/miniaturavideo.svg',
    fecha: v.Fecha?.toDate?.().toLocaleDateString('es-MX') ?? '',
    descripcion: v.Descripcion ?? '',
    publicado: v.publicado ?? false,
    _source: 'firestore',
  }))

  const allVideos = useMemo(() => {
    const firestoreIds = new Set(videosFirestore.map(v => v.id))
    const staticFiltered = videoslist.filter(v => !firestoreIds.has(String(v.id)))
    return [...videosFirestore, ...staticFiltered]
  }, [videosFirestore])

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase()
    if (!term) return allVideos
    return allVideos.filter(v => v.videoname.toLowerCase().includes(term))
  }, [search, allVideos])

  const visible = filtered.slice(0, page * PAGE_SIZE)
  const hasMore = visible.length < filtered.length

  const handleSearch = (val) => {
    setSearch(val)
    setPage(1)
  }

  return (
    <>
      <Head>
        <title>Videos - CIPM</title>
        <link rel="icon" href="/logo.svg" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>

      <Navbar />
      <Breadcrumb />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-6 mb-16">

        {/* ── Encabezado ──────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Videos gratuitos</h1>
            <p className="text-gray-400 text-sm mt-1">
              {filtered.length} video{filtered.length !== 1 ? 's' : ''} disponible{filtered.length !== 1 ? 's' : ''}
            </p>
          </div>

          {/* Buscador */}
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={e => handleSearch(e.target.value)}
              placeholder="Buscar video..."
              className="w-full pl-9 pr-9 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-colors"
            />
            {search && (
              <button
                onClick={() => handleSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* ── Grid de videos ──────────────────────────────────────── */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <Search className="w-10 h-10 text-gray-200 mb-3" />
            <p className="text-gray-500 font-medium">No se encontraron videos</p>
            <p className="text-gray-400 text-sm mt-1">Intenta con otro término de búsqueda</p>
            <button
              onClick={() => handleSearch('')}
              className="mt-4 text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
            >
              Ver todos los videos
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {visible.map(video => (
                <Videocard key={video.id} data={video} />
              ))}
            </div>

            {hasMore && (
              <div className="flex justify-center mt-10">
                <button
                  onClick={() => setPage(p => p + 1)}
                  className="px-6 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-colors"
                >
                  Ver más videos
                </button>
              </div>
            )}
          </>
        )}
      </div>

      <Footer />
    </>
  )
}
