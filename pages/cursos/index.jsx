import React from 'react'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'

const index = () => {
  return (
    <>
      <Navbar />

      <div className="w-[80%] mx-auto ">
        <h2 className="text-2xl font-bold text-gray-500 my-5">Cursos Disponibles</h2>
      </div>

      <Footer/>
    </>
  )
}

export default index
