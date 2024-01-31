import React, { useEffect, useState } from 'react'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import { Field, Form, Formik, useFormik } from 'formik'
import * as Yup from "yup";
import { Cursos } from "../../db/Cursos";
import { uid } from 'uid';
import { toast } from "../../src/components/ui/use-toast";
import { useRouter } from 'next/router';
import { Loader2 } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const cursoCtrl = new Cursos();
const index = () => {
  const {User} = useAuth()

  const [ImgCurso, setImgCurso] = useState(false)

  useEffect(() => {
    if(!User){
      router.push('/')
    }
  }, [User])

  const formik = useFormik({});

  const router = useRouter();

  return (
    <>
      <Navbar />


      <Formik
        initialValues={{
          Titulo: '',
          Descripcion: '',
          precio: null,
        }}
        validationSchema={Yup.object({
          Titulo: Yup.string().required("Porfavor. Ingrese un Titulo"),
          Descripcion: Yup.string().required("Porfavor. Ingrese una Descripcion"),
          precio: Yup.number().required("Porfavor. agrega un precio para el curso")
        })}
        onSubmit={async (values) => {
          const Slug = uid(25);
          let dataCurso = {
            ...values,
            ImgUrl: ImgCurso
              ? await cursoCtrl.uploadCursoImage(ImgCurso, Slug, Slug)
              : "",
          }

          const result = await cursoCtrl.createCurso(Slug, dataCurso);

          if (result) {
            // El blog se creó correctamente
            toast({
              title: "Curso Creado Exitosamente",
            });


            formik.resetForm();

            router.push("/cursos")
          } else {
            // Hubo un error al crear el blog
            toast({
              variant: "destructive",
              title: "Ocurrio un error al subir el Curso",
              description:
                "algo paso al monento de registrar los datos suministrados.",
            });
          }
        }}
      >
        {({ errors, touched,isSubmitting,isValid }) => (
          <Form className="flex flex-col lg:w-[30%] md:w-[60%] w-[90%] mt-10 mx-auto bg-white/70 p-5 shadow-md h-full ">
            <label className="font-bold text-gray-600" htmlFor="Titulo">Titulo</label>
            <Field className={`py-2 w-full ${errors.Titulo && touched.Titulo ? "border-red-500" : "border-gray-200"}  border-2 px-2 rounded-md outline-none focus:border-gray-400`} name="Titulo" />
            {errors.Titulo && touched.Titulo ? (
              <div>{errors.Titulo}</div>
            ) : null}

            <label className="font-bold mt-3 text-gray-600" htmlFor="password">Descripcion</label>
            <Field
              className={`py-2 w-full ${errors.Descripcion && touched.Descripcion ? "border-red-500" : "border-gray-200"}  border-2 px-2 rounded-md outline-none focus:border-gray-400`}
              name="Descripcion"
              type="text" />
            {errors.Descripcion && touched.Descripcion ? (
              <div>{errors.Descripcion}</div>
            ) : null}

            <label className="font-bold mt-3 text-gray-600" htmlFor="password">Precio</label>
            <Field
              className={`py-2 w-full ${errors.precio && touched.precio ? "border-red-500" : "border-gray-200"}  border-2 px-2 rounded-md outline-none focus:border-gray-400`}
              name="precio"
              type="number" />
            {errors.precio && touched.precio ? (
              <div>{errors.precio}</div>
            ) : null}

            <label className="font-bold mt-3 text-gray-600" htmlFor="password">Miniatura del Curso</label>
            <Field
              className={`py-2 w-full ${errors.Descripcion && touched.Descripcion ? "border-red-500" : "border-gray-200"}  border-2 px-2 rounded-md outline-none focus:border-gray-400`}
              name="imgCurso"
              type="file"
              onChange={(event) => {
                setImgCurso(event.currentTarget.files[0]);
              }}
            />

            <button 
            disabled={isValid || isSubmitting ? false : true} 
            className="py-2 px-4 mt-5 disabled:opacity-20 transition-colors bg-blue-500 
            rounded-md text-white hover:bg-blue-300 " 
            type="submit">{isSubmitting ? <div className='w-full h-full flex justify-center items-center'><Loader2 className='animate-spin'/></div> : "Crear Curso"}</button>

          </Form>
        )}
      </Formik>

      <div className='pb-[50vh] ' />
      <div className='relative'>
        <Footer />
      </div>
    </>
  )
}

export default index