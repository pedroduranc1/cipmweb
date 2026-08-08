import React, { useEffect, useState } from 'react'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import { Cursos } from '../../db/Cursos'
import { useQuery, useQueryClient } from 'react-query'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '../../src/components/ui/select'
import { toast } from '../../src/components/ui/use-toast'
import { useRouter } from 'next/router'
import { AlertCircle, Loader2 } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'

const cursoCtrl = new Cursos();

const EliminarVideo = () => {
  const { User, loading } = useAuth()
  const router = useRouter()
  const queryClient = useQueryClient()

  const [CursoID, setCursoID] = useState(null)
  const [VideoSeleccionado, setVideoSeleccionado] = useState(null)
  const [confirmando, setConfirmando] = useState(false)
  const [eliminando, setEliminando] = useState(false)

  useEffect(() => {
    if (!loading && !User) router.push('/')
  }, [User, loading])

  const { data: DataCursos, isLoading: loadingCursos, isError: errorCursos } = useQuery("cursos-admin", () => cursoCtrl.getCursos(true))
  const { data: DataVideos, isLoading: loadingVideos, isError: errorVideos } = useQuery(
    ["videos-curso", CursoID],
    () => cursoCtrl.getVideosCurso(CursoID),
    { enabled: !!CursoID }
  )

  const cursosOrdenados = DataCursos
    ? [...DataCursos].sort((a, b) => a.Titulo?.localeCompare(b.Titulo))
    : []

  const videosOrdenados = DataVideos
    ? [...DataVideos].sort((a, b) => (a.orden ?? 9999) - (b.orden ?? 9999))
    : []

  const cursoActual = cursosOrdenados.find(c => c.id === CursoID)

  const handleEliminar = async () => {
    setEliminando(true)
    const result = await cursoCtrl.deleteVideo(VideoSeleccionado)

    if (result) {
      toast({ title: "Video eliminado exitosamente" })
      queryClient.invalidateQueries(["videos-curso", CursoID])
      router.push("/cursos")
    } else {
      toast({
        variant: "destructive",
        title: "Error al eliminar el video",
        description: "Ocurrió un problema al intentar eliminar.",
      })
      setEliminando(false)
      setConfirmando(false)
    }
  }

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-red-50 py-10 px-4">
        <div className="max-w-lg mx-auto">

          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-red-500 rounded-2xl mb-4 shadow-lg">
              <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none"
                stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                <path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-800">Eliminar Video</h1>
            <p className="text-sm text-gray-500 mt-1">Selecciona el curso y luego el video a eliminar</p>
          </div>

          {/* Paso 1 — Selector de curso */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-4">
            <div className="flex items-center gap-2 mb-3">
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-red-500 text-white text-xs font-bold">1</span>
              <label className="text-sm font-semibold text-gray-700">Selecciona el curso</label>
            </div>

            {errorCursos ? (
              <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
                <AlertCircle size={16} className="shrink-0" />
                No se pudieron cargar los cursos. Recarga la página.
              </div>
            ) : loadingCursos ? (
              <div className="flex flex-col gap-2">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-10 bg-gray-100 rounded-lg animate-pulse" />
                ))}
              </div>
            ) : (
              <Select onValueChange={(val) => { setCursoID(val); setVideoSeleccionado(null); setConfirmando(false) }}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Elige un curso..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {cursosOrdenados.map((curso) => (
                      <SelectItem key={curso.id} value={curso.id}>{curso.Titulo}</SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}
          </div>

          {/* Paso 2 — Lista de videos con orden */}
          {CursoID && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-6">
              <div className="flex items-center gap-2 mb-3">
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-red-500 text-white text-xs font-bold">2</span>
                <label className="text-sm font-semibold text-gray-700">Selecciona el video a eliminar</label>
              </div>

              {errorVideos && (
                <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3 mb-3">
                  <AlertCircle size={16} className="shrink-0" />
                  No se pudieron cargar los videos. Recarga la página.
                </div>
              )}

              {loadingVideos ? (
                <div className="flex flex-col gap-2">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-14 bg-gray-100 rounded-lg animate-pulse" />
                  ))}
                </div>
              ) : videosOrdenados.length > 0 ? (
                <div className="bg-gray-50 border border-gray-200 rounded-lg overflow-hidden">
                  <p className="text-xs font-semibold text-gray-500 px-3 py-2 border-b border-gray-200 bg-gray-100 uppercase tracking-wide">
                    Videos de {cursoActual?.Titulo} ({videosOrdenados.length})
                  </p>
                  <div className="divide-y divide-gray-100 max-h-64 overflow-y-auto">
                    {videosOrdenados.map((v) => (
                      <button
                        key={v.id}
                        type="button"
                        onClick={() => { setVideoSeleccionado(v); setConfirmando(false) }}
                        className={`w-full flex items-center gap-3 px-3 py-3 text-left transition-colors
                          ${VideoSeleccionado?.id === v.id
                            ? 'bg-red-50 border-l-2 border-red-400'
                            : 'hover:bg-gray-100'}`}
                      >
                        <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold shrink-0
                          ${VideoSeleccionado?.id === v.id ? 'bg-red-400 text-white' : 'bg-blue-100 text-blue-700'}`}>
                          {v.orden ?? '?'}
                        </span>
                        <div className="flex flex-col min-w-0 flex-1">
                          <span className="text-sm text-gray-800 font-medium truncate">{v.Titulo}</span>
                          {v.Descripcion && (
                            <span className="text-xs text-gray-400 truncate">{v.Descripcion}</span>
                          )}
                        </div>
                        {VideoSeleccionado?.id === v.id && (
                          <span className="text-red-400 text-xs font-semibold shrink-0">Seleccionado</span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-sm text-gray-400 text-center py-4">
                  Este curso no tiene videos
                </p>
              )}
            </div>
          )}


          {/* Info del video seleccionado */}
          {VideoSeleccionado && !confirmando && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-6">

              {VideoSeleccionado.ImgUrl && (
                <div className="h-36 bg-gray-100">
                  <img src={VideoSeleccionado.ImgUrl} alt={VideoSeleccionado.Titulo}
                    className="w-full h-full object-cover" />
                </div>
              )}

              <div className="p-5">
                <div className="flex items-start gap-3 mb-3">
                  {VideoSeleccionado.orden && (
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-700 text-sm font-bold shrink-0 mt-0.5">
                      {VideoSeleccionado.orden}
                    </span>
                  )}
                  <div>
                    <h2 className="text-base font-bold text-gray-800">{VideoSeleccionado.Titulo}</h2>
                    {VideoSeleccionado.Descripcion && (
                      <p className="text-sm text-gray-500 mt-0.5 line-clamp-2">{VideoSeleccionado.Descripcion}</p>
                    )}
                  </div>
                </div>

                {VideoSeleccionado.VideoUrl && (
                  <p className="text-xs text-gray-400 mb-4 truncate">🔗 {VideoSeleccionado.VideoUrl}</p>
                )}

                <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 mb-4 text-sm text-red-700">
                  ⚠ Una vez eliminado, el video no se puede recuperar.
                </div>

                <button
                  type="button"
                  onClick={() => setConfirmando(true)}
                  className="w-full py-3 rounded-xl font-semibold text-sm bg-red-500 hover:bg-red-600 text-white transition-all active:scale-[0.98] shadow-sm"
                >
                  Eliminar este video
                </button>
              </div>
            </div>
          )}

          {/* Panel de confirmación */}
          {confirmando && (
            <div className="bg-white rounded-2xl border-2 border-red-200 shadow-sm p-6 mb-6">
              <div className="text-center mb-5">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-red-100 rounded-full mb-3">
                  <span className="text-2xl">⚠️</span>
                </div>
                <h3 className="text-lg font-bold text-gray-800">¿Confirmas la eliminación?</h3>
                <p className="text-sm text-gray-500 mt-1">
                  Estás a punto de eliminar <span className="font-semibold text-gray-700">"{VideoSeleccionado.Titulo}"</span>.
                  Esta acción no se puede deshacer.
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setConfirmando(false)}
                  disabled={eliminando}
                  className="flex-1 py-2.5 rounded-xl font-semibold text-sm border-2 border-gray-200 text-gray-600 hover:bg-gray-50 transition-all disabled:opacity-40"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleEliminar}
                  disabled={eliminando}
                  className="flex-1 py-2.5 rounded-xl font-semibold text-sm bg-red-500 hover:bg-red-600 text-white transition-all disabled:opacity-40 flex items-center justify-center gap-2"
                >
                  {eliminando
                    ? <><Loader2 size={16} className="animate-spin" /> Eliminando...</>
                    : 'Sí, eliminar'
                  }
                </button>
              </div>
            </div>
          )}

        </div>
      </div>

      <Footer />
    </>
  )
}

export default EliminarVideo
