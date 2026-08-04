import React, { useState } from 'react'
import * as emailjs from '@emailjs/browser'
import swal from 'sweetalert'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { Loader2, Send } from 'lucide-react'
import { motion } from 'framer-motion'
import { useInView } from '../hooks/useInView'

const PLANS = [
  {
    name: 'Personalizada',
    price: '275',
    unit: 'MXN / hora',
    color: 'yellow',
    border: 'border-yellow-400',
    badge: 'bg-yellow-400/10 text-yellow-600',
    hr: 'bg-yellow-400',
    features: ['Clases individuales', 'Mín. 3 horas por semana', 'Lunes – Viernes', '12 semanas'],
  },
  {
    name: 'Grupal',
    price: '375',
    unit: 'MXN / semana',
    color: 'blue',
    border: 'border-blue-500',
    badge: 'bg-blue-500/10 text-blue-600',
    hr: 'bg-blue-500',
    features: ['Clases grupales', 'Lunes – Viernes', '12 semanas'],
  },
  {
    name: 'Fin de semana',
    price: '225',
    unit: 'MXN / hora',
    color: 'violet',
    border: 'border-violet-600',
    badge: 'bg-violet-600/10 text-violet-600',
    hr: 'bg-violet-600',
    features: ['Clases grupales', '3 horas por día', 'Sábado y domingo', '20 semanas'],
  },
  {
    name: 'Super Intensivo',
    price: '3,500',
    unit: 'MXN total',
    color: 'pink',
    border: 'border-pink-500',
    badge: 'bg-pink-500/10 text-pink-600',
    hr: 'bg-pink-500',
    features: ['1 semana intensiva', 'Lunes – Sábado', '9 am – 6 pm'],
  },
  {
    name: 'Curso pregrabado',
    price: '500',
    unit: 'MXN total',
    color: 'green',
    border: 'border-green-500',
    badge: 'bg-green-500/10 text-green-600',
    hr: 'bg-green-500',
    features: ['48 GB de contenido', '8.5 horas de video', '55 estructuras del lenguaje', '+500 palabras comunes'],
  },
]

const SOCIAL_LINKS = [
  { href: 'https://wa.link/jlznzn',                                     icon: '/ws.svg',      label: 'WhatsApp' },
  { href: 'https://www.facebook.com/olympusgroupmx',                    icon: '/fb.svg',      label: 'Facebook' },
  { href: 'https://www.tiktok.com/@adrianlealcaldera?lang=en',          icon: '/tiktok.svg',  label: 'TikTok' },
  { href: 'https://youtube.com/channel/UCV2OnDpkWlcIdpNoilCBiYA',      icon: '/youtube.svg', label: 'YouTube' },
]

const Plans = () => {
  const [enviando, setEnviando] = useState(false)
  const [plansRef, plansInView] = useInView()
  const [contactRef, contactInView] = useInView()

  const formik = useFormik({
    initialValues: { nombrecompleto: '', email: '', message: '', telefono: 'No Disponible' },
    validationSchema: Yup.object({
      nombrecompleto: Yup.string().required('Requerido'),
      email: Yup.string().email('Correo inválido').required('Requerido'),
      message: Yup.string().required('Requerido'),
    }),
    onSubmit: (values) => {
      setEnviando(true)
      emailjs
        .send('service_5s7kuca', 'template_92ao3zk', {
          nombre: values.nombrecompleto,
          from_name: values.email,
          message: values.message,
          telefono: values.telefono,
        }, 'zqIzI2_ekxMdEySHy')
        .then(() => {
          swal(`¡Gracias, ${values.nombrecompleto}!`, 'Tu mensaje fue enviado con éxito', 'success')
          formik.resetForm()
        })
        .catch(() => swal('Oops', 'Ocurrió un error al enviar el mensaje', 'error'))
        .finally(() => setEnviando(false))
    },
  })

  const field = (name, type = 'text', placeholder) => ({
    id: name, name, type, placeholder,
    onChange: formik.handleChange,
    onBlur: formik.handleBlur,
    value: formik.values[name],
    className: `w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition-colors
      ${formik.errors[name] && formik.touched[name]
        ? 'border-red-400 focus:border-red-500'
        : 'border-gray-200 focus:border-gray-400'}`,
  })

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20 overflow-hidden">

      {/* Encabezado */}
      <motion.div
        className="text-center mb-12"
        ref={plansRef}
        initial={{ opacity: 0, y: 30 }}
        animate={plansInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800">Nuestros planes</h2>
        <p className="text-gray-400 mt-3">Elige el que mejor se adapte a ti</p>
      </motion.div>

      {/* Grid de planes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-16">
        {PLANS.map((plan, i) => (
          <motion.div
            key={plan.name}
            initial={{ opacity: 0, y: 50 }}
            animate={plansInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ y: -6, boxShadow: '0 16px 40px -8px rgba(0,0,0,0.12)' }}
            className={`group flex flex-col p-6 rounded-2xl border-2 ${plan.border} bg-white transition-colors duration-200`}
          >
            <span className={`self-center text-xs font-semibold px-3 py-1 rounded-full ${plan.badge} mb-4`}>
              {plan.name}
            </span>
            <p className="text-center text-3xl font-bold text-gray-800">${plan.price}</p>
            <p className="text-center text-xs text-gray-400 mt-1 mb-4">{plan.unit}</p>
            <div className={`h-px w-full ${plan.hr} opacity-30 mb-4`} />
            <ul className="flex flex-col gap-2 flex-1">
              {plan.features.map((f) => (
                <li key={f} className="flex items-start gap-1.5 text-xs text-gray-500">
                  <span className="mt-0.5 text-gray-300">·</span>
                  {f}
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>

      {/* Contacto */}
      <motion.div
        ref={contactRef}
        initial={{ opacity: 0, y: 40 }}
        animate={contactInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
      >
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-700">¿Estás interesado/a?</h3>
          <p className="text-sm text-gray-400 mt-0.5">Envíanos un mensaje y te contactamos</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-100">

          {/* Formulario */}
          <form onSubmit={formik.handleSubmit} className="p-6 flex flex-col gap-4">
            <input {...field('nombrecompleto', 'text', 'Nombre y apellido')} />
            <input {...field('email', 'email', 'Correo electrónico')} />
            <textarea
              {...field('message', 'text', 'Mensaje')}
              rows={4}
              className={`w-full px-4 py-2.5 rounded-xl border text-sm outline-none resize-none transition-colors
                ${formik.errors.message && formik.touched.message
                  ? 'border-red-400 focus:border-red-500'
                  : 'border-gray-200 focus:border-gray-400'}`}
            />
            <button
              type="submit"
              disabled={enviando}
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-gray-900 text-white text-sm font-medium hover:bg-gray-700 disabled:opacity-50 transition-colors"
            >
              {enviando ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              {enviando ? 'Enviando...' : 'Enviar mensaje'}
            </button>
          </form>

          {/* Redes */}
          <div className="p-6 flex flex-col items-center justify-center gap-6">
            <div className="text-center">
              <p className="text-gray-600 font-medium">O escríbenos por redes sociales</p>
              <p className="text-gray-400 text-sm mt-1">Respondemos en menos de 24 h</p>
            </div>
            <div className="grid grid-cols-4 gap-4">
              {SOCIAL_LINKS.map(({ href, icon, label }, i) => (
                <motion.a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  initial={{ opacity: 0, scale: 0.7 }}
                  animate={contactInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.4, delay: 0.3 + i * 0.08 }}
                  whileHover={{ scale: 1.18, rotate: 4 }}
                  whileTap={{ scale: 0.93 }}
                  className="w-14 h-14 flex items-center justify-center rounded-2xl bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <img src={icon} alt={label} className="h-7 w-auto" />
                </motion.a>
              ))}
            </div>
          </div>

        </div>
      </motion.div>

    </section>
  )
}

export default Plans
