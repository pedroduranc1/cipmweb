import React from 'react'
import Link from 'next/link'
import { useAuth } from '../hooks/useAuth'
import { motion } from 'framer-motion'
import { useInView } from '../hooks/useInView'

const NAV_LINKS = [
  { label: 'Inicio',    href: '/' },
  { label: 'Videos',   href: '/videos/cipm' },
  { label: 'Contacto', href: '/contactos' },
]

const SOCIAL_LINKS = [
  { label: 'WhatsApp', href: 'https://wa.link/sljtqs',                                            icon: '/ws.svg' },
  { label: 'Facebook', href: 'https://www.facebook.com/Cursosdeinglesmty?mibextid=2JQ9oc',        icon: '/fb.svg' },
  { label: 'TikTok',   href: 'https://www.tiktok.com/@adrianlealcaldera?lang=en',                 icon: '/tiktok.svg' },
  { label: 'YouTube',  href: 'https://youtube.com/channel/UCV2OnDpkWlcIdpNoilCBiYA',             icon: '/youtube.svg' },
]

const Footer = () => {
  const year = new Date().getFullYear()
  const { User } = useAuth()
  const [ref, inView] = useInView({ threshold: 0.1 })

  return (
    <footer className="w-full border-t border-gray-100 bg-white" ref={ref}>
      <div className="max-w-7xl mx-auto px-6 py-10">

        {/* ── Fila principal ─────────────────────────────────────── */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-8">

          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
          >
            <Link href="/" className="flex items-center gap-2 group w-fit">
                <img src="/logo.svg" alt="Logo C.I.P.M" className="h-10 w-auto" />
                <div className="flex flex-col leading-tight">
                  <span className="font-bold text-gray-800 group-hover:text-gray-600 transition-colors">C.I.P.M</span>
                  <span className="text-xs text-gray-400">Cursos de Inglés Personalizados</span>
                </div>
            </Link>
          </motion.div>

          {/* Navegación */}
          <motion.nav
            className="flex flex-col gap-2"
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Navegación</p>
            {NAV_LINKS.map(({ label, href }) => (
              <Link key={href} href={href} className="text-sm text-gray-500 hover:text-gray-800 transition-colors w-fit">{label}</Link>
            ))}
            {User && (
              <Link href="/cursos" className="text-sm text-gray-500 hover:text-gray-800 transition-colors w-fit">Cursos</Link>
            )}
          </motion.nav>

          {/* Redes sociales */}
          <motion.div
            className="flex flex-col gap-3"
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Síguenos</p>
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
                  className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
                >
                  <img src={icon} alt={label} className="w-5 h-5" />
                </motion.a>
              ))}
            </div>
          </motion.div>

        </div>

        {/* ── Copyright ──────────────────────────────────────────── */}
        <motion.div
          className="mt-8 pt-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-2"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <p className="text-xs text-gray-400">© {year} C.I.P.M — Todos los derechos reservados.</p>
          <p className="text-xs text-gray-400">Monterrey, México</p>
        </motion.div>

      </div>
    </footer>
  )
}

export default Footer
