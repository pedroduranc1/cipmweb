import React, { useCallback, useEffect, useRef, useState } from 'react'
import Navbar from '../../../../../components/Navbar'
import Footer from '../../../../../components/Footer'
import { useRouter } from 'next/router'
import ReactPlayer from 'react-player'
import { useQuery } from 'react-query'
import { Cursos } from "../../../../../db/Cursos";
import { useAuth } from '../../../../../hooks/useAuth'
import { Loader2, Maximize, Minimize, Pause, Play, Undo2, Volume2, VolumeX } from 'lucide-react'

const cursoCtrl = new Cursos();

// ── Player Custom ─────────────────────────────────────────────────────────────

const formatTime = (secs) => {
  if (!secs || isNaN(secs)) return '0:00'
  const h = Math.floor(secs / 3600)
  const m = Math.floor((secs % 3600) / 60)
  const s = Math.floor(secs % 60)
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  return `${m}:${String(s).padStart(2, '0')}`
}

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
      className="relative w-full h-full bg-black overflow-hidden select-none"
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
        <div className="relative w-full h-1 mb-3">
          <div className="absolute top-0 left-0 h-full bg-white/25 rounded-full" style={{ width: `${loaded * 100}%` }} />
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
              {playing ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-white" />}
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

const VideoPage = () => {
    const { User, loading } = useAuth()
    const router = useRouter()

    useEffect(() => {
        if (!loading && !User) {
            router.push("/")
        }
    }, [User, loading])

    const { video } = router.query

    const { data: videoData, isLoading, isError } = useQuery(["video", video], () => cursoCtrl.getVideo(video), { enabled: !!video })

    return (
        <>
            <Navbar />

            <div className='w-[80%] my-[1%] mx-auto'>
                <button className='flex items-center justify-center text-gray-400 gap-x-2 cursor-pointer' onClick={() => { router.back() }}><Undo2 className='text-gray-400' /> Volver</button>
            </div>

            <div className='w-[80%] flex md:flex-row flex-col mx-auto'>
                <div className='md:w-fit w-full flex h-full md:h-[50vh]'>
                    <VideoPlayer url={videoData?.VideoUrl} />
                </div>

                <div className='w-full md:w-1/2 h-full md:h-[50vh] flex flex-col md:py-[5%] md:px-10'>
                    <h3 className='text-gray-600 mt-5 md:mt-0 text-2xl'>{videoData?.Titulo}</h3>
                    <p className='text-gray-400 mt-5 mb-5 md:mb-0 text-base'>
                        {videoData?.Descripcion}
                    </p>
                </div>
            </div>

            <div className='pb-[50vh] ' />
            <div className='relative'>
                <Footer />
            </div>
        </>
    )
}

export default VideoPage
