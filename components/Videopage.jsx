import React from 'react'
import VideoCard2 from '../minicomponents/VideoCard2'
import { useRouter } from 'next/router'
import videoslist from '../db/videos'

const Videopage = () => {

    const router = useRouter()
    const { video } = router.query

    const videoselec = videoslist[video - 1]

    let arr = videoselec?.videoname.split(' ');
    //console.log(arr)

    let videos = []
    let min = 0


    if (arr !== "") {
        const videosdiferente = videoslist.filter(videof => videof.id !== videoselec?.id);

        videosdiferente.map((video) => {
            if(videos.length <= 3){
                videos.push(video)
            }
        })
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="">
                <div className='grid grid-cols-1 md:grid-cols-2 items-center justify-between py-10 '>
                    <h1 className='text-3xl w-full text-gray-700 font-semibold'>Videos que pueden ayudarte</h1>

                </div>
            </div>
            <div className='grid grid-cols-1 md:space-x-6 grid-rows-4 md:grid-cols-4'>

                <div className='col-span-3 row-span-4'>
                    <div className='col-span-3 justify-items-center row-span-2'>
                        <video src={`https://adrianlealcaldera.com` + videoselec?.videourl}
                            controls
                        ></video>

                    </div>

                    <div className='col-span-3 row-span-2'>
                        <h1 className='text-3xl font-semibold text-gray-700 pt-10'>{videoselec?.videoname}</h1>
                        <h2 className='text-lg text-gray-700 pt-3'>{videoselec?.fecha}</h2>
                        <h2 className='text-lg text-gray-700 pt-3 pb-6'>{videoselec?.descripcion === "" ? "Este video no posee descripcion" : videoselec?.descripcion} </h2>
                        <div className='flex justify-center md:justify-start pt-6 pb-6 space-x-6'>
                            <img
                                className="h-8 w-auto sm:h-12 hover:cursor-pointer"
                                src="/ws.svg"
                                alt=""
                            />

                            <img
                                className="h-8 w-auto sm:h-12 hover:cursor-pointer "
                                src="/fb.svg"
                                alt=""
                            />

                            <img
                                className="h-8 w-auto sm:h-12 hover:cursor-pointer"
                                src="/tiktok.svg"
                                alt=""
                            />
                        </div>
                    </div>
                </div>

                <div className='col-span-1 space-y-6 pb-10 row-span-4'>
                    {
                        videos.map((video) =>
                            <VideoCard2
                                key={video.id}
                                data={video}
                            />
                        )
                    }
                </div>
            </div>
        </div>
    )
}

export default Videopage