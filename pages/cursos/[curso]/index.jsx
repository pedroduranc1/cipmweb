import React, { useEffect, useState } from 'react'
import Navbar from "../../../components/Navbar";
import Footer from '../../../components/Footer'
import { useRouter } from 'next/router'
import { Cursocard } from '../../../minicomponents/Cursocard'
import { useQuery } from 'react-query';
import { Cursos } from "../../../db/Cursos";

const cursoCtrl = new Cursos();

const CursoPage = () => {

    const router = useRouter()

    const { curso: CursoID } = router.query

    const { data: CursosData, isLoading: IsLoadingCurso, isError: isErrorCurso } = useQuery(`${CursoID}`, () => cursoCtrl.getCurso(CursoID))
    const { data: VideosData, isLoading: IsLoadingVideos, isError: isErrorVideos } = useQuery("Videos", ()=> cursoCtrl.getVideosCurso(CursoID));


    return (
        <>
            <Navbar />

            <div className='w-[80%] mx-auto'>
                <button onClick={() => { router.back() }}>Volver</button>
            </div>

            <div className='w-[80%] mx-auto flex md:flex-row flex-col'>
                <div className='w-full md:w-1/2 h-full md:h-[50vh] '>
                    <img src="/imgvideo.svg" className='w-full h-full' alt="" />
                </div>
                <div className='w-full md:w-1/2 h-full md:h-[50vh] flex flex-col md:py-[5%] md:px-10'>
                    <h3 className='text-gray-600 mt-5 md:mt-0 text-2xl'>{CursosData?.Titulo}</h3>
                    <p className='text-gray-400 mt-5 mb-5 md:mb-0 text-base'>
                        {CursosData?.Descripcion}
                    </p>
                </div>
            </div>

            <div className='w-[80%] mb-5 mx-auto'>
                <h3 className='text-2xl text-gray-600 font-bold'>Contenido del curso</h3>
            </div>

            <div className='w-[80%] grid grid-cols-3 grid-flow-row gap-4 mx-auto'>
                {
                    VideosData?.map((video)=>(
                        <Cursocard slug={`/${CursoID}/video/${video.id}`} titulo={video.Titulo} descripcion={video.Descripcion} />
                    ))
                }
            </div>

            <div className='pb-[50vh] ' />

            <div className='relative'>
                <Footer />

            </div>

        </>
    )
}

export default CursoPage