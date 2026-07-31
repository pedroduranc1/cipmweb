import React from 'react'
import Link from 'next/link'

const STATS = [
  { value: '100%', label: 'Conversacional' },
  { value: '75', label: 'Pesos la hora' },
  { value: '3–6', label: 'Personas por grupo' },
]

const Heros = () => {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16 md:py-24">
      <div className="flex flex-col md:flex-row items-center gap-12">

        {/* ── Texto ───────────────────────────────────────────────── */}
        <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left">
          <span className="inline-block mb-4 px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 text-xs font-semibold tracking-wide uppercase">
            Centro de Inglés para Mexicanos
          </span>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-800 leading-tight">
            Una forma diferente<br />
            <span className="text-blue-600">de aprender inglés</span>
          </h1>

          <p className="mt-6 text-gray-500 text-lg leading-relaxed max-w-md">
            Clases conversacionales diseñadas para hispanohablantes. Aprende inglés real, el que se usa en la vida diaria.
          </p>

          {/* Stats */}
          <div className="flex gap-8 mt-8">
            {STATS.map(({ value, label }) => (
              <div key={label} className="flex flex-col items-center md:items-start">
                <span className="text-2xl font-bold text-gray-800">{value}</span>
                <span className="text-xs text-gray-400 mt-0.5">{label}</span>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row gap-3 mt-10">
            <a
              href="https://wa.link/jlznzn"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-yellow-400 text-gray-800 font-semibold hover:bg-yellow-300 transition-colors shadow-sm hover:shadow-md"
            >
              Agendar clase de prueba
            </a>
            <Link href="/contactos">
              <a className="inline-flex items-center justify-center px-7 py-3.5 rounded-xl border border-gray-200 text-gray-600 font-medium hover:bg-gray-50 transition-colors">
                Más información
              </a>
            </Link>
          </div>
        </div>

        {/* ── Imagen ──────────────────────────────────────────────── */}
        <div className="flex-1 flex justify-center">
          <img
            src="/herosimg.svg"
            alt="Clases de inglés CIPM"
            className="w-full max-w-sm md:max-w-md lg:max-w-lg h-auto"
          />
        </div>

      </div>
    </section>
  )
}

export default Heros
