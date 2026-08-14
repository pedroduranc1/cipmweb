import React, { useState } from 'react'
import Navbar from '../components/Navbar'
import { collection, doc, setDoc, getDoc } from 'firebase/firestore'
import { db } from '../db/firebase'
import { Loader2, CheckCircle, XCircle, AlertCircle } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

const BASE = 'https://adrianlealcaldera.com'

const videosEstaticos = [
  {
    id: 'static-1',
    Titulo: 'Problemas de aprender pronunciación',
    Descripcion: '',
    VideoUrl: `${BASE}/si%20te%20da%20verg%C3%BCenza%20hablar%20ingl%C3%A9s%20mira%20este%20video.mp4`,
    ImgUrl: '',
    tipo: 'solitario',
    publicado: true,
    Fecha: new Date('2021-01-27'),
  },
  {
    id: 'static-2',
    Titulo: 'La mejor metodología para aprender inglés',
    Descripcion: '',
    VideoUrl: `${BASE}/la%20mejor%20metodolog%C3%ADa%20para%20aprender%20ingl%C3%A9s.mp4`,
    ImgUrl: '',
    tipo: 'solitario',
    publicado: true,
    Fecha: new Date('2020-11-12'),
  },
  {
    id: 'static-3',
    Titulo: 'Los problemas del TOEFL',
    Descripcion: '',
    VideoUrl: `${BASE}/Los%20problemas%20del%20TOEFL.mp4`,
    ImgUrl: '',
    tipo: 'solitario',
    publicado: true,
    Fecha: new Date('2021-06-05'),
  },
  {
    id: 'static-4',
    Titulo: 'Problemas de aprender pronunciación (2022)',
    Descripcion: '',
    VideoUrl: `${BASE}/problemas%20de%20aprender%20pronunciaci%C3%B3n.mp4`,
    ImgUrl: '',
    tipo: 'solitario',
    publicado: true,
    Fecha: new Date('2022-01-10'),
  },
  {
    id: 'static-5',
    Titulo: 'Como las escuelas de inglés te alargan artificialmente el curso',
    Descripcion: '',
    VideoUrl: `${BASE}/Como%20las%20escuelas%20de%20ingl%C3%A9s%20te%20alargan%20artificialmente%20el%20curso.mp4`,
    ImgUrl: '',
    tipo: 'solitario',
    publicado: true,
    Fecha: new Date('2021-10-15'),
  },
  {
    id: 'static-6',
    Titulo: 'Inglés callejero',
    Descripcion: '',
    VideoUrl: `${BASE}/Ingl%C3%A9s%20callejero.mp4`,
    ImgUrl: '',
    tipo: 'solitario',
    publicado: true,
    Fecha: new Date('2022-05-27'),
  },
  {
    id: 'static-7',
    Titulo: 'Duolingo no resuelve el problema computacional de lenguaje',
    Descripcion: '',
    VideoUrl: `${BASE}/duolingo%20no%20resuelve%20el%20problema%20computacional%20de%20lenguaje.mp4`,
    ImgUrl: '',
    tipo: 'solitario',
    publicado: true,
    Fecha: new Date('2022-02-27'),
  },
]

export default function MigrarVideos() {
  const { User, loading } = useAuth()
  const router = useRouter()
  const [resultados, setResultados] = useState([])
  const [ejecutando, setEjecutando] = useState(false)
  const [terminado, setTerminado] = useState(false)

  useEffect(() => {
    if (!loading && (!User || User.role !== 'admin')) router.push('/')
  }, [User, loading])

  const migrar = async () => {
    setEjecutando(true)
    setResultados([])
    setTerminado(false)

    for (const video of videosEstaticos) {
      const { id, ...data } = video

      // Verificar si ya existe
      const ref = doc(db, 'videos', id)
      const snap = await getDoc(ref)

      if (snap.exists()) {
        setResultados(prev => [...prev, { id, titulo: video.Titulo, estado: 'existia' }])
        continue
      }

      try {
        await setDoc(ref, {
          ...data,
          Fecha: { seconds: Math.floor(data.Fecha.getTime() / 1000), nanoseconds: 0 },
        })
        setResultados(prev => [...prev, { id, titulo: video.Titulo, estado: 'ok' }])
      } catch (e) {
        setResultados(prev => [...prev, { id, titulo: video.Titulo, estado: 'error', msg: e.message }])
      }
    }

    setEjecutando(false)
    setTerminado(true)
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-10 px-4">
        <div className="max-w-lg mx-auto">

          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-800">Migrar Videos Estáticos</h1>
            <p className="text-sm text-gray-500 mt-1">
              Sube los 7 videos del array estático a Firestore para que tengan comentarios.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
            <p className="text-sm text-gray-600 mb-4">
              Se crearán <span className="font-semibold">{videosEstaticos.length} documentos</span> en la colección <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs">videos</code> con IDs <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs">static-1</code> a <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs">static-7</code>.
              Si ya existen, se omiten sin sobreescribir.
            </p>

            <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-5 text-sm text-amber-700">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>Las URLs de video apuntan a <strong>adrianlealcaldera.com</strong>. Puedes cambiarlas después desde Modificar Video.</span>
            </div>

            <button
              onClick={migrar}
              disabled={ejecutando || terminado}
              className="w-full py-3 rounded-xl font-semibold text-sm bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-colors"
            >
              {ejecutando
                ? <><Loader2 className="w-4 h-4 animate-spin" /> Migrando...</>
                : terminado ? '✓ Migración completada' : 'Iniciar migración'
              }
            </button>
          </div>

          {resultados.length > 0 && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <p className="text-xs font-semibold text-gray-500 px-5 py-3 border-b border-gray-100 uppercase tracking-wide">
                Resultados
              </p>
              <div className="divide-y divide-gray-50">
                {resultados.map(r => (
                  <div key={r.id} className="flex items-center gap-3 px-5 py-3">
                    {r.estado === 'ok' && <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />}
                    {r.estado === 'existia' && <CheckCircle className="w-4 h-4 text-gray-400 shrink-0" />}
                    {r.estado === 'error' && <XCircle className="w-4 h-4 text-red-500 shrink-0" />}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-700 truncate">{r.titulo}</p>
                      {r.estado === 'ok' && <p className="text-xs text-green-600">Creado correctamente</p>}
                      {r.estado === 'existia' && <p className="text-xs text-gray-400">Ya existía, omitido</p>}
                      {r.estado === 'error' && <p className="text-xs text-red-500">{r.msg}</p>}
                    </div>
                    <span className="text-xs text-gray-400 shrink-0">{r.id}</span>
                  </div>
                ))}
              </div>

              {terminado && (
                <div className="px-5 py-4 border-t border-gray-100 flex gap-3">
                  <button
                    onClick={() => router.push('/videos')}
                    className="flex-1 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors"
                  >
                    Ver videos
                  </button>
                  <button
                    onClick={() => router.push('/modificar-video')}
                    className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors"
                  >
                    Modificar videos
                  </button>
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </>
  )
}
