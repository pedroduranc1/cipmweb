import React, { useEffect, useState } from 'react'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'

import { Cursos } from "../../db/Cursos";
import { useQuery } from 'react-query';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../../src/components/ui/select";
import { Field, Form, Formik, useFormik } from 'formik';
import * as Yup from "yup";
import { useRouter } from 'next/router';
import { uid } from 'uid';
import { toast } from '../../src/components/ui/use-toast';
import { Timestamp } from 'firebase/firestore';
import { Loader2 } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const cursoCtrl = new Cursos();
const index = () => {

  const {User} = useAuth()

  const [ImgCurso, setImgCurso] = useState(false)
  const [CursoID, setCursoID] = useState(null)

  const router = useRouter();


  useEffect(() => {
    if(!User){
      router.push('/')
    }
  }, [User])

  const { data: DataCursos } = useQuery("cursos", () => cursoCtrl.getCursos())

  const formik = useFormik({});


  return (
    <>
      <Navbar />

      <div className='lg:w-[30%] md:w-[60%] w-[90%] h-fit mt-[5%] bg-white/90 overflow-hidden rounded-md shadow-md mx-auto'>
        <h2 className='text-2xl font-bold text-center text-gray-600 mt-2'>Agregar Videos al Curso</h2>

        <div className='w-full flex justify-center'>
          <Select onValueChange={setCursoID}>
            <SelectTrigger className="w-[80%] my-5">
              <SelectValue placeholder="Selecciona un Curso" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {
                  DataCursos?.map((curso) => (<SelectItem value={curso.id}>{curso.Titulo}</SelectItem>))
                }

              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        {
          CursoID && (<Formik
            initialValues={{
              Titulo: '',
              Descripcion: '',
            }}
            validationSchema={Yup.object({
              Titulo: Yup.string().required("Porfavor. Ingrese un Titulo"),
              Descripcion: Yup.string().required("Porfavor. Ingrese una Descripcion")
            })}
            onSubmit={async (values) => {
              const Slug = uid(25);
              let dataCurso = {
                ...values,
                ImgUrl: ImgCurso
                  ? await cursoCtrl.uploadCursoImage(ImgCurso, Slug, Slug)
                  : "",
                CursoID: CursoID,
                Fecha: Timestamp.now()
              }


              const result = await cursoCtrl.createVideoCurso(Slug, dataCurso);

              if (result) {
                // El blog se creó correctamente
                toast({
                  title: "Video Agregado Exitosamente",
                });


                formik.resetForm();

                router.push("/cursos")
              } else {
                // Hubo un error al crear el blog
                toast({
                  variant: "destructive",
                  title: "Ocurrio un error al subir el Video",
                  description:
                    "algo paso al monento de registrar los datos suministrados.",
                });
              }

            }}
          >
            {({ errors, touched, isValid, isSubmitting }) => (
              <Form className="flex flex-col w-full mt-3 bg-white/70 p-5 shadow-md h-full ">
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

                <label className="font-bold mt-3 text-gray-600" htmlFor="VideoUrl">Url del Video</label>
                <Field
                  className={`py-2 w-full ${errors.VideoUrl && touched.VideoUrl ? "border-red-500" : "border-gray-200"}  border-2 px-2 rounded-md outline-none focus:border-gray-400`}
                  name="VideoUrl"
                  type="text" />
                {errors.VideoUrl && touched.VideoUrl ? (
                  <div>{errors.VideoUrl}</div>
                ) : null}

                <label className="font-bold mt-3 text-gray-600" htmlFor="password">Miniatura del Video</label>
                <Field
                  className={`py-2 w-full  border-2 px-2 rounded-md outline-none focus:border-gray-400`}
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
                  type="submit">{isSubmitting ? <div className='w-full h-full flex justify-center items-center'><Loader2 className='animate-spin' /></div> : "Agregar Video"}</button>
              </Form>
            )}
          </Formik>)
        }


      </div>

      <div className='pb-[40vh] ' />
      <div className='relative'>
        <Footer />
      </div>
    </>
  )
}

export default index