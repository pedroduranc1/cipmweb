import React from 'react'
import { Mail, MapPin, Clock } from 'lucide-react'
import { motion } from 'framer-motion'
import { useInView } from '../hooks/useInView'

const SOCIAL_LINKS = [
  { label: 'WhatsApp', href: 'https://wa.link/sljtqs',                                        icon: '/ws.svg' },
  { label: 'Facebook', href: 'https://www.facebook.com/Cursosdeinglesmty?mibextid=2JQ9oc',    icon: '/fb.svg' },
  { label: 'TikTok',   href: 'https://www.tiktok.com/@adrianlealcaldera?lang=en',             icon: '/tiktok.svg' },
  { label: 'YouTube',  href: 'https://youtube.com/channel/UCV2OnDpkWlcIdpNoilCBiYA',         icon: '/youtube.svg' },
]

const INFO = [
  { icon: MapPin, text: 'Monterrey, México' },
  { icon: Clock,  text: 'Lunes – Viernes · 9 am – 5 pm' },
  { icon: Mail,   text: 'Contáctanos por WhatsApp o redes sociales' },
]

const Contact = () => {
  const [ref, inView] = useInView({ threshold: 0.1 })

  return (
    <section className="bg-gray-50 w-full py-20 overflow-hidden" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800">Contáctanos</h2>
          <p className="text-gray-400 mt-3 text-base">Estamos aquí para responder tus preguntas</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* ── Info de contacto ──────────────────────────────────── */}
          <motion.div
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 flex flex-col gap-6"
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div>
              <h3 className="text-lg font-bold text-gray-700 mb-4">Información de contacto</h3>
              <div className="flex flex-col gap-4">
                {INFO.map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-center gap-3 text-sm text-gray-500">
                    <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                      <Icon className="w-4 h-4 text-blue-500" />
                    </div>
                    {text}
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-gray-100 pt-5">
              <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold mb-4">Síguenos</p>
              <div className="flex gap-3">
                {SOCIAL_LINKS.map(({ label, href, icon }, i) => (
                  <motion.a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={label}
                    initial={{ opacity: 0, scale: 0.6 }}
                    animate={inView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ duration: 0.3, delay: 0.3 + i * 0.07 }}
                    whileHover={{ scale: 1.2, rotate: 6 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors"
                  >
                    <img src={icon} alt={label} className="w-5 h-5" />
                  </motion.a>
                ))}
              </div>
            </div>

            <motion.a
              href="https://wa.link/sljtqs"
              target="_blank"
              rel="noreferrer"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-gray-800 font-semibold text-sm transition-colors mt-auto"
            >
              <img src="/ws.svg" alt="WhatsApp" className="w-5 h-5" />
              Agendar clase de prueba
            </motion.a>
          </motion.div>

          {/* ── Mapa ─────────────────────────────────────────────── */}
          <motion.div
            className="rounded-2xl overflow-hidden border border-gray-100 shadow-sm min-h-[300px]"
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <img
              src="/googlemap.svg"
              alt="Ubicación CIPM Monterrey"
              className="w-full h-full object-cover"
            />
          </motion.div>

        </div>
      </div>
    </section>
  )
}

export default Contact
