import React from 'react'
import Link from 'next/link'

export const Services = () => {
  return (
    <div className='bg-blue-600 w-full'>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col justify-between items-center py-6 md:justify-start md:space-x-10">
          <h1 className='text-center text-white font-bold text-3xl py-6'>Nuestros Servicios</h1>

          <div className='w-full flex items-center space-y-10 flex-col md:flex-row my-8 justify-around'>
            <div className='flex flex-col justify-center'>
              <img src="/clasesindividuales.svg" layout='fill' className='h-24' alt="" ></img>
              <h1 className='font-semibold mt-5 text-2xl text-center text-white'>Clases individuales</h1>
            </div>
            <div className='flex flex-col justify-center'>
              <img src="/clasesgrupales.svg" layout='fill' className='h-24' alt="" ></img>
              <h1 className='font-semibold mt-5 text-2xl text-center text-white'>Clases grupales</h1>
            </div>
            <div className='flex flex-col justify-center'>
              <img src="/clasessuperrapidas.svg" layout='fill' className='h-24' alt="" ></img>
              <h1 className='font-semibold mt-5 text-center text-2xl text-white'>Clases super <br /> intensivas</h1>
            </div>
            <div className='flex flex-col justify-center'>
              <img src="/appingles.svg" layout='fill' className='h-24' alt="" ></img>
              <h1 className='font-semibold mt-5 text-2xl text-center text-white'>App para <br /> aprender ingles</h1>
            </div>
            <div className='flex flex-col justify-center'>
              <img src="/clasespregrab.svg" layout='fill' className='h-24' alt="" ></img>
              <h1 className='font-semibold mt-5 text-2xl text-center text-white'>Clases pre-grabadas</h1>
            </div>
          </div>

          <div className='flex justify-center my-8'>
            <Link href="/">
              <a className='bg-yellow-500 text-gray-800 cursor-pointer font-semibold rounded-lg px-8 py-4'>Obtener info</a>
            </Link>

          </div>
        </div>
      </div>
    </div>

  )
}
