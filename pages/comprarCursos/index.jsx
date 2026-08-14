import React from 'react'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import Breadcrumb from '../../components/Breadcrumb'
import { CheckCircle, MessageCircle, ShoppingBag, Users, BookOpen, Zap } from 'lucide-react'

const PLANES = [
  {
    icon: BookOpen,
    label: '1 Curso',
    descripcion: 'Ideal para comenzar con el tema de tu elección.',
    features: ['1 curso a elegir', 'Acceso de por vida', 'Soporte por WhatsApp'],
    destacado: false,
  },
  {
    icon: Zap,
    label: '2 Cursos',
    descripcion: 'La opción más popular. Combina dos cursos y avanza más rápido.',
    features: ['2 cursos a elegir', 'Acceso de por vida', 'Soporte por WhatsApp', 'Mayor ahorro'],
    destacado: true,
  },
  {
    icon: Users,
    label: '3 Cursos',
    descripcion: 'Máximo aprovechamiento para quienes van en serio.',
    features: ['3 cursos a elegir', 'Acceso de por vida', 'Soporte prioritario', 'Mejor precio por curso'],
    destacado: false,
  },
]

const ComprarCursos = () => {
  return (
    <>
      <Navbar />
      <Breadcrumb />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 mt-8 mb-16">

        {/* Encabezado */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-semibold uppercase tracking-wide mb-4">
            <ShoppingBag className="w-3.5 h-3.5" />
            Adquiere tus cursos
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800">Elige tu plan</h1>
          <p className="text-gray-400 mt-3 max-w-md mx-auto text-sm leading-relaxed">
            Contáctanos por Facebook para conocer los precios actuales y completar tu compra. Respondemos en menos de 24 horas.
          </p>
        </div>

        {/* Planes */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
          {PLANES.map(({ icon: Icon, label, descripcion, features, destacado }) => (
            <div
              key={label}
              className={`relative rounded-2xl border p-6 flex flex-col gap-4 transition-all
                ${destacado
                  ? 'border-blue-500 bg-blue-50 shadow-md'
                  : 'border-gray-200 bg-white shadow-sm'
                }`}
            >
              {destacado && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap">
                  Más popular
                </span>
              )}

              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${destacado ? 'bg-blue-100' : 'bg-gray-100'}`}>
                <Icon className={`w-5 h-5 ${destacado ? 'text-blue-600' : 'text-gray-500'}`} />
              </div>

              <div>
                <h3 className={`text-lg font-bold mb-1 ${destacado ? 'text-blue-700' : 'text-gray-800'}`}>
                  {label}
                </h3>
                <p className="text-gray-400 text-sm leading-snug">{descripcion}</p>
              </div>

              <ul className="flex flex-col gap-2 flex-1">
                {features.map(f => (
                  <li key={f} className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle className={`w-4 h-4 shrink-0 ${destacado ? 'text-blue-500' : 'text-gray-300'}`} />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="text-gray-700 font-semibold">¿Listo para empezar?</p>
            <p className="text-gray-400 text-sm mt-0.5">
              Escríbenos por Facebook para conocer los precios y disponibilidad
            </p>
          </div>
          <a
            href="https://www.facebook.com/Cursosdeinglesmty?mibextid=2JQ9oc"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors whitespace-nowrap shrink-0"
          >
            <MessageCircle className="w-4 h-4" />
            Contactar por Facebook
          </a>
        </div>

      </div>

      <Footer />
    </>
  )
}

export default ComprarCursos
