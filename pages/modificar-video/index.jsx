import React, { useEffect, useState } from 'react'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import { Cursos } from '../../db/Cursos';
import { useQuery, useQueryClient } from 'react-query';
import {
  Select, SelectContent, SelectGroup,
  SelectItem, SelectTrigger, SelectValue,
} from "../../src/components/ui/select";
import { Field, Form, Formik } from 'formik';
import * as Yup from "yup";
import { useRouter } from 'next/router';
import { toast } from '../../src/components/ui/use-toast';
import { AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const cursoCtrl = new Cursos();

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
  const [CursoID, setCursoID] = useState(null)
  const [VideoSeleccionado, setVideoSeleccionado] = useState(null)

  useEffect(() => {
    if (!loading && !User) router.push('/')
  }, [User, loading])

  const { data: DataCursos, isLoading: loadingCursos, isError: errorCursos } = useQuery("cursos", () => cursoCtrl.getCursos())
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
            <p className="text-sm text-gray-500 mt-1">Selecciona el curso y luego el video a editar</p>
          </div>

          {/* Paso 1 — Selector de curso */}
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
              <Select onValueChange={(val) => { setCursoID(val); setVideoSeleccionado(null) }}>
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

          {/* Paso 2 — Selector de video con lista de orden */}
          {CursoID && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-6">
              <div className="flex items-center gap-2 mb-3">
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold">2</span>
                <label className="text-sm font-semibold text-gray-700">Selecciona el video</label>
              </div>

              {errorVideos && (
                <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3 mb-3">
                  <AlertCircle size={16} className="shrink-0" />
                  No se pudieron cargar los videos. Recarga la página.
                </div>
              )}

              {/* Lista de videos con orden visual */}
              {loadingVideos ? (
                <div className="flex flex-col gap-2">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-12 bg-gray-100 rounded-lg animate-pulse" />
                  ))}
                </div>
              ) : videosOrdenados.length > 0 ? (
                <>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg overflow-hidden mb-3">
                    <p className="text-xs font-semibold text-gray-500 px-3 py-2 border-b border-gray-200 bg-gray-100 uppercase tracking-wide">
                      Videos de {cursoActual?.Titulo} ({videosOrdenados.length})
                    </p>
                    <div className="divide-y divide-gray-100 max-h-52 overflow-y-auto">
                      {videosOrdenados.map((v) => (
                        <button
                          key={v.id}
                          type="button"
                          onClick={() => setVideoSeleccionado(v)}
                          className={`w-full flex items-center gap-3 px-3 py-2.5 text-left transition-colors
                            ${VideoSeleccionado?.id === v.id
                              ? 'bg-amber-50 border-l-2 border-amber-400'
                              : 'hover:bg-gray-50'}`}
                        >
                          <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold shrink-0
                            ${VideoSeleccionado?.id === v.id ? 'bg-amber-400 text-white' : 'bg-blue-100 text-blue-700'}`}>
                            {v.orden ?? '?'}
                          </span>
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

                  {/* Select como alternativa */}
                  <Select
                    value={VideoSeleccionado?.id || ""}
                    onValueChange={(val) => {
                      const video = videosOrdenados.find(v => v.id === val)
                      setVideoSeleccionado(video)
                    }}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="O selecciona desde aquí..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {videosOrdenados.map((v) => (
                          <SelectItem key={v.id} value={v.id}>
                            {v.orden ? `#${v.orden} — ` : ''}{v.Titulo}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </>
              ) : (
                <p className="text-sm text-gray-400 text-center py-4">
                  Este curso no tiene videos aún
                </p>
              )}

            </div>
          )}

          {/* Formulario de edición */}
          {VideoSeleccionado && (
            <VideoFormUpdate
              key={VideoSeleccionado.id}
              data={VideoSeleccionado}
              videosDelCurso={videosOrdenados}
              onSuccess={() => {
                queryClient.invalidateQueries("cursos")
                queryClient.invalidateQueries(["videos-curso", CursoID])
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

const VideoFormUpdate = ({ data, videosDelCurso, onSuccess }) => {
  const [ImgCurso, setImgCurso] = useState(null)
  const [previewImg, setPreviewImg] = useState(data?.ImgUrl || null)

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
        orden: Yup.number()
          .typeError("Debe ser un número")
          .required("El orden es obligatorio")
          .min(1, "El orden mínimo es 1")
          .integer("Debe ser un número entero"),
      })}
      onSubmit={async (values) => {
        const dataCurso = {
          ...values,
          orden: Number(values.orden),
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

          {/* Badge video seleccionado */}
          <div className="px-5 py-3 bg-amber-50 text-amber-700 border-b border-amber-100 text-sm font-medium flex items-center gap-2">
            ✏️ Editando: <span className="font-bold">{data.Titulo}</span>
            {data.orden && (
              <span className="ml-auto bg-amber-100 text-amber-600 text-xs px-2 py-0.5 rounded-full font-semibold">
                Orden #{data.orden}
              </span>
            )}
          </div>

          {/* Preview imagen */}
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

            {/* Título */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-gray-700" htmlFor="Titulo">Título del video</label>
              <Field id="Titulo" name="Titulo" className={fieldClass(errors.Titulo, touched.Titulo)} />
              <FieldError error={errors.Titulo} touched={touched.Titulo} />
            </div>

            {/* Descripción */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-gray-700" htmlFor="Descripcion">Descripción</label>
              <Field as="textarea" id="Descripcion" name="Descripcion" rows={3}
                className={`${fieldClass(errors.Descripcion, touched.Descripcion)} resize-none`} />
              <FieldError error={errors.Descripcion} touched={touched.Descripcion} />
            </div>

            {/* URL del video */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-gray-700" htmlFor="VideoUrl">URL del video</label>
              <Field id="VideoUrl" name="VideoUrl" type="url" className={fieldClass(errors.VideoUrl, touched.VideoUrl)} />
              <FieldError error={errors.VideoUrl} touched={touched.VideoUrl} />
            </div>

            {/* Orden */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-700" htmlFor="orden">Orden en el curso</label>

              {/* Lista de orden del resto de videos */}
              {videosDelCurso.length > 1 && (
                <div className="bg-gray-50 border border-gray-200 rounded-lg overflow-hidden">
                  <p className="text-xs font-semibold text-gray-500 px-3 py-2 border-b border-gray-200 bg-gray-100 uppercase tracking-wide">
                    Orden actual del curso
                  </p>
                  <div className="divide-y divide-gray-100 max-h-36 overflow-y-auto">
                    {videosDelCurso.map((v) => (
                      <div key={v.id} className={`flex items-center gap-3 px-3 py-2
                        ${v.id === data.id ? 'bg-amber-50' : ''}`}>
                        <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold shrink-0
                          ${v.id === data.id ? 'bg-amber-400 text-white' : 'bg-blue-100 text-blue-700'}`}>
                          {v.orden ?? '?'}
                        </span>
                        <span className={`text-sm truncate ${v.id === data.id ? 'font-semibold text-amber-700' : 'text-gray-600'}`}>
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

            {/* Cambiar imagen */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-gray-700">
                Cambiar miniatura <span className="text-gray-400 font-normal">(opcional)</span>
              </label>
              <label className={`flex flex-col items-center justify-center w-full h-24 border-2 border-dashed rounded-lg cursor-pointer transition-colors
                ${ImgCurso ? 'border-amber-300 bg-amber-50' : 'border-gray-300 bg-gray-50 hover:bg-gray-100 hover:border-gray-400'}`}>
                <div className="flex flex-col items-center text-sm">
                  <span className="text-lg mb-1">🖼️</span>
                  {ImgCurso
                    ? <span className="text-amber-600 font-medium text-xs">Nueva imagen seleccionada ✓</span>
                    : <><span className="font-medium text-gray-600 text-xs">Haz clic para cambiar</span><span className="text-xs text-gray-400">PNG, JPG hasta 5MB</span></>
                  }
                </div>
                <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
              </label>
            </div>

            <button
              type="submit"
              disabled={!(isValid && dirty) || isSubmitting}
              className="w-full py-3 rounded-xl font-semibold text-sm transition-all
                bg-amber-500 text-white hover:bg-amber-600 active:scale-[0.98]
                disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm"
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
