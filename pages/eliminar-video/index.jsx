import React, { useEffect, useState } from 'react'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import { Cursos } from '../../db/Cursos';
import { useQuery } from 'react-query';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '../../src/components/ui/select';
import { useFormik } from 'formik';
import { toast } from '../../src/components/ui/use-toast';
import { useRouter } from 'next/router';
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
          <h2 className='text-xl font-bold text-center text-gray-600 mt-2'>Selecciona el Curso donde esta el video</h2>
        </div>
        <div className='w-full flex justify-center'>
          <Select key={1} onValueChange={setCursoID}>
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
          CursoID && (<><CursoSelect cursoID={CursoID} /></>)
        }


      </div>

      <div className='pb-[55vh] ' />
      <div className='relative'>
        <Footer />
      </div>
    </>
  )
}

const CursoSelect = ({ cursoID }) => {
  const [VideoData, setVideoData] = useState(null)
  const { data: DataVideosCurso } = useQuery(`${cursoID}`, () => cursoCtrl.getVideosCurso(cursoID))

  const handleVideoData = (data) => {
    setVideoData(data)
  }

  const router = useRouter();

  const formik = useFormik({
    initialValues: {},
    validateOnChange: false,
    onSubmit: async () => {

      const result = await cursoCtrl.deleteVideo(VideoData)

      if (result) {
        // El blog se creó correctamente
        toast({
          title: "Video Eliminado Exitosamente",
        });

        router.push("/cursos")
      } else {
        // Hubo un error al crear el blog
        toast({
          variant: "destructive",
          title: "Ocurrio un error al Eliminar el Video",
          description:
            "algo paso al monento de registrar los datos suministrados.",
        });
      }
    }
  })

  return (
    <>
      {
        DataVideosCurso?.length > 0 && (<>
          <div className='w-full px-5'>
            <h2 className='text-xl font-bold text-center text-gray-600 mt-2'>Selecciona el Video</h2>
          </div>
          <div className='w-full flex justify-center'>
            <Select key={1} onValueChange={handleVideoData}>
              <SelectTrigger className="w-[80%] my-5">
                <SelectValue placeholder="Selecciona un Curso" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {
                    DataVideosCurso?.map((curso) => (<SelectItem value={curso}>{curso.Titulo}</SelectItem>))
                  }
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          {
            VideoData && (
              <form
                onSubmit={formik.handleSubmit}
                className='w-full flex justify-center mb-5'>
                <button
                  disabled={formik.isValid || formik.isSubmitting ? false : true}
                  className="py-2 px-4 mt-5 disabled:opacity-20 transition-colors bg-red-500 
            rounded-md text-white hover:bg-red-300 "
                  type="submit">{formik.isSubmitting ? <div className='w-full h-full flex justify-center items-center'><Loader2 className='animate-spin' /></div> : "Eliminar Video"}</button>
              </form>)
          }

        </>)
      }

    </>)
}


export default index