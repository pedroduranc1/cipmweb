import React, { useEffect, useRef, useState } from 'react'
import Navbar from '../../../../../components/Navbar'
import Footer from '../../../../../components/Footer'
import { useRouter } from 'next/router'
import ReactPlayer from 'react-player'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { Cursos } from "../../../../../db/Cursos";
import { useAuth } from '../../../../../hooks/useAuth'
import Breadcrumb from '../../../../../components/Breadcrumb'
import { CheckCircle2, ChevronRight, Loader2, MessageCircle, PlayCircle, Send } from 'lucide-react'
import Link from 'next/link'

const cursoCtrl = new Cursos();

// ── Skeleton ────────────────────────────────────────────────────────────────
const PageSkeleton = () => (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 animate-pulse">
    <div className="flex flex-col lg:flex-row gap-6">
      <div className="flex-1">
        <div className="rounded-2xl bg-gray-100 w-full aspect-video mb-5" />
        <div className="h-7 bg-gray-100 rounded-full w-2/3 mb-3" />
        <div className="h-4 bg-gray-100 rounded-full w-full mb-2" />
        <div className="h-4 bg-gray-100 rounded-full w-4/5" />
      </div>
      <div className="lg:w-72 xl:w-80 space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-16 bg-gray-100 rounded-xl" />
        ))}
      </div>
    </div>
  </div>
)

// ── Item de la lista lateral de videos ──────────────────────────────────────
const VideoListItem = ({ video, index, isCurrent, cursoId }) => (
  <Link href={`/cursos/${cursoId}/video/${video.id}`}>
    <a className={`flex items-center gap-3 p-3 rounded-xl transition-all group
      ${isCurrent
        ? 'bg-gray-900 text-white shadow-sm'
        : 'hover:bg-gray-50 text-gray-600 hover:text-gray-900'
      }`}>
      <span className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold
        ${isCurrent ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500 group-hover:bg-gray-200'}`}>
        {isCurrent
          ? <PlayCircle className="w-3.5 h-3.5" />
          : String(index).padStart(2, '0')}
      </span>
      <span className="text-sm leading-tight line-clamp-2 flex-1">{video.Titulo}</span>
      {isCurrent && <ChevronRight className="w-4 h-4 flex-shrink-0 opacity-60" />}
    </a>
  </Link>
)

// ── Sección de comentarios ───────────────────────────────────────────────────
const CommentsSection = ({ videoId, User }) => {
  const queryClient = useQueryClient()
  const [texto, setTexto] = useState('')
  const textareaRef = useRef(null)

  const { data: comentarios = [], isLoading } = useQuery(
    ['comentarios', videoId],
    () => cursoCtrl.getComments(videoId),
    { enabled: !!videoId }
  )

  const { mutate: enviar, isLoading: enviando } = useMutation(
    () => cursoCtrl.addComment(videoId, {
      texto: texto.trim(),
      autorId: User.uid,
      autorNombre: `${User.nombre} ${User.apellido}`.trim(),
    }),
    {
      onSuccess: () => {
        setTexto('')
        queryClient.invalidateQueries(['comentarios', videoId])
      },
    }
  )

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!texto.trim() || enviando) return
    enviar()
  }

  const formatFecha = (ts) => {
    if (!ts) return ''
    const date = ts.toDate ? ts.toDate() : new Date(ts)
    return date.toLocaleDateString('es-MX', { day: 'numeric', month: 'short', year: 'numeric' })
  }

  return (
    <div className="mt-10 border-t border-gray-100 pt-8">
      <h2 className="flex items-center gap-2 text-lg font-bold text-gray-700 mb-6">
        <MessageCircle className="w-5 h-5 text-gray-400" />
        Comentarios
        {comentarios.length > 0 && (
          <span className="text-sm font-normal text-gray-400">· {comentarios.length}</span>
        )}
      </h2>

      {/* Input de nuevo comentario */}
      <form onSubmit={handleSubmit} className="mb-8">
        <div className="flex gap-3">
          <div className="flex-shrink-0 w-9 h-9 rounded-full bg-gray-900 flex items-center justify-center text-white text-sm font-bold">
            {User.nombre?.[0]?.toUpperCase()}
          </div>
          <div className="flex-1">
            <textarea
              ref={textareaRef}
              value={texto}
              onChange={(e) => setTexto(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleSubmit(e)
              }}
              placeholder="Escribe un comentario..."
              rows={3}
              className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-700 placeholder-gray-300 outline-none focus:border-gray-400 focus:ring-0 transition-colors"
            />
            <div className="flex items-center justify-between mt-2">
              <span className="text-xs text-gray-300">Cmd+Enter para enviar</span>
              <button
                type="submit"
                disabled={!texto.trim() || enviando}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-gray-900 text-white text-sm font-medium disabled:opacity-40 hover:bg-gray-700 transition-colors"
              >
                {enviando ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                Enviar
              </button>
            </div>
          </div>
        </div>
      </form>

      {/* Lista de comentarios */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="flex gap-3 animate-pulse">
              <div className="w-9 h-9 rounded-full bg-gray-100 flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-3 bg-gray-100 rounded-full w-32" />
                <div className="h-3 bg-gray-100 rounded-full w-full" />
                <div className="h-3 bg-gray-100 rounded-full w-3/4" />
              </div>
            </div>
          ))}
        </div>
      ) : comentarios.length === 0 ? (
        <p className="text-sm text-gray-300 text-center py-8">Sé el primero en comentar esta clase</p>
      ) : (
        <div className="space-y-6">
          {comentarios.map((c) => (
            <div key={c.id} className="flex gap-3">
              <div className="flex-shrink-0 w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 text-sm font-bold">
                {c.autorNombre?.[0]?.toUpperCase()}
              </div>
              <div>
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-sm font-semibold text-gray-700">{c.autorNombre}</span>
                  <span className="text-xs text-gray-300">{formatFecha(c.creadoEn)}</span>
                </div>
                <p className="text-sm text-gray-500 leading-relaxed">{c.texto}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ── Página principal ─────────────────────────────────────────────────────────
const VideoPage = () => {
  const { User, loading } = useAuth()
  const router = useRouter()
  const { video, curso } = router.query

  useEffect(() => {
    if (!loading && !User) router.push("/")
  }, [User, loading])

  const { data: videoData, isLoading: isLoadingVideo } = useQuery(
    ["video", video],
    () => cursoCtrl.getVideo(video),
    { enabled: !!video }
  )

  const { data: cursoData } = useQuery(
    ["curso", curso],
    () => cursoCtrl.getCurso(curso),
    { enabled: !!curso }
  )

  const { data: videosData } = useQuery(
    ["videos", curso],
    () => cursoCtrl.getVideosCurso(curso),
    { enabled: !!curso }
  )

  const videosOrdenados = videosData
    ? [...videosData].sort((a, b) => a.Fecha.toDate() - b.Fecha.toDate())
    : []

  const currentIndex = videosOrdenados.findIndex(v => v.id === video)
  const nextVideo = videosOrdenados[currentIndex + 1]

  if (isLoadingVideo || !User) return (
    <>
      <Navbar />
      <Breadcrumb />
      <div className="mt-6"><PageSkeleton /></div>
      <Footer />
    </>
  )

  return (
    <>
      <Navbar />

      <Breadcrumb labels={{
          [curso]: cursoData?.Titulo,
          [video]: videoData?.Titulo,
        }} />


      <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-4 mb-16">

        <div className="flex flex-col lg:flex-row gap-6">

          {/* ── Columna principal ───────────────────────────────── */}
          <div className="flex-1 min-w-0">

            {/* Player */}
            <div className="rounded-2xl overflow-hidden bg-black w-full aspect-video shadow-lg mb-5">
              <ReactPlayer
                url={videoData?.VideoUrl}
                controls
                playing
                width="100%"
                height="100%"
                config={{
                  file: { attributes: { controlsList: 'nodownload' } },
                }}
              />
            </div>

            {/* Info + navegación */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-2">
              <div>
                {currentIndex >= 0 && (
                  <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-1">
                    Clase {String(currentIndex + 1).padStart(2, '0')} · {videosOrdenados.length} en total
                  </p>
                )}
                <h1 className="text-gray-800 text-xl font-bold leading-snug">{videoData?.Titulo}</h1>
              </div>

              {/* Botón siguiente video */}
              {nextVideo && (
                <Link href={`/cursos/${curso}/video/${nextVideo.id}`}>
                  <a className="flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-900 text-white text-sm font-medium hover:bg-gray-700 transition-colors">
                    Siguiente
                    <ChevronRight className="w-4 h-4" />
                  </a>
                </Link>
              )}
            </div>

            {videoData?.Descripcion && (
              <p className="text-gray-400 text-sm leading-relaxed mt-3">{videoData.Descripcion}</p>
            )}

            {/* Comentarios */}
            {User && <CommentsSection videoId={video} User={User} />}
          </div>

          {/* ── Sidebar: lista de videos ────────────────────────── */}
          <aside className="lg:w-72 xl:w-80 flex-shrink-0">
            <div className="lg:sticky lg:top-24">
              <div className="rounded-2xl border border-gray-100 bg-white overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-100">
                  <h2 className="text-sm font-semibold text-gray-700">Contenido del curso</h2>
                  {videosOrdenados.length > 0 && (
                    <p className="text-xs text-gray-400 mt-0.5">{videosOrdenados.length} clases</p>
                  )}
                </div>
                <div className="p-2 max-h-[60vh] overflow-y-auto">
                  {videosOrdenados.map((v, i) => (
                    <VideoListItem
                      key={v.id}
                      video={v}
                      index={i + 1}
                      isCurrent={v.id === video}
                      cursoId={curso}
                    />
                  ))}
                </div>
              </div>
            </div>
          </aside>

        </div>
      </div>

      <Footer />
    </>
  )
}

export default VideoPage
