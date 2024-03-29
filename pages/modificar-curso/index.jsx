import React, { useEffect, useState } from 'react'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../../src/components/ui/select";
import { useQuery } from 'react-query';
import { Cursos } from "../../db/Cursos";
import { useRouter } from 'next/router';
import { Field, Form, Formik } from 'formik';
import { toast } from '../../src/components/ui/use-toast';
import * as Yup from "yup";
import { Loader2 } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const cursoCtrl = new Cursos();
const index = () => {
  const {User} = useAuth()

  const [CursoID, setCursoID] = useState(null)

  const router = useRouter()

  useEffect(() => {
    if(!User){
      router.push('/')
    }
  }, [User])

  const { data: DataCursos } = useQuery("cursos", () => cursoCtrl.getCursos())

  return (
    <>
      <Navbar />
      <div className='lg:w-[30%] md:w-[60%] w-[90%] h-fit mt-[5%]  bg-white/90 overflow-hidden rounded-md shadow-md mx-auto'>
        <div className='w-full px-5'>
          <h2 className='text-xl font-bold text-center text-gray-600 mt-2'>Selecciona el Curso</h2>
        </div>
        <div className='w-full flex justify-center'>
          <Select key={1} onValueChange={setCursoID}>
            <SelectTrigger className="w-[80%] my-5">
              <SelectValue placeholder="Selecciona un Curso" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {
                  DataCursos?.map((curso) => (<SelectItem value={curso}>{curso.Titulo}</SelectItem>))
                }
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        {
          CursoID && (<><CursoFormUpdate data={CursoID} /></>)
        }


      </div>
      <div className='pb-[55vh] ' />
      <div className='relative'>
        <Footer />
      </div>
    </>
  )
}

const CursoFormUpdate = ({ data }) => {
  const [ImgCurso, setImgCurso] = useState(null)
  const router = useRouter();
  return (<>
    <Formik
      initialValues={{
        id: data?.id || "",
        Titulo: data?.Titulo || "",
        Descripcion: data?.Descripcion || "",
        ImgUrl: data?.ImgUrl || "",
        precio: data?.precio || null
      }}
      validationSchema={Yup.object({
        Titulo: Yup.string().required("Porfavor. Ingrese un Titulo"),
        Descripcion: Yup.string().required("Porfavor. Ingrese una Descripcion"),
        precio : Yup.number().moreThan(0, 'El número debe ser mayor que 0').required()
      })}
      onSubmit={async (values) => {
        let imagenPrev = data?.ImgUrl ? data?.ImgUrl : ""
        let dataCurso = {
          ...values,
          ImgUrl: ImgCurso
            ? await cursoCtrl.uploadCursoImage(ImgCurso, values.id, values.id)
            : imagenPrev,
        }

        const result = await cursoCtrl.updateCurso(dataCurso.id, dataCurso)

        if (result) {
          // El blog se creó correctamente
          toast({
            title: "Curso Actualizado Exitosamente",
          });

          router.push("/cursos")
        } else {
          // Hubo un error al crear el blog
          toast({
            variant: "destructive",
            title: "Ocurrio un error al actualizar el Curso",
            description:
              "algo paso al monento de registrar los datos suministrados.",
          });
        }
      }}
    >
      {({ errors, touched, isSubmitting, isValid }) => (
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

          <label className="font-bold mt-3 text-gray-600" htmlFor="password">Precio</label>
          <Field
            className={`py-2 w-full ${errors.precio && touched.precio ? "border-red-500" : "border-gray-200"}  border-2 px-2 rounded-md outline-none focus:border-gray-400`}
            name="precio"
            type="number" />
          {errors.precio && touched.precio ? (
            <div>{errors.precio}</div>
          ) : null}

          <label className="font-bold mt-3 text-gray-600" htmlFor="password">Miniatura del Video</label>
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
            type="submit">{isSubmitting ? <div className='w-full h-full flex justify-center items-center'><Loader2 className='animate-spin' /></div> : "Modificar Curso"}</button>
        </Form>
      )}
    </Formik>
  </>)
}

export default index