import React, { useEffect, useMemo, useState } from 'react'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import { useQuery, useQueryClient } from 'react-query';
import { Cursos } from "../../db/Cursos";
import { useRouter } from 'next/router';
import { Field, Form, Formik } from 'formik';
import { toast } from '../../src/components/ui/use-toast';
import * as Yup from "yup";
import { AlertCircle, Loader2, Search, X } from 'lucide-react';
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

const ModificarCurso = () => {
  const { User, loading } = useAuth()
  const router = useRouter()
  const queryClient = useQueryClient()
  const [CursoSeleccionado, setCursoSeleccionado] = useState(null)
  const [search, setSearch] = useState('')

  useEffect(() => {
    if (!loading && !User) router.push('/')
  }, [User, loading])

  const { data: DataCursos, isLoading: loadingCursos, isError: errorCursos } = useQuery(
    "cursos-admin",
    () => cursoCtrl.getCursos(true)
  )

  const cursosOrdenados = useMemo(() =>
    DataCursos ? [...DataCursos].sort((a, b) => a.Titulo?.localeCompare(b.Titulo)) : []
  , [DataCursos])

  const cursosFiltrados = useMemo(() => {
    const term = search.trim().toLowerCase()
    if (!term) return cursosOrdenados
    return cursosOrdenados.filter(c => c.Titulo?.toLowerCase().includes(term))
  }, [cursosOrdenados, search])

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
            <h1 className="text-2xl font-bold text-gray-800">Modificar Curso</h1>
            <p className="text-sm text-gray-500 mt-1">Selecciona el curso que deseas editar</p>
          </div>

          {/* Selector de curso */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-6">
            <div className="flex items-center gap-2 mb-3">
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-500 text-white text-xs font-bold">1</span>
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
                    value={search}
                    onChange={e => { setSearch(e.target.value); setCursoSeleccionado(null) }}
                    placeholder="Buscar curso por título..."
                    className="w-full pl-9 pr-9 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400/30 focus:border-amber-400 transition-colors"
                  />
                  {search && (
                    <button
                      type="button"
                      onClick={() => { setSearch(''); setCursoSeleccionado(null) }}
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
                          onClick={() => setCursoSeleccionado(curso)}
                          className={`w-full flex items-center gap-3 px-3 py-2.5 text-left transition-colors
                            ${CursoSeleccionado?.id === curso.id
                              ? 'bg-amber-50 border-l-2 border-amber-400'
                              : 'hover:bg-gray-50'}`}
                        >
                          <div className="flex flex-col min-w-0 flex-1">
                            <span className="text-sm text-gray-800 font-medium truncate">{curso.Titulo}</span>
                            {curso.Descripcion && (
                              <span className="text-xs text-gray-400 truncate">{curso.Descripcion}</span>
                            )}
                          </div>
                          {curso.publicado === false && (
                            <span className="text-xs bg-amber-100 text-amber-600 px-2 py-0.5 rounded-full font-semibold shrink-0">
                              No publicado
                            </span>
                          )}
                          {CursoSeleccionado?.id === curso.id && (
                            <span className="text-amber-500 text-xs font-semibold shrink-0">Seleccionado</span>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Formulario de edición */}
          {CursoSeleccionado && (
            <CursoFormUpdate
              key={CursoSeleccionado.id}
              data={CursoSeleccionado}
              onSuccess={() => {
                queryClient.invalidateQueries("cursos-admin")
                queryClient.invalidateQueries(["Cursos", true])
                queryClient.invalidateQueries(["Cursos", false])
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

const CursoFormUpdate = ({ data, onSuccess }) => {
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
        ImgUrl: data?.ImgUrl || "",
        precio: data?.precio || "",
      }}
      validationSchema={Yup.object({
        Titulo: Yup.string().required("El título es obligatorio"),
        Descripcion: Yup.string().required("La descripción es obligatoria"),
        precio: Yup.number().typeError("Debe ser un número").moreThan(0, "El precio debe ser mayor que 0").required("El precio es obligatorio"),
      })}
      onSubmit={async (values) => {
        const dataCurso = {
          ...values,
          publicado,
          ImgUrl: ImgCurso
            ? await cursoCtrl.uploadCursoImage(ImgCurso, values.id, values.id)
            : data?.ImgUrl || "",
        }

        const result = await cursoCtrl.updateCurso(dataCurso.id, dataCurso)

        if (result) {
          toast({ title: "Curso actualizado exitosamente" })
          onSuccess()
        } else {
          toast({
            variant: "destructive",
            title: "Error al actualizar el curso",
            description: "Ocurrió un problema al guardar los datos.",
          })
        }
      }}
    >
      {({ errors, touched, isSubmitting, isValid, dirty }) => (
        <Form className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

          <div className="px-5 py-3 bg-amber-50 text-amber-700 border-b border-amber-100 text-sm font-medium flex items-center gap-2">
            ✏️ Editando: <span className="font-bold truncate">{data.Titulo}</span>
          </div>

          {previewImg && (
            <div className="relative h-48 bg-gray-100">
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
              <label className="text-sm font-semibold text-gray-700" htmlFor="Titulo">Título del curso</label>
              <Field id="Titulo" name="Titulo" className={fieldClass(errors.Titulo, touched.Titulo)} />
              <FieldError error={errors.Titulo} touched={touched.Titulo} />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-gray-700" htmlFor="Descripcion">Descripción</label>
              <Field as="textarea" id="Descripcion" name="Descripcion" rows={4}
                className={`${fieldClass(errors.Descripcion, touched.Descripcion)} resize-none`} />
              <FieldError error={errors.Descripcion} touched={touched.Descripcion} />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-gray-700" htmlFor="precio">Precio (USD)</label>
              <Field id="precio" name="precio" type="number" min="0" step="0.01"
                className={fieldClass(errors.precio, touched.precio)} />
              <FieldError error={errors.precio} touched={touched.precio} />
            </div>

            {/* Visibilidad */}
            <div className="flex items-center justify-between p-4 rounded-xl border-2 border-dashed transition-colors border-gray-200 bg-gray-50">
              <div>
                <p className="text-sm font-semibold text-gray-700">Visible al público</p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {publicado ? 'El curso aparecerá en la lista de cursos' : 'Solo visible para administradores (modo prueba)'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setPublicado(p => !p)}
                className={`relative inline-flex h-6 w-11 shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 cursor-pointer
                  ${publicado ? 'bg-blue-600' : 'bg-gray-300'}`}
              >
                <span className={`inline-block h-5 w-5 rounded-full bg-white shadow transform transition-transform duration-200
                  ${publicado ? 'translate-x-5' : 'translate-x-0'}`} />
              </button>
            </div>

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

export default ModificarCurso
