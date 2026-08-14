import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useInView } from '../hooks/useInView'

const SERVICES = [
  { icon: '/clasesindividuales.svg', label: 'Clases individuales' },
  { icon: '/clasesgrupales.svg',     label: 'Clases grupales' },
  { icon: '/clasessuperrapidas.svg', label: 'Clases super intensivas' },
  { icon: '/appingles.svg',          label: 'App para aprender inglés' },
  { icon: '/clasespregrab.svg',      label: 'Clases pre-grabadas' },
]

const Services = () => {
  const [ref, inView] = useInView()

  return (
    <section className="bg-blue-600 w-full py-20 overflow-hidden" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        {/* Encabezado */}
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <h2 className="text-white font-bold text-3xl md:text-4xl">Nuestros Servicios</h2>
          <p className="text-blue-200 mt-3 text-base">Todo lo que necesitas para aprender inglés</p>
        </motion.div>

        {/* Cards en cascada */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
          {SERVICES.map(({ icon, label }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ scale: 1.06, backgroundColor: 'rgba(255,255,255,0.22)' }}
              className="group flex flex-col items-center gap-4 p-6 rounded-2xl bg-white/10 transition-all duration-200 cursor-default"
            >
              <motion.div
                className="w-16 h-16 flex items-center justify-center bg-white/20 rounded-xl"
                whileHover={{ rotate: [0, -8, 8, -4, 0] }}
                transition={{ duration: 0.4 }}
              >
                <img src={icon} alt={label} className="h-10 w-auto" />
              </motion.div>
              <p className="text-white font-medium text-sm text-center leading-snug">{label}</p>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          className="flex justify-center mt-14"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <Link href="/contactos" legacyBehavior>
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-2 bg-yellow-400 hover:bg-yellow-300 text-gray-800 font-semibold px-8 py-3.5 rounded-xl transition-colors shadow-sm hover:shadow-md"
            >
              Obtener información
            </motion.a>
          </Link>
        </motion.div>

      </div>
    </section>
  )
}

export default Services
