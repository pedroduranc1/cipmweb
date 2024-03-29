import React, { useEffect } from 'react'
import Navbar from '../../../../../components/Navbar'
import Footer from '../../../../../components/Footer'
import { useRouter } from 'next/router'

import ReactPlayer from 'react-player'
import { useQuery } from 'react-query'
import { Cursos } from "../../../../../db/Cursos";
import { useAuth } from '../../../../../hooks/useAuth'
import { Undo2 } from 'lucide-react'

const cursoCtrl = new Cursos();
const VideoPage = () => {
    const { User } = useAuth()
    const router = useRouter()

    useEffect(() => {
        if (!User) {
            router.push("/")
        }
    }, [User])


    const { video } = router.query

    const { data: videoData, isLoading, isError } = useQuery(`${video}`, () => cursoCtrl.getVideo(video))

    return (
        <>
            <Navbar />

            <div className='w-[80%] my-[1%] mx-auto'>
                <button className='flex items-center justify-center text-gray-400 gap-x-2 cursor-pointer' onClick={() => { router.back() }}><Undo2 className='text-gray-400' /> Volver</button>
            </div>

            <div className='w-[80%] flex md:flex-row flex-col mx-auto'>
                <div className='md:w-fit w-full  flex  h-full md:h-[50vh]'>
                    <ReactPlayer controls config={{
                        file: {
                            attributes: {
                                controlsList: 'nodownload', // Esto desactiva el botón de descarga
                            },
                        },
                    }} className="w-full h-full" playIcon={true} url={videoData?.VideoUrl} />
                </div>

                <div className='w-full md:w-1/2 h-full md:h-[50vh] flex flex-col md:py-[5%] md:px-10'>
                    <h3 className='text-gray-600 mt-5 md:mt-0 text-2xl'>{videoData?.Titulo}</h3>
                    <p className='text-gray-400 mt-5 mb-5 md:mb-0 text-base'>
                        {videoData?.Descripcion}
                    </p>
                </div>
            </div>

            <div className='pb-[50vh] ' />
            <div className='relative'>
                <Footer />
            </div>
        </>
    )
}

export default VideoPage