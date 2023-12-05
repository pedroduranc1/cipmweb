import React from 'react'
import Link from 'next/link'

const Footer = () => {
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
                                <h1 className='grid items-center font-bold ml-2'>C.I.P.M</h1>
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

                        <div className='grid grid-cols-4 place-items-center gap-4 mt-6 md:ml-6'>
                            <img
                                className="h-8 w-auto sm:h-7 hover:cursor-pointer"
                                src="/ws.svg"
                                alt=""
                                layout='fill'
                                onClick={() => {
                                    window.location.href = "https://wa.link/jlznzn";
                                }}
                            ></img>

                            <img
                                className="h-8 w-auto sm:h-7 hover:cursor-pointer"
                                src="/fb.svg"
                                alt=""
                                layout='fill'
                                onClick={() => {
                                    window.location.href = "https://www.facebook.com/olympusgroupmx";
                                }}
                            ></img>

                            <img
                                className="h-8 w-auto sm:h-7 hover:cursor-pointer"
                                src="/tiktok.svg"
                                alt=""
                                layout='fill'
                                onClick={() => {
                                    window.location.href = "https://www.tiktok.com/@adrianlealcaldera?lang=en";
                                }}
                            ></img>

                            <img
                                className="h-8 w-auto sm:h-9 hover:cursor-pointer"
                                src="/youtube.svg"
                                alt=""
                                layout='fill'
                                onClick={() => {
                                    window.location.href = "https://youtube.com/channel/UCV2OnDpkWlcIdpNoilCBiYA";
                                }}
                            ></img>
                        </div>

                    </div>
                </div>
                <div className='flex justify-center'>
                    <h1 className='py-10 text-gray-900 font-semibold'>cursosdeinglespersonalizadosenmonterrey.com | Copyright 2022 ©</h1>
                </div>
            </div>
        </div>
    )
}

export default Footer;

