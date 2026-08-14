import React, { useEffect, useMemo, useState } from 'react'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import { Cursos } from '../../db/Cursos';
import { useQuery, useQueryClient } from 'react-query';
import { Field, Form, Formik } from 'formik';
import * as Yup from "yup";
import { useRouter } from 'next/router';
import { toast } from '../../src/components/ui/use-toast';
import { AlertCircle, Loader2, Search, X } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const cursoCtrl = new Cursos();

const TIPO_VIDEO = { CURSO: 'curso', SOLITARIO: 'solitario' }

const fieldClass = (error, touched) =>
  `w-full px-3 py-2.5 rounded-lg border-2 outline-none text-sm transition-colors ${
    error && touched
      ? 'border-red-400 bg-red-50 focus:border-red-500'
      : 'border-gray-200 bg-gray-50 focus:border-blue-400 focus:bg-white'
  }`

const FieldError = ({ error, touched }) =>
  error && touched ? <p className="text-xs text-red-500 mt-0.5">⚠ {error}</p> : null

const ModificarVideo = () => {
  const { User, loading } = useAuth()
  const router = useRouter()
  const queryClient = useQueryClient()

  const [tipoVideo, setTipoVideo] = useState(null)
  const [CursoID, setCursoID] = useState(null)
  const [VideoSeleccionado, setVideoSeleccionado] = useState(null)
  const [searchCurso, setSearchCurso] = useState('')
  const [searchVideo, setSearchVideo] = useState('')

  useEffect(() => {
    if (!loading && !User) router.push('/')
  }, [User, loading])

  const { data: DataCursos, isLoading: loadingCursos, isError: errorCursos } = useQuery(
    "cursos-admin",
    () => cursoCtrl.getCursos(true)
  )

  const { data: VideosCurso, isLoading: loadingVideosCurso, isError: errorVideosCurso } = useQuery(
    ["videos-curso", CursoID],
    () => cursoCtrl.getVideosCurso(CursoID),
    { enabled: !!CursoID }
  )

  const { data: VideosSolitarios, isLoading: loadingVideosSolitarios, isError: errorVideosSolitarios } = useQuery(
    "videos-solitarios-admin",
    () => cursoCtrl.getVideosSolitarios(true),
    { enabled: tipoVideo === TIPO_VIDEO.SOLITARIO }
  )

  const cursosOrdenados = useMemo(() => {
    if (!DataCursos) return []
    return [...DataCursos].sort((a, b) => a.Titulo?.localeCompare(b.Titulo))
  }, [DataCursos])

  const cursosFiltrados = useMemo(() => {
    const term = searchCurso.trim().toLowerCase()
    if (!term) return cursosOrdenados
    return cursosOrdenados.filter(c => c.Titulo?.toLowerCase().includes(term))
  }, [cursosOrdenados, searchCurso])

  const videosOrdenados = useMemo(() => {
    if (!VideosCurso) return []
    return [...VideosCurso].sort((a, b) => (a.orden ?? 9999) - (b.orden ?? 9999))
  }, [VideosCurso])

  const videosFiltrados = useMemo(() => {
    const term = searchVideo.trim().toLowerCase()
    if (tipoVideo === TIPO_VIDEO.CURSO) {
      if (!term) return videosOrdenados
      return videosOrdenados.filter(v => v.Titulo?.toLowerCase().includes(term))
    }
    const lista = VideosSolitarios ?? []
    if (!term) return lista
    return lista.filter(v => v.Titulo?.toLowerCase().includes(term))
  }, [tipoVideo, videosOrdenados, VideosSolitarios, searchVideo])

  const cursoActual = cursosOrdenados.find(c => c.id === CursoID)

  const handleTipo = (tipo) => {
    setTipoVideo(tipo)
    setCursoID(null)
    setVideoSeleccionado(null)
    setSearchCurso('')
    setSearchVideo('')
  }

  const handleCurso = (id) => {
    setCursoID(id)
    setVideoSeleccionado(null)
    setSearchVideo('')
  }

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-10 px-4">
        <div className="max-w-lg mx-auto">

          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-amber-500 rounded-2xl mb-4 shadow-lg">
              <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none"
                stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-800">Modificar Video</h1>
            <p className="text-sm text-gray-500 mt-1">Selecciona el tipo de video antes de continuar</p>
          </div>

          {/* Paso 0 — Tipo de video */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <button
              type="button"
              onClick={() => handleTipo(TIPO_VIDEO.CURSO)}
              className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all text-sm font-medium
                ${tipoVideo === TIPO_VIDEO.CURSO
                  ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-sm'
                  : 'border-gray-200 bg-white text-gray-500 hover:border-gray-300 hover:bg-gray-50'}`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center
                ${tipoVideo === TIPO_VIDEO.CURSO ? 'bg-blue-600' : 'bg-gray-100'}`}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                  stroke={tipoVideo === TIPO_VIDEO.CURSO ? 'white' : '#9ca3af'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
                </svg>
              </div>
              Video de Curso
              {tipoVideo === TIPO_VIDEO.CURSO && (
                <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full font-semibold">Seleccionado</span>
              )}
            </button>

            <button
              type="button"
              onClick={() => handleTipo(TIPO_VIDEO.SOLITARIO)}
              className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all text-sm font-medium
                ${tipoVideo === TIPO_VIDEO.SOLITARIO
                  ? 'border-purple-500 bg-purple-50 text-purple-700 shadow-sm'
                  : 'border-gray-200 bg-white text-gray-500 hover:border-gray-300 hover:bg-gray-50'}`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center
                ${tipoVideo === TIPO_VIDEO.SOLITARIO ? 'bg-purple-600' : 'bg-gray-100'}`}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                  stroke={tipoVideo === TIPO_VIDEO.SOLITARIO ? 'white' : '#9ca3af'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                </svg>
              </div>
              Video Solitario
              {tipoVideo === TIPO_VIDEO.SOLITARIO && (
                <span className="text-xs bg-purple-100 text-purple-600 px-2 py-0.5 rounded-full font-semibold">Seleccionado</span>
              )}
            </button>
          </div>

          {/* Paso 1 — Selector de curso (solo video de curso) */}
          {tipoVideo === TIPO_VIDEO.CURSO && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-4">
              <div className="flex items-center gap-2 mb-3">
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold">1</span>
                <label className="text-sm font-semibold text-gray-700">Selecciona el curso</label>
              </div>

              {errorCursos ? (
                <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
                  <AlertCircle size={16} className="shrink-0" />
                  No se pudieron cargar los cursos. Recarga la página.
                </div>
              ) : loadingCursos ? (
                <div className="flex flex-col gap-2">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-10 bg-gray-100 rounded-lg animate-pulse" />
                  ))}
                </div>
              ) : (
                <>
                  <div className="relative mb-3">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    <input
                      type="text"
                      value={searchCurso}
                      onChange={e => { setSearchCurso(e.target.value); handleCurso(null) }}
                      placeholder="Buscar curso por título..."
                      className="w-full pl-9 pr-9 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400/30 focus:border-blue-400 transition-colors"
                    />
                    {searchCurso && (
                      <button
                        onClick={() => { setSearchCurso(''); handleCurso(null) }}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  {cursosFiltrados.length === 0 ? (
                    <p className="text-sm text-gray-400 text-center py-3">Sin resultados</p>
                  ) : (
                    <div className="bg-gray-50 border border-gray-200 rounded-lg overflow-hidden">
                      <div className="divide-y divide-gray-100 max-h-52 overflow-y-auto">
                        {cursosFiltrados.map((curso) => (
                          <button
                            key={curso.id}
                            type="button"
                            onClick={() => handleCurso(curso.id)}
                            className={`w-full flex items-center gap-3 px-3 py-2.5 text-left transition-colors
                              ${CursoID === curso.id
                                ? 'bg-blue-50 border-l-2 border-blue-500'
                                : 'hover:bg-gray-50'}`}
                          >
                            <div className="flex flex-col min-w-0">
                              <span className="text-sm text-gray-800 font-medium truncate">{curso.Titulo}</span>
                              {curso.Descripcion && (
                                <span className="text-xs text-gray-400 truncate">{curso.Descripcion}</span>
                              )}
                            </div>
                            {CursoID === curso.id && (
                              <span className="ml-auto text-blue-500 text-xs font-semibold shrink-0">Seleccionado</span>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {!CursoID && (
                    <p className="text-xs text-amber-600 mt-2">⚠ Debes seleccionar un curso para continuar</p>
                  )}
                </>
              )}
            </div>
          )}

          {/* Paso 1/2 — Selector de video */}
          {(tipoVideo === TIPO_VIDEO.SOLITARIO || (tipoVideo === TIPO_VIDEO.CURSO && CursoID)) && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-6">
              <div className="flex items-center gap-2 mb-3">
                <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-white text-xs font-bold
                  ${tipoVideo === TIPO_VIDEO.CURSO ? 'bg-blue-600' : 'bg-purple-600'}`}>
                  {tipoVideo === TIPO_VIDEO.CURSO ? '2' : '1'}
                </span>
                <label className="text-sm font-semibold text-gray-700">
                  {tipoVideo === TIPO_VIDEO.CURSO
                    ? `Videos de "${cursoActual?.Titulo}"`
                    : 'Selecciona el video solitario'}
                </label>
              </div>

              {(errorVideosCurso || errorVideosSolitarios) && (
                <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3 mb-3">
                  <AlertCircle size={16} className="shrink-0" />
                  No se pudieron cargar los videos. Recarga la página.
                </div>
              )}

              <div className="relative mb-3">
                <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none`} />
                <input
                  type="text"
                  value={searchVideo}
                  onChange={e => { setSearchVideo(e.target.value); setVideoSeleccionado(null) }}
                  placeholder="Buscar video por título..."
                  className={`w-full pl-9 pr-9 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 transition-colors
                    ${tipoVideo === TIPO_VIDEO.CURSO
                      ? 'focus:ring-blue-400/30 focus:border-blue-400'
                      : 'focus:ring-purple-400/30 focus:border-purple-400'}`}
                />
                {searchVideo && (
                  <button
                    onClick={() => { setSearchVideo(''); setVideoSeleccionado(null) }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {(loadingVideosCurso || loadingVideosSolitarios) ? (
                <div className="flex flex-col gap-2">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-12 bg-gray-100 rounded-lg animate-pulse" />
                  ))}
                </div>
              ) : videosFiltrados.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-4">
                  {searchVideo ? 'Sin resultados para esa búsqueda' : 'No hay videos disponibles'}
                </p>
              ) : (
                <div className="bg-gray-50 border border-gray-200 rounded-lg overflow-hidden">
                  <p className="text-xs font-semibold text-gray-500 px-3 py-2 border-b border-gray-200 bg-gray-100 uppercase tracking-wide">
                    {videosFiltrados.length} video{videosFiltrados.length !== 1 ? 's' : ''}
                  </p>
                  <div className="divide-y divide-gray-100 max-h-64 overflow-y-auto">
                    {videosFiltrados.map((v) => (
                      <button
                        key={v.id}
                        type="button"
                        onClick={() => setVideoSeleccionado(v)}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 text-left transition-colors
                          ${VideoSeleccionado?.id === v.id
                            ? 'bg-amber-50 border-l-2 border-amber-400'
                            : 'hover:bg-gray-50'}`}
                      >
                        {tipoVideo === TIPO_VIDEO.CURSO && (
                          <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold shrink-0
                            ${VideoSeleccionado?.id === v.id ? 'bg-amber-400 text-white' : 'bg-blue-100 text-blue-700'}`}>
                            {v.orden ?? '?'}
                          </span>
                        )}
                        <div className="flex flex-col min-w-0">
                          <span className="text-sm text-gray-800 font-medium truncate">{v.Titulo}</span>
                          {v.Descripcion && (
                            <span className="text-xs text-gray-400 truncate">{v.Descripcion}</span>
                          )}
                        </div>
                        {VideoSeleccionado?.id === v.id && (
                          <span className="ml-auto text-amber-500 text-xs font-semibold shrink-0">Seleccionado</span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Formulario de edición */}
          {VideoSeleccionado && (
            <VideoFormUpdate
              key={VideoSeleccionado.id}
              data={VideoSeleccionado}
              esCurso={tipoVideo === TIPO_VIDEO.CURSO}
              videosDelCurso={tipoVideo === TIPO_VIDEO.CURSO ? videosOrdenados : []}
              onSuccess={() => {
                queryClient.invalidateQueries(["videos-curso", CursoID])
                queryClient.invalidateQueries("videos-solitarios-admin")
                router.push('/cursos')
              }}
            />
          )}

        </div>
      </div>

      <Footer />
    </>
  )
}

const VideoFormUpdate = ({ data, esCurso, videosDelCurso, onSuccess }) => {
  const [ImgCurso, setImgCurso] = useState(null)
  const [previewImg, setPreviewImg] = useState(data?.ImgUrl || null)
  const [publicado, setPublicado] = useState(data?.publicado ?? false)

  const handleImageChange = (e) => {
    const file = e.currentTarget.files[0]
    if (!file) return
    setImgCurso(file)
    setPreviewImg(URL.createObjectURL(file))
  }

  return (
    <Formik
      initialValues={{
        id: data?.id || "",
        Titulo: data?.Titulo || "",
        Descripcion: data?.Descripcion || "",
        CursoID: data?.CursoID || "",
        VideoUrl: data?.VideoUrl || "",
        ImgUrl: data?.ImgUrl || "",
        orden: data?.orden || "",
      }}
      validationSchema={Yup.object({
        Titulo: Yup.string().required("El título es obligatorio"),
        Descripcion: Yup.string().required("La descripción es obligatoria"),
        VideoUrl: Yup.string().url("Debe ser una URL válida").required("La URL es obligatoria"),
        ...(esCurso && {
          orden: Yup.number()
            .typeError("Debe ser un número")
            .required("El orden es obligatorio")
            .min(1, "El orden mínimo es 1")
            .integer("Debe ser un número entero"),
        }),
      })}
      onSubmit={async (values) => {
        const dataCurso = {
          ...values,
          ...(esCurso && { orden: Number(values.orden) }),
          ...(!esCurso && { publicado }),
          ImgUrl: ImgCurso
            ? await cursoCtrl.uploadCursoImage(ImgCurso, values.id, values.id)
            : data?.ImgUrl || "",
        }

        const result = await cursoCtrl.updateVideo(dataCurso.id, dataCurso)

        if (result) {
          toast({ title: "Video actualizado exitosamente" })
          onSuccess()
        } else {
          toast({
            variant: "destructive",
            title: "Error al actualizar el video",
            description: "Ocurrió un problema al guardar los datos.",
          })
        }
      }}
    >
      {({ errors, touched, isSubmitting, isValid, dirty }) => (
        <Form className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

          <div className={`px-5 py-3 border-b text-sm font-medium flex items-center gap-2
            ${esCurso ? 'bg-blue-50 text-blue-700 border-blue-100' : 'bg-purple-50 text-purple-700 border-purple-100'}`}>
            ✏️ Editando: <span className="font-bold truncate">{data.Titulo}</span>
            {esCurso && data.orden && (
              <span className="ml-auto bg-blue-100 text-blue-600 text-xs px-2 py-0.5 rounded-full font-semibold shrink-0">
                Orden #{data.orden}
              </span>
            )}
            {!esCurso && (
              <span className="ml-auto bg-purple-100 text-purple-600 text-xs px-2 py-0.5 rounded-full font-semibold shrink-0">
                Solitario
              </span>
            )}
          </div>

          {previewImg && (
            <div className="relative h-44 bg-gray-100">
              <img src={previewImg} alt="preview" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              <span className="absolute bottom-3 left-3 text-white text-xs font-medium bg-black/40 px-2 py-1 rounded-full">
                {ImgCurso ? 'Nueva imagen' : 'Imagen actual'}
              </span>
              {ImgCurso && (
                <button
                  type="button"
                  onClick={() => { setImgCurso(null); setPreviewImg(data?.ImgUrl || null) }}
                  className="absolute top-3 right-3 bg-white/90 hover:bg-white text-gray-700 rounded-full px-2 py-1 text-xs font-medium shadow transition-colors"
                >
                  ✕ Restaurar
                </button>
              )}
            </div>
          )}

          <div className="p-6 flex flex-col gap-5">

            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-gray-700" htmlFor="Titulo">Título del video</label>
              <Field id="Titulo" name="Titulo" className={fieldClass(errors.Titulo, touched.Titulo)} />
              <FieldError error={errors.Titulo} touched={touched.Titulo} />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-gray-700" htmlFor="Descripcion">Descripción</label>
              <Field as="textarea" id="Descripcion" name="Descripcion" rows={3}
                className={`${fieldClass(errors.Descripcion, touched.Descripcion)} resize-none`} />
              <FieldError error={errors.Descripcion} touched={touched.Descripcion} />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-gray-700" htmlFor="VideoUrl">URL del video</label>
              <Field id="VideoUrl" name="VideoUrl" type="url" className={fieldClass(errors.VideoUrl, touched.VideoUrl)} />
              <FieldError error={errors.VideoUrl} touched={touched.VideoUrl} />
            </div>

            {esCurso && (
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-gray-700" htmlFor="orden">Orden en el curso</label>

                {videosDelCurso.length > 1 && (
                  <div className="bg-gray-50 border border-gray-200 rounded-lg overflow-hidden">
                    <p className="text-xs font-semibold text-gray-500 px-3 py-2 border-b border-gray-200 bg-gray-100 uppercase tracking-wide">
                      Orden actual del curso
                    </p>
                    <div className="divide-y divide-gray-100 max-h-36 overflow-y-auto">
                      {videosDelCurso.map((v) => (
                        <div key={v.id} className={`flex items-center gap-3 px-3 py-2 ${v.id === data.id ? 'bg-blue-50' : ''}`}>
                          <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold shrink-0
                            ${v.id === data.id ? 'bg-blue-500 text-white' : 'bg-blue-100 text-blue-700'}`}>
                            {v.orden ?? '?'}
                          </span>
                          <span className={`text-sm truncate ${v.id === data.id ? 'font-semibold text-blue-700' : 'text-gray-600'}`}>
                            {v.Titulo} {v.id === data.id && '← editando'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <Field id="orden" name="orden" type="number" min="1" placeholder="Ej: 1, 2, 3..."
                  className={fieldClass(errors.orden, touched.orden)} />
                <FieldError error={errors.orden} touched={touched.orden} />
              </div>
            )}

            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-gray-700">
                Cambiar miniatura <span className="text-gray-400 font-normal">(opcional)</span>
              </label>
              <label className={`flex flex-col items-center justify-center w-full h-24 border-2 border-dashed rounded-lg cursor-pointer transition-colors
                ${ImgCurso
                  ? esCurso ? 'border-blue-300 bg-blue-50' : 'border-purple-300 bg-purple-50'
                  : 'border-gray-300 bg-gray-50 hover:bg-gray-100 hover:border-gray-400'}`}>
                <div className="flex flex-col items-center text-sm">
                  <span className="text-lg mb-1">🖼️</span>
                  {ImgCurso
                    ? <span className={`font-medium text-xs ${esCurso ? 'text-blue-600' : 'text-purple-600'}`}>Nueva imagen seleccionada ✓</span>
                    : <><span className="font-medium text-gray-600 text-xs">Haz clic para cambiar</span><span className="text-xs text-gray-400">PNG, JPG hasta 5MB</span></>
                  }
                </div>
                <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
              </label>
            </div>

            {/* Visibilidad — solo para videos solitarios */}
            {!esCurso && (
              <div className="flex items-center justify-between p-4 rounded-xl border-2 border-dashed transition-colors border-gray-200 bg-gray-50">
                <div>
                  <p className="text-sm font-semibold text-gray-700">Visible al público</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {publicado ? 'El video aparecerá en la sección de videos' : 'Solo visible para administradores (modo prueba)'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setPublicado(p => !p)}
                  className={`relative inline-flex h-6 w-11 shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 cursor-pointer
                    ${publicado ? 'bg-purple-600' : 'bg-gray-300'}`}
                >
                  <span className={`inline-block h-5 w-5 rounded-full bg-white shadow transform transition-transform duration-200
                    ${publicado ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={!(isValid && dirty) || isSubmitting}
              className={`w-full py-3 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 shadow-sm
                disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98] text-white
                ${esCurso ? 'bg-blue-600 hover:bg-blue-700' : 'bg-purple-600 hover:bg-purple-700'}`}
            >
              {isSubmitting
                ? <><Loader2 size={16} className="animate-spin" /> Guardando cambios...</>
                : '✓ Guardar Cambios'
              }
            </button>
          </div>
        </Form>
      )}
    </Formik>
  )
}

export default ModificarVideo
