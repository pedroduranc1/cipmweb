import React, { useEffect } from 'react'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import { useAuth } from '../../hooks/useAuth'

import { Cursocard } from '../../minicomponents/Cursocard'
import Link from 'next/link'
import { useQuery } from 'react-query'
import { Cursos } from "../../db/Cursos";
import { useRouter } from 'next/router'

const cursoCtrl = new Cursos();
const index = () => {

  const { User } = useAuth();
  const router = useRouter();

  const { data: CursosData, isLoading, isError } = useQuery("Cursos", () => cursoCtrl.getCursos())

  useEffect(() => {
    if(!User){
      router.push("/")
    }
  }, [User])
  


  return (
    <>
      <Navbar />

      <div className='relative'>
        <div className="w-[80%] mx-auto ">
          <h2 className="text-2xl font-bold text-gray-500 my-5">Cursos Disponibles</h2>
        </div>


        {
          User?.uid == "YGDmj8LOpmg1ZJIscT9QuH6brCU2" | User?.uid == "a1UMHAwQwDTKL21aKRrCGyAMGtO2" ? (
            <div className='w-full flex flex-wrap justify-center gap-3 '>
              <Link href="/crear-curso" >
                <a className='px-4 py-2 rounded-md bg-gray-600 hover:bg-gray-400 transition-all text-white' >Crear Curso</a>
              </Link>
              <Link href="/agregar-video" >
                <a className='px-4 py-2 rounded-md bg-gray-600 hover:bg-gray-400 transition-all text-white' >Agregar Video</a>
              </Link>
              <Link href="/modificar-video" >
                <a className='px-4 py-2 rounded-md bg-gray-600 hover:bg-gray-400 transition-all text-white' >Modificar Video</a>
              </Link>
              <Link href="/modificar-curso" >
                <a className='px-4 py-2 rounded-md bg-gray-600 hover:bg-gray-400 transition-all text-white' >Modificar Curso</a>
              </Link>
              <Link href="/eliminar-video" >
                <a className='px-4 py-2 rounded-md bg-gray-600 hover:bg-gray-400 transition-all text-white' >Eliminar Video</a>
              </Link>
              <Link href="/eliminar-curso" >
                <a className='px-4 py-2 rounded-md bg-gray-600 hover:bg-gray-400 transition-all text-white' >Eliminar Curso</a>
              </Link>
              <Link href="/activar-cursos" >
                <a className='px-4 py-2 rounded-md bg-gray-600 hover:bg-gray-400 transition-all text-white' >Activar Cursos a Clientes</a>
              </Link>
            </div>
          ) :
          (<></>)
        }

        <div className='w-[80%] mt-[2%] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-y-3 gap-x-4 rounded-lg h-fit '>

          {
            isLoading ? (<>Cargando Cursos..</>) : (<>
              {
                CursosData?.map(curso=>(<Cursocard slug={curso.id} img={curso.ImgUrl} titulo={curso.Titulo} descripcion={curso.Descripcion} precio={curso.precio} />))
              }
            </>)
          }
        </div>

        <div className='pb-[50vh] ' />


        <Footer />
      </div>

    </>
  )
}

export default index
