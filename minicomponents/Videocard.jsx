import React from 'react'
import Link from 'next/link'

const Videocard = ({data}) => {
    return (
        <Link href={`/video/${data.id}`}>
            <div className='grid grid-cols-1 p-3 grid-rows-1 cursor-pointer'>
                <img src={data.miniatura || "/imgvideo.svg"} className='row-span-1 w-[330px] h-[180px] bg-gray-700' alt="" />
                <h1 className='text-gray-700 font-semibold mt-4 text-lg'
                style={{maxWidth:"330px"}}
                >{data.videoname}</h1>
                <p className='text-gray-700 font-semibold text-lg'>{data.fecha}</p>
            </div>
        </Link>

    )
}

export default Videocard;
