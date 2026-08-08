import React, { useEffect, useState } from 'react'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import { Cursos } from "../../db/Cursos";
import { useQuery, useQueryClient } from 'react-query';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../src/components/ui/select";
import { Field, Form, Formik } from 'formik';
import * as Yup from "yup";
import { useRouter } from 'next/router';
import { uid } from 'uid';
import { toast } from '../../src/components/ui/use-toast';
import { Timestamp } from 'firebase/firestore';
import { AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const cursoCtrl = new Cursos();

const TIPO_VIDEO = {
  CURSO: 'curso',
  SOLITARIO: 'solitario',
}

const fieldClass = (error, touched) =>
  `w-full px-3 py-2.5 rounded-lg border-2 outline-none text-sm transition-colors ${
    error && touched
      ? 'border-red-400 bg-red-50 focus:border-red-500'
      : 'border-gray-200 bg-gray-50 focus:border-blue-400 focus:bg-white'
  }`

const FieldError = ({ error, touched }) =>
  error && touched ? (
    <p className="text-xs text-red-500 mt-0.5">⚠ {error}</p>
  ) : null

const AgregarVideo = () => {
  const { User, loading } = useAuth()
  const router = useRouter()
  const queryClient = useQueryClient()

  const [tipoVideo, setTipoVideo] = useState(null)
  const [CursoID, setCursoID] = useState(null)
  const [ImgVideo, setImgVideo] = useState(null)
  const [previewImg, setPreviewImg] = useState(null)

  useEffect(() => {
    if (!loading && !User) router.push('/')
  }, [User, loading])

  const { data: DataCursos, isLoading: loadingCursos, isError: errorCursos } = useQuery("cursos", () => cursoCtrl.getCursos())

  const { data: VideosCurso } = useQuery(
    ["videos-curso", CursoID],
    () => cursoCtrl.getVideosCurso(CursoID),
    { enabled: !!CursoID }
  )

  const handleImageChange = (e) => {
    const file = e.currentTarget.files[0]
    if (!file) return
    setImgVideo(file)
    setPreviewImg(URL.createObjectURL(file))
  }

  const validationSchema = Yup.object({
    Titulo: Yup.string().required("El título es obligatorio"),
    Descripcion: Yup.string().required("La descripción es obligatoria"),
    VideoUrl: Yup.string().url("Debe ser una URL válida").required("La URL del video es obligatoria"),
    ...(tipoVideo === TIPO_VIDEO.CURSO && {
      orden: Yup.number()
        .typeError("Debe ser un número")
        .required("El orden es obligatorio")
        .min(1, "El orden mínimo es 1")
        .integer("Debe ser un número entero"),
    }),
  })

  const cursosOrdenados = DataCursos
    ? [...DataCursos].sort((a, b) => a.Titulo?.localeCompare(b.Titulo))
    : []

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-10 px-4">
        <div className="max-w-lg mx-auto">

          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-600 rounded-2xl mb-4 shadow-lg">
              <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-800">Agregar Video</h1>
            <p className="text-sm text-gray-500 mt-1">Selecciona el tipo de video antes de continuar</p>
          </div>

          {/* Selector tipo de video */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <button
              type="button"
              onClick={() => { setTipoVideo(TIPO_VIDEO.CURSO); setCursoID(null) }}
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
              onClick={() => { setTipoVideo(TIPO_VIDEO.SOLITARIO); setCursoID(null) }}
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

          {/* Selector de curso */}
          {tipoVideo === TIPO_VIDEO.CURSO && (
            <div className="mb-6 bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <label className="text-sm font-semibold text-gray-700 mb-2 block">
                Selecciona el curso
              </label>

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
                  <Select onValueChange={setCursoID} value={CursoID}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Elige un curso..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {cursosOrdenados.map((curso) => (
                          <SelectItem key={curso.id} value={curso.id}>
                            {curso.Titulo}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  {!CursoID && (
                    <p className="text-xs text-amber-600 mt-2">⚠ Debes seleccionar un curso para continuar</p>
                  )}
                </>
              )}
            </div>
          )}

          {/* Formulario */}
          {tipoVideo && (tipoVideo === TIPO_VIDEO.SOLITARIO || CursoID) && (
            <Formik
              key={`${tipoVideo}-${CursoID}`}
              initialValues={{ Titulo: '', Descripcion: '', VideoUrl: '', orden: '' }}
              validationSchema={validationSchema}
              onSubmit={async (values, { resetForm }) => {
                const Slug = uid(25)
                const dataCurso = {
                  Titulo: values.Titulo,
                  Descripcion: values.Descripcion,
                  VideoUrl: values.VideoUrl,
                  ImgUrl: ImgVideo
                    ? await cursoCtrl.uploadCursoImage(ImgVideo, Slug, Slug)
                    : "",
                  tipo: tipoVideo,
                  Fecha: Timestamp.now(),
                  ...(tipoVideo === TIPO_VIDEO.CURSO && {
                    CursoID,
                    orden: Number(values.orden),
                  }),
                }

                const result = await cursoCtrl.createVideoCurso(Slug, dataCurso)

                if (result) {
                  toast({ title: "Video agregado exitosamente" })
                  queryClient.invalidateQueries("cursos")
                  if (CursoID) queryClient.invalidateQueries(["videos-curso", CursoID])
                  resetForm()
                  setImgVideo(null)
                  setPreviewImg(null)
                  router.push("/cursos")
                } else {
                  toast({
                    variant: "destructive",
                    title: "Error al agregar el video",
                    description: "Ocurrió un problema al guardar los datos.",
                  })
                }
              }}
            >
              {({ errors, touched, isSubmitting, isValid, dirty }) => (
                <Form className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

                  {/* Badge tipo activo */}
                  <div className={`px-5 py-3 text-sm font-medium border-b flex items-center gap-2
                    ${tipoVideo === TIPO_VIDEO.CURSO
                      ? 'bg-blue-50 text-blue-700 border-blue-100'
                      : 'bg-purple-50 text-purple-700 border-purple-100'}`}>
                    {tipoVideo === TIPO_VIDEO.CURSO
                      ? <>📚 Video del curso: <span className="font-bold">{cursosOrdenados.find(c => c.id === CursoID)?.Titulo}</span></>
                      : <>🎬 Video solitario — sin curso asociado</>
                    }
                  </div>

                  {/* Preview miniatura */}
                  {previewImg && (
                    <div className="relative h-44 bg-gray-100">
                      <img src={previewImg} alt="preview" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                      <button
                        type="button"
                        onClick={() => { setImgVideo(null); setPreviewImg(null) }}
                        className="absolute top-3 right-3 bg-white/90 hover:bg-white text-gray-700 rounded-full px-2 py-1 text-xs font-medium shadow transition-colors"
                      >
                        ✕ Quitar
                      </button>
                    </div>
                  )}

                  <div className="p-6 flex flex-col gap-5">

                    {/* Título */}
                    <div className="flex flex-col gap-1">
                      <label className="text-sm font-semibold text-gray-700" htmlFor="Titulo">Título del video</label>
                      <Field id="Titulo" name="Titulo" placeholder="Ej: Introducción al módulo 1"
                        className={fieldClass(errors.Titulo, touched.Titulo)} />
                      <FieldError error={errors.Titulo} touched={touched.Titulo} />
                    </div>

                    {/* Descripción */}
                    <div className="flex flex-col gap-1">
                      <label className="text-sm font-semibold text-gray-700" htmlFor="Descripcion">Descripción</label>
                      <Field as="textarea" id="Descripcion" name="Descripcion" rows={3}
                        placeholder="¿Qué se verá en este video?"
                        className={`${fieldClass(errors.Descripcion, touched.Descripcion)} resize-none`} />
                      <FieldError error={errors.Descripcion} touched={touched.Descripcion} />
                    </div>

                    {/* URL del video */}
                    <div className="flex flex-col gap-1">
                      <label className="text-sm font-semibold text-gray-700" htmlFor="VideoUrl">URL del video</label>
                      <p className="text-xs text-gray-400 -mt-0.5">Pega la URL de YouTube, Vimeo u otro proveedor</p>
                      <Field id="VideoUrl" name="VideoUrl" type="url" placeholder="https://..."
                        className={fieldClass(errors.VideoUrl, touched.VideoUrl)} />
                      <FieldError error={errors.VideoUrl} touched={touched.VideoUrl} />
                    </div>

                    {/* Orden — solo para videos de curso */}
                    {tipoVideo === TIPO_VIDEO.CURSO && (
                      <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold text-gray-700" htmlFor="orden">Orden en el curso</label>
                        <p className="text-xs text-gray-400 -mt-1">Define en qué posición aparece este video dentro del curso</p>

                        {/* Videos actuales del curso */}
                        {VideosCurso && VideosCurso.length > 0 && (
                          <div className="bg-gray-50 border border-gray-200 rounded-lg overflow-hidden">
                            <p className="text-xs font-semibold text-gray-500 px-3 py-2 border-b border-gray-200 bg-gray-100 uppercase tracking-wide">
                              Videos actuales ({VideosCurso.length})
                            </p>
                            <div className="divide-y divide-gray-100 max-h-48 overflow-y-auto">
                              {VideosCurso.map((v) => (
                                <div key={v.id} className="flex items-center gap-3 px-3 py-2">
                                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-bold shrink-0">
                                    {v.orden ?? '?'}
                                  </span>
                                  <span className="text-sm text-gray-700 truncate">{v.Titulo}</span>
                                </div>
                              ))}
                            </div>
                            <p className="text-xs text-gray-400 px-3 py-2 border-t border-gray-100">
                              Siguiente disponible: <span className="font-semibold text-blue-600">{VideosCurso.length + 1}</span>
                            </p>
                          </div>
                        )}

                        {VideosCurso && VideosCurso.length === 0 && (
                          <div className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-3 text-xs text-gray-400 text-center">
                            Este curso aún no tiene videos — este será el primero
                          </div>
                        )}

                        <Field id="orden" name="orden" type="number" min="1"
                          placeholder={VideosCurso ? `Siguiente sugerido: ${(VideosCurso.length ?? 0) + 1}` : "Ej: 1, 2, 3..."}
                          className={fieldClass(errors.orden, touched.orden)} />
                        <FieldError error={errors.orden} touched={touched.orden} />
                      </div>
                    )}

                    {/* Upload miniatura */}
                    <div className="flex flex-col gap-1">
                      <label className="text-sm font-semibold text-gray-700">Miniatura del video <span className="text-gray-400 font-normal">(opcional)</span></label>
                      <label className={`flex flex-col items-center justify-center w-full h-24 border-2 border-dashed rounded-lg cursor-pointer transition-colors
                        ${previewImg ? 'border-blue-300 bg-blue-50' : 'border-gray-300 bg-gray-50 hover:bg-gray-100 hover:border-gray-400'}`}>
                        <div className="flex flex-col items-center text-sm">
                          <span className="text-lg mb-1">🖼️</span>
                          {previewImg
                            ? <span className="text-blue-600 font-medium text-xs">Imagen seleccionada ✓</span>
                            : <><span className="font-medium text-gray-600 text-xs">Haz clic para subir</span><span className="text-xs text-gray-400">PNG, JPG</span></>
                          }
                        </div>
                        <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                      </label>
                    </div>

                    <button
                      type="submit"
                      disabled={!(isValid && dirty) || isSubmitting}
                      className={`w-full py-3 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 shadow-sm
                        disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98]
                        ${tipoVideo === TIPO_VIDEO.CURSO
                          ? 'bg-blue-600 hover:bg-blue-700 text-white'
                          : 'bg-purple-600 hover:bg-purple-700 text-white'}`}
                    >
                      {isSubmitting
                        ? <><Loader2 size={16} className="animate-spin" /> Guardando video...</>
                        : '✓ Agregar Video'
                      }
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          )}

        </div>
      </div>

      <Footer />
    </>
  )
}

export default AgregarVideo
