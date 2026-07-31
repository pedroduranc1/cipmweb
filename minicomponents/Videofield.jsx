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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-12">
            <div className="flex flex-col  justify-between mt-4 md:justify-start ">
                <div className='flex flex-col md:flex-row items-center justify-between w-full pb-10'>
                    <h1 className='text-2xl md:text-4xl text-gray-700 font-bold'>Videos que pueden ayudarte</h1>
                    
                </div>

                <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5'>
                    {videos.map((video) =>
                      <Videocard key={video.id} data={video} />
                    )}
                </div>

                <div className='flex justify-center mt-6'>
                  <button
                    onClick={aumentarrange}
                    className='px-6 py-2 rounded-xl border border-gray-300 text-gray-600 text-sm font-medium hover:bg-gray-50 hover:border-gray-400 transition-colors'
                  >
                    Ver más
                  </button>
                </div>
            </div>
        </div>
    )
}

export default Videofield;