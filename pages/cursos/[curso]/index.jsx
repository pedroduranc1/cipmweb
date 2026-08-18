import React, { useEffect, useState } from 'react'
import Navbar from "../../../components/Navbar";
import Footer from '../../../components/Footer'
import { useRouter } from 'next/router'
import { Cursocard } from "../../../minicomponents/cardVideo";
import { useQuery } from 'react-query';
import { Cursos } from "../../../db/Cursos";
import { useAuth } from '../../../hooks/useAuth';
import { BookOpen } from 'lucide-react';
import Breadcrumb from '../../../components/Breadcrumb';

const cursoCtrl = new Cursos();

const HeroSkeleton = () => (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 animate-pulse">
    <div className="rounded-2xl overflow-hidden bg-gray-100 aspect-video md:aspect-[21/7] w-full mb-8" />
  </div>
)

const VideoCardSkeleton = () => (
  <div className="rounded-2xl overflow-hidden bg-white border border-gray-100 shadow-sm animate-pulse">
    <div className="aspect-video bg-gray-100" />
    <div className="p-4 space-y-2">
      <div className="h-4 bg-gray-100 rounded-full w-3/4" />
      <div className="h-3 bg-gray-100 rounded-full w-full" />
    </div>
  </div>
)

const CursoPage = () => {
  const [videosOrdenados, setVideosOrdenados] = useState(null)
  const router = useRouter()
  const { User, loading } = useAuth()
  const { curso: CursoID } = router.query

  useEffect(() => {
    if (!loading && !User) router.push("/")
  }, [User, loading])

  const { data: CursosData, isLoading: isLoadingCurso } = useQuery(
    ["curso", CursoID],
    () => cursoCtrl.getCurso(CursoID),
    { enabled: !!CursoID }
  )

  const { data: VideosData, isLoading: isLoadingVideos } = useQuery(
    ["videos", CursoID],
    () => cursoCtrl.getVideosCurso(CursoID),
    { enabled: !!CursoID }
  )

  useEffect(() => {
    if (!VideosData) return
    const ordenados = [...VideosData].sort((a, b) => (a.orden ?? 9999) - (b.orden ?? 9999))
    setVideosOrdenados(ordenados)
  }, [VideosData])

  const isLoading = isLoadingCurso || isLoadingVideos
  const thumbnail = CursosData?.ImgUrl?.trim() ? CursosData.ImgUrl : '/video-placeholder.svg'

  return (
    <>
      <Navbar />

      <Breadcrumb labels={{ [CursoID]: CursosData?.Titulo }} />

      {/* ── Hero del curso ───────────────────────────────────────── */}
      {isLoading ? <HeroSkeleton /> : (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-4 mb-10">
          <div className="relative w-full rounded-2xl overflow-hidden bg-gray-100">
            <img
              src={thumbnail}
              alt={CursosData?.Titulo}
              className="w-full max-h-[380px] object-cover"
            />
            {/* Overlay con info del curso */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex flex-col justify-end p-6 md:p-8">
              <h1 className="text-white text-2xl md:text-3xl font-bold leading-tight mb-2">
                {CursosData?.Titulo}
              </h1>
              <p className="text-white/80 text-sm md:text-base leading-relaxed max-w-2xl">
                {CursosData?.Descripcion}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ── Encabezado del contenido ─────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-5 flex items-center gap-2">
        <BookOpen className="w-5 h-5 text-gray-400" />
        <h2 className="text-xl font-bold text-gray-700">Contenido del curso</h2>
        {videosOrdenados && (
          <span className="text-sm text-gray-400 ml-1">
            · {videosOrdenados.length} clase{videosOrdenados.length !== 1 ? 's' : ''}
          </span>
        )}
      </div>

      {/* ── Grid de videos ───────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-16">
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-col-4 gap-4">
            {Array.from({ length: 6 }).map((_, i) => <VideoCardSkeleton key={i} />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {videosOrdenados?.map((video, index) => (
              <Cursocard
                key={video.id}
                index={index + 1}
                slug={`/${CursoID}/video/${video.id}`}
                img={video.ImgUrl}
                imgSecond={thumbnail}
                titulo={video.Titulo}
                descripcion={video.Descripcion}
              />
            ))}
          </div>
        )}
      </div>

      <Footer />
    </>
  )
}

export default CursoPage
