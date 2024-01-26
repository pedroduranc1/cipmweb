import React from 'react'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'

const index = () => {
    return (
        <>
            <Navbar />

            <div className='lg:w-[30%] md:w-[60%] w-[90%] h-fit mt-[5%] py-[1%] bg-white/90 overflow-hidden rounded-md shadow-md mx-auto'>
                <h2 className='text-2xl font-bold text-center text-gray-600 mt-2'>Adquiere Cursos</h2>
                <p className='text-gray-500 mx-[3%] font-semibold text-justify'>
                    para poder adquirir nuestros cursos debes ponerte en contacto con nuestro inbox mediante facebook
                </p>

                <p className='mx-[3%] text-gray-500'>
                    Promos Disponibles:
                </p>

                <div className='flex mx-[3%] flex-wrap w-full justify-center items-center'>
                    <div className='w-1/3'>
                        <h3>1 Curso</h3>
                    </div>
                    <div className='w-1/3'>
                        <h3>2 Cursos</h3>
                    </div>
                    <div className='w-1/3'>
                        <h3>3 Cursos</h3>
                    </div>
                </div>
            </div>

            <div className='pb-[40vh] ' />
            <div className='relative'>
                <Footer />
            </div>
        </>
    )
}

export default index