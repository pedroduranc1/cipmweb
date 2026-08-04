import React, { useEffect, useState } from 'react'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '../../src/components/ui/select'
import { useQuery, useQueryClient } from 'react-query'
import { Cursos } from '../../db/Cursos'
import { useRouter } from 'next/router'
import { toast } from '../../src/components/ui/use-toast'
import { Loader2 } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'

const cursoCtrl = new Cursos();

const EliminarCurso = () => {
  const { User, loading } = useAuth()
  const router = useRouter()
  const queryClient = useQueryClient()

  const [CursoSeleccionado, setCursoSeleccionado] = useState(null)
  const [confirmando, setConfirmando] = useState(false)
  const [eliminando, setEliminando] = useState(false)

  useEffect(() => {
    if (!loading && !User) router.push('/')
  }, [User, loading])

  const { data: DataCursos } = useQuery("cursos", () => cursoCtrl.getCursos())
  const { data: VideosDelCurso } = useQuery(
    ["videos-curso", CursoSeleccionado?.id],
    () => cursoCtrl.getVideosCurso(CursoSeleccionado.id),
    { enabled: !!CursoSeleccionado }
  )

  const cursosOrdenados = DataCursos
    ? [...DataCursos].sort((a, b) => a.Titulo?.localeCompare(b.Titulo))
    : []

  const handleSeleccion = (id) => {
    const curso = cursosOrdenados.find(c => c.id === id)
    setCursoSeleccionado(curso)
    setConfirmando(false)
  }

  const handleEliminar = async () => {
    setEliminando(true)
    const result = await cursoCtrl.deleteCurso(CursoSeleccionado)

    if (result) {
      toast({ title: "Curso eliminado exitosamente" })
      queryClient.invalidateQueries("cursos")
      router.push("/cursos")
    } else {
      toast({
        variant: "destructive",
        title: "Error al eliminar el curso",
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
            <h1 className="text-2xl font-bold text-gray-800">Eliminar Curso</h1>
            <p className="text-sm text-gray-500 mt-1">Esta acción es permanente y no se puede deshacer</p>
          </div>

          {/* Selector de curso */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-6">
            <label className="text-sm font-semibold text-gray-700 mb-2 block">Selecciona el curso a eliminar</label>
            <Select onValueChange={handleSeleccion}>
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
          </div>

          {/* Info del curso seleccionado */}
          {CursoSeleccionado && !confirmando && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-6">

              {/* Preview imagen */}
              {CursoSeleccionado.ImgUrl && (
                <div className="h-40 bg-gray-100">
                  <img src={CursoSeleccionado.ImgUrl} alt={CursoSeleccionado.Titulo}
                    className="w-full h-full object-cover" />
                </div>
              )}

              <div className="p-5">
                <h2 className="text-lg font-bold text-gray-800 mb-1">{CursoSeleccionado.Titulo}</h2>
                {CursoSeleccionado.Descripcion && (
                  <p className="text-sm text-gray-500 mb-3 line-clamp-2">{CursoSeleccionado.Descripcion}</p>
                )}

                <div className="flex gap-3 text-sm mb-5">
                  {CursoSeleccionado.precio != null && (
                    <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full font-medium">
                      ${CursoSeleccionado.precio} USD
                    </span>
                  )}
                  {VideosDelCurso !== undefined && (
                    <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full font-medium">
                      {VideosDelCurso.length} {VideosDelCurso.length === 1 ? 'video' : 'videos'}
                    </span>
                  )}
                </div>

                {/* Advertencia si tiene videos */}
                {VideosDelCurso?.length > 0 && (
                  <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 mb-4 text-sm text-amber-700">
                    ⚠ Este curso tiene <strong>{VideosDelCurso.length} {VideosDelCurso.length === 1 ? 'video' : 'videos'}</strong> asociados. Al eliminarlo se borrarán todos sus videos también.
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => setConfirmando(true)}
                  className="w-full py-3 rounded-xl font-semibold text-sm bg-red-500 hover:bg-red-600 text-white transition-all active:scale-[0.98] shadow-sm"
                >
                  Eliminar este curso
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
                  Estás a punto de eliminar <span className="font-semibold text-gray-700">"{CursoSeleccionado.Titulo}"</span>
                  {VideosDelCurso?.length > 0 && (
                    <span> y sus <strong>{VideosDelCurso.length} {VideosDelCurso.length === 1 ? 'video' : 'videos'}</strong></span>
                  )}.
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

export default EliminarCurso
