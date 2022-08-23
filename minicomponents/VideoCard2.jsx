import React from 'react'
import Link from 'next/link'

const VideoCard2 = ({data}) => {
    return (
        <Link href={`/video/${data.id}`}>
            <div className='grid col-span-1 row-span-1 justify-center cursor-pointer'>
                <img src="/imgvideo.svg" className='col-span-1 row-span-1 w-[330px] h-[180px] bg-gray-700' alt="" />
                <h1 className='text-gray-700 col-span-1 row-span-1 font-semibold mt-4 text-lg'>{data.videoname}</h1>
                <p className='text-gray-700 col-span-1 row-span-1 font-semibold text-lg'>{data.fecha}</p>
            </div>
        </Link>
    )
}

export default VideoCard2