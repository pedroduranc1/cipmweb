import React, { useEffect, useState } from 'react'
import Link from "next/link";
import { useAuth } from '../hooks/useAuth';
import { useQuery } from 'react-query';
import { Cursos } from "../db/Cursos";


const cursoCtrl = new Cursos();
export const Cursocard = ({ titulo, descripcion, slug, precio,img }) => {
    const { User } = useAuth();
    const [active, setactive] = useState(false)

    const { data: userCursosData, isLoading } = useQuery(`cursos ${User?.uid}`, () => cursoCtrl.getCursosCliente(User?.uid))

    useEffect(() => {
        if (userCursosData?.cursos?.includes(slug)) {
            setactive(true)
        }
    }, [userCursosData])

    console.log(img)

    return (
        <>
            {
                active ?
                    (<>
                        <Link href={`/cursos/${slug}`}>
                            <div className='flex flex-col relative justify-start overflow-hidden rounded-md cursor-pointer h-full shadow-md'>
                                <div className='h-[30%]'>
                                    <img src={img ? img : '/miniaturavideo.svg'} alt="curso img" className='w-full h-full' />
                                </div>

                                <div className='px-4  py-4' >
                                    <h2 className='text-gray-600 font-bold'>{titulo}</h2>
                                    <p className='truncate line-clamp-3' style={{ lineClamp: 3 }}>
                                        {descripcion}
                                    </p>
                                </div>

                                <div className='w-full absolute bottom-0'>
                                    <button className='mx-[2%] w-full py-2 rounded-md bg-blue-500 text-white cursor-pointer transition-colors hover:bg-blue-300'>Ver Curso</button>
                                </div>
                            </div>
                        </Link>
                    </>) :
                    (<>
                        <Link href={`/comprarCursos`}>

                            <div className='flex flex-col overflow-hidden rounded-md cursor-pointer h-full shadow-md'>
                                <div className='h-[30%]'>
                                    <img src={img ? img : '/miniaturavideo.svg'} alt="curso img" className='w-full h-full' />
                                </div>

                                <div className='px-4  py-4'>
                                    <h2 className='text-gray-600 font-bold'>{titulo}</h2>
                                    <p className='truncate line-clamp-2' style={{ lineClamp: 1 }}>
                                        {descripcion}
                                    </p>
                                </div>

                                <div className='w-full' style={{ marginTop: 'auto' }}>
                                    <h2 className='text-gray-600 font-bold px-4 py-1'>Precio: ${precio}</h2>
                                    <button className='mx-[2%] w-full py-2 rounded-md bg-blue-500 text-white cursor-pointer transition-colors hover:bg-blue-300'>Comprar</button>
                                </div>
                            </div>
                        </Link>
                    </>)
            }
        </>

    )
}
