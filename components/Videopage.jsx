import React, { useCallback, useEffect, useRef, useState } from 'react'
import VideoCard2 from '../minicomponents/VideoCard2'
import Link from 'next/link'
import { useRouter } from 'next/router'
import videoslist from '../db/videos'
import ReactPlayer from 'react-player'
import { ChevronRight, Film, Loader2, Maximize, Minimize, Pause, Play, Volume2, VolumeX } from 'lucide-react'

const BASE = 'https://adrianlealcaldera.com'

const formatTime = (secs) => {
  if (!secs || isNaN(secs)) return '0:00'
  const h = Math.floor(secs / 3600)
  const m = Math.floor((secs % 3600) / 60)
  const s = Math.floor(secs % 60)
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  return `${m}:${String(s).padStart(2, '0')}`
}

// ── Player ────────────────────────────────────────────────────────────────────

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
      className="relative w-full aspect-video bg-black rounded-2xl overflow-hidden select-none shadow-lg"
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

      <div
        className="absolute inset-0 grid grid-cols-2"
        onDoubleClick={(e) => {
          const rect = containerRef.current.getBoundingClientRect()
          e.clientX - rect.left < rect.width / 2 ? skip(-10) : skip(10)
        }}
      />

      <div className={`absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/90 via-black/40 to-transparent transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`} />

      <div className={`absolute inset-x-0 bottom-0 px-4 pb-4 pt-2 transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`}>
        <div className="relative w-full h-1.5 mb-3">
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

// ── Página ────────────────────────────────────────────────────────────────────

const Videopage = () => {
  const router = useRouter()
  const { video: videoId } = router.query

  const videoselec = videoslist[videoId - 1]
  const relacionados = videoslist.filter(v => v.id !== videoselec?.id).slice(0, 6)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-4 mb-16">
      <div className="flex flex-col lg:flex-row gap-6">

        {/* ── Columna principal ──────────────────────────────────── */}
        <div className="flex-1 min-w-0">

          {/* Player */}
          <VideoPlayer url={BASE + videoselec?.videourl} />

          {/* Info */}
          <div className="mt-4">
            <h1 className="text-xl md:text-2xl font-bold text-gray-800 leading-snug">
              {videoselec?.videoname}
            </h1>
            <p className="text-gray-400 text-sm mt-1">{videoselec?.fecha}</p>
            {videoselec?.descripcion && (
              <p className="mt-3 text-gray-500 text-sm leading-relaxed">
                {videoselec.descripcion}
              </p>
            )}
          </div>
        </div>

        {/* ── Sidebar: videos relacionados ───────────────────────── */}
        <div className="w-full lg:w-72 shrink-0">
          <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">

            <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Film className="w-4 h-4 text-gray-400" />
                <span className="text-sm font-semibold text-gray-700">Más videos</span>
              </div>
              <Link href="/videos/cipm" className="text-xs text-blue-600 hover:text-blue-700 font-medium transition-colors">
                Ver todos
              </Link>
            </div>

            <div className="divide-y divide-gray-50">
              {relacionados.map(v => (
                <Link
                  key={v.id}
                  href={`/video/${v.id}`}
                  className="flex gap-3 px-4 py-3 hover:bg-gray-50 transition-colors group"
                >
                  <div className="relative w-20 h-14 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                    <img
                      src={v.miniatura?.trim() || '/miniaturavideo.svg'}
                      alt={v.videoname}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col justify-center">
                    <p className="text-sm text-gray-700 font-medium line-clamp-2 leading-snug group-hover:text-blue-600 transition-colors">
                      {v.videoname}
                    </p>
                    {v.fecha && <p className="text-xs text-gray-400 mt-0.5">{v.fecha}</p>}
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-gray-300 shrink-0 self-center" />
                </Link>
              ))}
            </div>

          </div>
        </div>

      </div>
    </div>
  )
}

export default Videopage
