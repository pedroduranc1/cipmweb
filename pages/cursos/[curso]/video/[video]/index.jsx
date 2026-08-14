import React, { useCallback, useEffect, useRef, useState } from 'react'
import Navbar from '../../../../../components/Navbar'
import Footer from '../../../../../components/Footer'
import { useRouter } from 'next/router'
import ReactPlayer from 'react-player'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { Cursos } from "../../../../../db/Cursos";
import { useAuth } from '../../../../../hooks/useAuth'
import Breadcrumb from '../../../../../components/Breadcrumb'
import Link from 'next/link'
import {
  Loader2, Maximize, Minimize, Pause, Play,
  Volume2, VolumeX, BookOpen, Send, MessageCircle,
  ChevronRight
} from 'lucide-react'

const cursoCtrl = new Cursos();

// ── Utilidades ────────────────────────────────────────────────────────────────

const formatTime = (secs) => {
  if (!secs || isNaN(secs)) return '0:00'
  const h = Math.floor(secs / 3600)
  const m = Math.floor((secs % 3600) / 60)
  const s = Math.floor(secs % 60)
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  return `${m}:${String(s).padStart(2, '0')}`
}

// ── Skeletons ─────────────────────────────────────────────────────────────────

const PlayerSkeleton = () => (
  <div className="w-full aspect-video bg-gray-900 rounded-2xl animate-pulse" />
)

const InfoSkeleton = () => (
  <div className="animate-pulse space-y-3 mt-4">
    <div className="h-6 bg-gray-100 rounded-full w-2/3" />
    <div className="h-4 bg-gray-100 rounded-full w-full" />
    <div className="h-4 bg-gray-100 rounded-full w-4/5" />
  </div>
)

// ── Video Player ──────────────────────────────────────────────────────────────

const VideoPlayer = ({ url }) => {
  const playerRef = useRef(null)
  const containerRef = useRef(null)
  const hideTimer = useRef(null)

  const [playing, setPlaying] = useState(false)
  const [played, setPlayed] = useState(0)
  const [loaded, setLoaded] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [muted, setMuted] = useState(false)
  const [playbackRate, setPlaybackRate] = useState(1)
  const [fullscreen, setFullscreen] = useState(false)
  const [showControls, setShowControls] = useState(true)
  const [seeking, setSeeking] = useState(false)
  const [buffering, setBuffering] = useState(false)
  const [showRateMenu, setShowRateMenu] = useState(false)

  const RATES = [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2]

  const resetHideTimer = useCallback(() => {
    setShowControls(true)
    clearTimeout(hideTimer.current)
    if (playing) hideTimer.current = setTimeout(() => setShowControls(false), 3000)
  }, [playing])

  useEffect(() => { resetHideTimer(); return () => clearTimeout(hideTimer.current) }, [playing, resetHideTimer])

  useEffect(() => {
    const handler = () => setFullscreen(!!document.fullscreenElement)
    document.addEventListener('fullscreenchange', handler)
    return () => document.removeEventListener('fullscreenchange', handler)
  }, [])

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) containerRef.current?.requestFullscreen()
    else document.exitFullscreen()
  }

  const skip = (secs) => {
    const current = playerRef.current?.getCurrentTime() || 0
    playerRef.current?.seekTo(current + secs)
  }

  useEffect(() => {
    const handler = (e) => {
      if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return
      if (e.key === ' ' || e.key === 'k') { e.preventDefault(); setPlaying(p => !p) }
      if (e.key === 'ArrowRight') { e.preventDefault(); skip(10) }
      if (e.key === 'ArrowLeft')  { e.preventDefault(); skip(-10) }
      if (e.key === 'ArrowUp')    { e.preventDefault(); setVolume(v => Math.min(1, v + 0.1)) }
      if (e.key === 'ArrowDown')  { e.preventDefault(); setVolume(v => Math.max(0, v - 0.1)) }
      if (e.key === 'm') setMuted(m => !m)
      if (e.key === 'f') toggleFullscreen()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full bg-black overflow-hidden select-none rounded-2xl"
      onMouseMove={resetHideTimer}
      onMouseLeave={() => playing && setShowControls(false)}
    >
      <ReactPlayer
        ref={playerRef}
        url={url}
        playing={playing}
        volume={volume}
        muted={muted}
        playbackRate={playbackRate}
        width="100%"
        height="100%"
        onDuration={setDuration}
        onProgress={({ played, loaded }) => { if (!seeking) setPlayed(played); setLoaded(loaded) }}
        onBuffer={() => setBuffering(true)}
        onBufferEnd={() => setBuffering(false)}
        onReady={() => setBuffering(false)}
        config={{ file: { attributes: { controlsList: 'nodownload' } } }}
        style={{ pointerEvents: 'none' }}
      />

      {buffering && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <Loader2 className="w-10 h-10 text-white animate-spin opacity-70" />
        </div>
      )}

      {/* Doble click para saltar */}
      <div
        className="absolute inset-0 grid grid-cols-2"
        onDoubleClick={(e) => {
          const rect = containerRef.current.getBoundingClientRect()
          e.clientX - rect.left < rect.width / 2 ? skip(-10) : skip(10)
        }}
      />

      {/* Gradiente inferior */}
      <div className={`absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/90 via-black/40 to-transparent transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`} />

      {/* Controles */}
      <div className={`absolute inset-x-0 bottom-0 px-4 pb-4 pt-2 transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`}>

        {/* Barra de progreso */}
        <div className="relative w-full h-1.5 mb-3 group/seek">
          <div className="absolute inset-0 bg-white/20 rounded-full" />
          <div className="absolute top-0 left-0 h-full bg-white/30 rounded-full" style={{ width: `${loaded * 100}%` }} />
          <div className="absolute top-0 left-0 h-full bg-blue-500 rounded-full pointer-events-none" style={{ width: `${played * 100}%` }} />
          <input
            type="range" min={0} max={1} step={0.0001} value={played}
            onChange={(e) => setPlayed(parseFloat(e.target.value))}
            onMouseDown={() => setSeeking(true)}
            onMouseUp={(e) => { setSeeking(false); playerRef.current?.seekTo(parseFloat(e.target.value)) }}
            className="absolute inset-0 w-full opacity-0 cursor-pointer h-full"
          />
        </div>

        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1">
            <button onClick={() => setPlaying(p => !p)} className="p-2 rounded-lg text-white hover:bg-white/10 transition-colors">
              {playing ? <Pause className="w-5 h-5 fill-white" /> : <Play className="w-5 h-5 fill-white" />}
            </button>
            <button onClick={() => skip(-10)} className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors hidden sm:block">
              <span className="text-xs font-bold">-10</span>
            </button>
            <button onClick={() => skip(10)} className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors hidden sm:block">
              <span className="text-xs font-bold">+10</span>
            </button>
            <div className="flex items-center gap-1 group/vol">
              <button onClick={() => setMuted(m => !m)} className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors">
                {muted || volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
              <input
                type="range" min={0} max={1} step={0.01} value={muted ? 0 : volume}
                onChange={(e) => { setVolume(parseFloat(e.target.value)); setMuted(false) }}
                className="w-0 group-hover/vol:w-16 transition-all duration-200 accent-white cursor-pointer"
              />
            </div>
            <span className="text-white/70 text-xs font-mono ml-1 hidden sm:block">
              {formatTime(played * duration)} / {formatTime(duration)}
            </span>
          </div>

          <div className="flex items-center gap-1 relative">
            <div className="relative">
              <button onClick={() => setShowRateMenu(r => !r)} className="px-2 py-1 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors text-xs font-bold">
                {playbackRate}x
              </button>
              {showRateMenu && (
                <div className="absolute bottom-9 right-0 bg-gray-900/95 backdrop-blur-sm rounded-xl overflow-hidden shadow-xl border border-white/10 min-w-[80px]">
                  {RATES.map(rate => (
                    <button key={rate} onClick={() => { setPlaybackRate(rate); setShowRateMenu(false) }}
                      className={`w-full px-4 py-2 text-xs text-left transition-colors ${playbackRate === rate ? 'bg-blue-600 text-white font-bold' : 'text-white/70 hover:bg-white/10 hover:text-white'}`}>
                      {rate}x
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button onClick={toggleFullscreen} className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors">
              {fullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Comentarios ───────────────────────────────────────────────────────────────

const Comentarios = ({ videoId, User }) => {
  const queryClient = useQueryClient()
  const [texto, setTexto] = useState('')

  const { data: comments = [], isLoading } = useQuery(
    ['comentarios', videoId],
    () => cursoCtrl.getComments(videoId),
    { enabled: !!videoId }
  )

  const { mutate: enviar, isLoading: enviando } = useMutation(
    () => cursoCtrl.addComment(videoId, {
      texto: texto.trim(),
      autorId: User.uid,
      autorNombre: `${User.nombre} ${User.apellido}`,
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
    if (!texto.trim()) return
    enviar()
  }

  return (
    <div className="mt-8">
      <div className="flex items-center gap-2 mb-4">
        <MessageCircle className="w-5 h-5 text-gray-400" />
        <h3 className="text-lg font-bold text-gray-700">
          Comentarios
          {comments.length > 0 && (
            <span className="text-sm text-gray-400 font-normal ml-1">· {comments.length}</span>
          )}
        </h3>
      </div>

      {/* Formulario */}
      <form onSubmit={handleSubmit} className="flex gap-2 mb-6">
        <input
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          placeholder="Escribe un comentario..."
          className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-colors"
        />
        <button
          type="submit"
          disabled={!texto.trim() || enviando}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {enviando ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          <span className="hidden sm:inline">Enviar</span>
        </button>
      </form>

      {/* Lista */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2].map(i => (
            <div key={i} className="animate-pulse flex gap-3">
              <div className="w-8 h-8 rounded-full bg-gray-100 shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-3 bg-gray-100 rounded-full w-1/4" />
                <div className="h-3 bg-gray-100 rounded-full w-3/4" />
              </div>
            </div>
          ))}
        </div>
      ) : comments.length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-6">Sé el primero en comentar</p>
      ) : (
        <div className="space-y-4">
          {comments.map(c => (
            <div key={c.id} className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                <span className="text-blue-600 text-xs font-bold">
                  {c.autorNombre?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-700">{c.autorNombre}</p>
                <p className="text-sm text-gray-500 mt-0.5">{c.texto}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ── Página ────────────────────────────────────────────────────────────────────

const VideoPage = () => {
  const { User, loading } = useAuth()
  const router = useRouter()
  const { curso: CursoID, video: VideoID } = router.query

  useEffect(() => {
    if (!loading && !User) router.push('/')
  }, [User, loading])

  const { data: videoData, isLoading: isLoadingVideo } = useQuery(
    ['video', VideoID],
    () => cursoCtrl.getVideo(VideoID),
    { enabled: !!VideoID }
  )

  const { data: cursoData, isLoading: isLoadingCurso } = useQuery(
    ['curso', CursoID],
    () => cursoCtrl.getCurso(CursoID),
    { enabled: !!CursoID }
  )

  const { data: videosData, isLoading: isLoadingVideos } = useQuery(
    ['videos', CursoID],
    () => cursoCtrl.getVideosCurso(CursoID),
    { enabled: !!CursoID }
  )

  const isLoading = isLoadingVideo || isLoadingCurso

  return (
    <>
      <Navbar />

      <Breadcrumb labels={{
        [CursoID]: cursoData?.Titulo,
        [VideoID]: videoData?.Titulo,
      }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-4 mb-16">
        <div className="flex flex-col lg:flex-row gap-6">

          {/* ── Columna principal ─────────────────────────────────── */}
          <div className="flex-1 min-w-0">

            {/* Player */}
            <div className="w-full aspect-video bg-gray-900 rounded-2xl overflow-hidden shadow-lg">
              {isLoadingVideo ? <PlayerSkeleton /> : <VideoPlayer url={videoData?.VideoUrl} />}
            </div>

            {/* Info del video */}
            {isLoading ? <InfoSkeleton /> : (
              <div className="mt-4">
                <h1 className="text-xl md:text-2xl font-bold text-gray-800 leading-snug">
                  {videoData?.Titulo}
                </h1>
                {videoData?.Descripcion && (
                  <p className="mt-2 text-gray-500 text-sm leading-relaxed">
                    {videoData.Descripcion}
                  </p>
                )}
              </div>
            )}

            {/* Comentarios */}
            {User && VideoID && (
              <Comentarios videoId={VideoID} User={User} />
            )}
          </div>

          {/* ── Sidebar: lista de clases ──────────────────────────── */}
          <div className="w-full lg:w-80 shrink-0">
            <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">

              {/* Encabezado del sidebar */}
              <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-gray-400" />
                <span className="text-sm font-semibold text-gray-700">Contenido del curso</span>
                {videosData && (
                  <span className="ml-auto text-xs text-gray-400">
                    {videosData.length} clase{videosData.length !== 1 ? 's' : ''}
                  </span>
                )}
              </div>

              {/* Lista de videos */}
              <div className="divide-y divide-gray-50 max-h-[70vh] overflow-y-auto">
                {isLoadingVideos ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="px-4 py-3 animate-pulse flex gap-3 items-center">
                      <div className="w-6 h-6 rounded bg-gray-100 shrink-0" />
                      <div className="flex-1 h-3 bg-gray-100 rounded-full" />
                    </div>
                  ))
                ) : (
                  videosData?.map((v, index) => {
                    const isActive = v.id === VideoID
                    return (
                      <Link
                        key={v.id}
                        href={`/cursos/${CursoID}/video/${v.id}`}
                        className={`flex items-center gap-3 px-4 py-3 text-sm transition-colors
                          ${isActive
                            ? 'bg-blue-50 text-blue-700 font-medium'
                            : 'text-gray-600 hover:bg-gray-50'
                          }`}
                      >
                        <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0
                          ${isActive ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-500'}`}>
                          {String(index + 1).padStart(2, '0')}
                        </span>
                        <span className="line-clamp-2 leading-snug flex-1">{v.Titulo}</span>
                        {isActive && <ChevronRight className="w-3.5 h-3.5 shrink-0 text-blue-500" />}
                      </Link>
                    )
                  })
                )}
              </div>
            </div>
          </div>

        </div>
      </div>

      <Footer />
    </>
  )
}

export default VideoPage
