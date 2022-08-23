import React from 'react'

export const Heros = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6">
      <div className="flex flex-col sm:flex-row justify-between items-center border-b-2 border-gray-100 py-6 md:justify-start md:space-x-10">
        <div className="flex flex-col w-full sm:w-1/2 justify-start ">
            <h1 className='lg:text-6xl text-center sm:text-start md:text-5xl text-3xl font-semibold text-gray-700'>
              Una forma diferente <br/> De aprender ingles
            </h1>
            <p className='mt-6 text-center sm:text-start lg:text-2xl md:text-lg text-md text-gray-700'>
            La práctica hace al maestro, deja de aprender <br /> 
            con personas que usan vocabulario confuso y <br />
            obtén nuestra app
            </p>

            <div className='flex items-center justify-center cursor-pointer sm:justify-start mt-12'
              onClick={() => window.location.href = 'https://play.google.com/store/apps/details?id=com.leal.cipm_testing&hl=en_US&gl=US'}
            >
              <a className='bg-yellow-400 px-7 py-5 rounded-2xl font-semibold'>Obtener la app</a>
              <img src="/playstore.svg" layout='fill' className='h-14 ml-10 w-auto sm:h-10 ' alt="" ></img>
            </div>
        </div>
        <div className="flex justify-start w-full sm:w-1/2 ">
          <img src="/herosimg.svg" layout='fill' className="my-14" alt="" ></img>
        </div>
      </div>
    </div>
  )
}
