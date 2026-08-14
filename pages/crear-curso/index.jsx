import React, { useEffect, useState } from 'react'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import { Field, Form, Formik } from 'formik'
import * as Yup from "yup";
import { Cursos } from "../../db/Cursos";
import { uid } from 'uid';
import { toast } from "../../src/components/ui/use-toast";
import { useRouter } from 'next/router';
import { Loader2 } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const cursoCtrl = new Cursos();

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

const CrearCurso = () => {
  const { User, loading } = useAuth()
  const router = useRouter()
  const [ImgCurso, setImgCurso] = useState(null)
  const [previewImg, setPreviewImg] = useState(null)
  const [publicado, setPublicado] = useState(false)

  useEffect(() => {
    if (!loading && !User) router.push('/')
  }, [User, loading])

  const handleImageChange = (e) => {
    const file = e.currentTarget.files[0]
    if (!file) return
    setImgCurso(file)
    setPreviewImg(URL.createObjectURL(file))
  }

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-10 px-4">
        <div className="max-w-lg mx-auto">

          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-600 rounded-2xl mb-4 shadow-lg">
              <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none"
                stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-800">Crear Nuevo Curso</h1>
            <p className="text-sm text-gray-500 mt-1">Completa la información para publicar el curso</p>
          </div>

          <Formik
            initialValues={{ Titulo: '', Descripcion: '', precio: '' }}
            validationSchema={Yup.object({
              Titulo: Yup.string().required("El título es obligatorio"),
              Descripcion: Yup.string().required("La descripción es obligatoria"),
              precio: Yup.number()
                .typeError("Debe ser un número")
                .required("El precio es obligatorio")
                .min(0, "El precio no puede ser negativo"),
            })}
            onSubmit={async (values, { resetForm }) => {
              const Slug = uid(25)
              const dataCurso = {
                ...values,
                precio: Number(values.precio),
                publicado,
                ImgUrl: ImgCurso
                  ? await cursoCtrl.uploadCursoImage(ImgCurso, Slug, Slug)
                  : "",
              }

              const result = await cursoCtrl.createCurso(Slug, dataCurso)

              if (result) {
                toast({ title: "Curso creado exitosamente" })
                resetForm()
                setImgCurso(null)
                setPreviewImg(null)
                router.push("/cursos")
              } else {
                toast({
                  variant: "destructive",
                  title: "Error al crear el curso",
                  description: "Ocurrió un problema al guardar los datos.",
                })
              }
            }}
          >
            {({ errors, touched, isSubmitting, isValid, dirty }) => (
              <Form className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

                {/* Preview imagen */}
                {previewImg && (
                  <div className="relative h-48 bg-gray-100">
                    <img src={previewImg} alt="preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    <button
                      type="button"
                      onClick={() => { setImgCurso(null); setPreviewImg(null) }}
                      className="absolute top-3 right-3 bg-white/90 hover:bg-white text-gray-700 rounded-full px-2 py-1 text-xs font-medium shadow transition-colors"
                    >
                      ✕ Quitar
                    </button>
                  </div>
                )}

                <div className="p-6 flex flex-col gap-5">

                  {/* Título */}
                  <div className="flex flex-col gap-1">
                    <label className="text-sm font-semibold text-gray-700" htmlFor="Titulo">Título del curso</label>
                    <Field id="Titulo" name="Titulo" placeholder="Ej: Diseño de interiores básico"
                      className={fieldClass(errors.Titulo, touched.Titulo)} />
                    <FieldError error={errors.Titulo} touched={touched.Titulo} />
                  </div>

                  {/* Descripción */}
                  <div className="flex flex-col gap-1">
                    <label className="text-sm font-semibold text-gray-700" htmlFor="Descripcion">Descripción</label>
                    <Field as="textarea" id="Descripcion" name="Descripcion" rows={4}
                      placeholder="Describe de qué trata el curso, qué aprenderán los estudiantes..."
                      className={`${fieldClass(errors.Descripcion, touched.Descripcion)} resize-none`} />
                    <FieldError error={errors.Descripcion} touched={touched.Descripcion} />
                  </div>

                  {/* Precio */}
                  <div className="flex flex-col gap-1">
                    <label className="text-sm font-semibold text-gray-700" htmlFor="precio">Precio (USD)</label>
                    <Field id="precio" name="precio" type="number" min="0" step="0.01" placeholder="0.00"
                      className={fieldClass(errors.precio, touched.precio)} />
                    <FieldError error={errors.precio} touched={touched.precio} />
                  </div>

                  {/* Visibilidad */}
                  <div className="flex items-center justify-between p-4 rounded-xl border-2 border-dashed transition-colors
                    border-gray-200 bg-gray-50">
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

                  {/* Miniatura */}
                  <div className="flex flex-col gap-1">
                    <label className="text-sm font-semibold text-gray-700">
                      Miniatura del curso <span className="text-gray-400 font-normal">(opcional)</span>
                    </label>
                    <label className={`flex flex-col items-center justify-center w-full h-28 border-2 border-dashed rounded-lg cursor-pointer transition-colors
                      ${previewImg ? 'border-blue-300 bg-blue-50' : 'border-gray-300 bg-gray-50 hover:bg-gray-100 hover:border-gray-400'}`}>
                      <div className="flex flex-col items-center text-sm">
                        <span className="text-xl mb-1">🖼️</span>
                        {previewImg
                          ? <span className="text-blue-600 font-medium text-xs">Imagen seleccionada ✓</span>
                          : <><span className="font-medium text-gray-600 text-xs">Haz clic para subir</span><span className="text-xs text-gray-400">PNG, JPG hasta 5MB</span></>
                        }
                      </div>
                      <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={!(isValid && dirty) || isSubmitting}
                    className="w-full py-3 rounded-xl font-semibold text-sm transition-all
                      bg-blue-600 text-white hover:bg-blue-700 active:scale-[0.98]
                      disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm"
                  >
                    {isSubmitting
                      ? <><Loader2 size={16} className="animate-spin" /> Creando curso...</>
                      : '✓ Crear Curso'
                    }
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>

      <Footer />
    </>
  )
}

export default CrearCurso
