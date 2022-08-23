import React, { useState } from 'react'
import Videocard from './Videocard'


const Videofield = ({videoslist}) => {

    const [range, setrange] = useState(3)

    let videos = []

    for (let index = 0; index <= range; index++) {
        if(videoslist[index] !== undefined){
            //console.log(videoslist[index])
            videos.push(videoslist[index])
        }
    }

    const aumentarrange = () =>{
        setrange(range + 4)
    }
    

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex flex-col  justify-between my-16 md:justify-start md:space-x-10">
                <div className='flex flex-col md:flex-row items-center justify-between w-full pb-10'>
                    <h1 className='text-2xl md:text-4xl text-gray-700 font-bold'>Videos que pueden ayudarte</h1>
                    
                </div>

                <div className='grid grid-cols-1 translate-x-0 md:-translate-x-10 w-full 
                justify-items-center
                md:grid-cols-4'>
                    {
                        videos.map((video) =>
                            <Videocard
                                key={video.id}
                                data={video}
                            />
                        )
                    }
                </div>

                <div className='flex justify-center py-6'>
                    <h1 className='text-gray-700 text-xl font-bold border-b-2 border-gray-700 cursor-pointer text-center'
                    onClick={aumentarrange}
                    >Ver mas</h1>
                </div>
            </div>
        </div>
    )
}

export default Videofield;