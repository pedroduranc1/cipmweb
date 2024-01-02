import React, { useEffect } from 'react'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import { useAuth } from '../../hooks/useAuth'
import { useRouter } from 'next/router'
import { useToast } from '../../src/components/ui/use-toast'

import Imagen from "../../public/imgvideo.svg";
import { Cursocard } from '../../minicomponents/Cursocard'

const index = () => {

  const { User } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    if (!User?.IsPremium) {
      toast({
        variant: "destructive",
        title: "Debes ser Premium para poder acceder a Cursos",
      })
      router.replace("/")
    }

  }, [User])

  return (
    <>
      <Navbar />

      <div className='relative'>
        <div className="w-[80%] mx-auto ">
          <h2 className="text-2xl font-bold text-gray-500 my-5">Cursos Disponibles</h2>
        </div>

        <div className='w-[80%] mt-[2%] mx-auto flex flex-wrap gap-y-3 gap-x-4 rounded-lg h-fit '>
          {/* Curso Card */}
          <Cursocard slug={"hola"} titulo={"Titulo de prueba"} descripcion={"Lorem ipsum dolor sit amet consectetur adipisicing elit. Sit animi facilis harum minima assumenda ad hic! Illo ab excepturi inventore asperiores. Quisquam, officia. Quae optio, eaque reprehenderit odit tempora eligendi."} />
          <Cursocard slug={"papa"} titulo={"Titulo de prueba 2"} descripcion={"Lorem ipsum dolor sit amet consectetur adipisicing elit. Sit animi facilis harum minima assumenda ad hic! Illo ab excepturi inventore asperiores. Quisquam, officia. Quae optio, eaque reprehenderit odit tempora eligendi."} />
          <Cursocard slug={"cuca"} titulo={"Titulo de prueba"} descripcion={"Lorem ipsum dolor sit amet consectetur adipisicing elit. Sit animi facilis harum minima assumenda ad hic! Illo ab excepturi inventore asperiores. Quisquam, officia. Quae optio, eaque reprehenderit odit tempora eligendi."} />
          <Cursocard slug={"pollo"} titulo={"Titulo de prueba"} descripcion={"Lorem ipsum dolor sit amet consectetur adipisicing elit. Sit animi facilis harum minima assumenda ad hic! Illo ab excepturi inventore asperiores. Quisquam, officia. Quae optio, eaque reprehenderit odit tempora eligendi."} />
          <Cursocard slug={"chicha"} titulo={"Titulo de prueba"} descripcion={"Lorem ipsum dolor sit amet consectetur adipisicing elit. Sit animi facilis harum minima assumenda ad hic! Illo ab excepturi inventore asperiores. Quisquam, officia. Quae optio, eaque reprehenderit odit tempora eligendi."} />
        </div>

        <div className='pb-[50vh] ' />


        <Footer />
      </div>

    </>
  )
}

export default index
