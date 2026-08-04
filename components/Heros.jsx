import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'

const STATS = [
  { value: 100, suffix: '%', label: 'Conversacional' },
  { value: 75,  suffix: '',  label: 'Pesos la hora' },
  { value: 6,   suffix: '',  label: 'Personas por grupo' },
]

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 32 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] },
})

const Counter = ({ target, suffix }) => {
  const [count, setCount] = useState(0)

  useEffect(() => {
    let start = 0
    const step = Math.ceil(target / 40)
    const timer = setInterval(() => {
      start += step
      if (start >= target) { setCount(target); clearInterval(timer) }
      else setCount(start)
    }, 30)
    return () => clearInterval(timer)
  }, [target])

  return <span>{count}{suffix}</span>
}

const Heros = () => {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16 md:py-24 overflow-hidden">
      <div className="flex flex-col md:flex-row items-center gap-12">

        {/* ── Texto ─────────────────────────────────────────────── */}
        <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left">

          <motion.span {...fadeUp(0)}
            className="inline-block mb-4 px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 text-xs font-semibold tracking-wide uppercase"
          >
            Centro de Inglés para Mexicanos
          </motion.span>

          <motion.h1 {...fadeUp(0.1)}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-800 leading-tight"
          >
            Una forma diferente<br />
            <span className="text-blue-600">de aprender inglés</span>
          </motion.h1>

          <motion.p {...fadeUp(0.2)}
            className="mt-6 text-gray-500 text-lg leading-relaxed max-w-md"
          >
            Clases conversacionales diseñadas para hispanohablantes. Aprende inglés real, el que se usa en la vida diaria.
          </motion.p>

          {/* Stats con contador */}
          <motion.div {...fadeUp(0.3)} className="flex gap-8 mt-8">
            {STATS.map(({ value, suffix, label }) => (
              <div key={label} className="flex flex-col items-center md:items-start">
                <span className="text-2xl font-bold text-gray-800">
                  <Counter target={value} suffix={suffix} />
                </span>
                <span className="text-xs text-gray-400 mt-0.5">{label}</span>
              </div>
            ))}
          </motion.div>

          {/* CTA */}
          <motion.div {...fadeUp(0.4)} className="flex flex-col sm:flex-row gap-3 mt-10">
            <motion.a
              href="https://wa.link/jlznzn"
              target="_blank"
              rel="noreferrer"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-yellow-400 text-gray-800 font-semibold hover:bg-yellow-300 transition-colors shadow-sm hover:shadow-md"
            >
              Agendar clase de prueba
            </motion.a>
            <Link href="/contactos">
              <motion.a
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center justify-center px-7 py-3.5 rounded-xl border border-gray-200 text-gray-600 font-medium hover:bg-gray-50 transition-colors"
              >
                Más información
              </motion.a>
            </Link>
          </motion.div>
        </div>

        {/* ── Imagen flotando ───────────────────────────────────── */}
        <motion.div
          className="flex-1 flex justify-center"
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.img
            src="/herosimg.svg"
            alt="Clases de inglés CIPM"
            className="w-full max-w-sm md:max-w-md lg:max-w-lg h-auto drop-shadow-xl"
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          />
        </motion.div>

      </div>
    </section>
  )
}

export default Heros
