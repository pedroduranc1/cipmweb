import React from 'react'
import Link from "next/link";

export const Cursocard = ({ titulo, descripcion, slug, precio }) => {
    return (
        <Link href={`/cursos/${slug}`}>
            <a className=' grid grid-cols-1 overflow-hidden rounded-md cursor-pointer h-[260px] shadow-md'>
                <div className=' h-[60%]'>
                    <img src='/imgvideo.svg' alt="curso img" className='w-full h-full' />
                </div>

                <div className='px-4  py-4'>
                    <h2 className='text-gray-600 font-bold'>{titulo}</h2>
                    <p className='truncate line-clamp-3' style={{ lineClamp: 3 }}>
                        {descripcion}
                    </p>
                </div>
            </a>
        </Link>
    )
}
