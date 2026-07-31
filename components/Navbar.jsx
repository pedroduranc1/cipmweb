import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useAuth } from '../hooks/useAuth'
import { LogOut, User as UserIcon, Menu, X } from 'lucide-react'

// Enlaces visibles para usuarios no autenticados
const PUBLIC_LINKS = [
  { label: 'Inicio',   href: '/' },
  { label: 'Videos',   href: '/videos/cipm' },
  { label: 'Contacto', href: '/contactos' },
  { label: 'Login',    href: '/login' },
]

// Enlaces visibles para usuarios autenticados
const AUTH_LINKS = [
  { label: 'Inicio',   href: '/' },
  { label: 'Videos',   href: '/videos/cipm' },
  { label: 'Cursos',   href: '/cursos' },
  { label: 'Contacto', href: '/contactos' },
]

const SOCIAL_LINKS = [
  { label: 'WhatsApp', href: 'https://wa.link/sljtqs',                                          icon: '/ws.svg' },
  { label: 'Facebook', href: 'https://www.facebook.com/Cursosdeinglesmty?mibextid=2JQ9oc',      icon: '/fb.svg' },
  { label: 'TikTok',   href: 'https://www.tiktok.com/@adrianlealcaldera?lang=en',               icon: '/tiktok.svg' },
  { label: 'YouTube',  href: 'https://youtube.com/channel/UCV2OnDpkWlcIdpNoilCBiYA',           icon: '/youtube.svg' },
]

const Navbar = () => {
  const { User, logout } = useAuth()
  const router = useRouter()
  const [mobileOpen, setMobileOpen] = useState(false)

  const navLinks = User ? AUTH_LINKS : PUBLIC_LINKS

  // Determina si un enlace corresponde a la ruta actual para resaltarlo
  const isActive = (href) =>
    href === '/' ? router.pathname === '/' : router.pathname.startsWith(href)

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">

          {/* ── Logo ───────────────────────────────────────────── */}
          <Link href="/">
            <a className="flex items-center gap-2 group">
              <img src="/logo.svg" alt="Logo C.I.P.M" className="h-9 w-auto" />
              <span className="font-bold text-gray-800 group-hover:text-gray-600 transition-colors">
                C.I.P.M
              </span>
            </a>
          </Link>

          {/* ── Navegación desktop ─────────────────────────────── */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map(({ label, href }) => (
              <Link key={href} href={href}>
                <a className={`text-sm font-medium transition-colors
                  ${isActive(href)
                    ? 'text-gray-900 border-b-2 border-gray-800 pb-0.5'
                    : 'text-gray-500 hover:text-gray-900'
                  }`}>
                  {label}
                </a>
              </Link>
            ))}
          </nav>

          {/* ── Lado derecho desktop ───────────────────────────── */}
          <div className="hidden md:flex items-center gap-4">

            {/* Redes sociales */}
            <div className="flex items-center gap-2">
              {SOCIAL_LINKS.map(({ label, href, icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
                >
                  <img src={icon} alt={label} className="w-4 h-4" />
                </a>
              ))}
            </div>

            {/* Info del usuario autenticado */}
            {User && (
              <div className="flex items-center gap-2 pl-3 border-l border-gray-100">
                <div className="flex items-center gap-1.5 text-sm text-gray-600">
                  <UserIcon className="w-4 h-4 text-gray-400" />
                  <span className="font-medium">{User.nombre} {User.apellido}</span>
                </div>
                <button
                  onClick={logout}
                  aria-label="Cerrar sesión"
                  className="p-1.5 rounded-md text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* ── Botón menú mobile ──────────────────────────────── */}
          <button
            className="md:hidden p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? 'Cerrar menú' : 'Abrir menú'}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>

        </div>
      </div>

      {/* ── Menú mobile ────────────────────────────────────────── */}
      {mobileOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white">
          <div className="px-4 py-4 flex flex-col gap-1">

            {navLinks.map(({ label, href }) => (
              <Link key={href} href={href}>
                <a
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center px-3 py-2.5 rounded-md text-sm font-medium transition-colors
                    ${isActive(href)
                      ? 'bg-gray-100 text-gray-900'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                >
                  {label}
                </a>
              </Link>
            ))}

            {/* Separador + datos del usuario en mobile */}
            {User && (
              <div className="mt-3 pt-3 border-t border-gray-100">
                <div className="flex items-center justify-between px-3 py-2">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <UserIcon className="w-4 h-4 text-gray-400" />
                    <span className="font-medium">{User.nombre} {User.apellido}</span>
                  </div>
                  <button
                    onClick={() => { logout(); setMobileOpen(false) }}
                    className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Salir
                  </button>
                </div>
              </div>
            )}

            {/* Redes sociales en mobile */}
            <div className="mt-3 pt-3 border-t border-gray-100 px-3 flex gap-3">
              {SOCIAL_LINKS.map(({ label, href, icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
                >
                  <img src={icon} alt={label} className="w-5 h-5" />
                </a>
              ))}
            </div>

          </div>
        </div>
      )}
    </header>
  )
}

export default Navbar
