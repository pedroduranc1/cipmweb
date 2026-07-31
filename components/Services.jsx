import React from 'react'
import Link from 'next/link'

const SERVICES = [
  { icon: '/clasesindividuales.svg', label: 'Clases individuales' },
  { icon: '/clasesgrupales.svg',     label: 'Clases grupales' },
  { icon: '/clasessuperrapidas.svg', label: 'Clases super intensivas' },
  { icon: '/appingles.svg',          label: 'App para aprender inglés' },
  { icon: '/clasespregrab.svg',      label: 'Clases pre-grabadas' },
]

const Services = () => {
  return (
    <section className="bg-blue-600 w-full py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        <div className="text-center mb-14">
          <h2 className="text-white font-bold text-3xl md:text-4xl">Nuestros Servicios</h2>
          <p className="text-blue-200 mt-3 text-base">Todo lo que necesitas para aprender inglés</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
          {SERVICES.map(({ icon, label }) => (
            <div
              key={label}
              className="group flex flex-col items-center gap-4 p-6 rounded-2xl bg-white/10 hover:bg-white/20 transition-all duration-200 cursor-default"
            >
              <div className="w-16 h-16 flex items-center justify-center bg-white/20 rounded-xl group-hover:scale-110 transition-transform duration-200">
                <img src={icon} alt={label} className="h-10 w-auto" />
              </div>
              <p className="text-white font-medium text-sm text-center leading-snug">{label}</p>
            </div>
          ))}
        </div>

        <div className="flex justify-center mt-14">
          <Link href="/contactos">
            <a className="inline-flex items-center gap-2 bg-yellow-400 hover:bg-yellow-300 text-gray-800 font-semibold px-8 py-3.5 rounded-xl transition-colors shadow-sm hover:shadow-md">
              Obtener información
            </a>
          </Link>
        </div>

      </div>
    </section>
  )
}

export default Services
