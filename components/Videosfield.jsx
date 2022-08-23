import React from 'react'
import Videocard from '../minicomponents/Videocard'
import videoslist from '../db/videos'

const Videosfield = () => {
    let videos = [];

    for (let index = 0; index <= 3; index++) {
        videos.push(videoslist[index])
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex flex-col  justify-between my-16 md:justify-start md:space-x-10">
                <h1 className='md:text-start text-center text-3xl text-gray-600 font-semibold'>Videos que pueden ayudarte</h1>
                <div className='grid mt-14 grid-cols-1 md:grid-cols-4 translate-x-0 
                md:-translate-x-10 overflow-x-auto justify-items-center 
                gap-x-6
                '>
                    {
                        videos.map((video) =>
                            <Videocard
                                key={video.id}
                                data={video}
                            />
                        )
                    }
                </div>
            </div>
        </div>
    )
}

export default Videosfield;
