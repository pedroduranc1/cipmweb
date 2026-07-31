import React from 'react'
import Link from 'next/link'
import { useAuth } from '../hooks/useAuth'

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

  return (
    <footer className="w-full border-t border-gray-100 bg-white">
      <div className="max-w-7xl mx-auto px-6 py-10">

        {/* ── Fila principal ─────────────────────────────────────── */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-8">

          {/* Logo + tagline */}
          <Link href="/">
            <a className="flex items-center gap-2 group w-fit">
              <img src="/logo.svg" alt="Logo C.I.P.M" className="h-10 w-auto" />
              <div className="flex flex-col leading-tight">
                <span className="font-bold text-gray-800 group-hover:text-gray-600 transition-colors">
                  C.I.P.M
                </span>
                <span className="text-xs text-gray-400">Cursos de Inglés Personalizados</span>
              </div>
            </a>
          </Link>

          {/* Navegación */}
          <nav className="flex flex-col gap-2">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Navegación</p>
            {NAV_LINKS.map(({ label, href }) => (
              <Link key={href} href={href}>
                <a className="text-sm text-gray-500 hover:text-gray-800 transition-colors w-fit">
                  {label}
                </a>
              </Link>
            ))}
            {/* Cursos solo visible si el usuario está autenticado */}
            {User && (
              <Link href="/cursos">
                <a className="text-sm text-gray-500 hover:text-gray-800 transition-colors w-fit">
                  Cursos
                </a>
              </Link>
            )}
          </nav>

          {/* Redes sociales */}
          <div className="flex flex-col gap-3">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Síguenos</p>
            <div className="flex gap-3">
              {SOCIAL_LINKS.map(({ label, href, icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  className="w-8 h-8 flex items-center justify-center rounded-full
                             hover:bg-gray-100 transition-colors"
                >
                  <img src={icon} alt={label} className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

        </div>

        {/* ── Separador + copyright ───────────────────────────────── */}
        <div className="mt-8 pt-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-gray-400">
            © {year} C.I.P.M — Todos los derechos reservados.
          </p>
          <p className="text-xs text-gray-400">
            Monterrey, México
          </p>
        </div>

      </div>
    </footer>
  )
}

export default Footer
