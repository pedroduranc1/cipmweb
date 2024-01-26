import React, { useEffect, useState } from 'react'
import Link from "next/link";
import { useAuth } from '../hooks/useAuth';
import { useQuery } from 'react-query';
import { Cursos } from "../db/Cursos";

const cursoCtrl = new Cursos();
export const Cursocard = ({ titulo, descripcion, slug, precio }) => {
    const { User } = useAuth();
    const [active, setactive] = useState(false)

    const { data: userCursosData,isLoading } = useQuery(`cursos ${User?.uid}`, () => cursoCtrl.getCursosCliente(User?.uid))

    useEffect(() => {
        if (userCursosData?.cursos?.includes(slug)) {
            console.log('paso')
            setactive(true)
        }
    }, [userCursosData])


    return (
        <>
            {
                active ?
                    (<>
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
                    </>) :
                    (<>
                        <Link href={`/comprarCursos`}>
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
                                <div className='px-4  py-1'>
                                    <h2 className='text-gray-600 font-bold'>Precio: ${precio}</h2>
                                </div>


                                <div className='w-full'>
                                    <button className='mx-[2%] w-full py-2 rounded-md bg-blue-500 text-white cursor-pointer transition-colors hover:bg-blue-300'>Comprar</button>
                                </div>
                                
                            </a>
                        </Link>
                    </>)
            }
        </>

    )
}
