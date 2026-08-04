import React from 'react'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'

const index = () => {
    return (
        <>
            <Navbar />

            <div className='lg:w-[30%] md:w-[60%] w-[90%] h-fit mt-[5%] py-[1%] bg-white/90 overflow-hidden rounded-md shadow-md mx-auto'>
                <div className='flex justify-center'>
                    <img
                        className='h-14 w-auto sm:h-15'
                        src="/logo.svg"
                        alt="" ></img>
                </div>

                <h2 className='text-2xl font-bold text-center text-gray-600 mt-2'>Adquiere Cursos</h2>
                <p className='text-gray-500 mx-[3%] font-semibold text-justify mt-1'>
                    para poder adquirir nuestros cursos debes ponerte en contacto con nuestro inbox mediante facebook
                </p>

                <p className='mx-[3%] text-gray-500'>
                    Promos Disponibles:
                </p>

                <div className='flex px-[3%] pt-[3%] flex-wrap w-full gap-y-3 justify-between items-center'>
                    <div className='w-full md:w-[30%] hover:border-blue-500 group transition-colors hover:cursor-pointer border-gray-500 border-2 rounded-md p-4'>
                        <h3 className='group-hover:text-blue-500 transition-colors'>1 Curso</h3>

                        <p className='group-hover:text-blue-500 transition-colors'>$500</p>
                    </div>
                    <div className='w-full md:w-[30%] hover:border-blue-500 group transition-colors hover:cursor-pointer border-gray-500 border-2 rounded-md p-4'>
                        <h3 className='group-hover:text-blue-500 transition-colors'>2 Cursos</h3>
                        <p className='group-hover:text-blue-500 transition-colors'>$800</p>
                    </div>
                    <div className='w-full md:w-[30%] hover:border-blue-500 group transition-colors hover:cursor-pointer border-gray-500 border-2 rounded-md p-4'>
                        <h3 className='group-hover:text-blue-500 transition-colors'>3 Cursos</h3>
                        <p className='group-hover:text-blue-500 transition-colors'>$1000</p>
                    </div>
                </div>

                <a target="_blank" className="mx-[3%] text-white hover:bg-blue-400 transition-colors rounded-md py-2 flex justify-center bg-blue-500 mt-10 inline-block " href="https://www.facebook.com/Cursosdeinglesmty?mibextid=2JQ9oc">
                    Contactar con Ventas
                </a>
            </div>

            <div className='pb-[50vh] md:pb-[40vh] ' />
            <div className='relative'>
                <Footer />
            </div>
        </>
    )
}

export default index