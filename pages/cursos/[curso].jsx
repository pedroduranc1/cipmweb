import React from 'react'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import { useRouter } from 'next/router'
import { Cursocard } from '../../minicomponents/Cursocard'

const CursoPage = () => {

    const router = useRouter()

    const { curso } = router.query

    return (
        <>
            <Navbar />

            <div className='w-[80%] mx-auto'>
                <h2>Slug: {curso}</h2>
            </div>

            <div className='w-[80%] mx-auto flex md:flex-row flex-col'>
                <div className='w-full md:w-1/2 h-full md:h-[50vh] '>
                    <img src="/imgvideo.svg" className='w-full h-full' alt="" />
                </div>
                <div className='w-full md:w-1/2 h-full md:h-[50vh] flex flex-col md:py-[5%] md:px-10'>
                    <h3 className='text-gray-600 mt-5 md:mt-0 text-2xl'>Aprende un nuevo idioma wayu</h3>
                    <p className='text-gray-400 mt-5 mb-5 md:mb-0 text-base'>
                        Lorem, ipsum dolor sit amet consectetur adipisicing elit. Doloremque aliquid saepe quas non nobis, expedita minima, velit quos, ipsum obcaecati natus! Iure vero ex qui porro, iste facere animi tempore.
                    </p>
                </div>
            </div>

            <div className='w-[80%] mb-5 mx-auto'>
                <h3 className='text-2xl text-gray-600 font-bold'>Contenido del curso</h3>
            </div>

            <div className='w-[80%] flex gap-4 flex-wrap mx-auto'>

                <Cursocard slug={'prueba'} titulo={"clase 1. prueba"} descripcion={"algo"} />
                <Cursocard slug={'prueba'} titulo={"clase 1. prueba"} descripcion={"algo"} />
                <Cursocard slug={'prueba'} titulo={"clase 1. prueba"} descripcion={"algo"} />
                <Cursocard slug={'prueba'} titulo={"clase 1. prueba"} descripcion={"algo"} />
            </div>

            <div className='pb-[50vh] ' />

            <div className='relative'>
                <Footer />

            </div>

        </>
    )
}

export default CursoPage