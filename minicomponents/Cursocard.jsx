import React from 'react'
import Link from "next/link";

export const Cursocard = ({titulo,descripcion,slug}) => {
    return (
        <Link href={`/cursos/${slug}`} >
            <div className='w-full sm:w-[45%] md:w-[22%] cursor-pointer h-[260px] shadow-md'>
            {/* IMG CURSO */}
            <div className='w-full h-[60%]'>
                <img src='/imgvideo.svg' alt="curso img" className='w-full h-full' />
            </div>

            <div className='px-4 py-5'>
                <h2 className='text-gray-600 font-bold'>{titulo}</h2>
                <p className='truncate'>
                    {descripcion}
                </p>
            </div>
            </div>
            
        </Link>
    )
}
