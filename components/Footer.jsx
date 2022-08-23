import React from 'react'
import Link from 'next/link'

export const Footer = () => {
    return (
        <div className='bg-gray-200 w-full '>
            <div className="max-w-7xl mx-auto px-4  sm:px-6">
                <div className="flex flex-col sm:flex-row  justify-between items-center py-6 md:justify-start md:space-x-10">
                    <div className="flex justify-start lg:w-0 lg:flex-1">
                        <Link href="">
                            <a className='flex '>
                                <img
                                    className="h-14 w-auto sm:h-15"
                                    src="/logo.svg"
                                    alt=""
                                    layout='fill'
                                ></img>
                                <h1 className='grid items-center font-bold ml-2'>C.I.M.P</h1>
                            </a>
                        </Link>

                    </div>

                    <div className=" md:flex items-center justify-end md:flex-1 lg:w-0">

                        <div className='flex mt-6 space-x-6 justify-around'>
                            <Link href="/">
                                <a className="whitespace-nowrap text-base font-medium text-gray-500 hover:text-gray-900">
                                    Inicio
                                </a>
                            </Link>

                            <Link href="/videos/cimp">
                                <a className="whitespace-nowrap text-base font-medium text-gray-500 hover:text-gray-900">
                                    Videos
                                </a>
                            </Link>

                            <Link href="/contactos">
                                <a className="whitespace-nowrap text-base font-medium text-gray-500 hover:text-gray-900">
                                    Contacto
                                </a>
                            </Link>
                        </div>

                        <div className='flex mt-6 justify-around'>
                            <img
                                className="h-8 w-auto sm:h-7 hover:cursor-pointer ml-10"
                                src="/ws.svg"
                                alt=""
                                layout='fill'
                                onClick={() => {
                                    window.location.href = "https://wa.link/8ebgdv";
                                }}
                            ></img>

                            <img
                                className="h-8 w-auto sm:h-7 hover:cursor-pointer ml-3"
                                src="/fb.svg"
                                alt=""
                                layout='fill'
                                onClick={() => {
                                    window.location.href = "https://www.facebook.com/olympusgroupmx";
                                }}
                            ></img>

                            <img
                                className="h-8 w-auto sm:h-7 hover:cursor-pointer ml-3"
                                src="/tiktok.svg"
                                alt=""
                                layout='fill'
                                onClick={() => {
                                    window.location.href = "https://www.tiktok.com/@adrianlealcaldera?lang=en";
                                }}
                            ></img>
                        </div>

                    </div>
                </div>
                <div className='flex justify-center'>
                    <h1 className='py-10 text-gray-900 font-semibold'>Nombredelapagina.com | Copyright 2022 ©</h1>
                </div>
            </div>
        </div>
    )
}
