import React, { useMemo } from 'react'
import Videocard from '../minicomponents/Videocard'
import { motion } from 'framer-motion'
import { useInView } from '../hooks/useInView'
import { useQuery } from 'react-query'
import { Cursos } from '../db/Cursos'

const cursoCtrl = new Cursos()

const Videosfield = () => {
  const [ref, inView] = useInView()

  const { data: videosSolitarios = [] } = useQuery(
    ['videos-solitarios', false],
    () => cursoCtrl.getVideosSolitarios(false),
    { staleTime: 1000 * 60 * 5 }
  )

  const videos = useMemo(() =>
    videosSolitarios.slice(0, 4).map(v => ({
      id: v.id,
      videoname: v.Titulo,
      miniatura: v.ImgUrl || '/miniaturavideo.svg',
      fecha: v.Fecha?.toDate?.().toLocaleDateString('es-MX') ?? '',
      descripcion: v.Descripcion ?? '',
      publicado: v.publicado ?? true,
      _source: 'firestore',
    }))
  , [videosSolitarios])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 overflow-hidden" ref={ref}>
      <div className="flex flex-col justify-between my-16">

        <motion.h1
          className="md:text-start text-center text-3xl text-gray-600 font-semibold"
          initial={{ opacity: 0, x: -30 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          Videos que pueden ayudarte
        </motion.h1>

        <div className="grid mt-14 grid-cols-1 md:grid-cols-4 gap-6">
          {videos.map((video, i) => (
            <motion.div
              key={video.id}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
            >
              <Videocard data={video} />
            </motion.div>
          ))}
        </div>

      </div>
    </div>
  )
}

export default Videosfield
