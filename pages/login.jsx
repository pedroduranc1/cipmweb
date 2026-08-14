import React from 'react'
import Link from 'next/link'
import Head from 'next/head'
import { Form, Field, Formik } from 'formik'
import * as Yup from 'yup'
import { useRouter } from 'next/router'
import { Auth } from '../db/Auth'
import { useAuth } from '../hooks/useAuth'
import { useToast } from '../src/components/ui/use-toast'
import { Loader2, Lock, Mail } from 'lucide-react'

const AuthCtrl = new Auth()

const Login = () => {
  const { login } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  return (
    <>
      <Head>
        <title>Login - CIPM</title>
        <link rel="icon" href="/logo.svg" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>

      <div className="min-h-screen flex">

        {/* ── Panel izquierdo (visual) ─────────────────────────── */}
        <div className="hidden lg:flex lg:w-1/2 bg-blue-600 flex-col justify-between p-12">
          <img src="/logo.svg" alt="CIPM" className="h-12 w-auto" />

          <div>
            <h1 className="text-4xl font-bold text-white leading-tight mb-4">
              Aprende inglés<br />a tu ritmo
            </h1>
            <p className="text-blue-200 text-base leading-relaxed max-w-sm">
              Accede a todos tus cursos y videos desde cualquier lugar, en cualquier momento.
            </p>
          </div>

          <p className="text-blue-300 text-sm">© {new Date().getFullYear()} C.I.P.M — Monterrey, México</p>
        </div>

        {/* ── Panel derecho (formulario) ───────────────────────── */}
        <div className="flex-1 flex flex-col justify-center items-center px-6 py-12 bg-white">

          {/* Logo mobile */}
          <img src="/logo.svg" alt="CIPM" className="h-10 w-auto mb-8 lg:hidden" />

          <div className="w-full max-w-sm">
            <h2 className="text-2xl font-bold text-gray-800 mb-1">Iniciar sesión</h2>
            <p className="text-gray-400 text-sm mb-8">Ingresa tus datos para continuar</p>

            <Formik
              initialValues={{ email: '', password: '' }}
              validationSchema={Yup.object({
                email: Yup.string().required('Ingresa tu correo'),
                password: Yup.string().required('Ingresa tu contraseña'),
              })}
              onSubmit={async (values) => {
                const { email, password } = values
                const data = await AuthCtrl.login(email, password)

                if (typeof data === 'string' && data.startsWith('Firebase:')) {
                  if (data.includes('wrong-password')) {
                    toast({ variant: 'destructive', title: 'Error', description: 'Contraseña incorrecta' })
                  } else if (data.includes('user-not-found')) {
                    toast({ variant: 'destructive', title: 'Error', description: 'El correo no existe' })
                  } else {
                    toast({ variant: 'destructive', title: 'Error', description: 'Error al iniciar sesión' })
                  }
                } else {
                  const { accessToken, uid } = data
                  await login(accessToken, uid)
                  router.push('/')
                }
              }}
            >
              {({ errors, touched, isSubmitting }) => (
                <Form className="flex flex-col gap-4">

                  <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-gray-600" htmlFor="email">
                      Correo electrónico
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                      <Field
                        id="email" name="email" type="email"
                        placeholder="tu@correo.com"
                        className={`w-full pl-9 pr-4 py-2.5 rounded-xl border text-sm text-gray-700 placeholder-gray-400
                          focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-colors
                          ${errors.email && touched.email ? 'border-red-400 bg-red-50' : 'border-gray-200'}`}
                      />
                    </div>
                    {errors.email && touched.email && (
                      <p className="text-xs text-red-500">{errors.email}</p>
                    )}
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-gray-600" htmlFor="password">
                      Contraseña
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                      <Field
                        id="password" name="password" type="password"
                        placeholder="••••••••"
                        className={`w-full pl-9 pr-4 py-2.5 rounded-xl border text-sm text-gray-700 placeholder-gray-400
                          focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-colors
                          ${errors.password && touched.password ? 'border-red-400 bg-red-50' : 'border-gray-200'}`}
                      />
                    </div>
                    {errors.password && touched.password && (
                      <p className="text-xs text-red-500">{errors.password}</p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex items-center justify-center gap-2 w-full py-2.5 mt-2 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
                  >
                    {isSubmitting
                      ? <><Loader2 className="w-4 h-4 animate-spin" /> Entrando...</>
                      : 'Iniciar sesión'
                    }
                  </button>

                  <p className="text-center text-sm text-gray-400 mt-1">
                    ¿No tienes cuenta?{' '}
                    <Link href="/registro" className="text-blue-600 hover:text-blue-700 font-medium transition-colors">
                      Regístrate
                    </Link>
                  </p>

                </Form>
              )}
            </Formik>
          </div>
        </div>

      </div>
    </>
  )
}

export default Login
