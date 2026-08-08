import React, { useEffect, useState } from 'react'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import { useQuery, useQueryClient } from 'react-query'
import { Cursos } from "../../db/Cursos";
import { useAuth } from '../../hooks/useAuth'
import { User } from '../../db/User'
import {
  Command, CommandEmpty, CommandGroup, CommandInput, CommandItem,
} from "../../src/components/ui/command"
import {
  Popover, PopoverContent, PopoverTrigger,
} from "../../src/components/ui/popover"
import { useRouter } from 'next/router';
import { toast } from '../../src/components/ui/use-toast';
import { AlertCircle, ChevronsUpDown, Loader2 } from 'lucide-react';

const cursoCtrl = new Cursos();
const userCtrl = new User();

const ActivarCursos = () => {
  const { User: AuthUser, loading } = useAuth()
  const router = useRouter()
  const queryClient = useQueryClient()

  const [cursoSeleccionado, setCursoSeleccionado] = useState(null)
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null)
  const [cursosDelCliente, setCursosDelCliente] = useState(null)
  const [loadingCliente, setLoadingCliente] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [confirmando, setConfirmando] = useState(false)

  useEffect(() => {
    if (!loading && !AuthUser) router.push('/')
  }, [AuthUser, loading])

  const { data: CursosData, isLoading: loadingCursos, isError: errorCursos } = useQuery("cursos", () => cursoCtrl.getCursos())
  const { data: Clientes, isLoading: loadingClientes, isError: errorClientes } = useQuery("clientes", () => userCtrl.getUsers())

  const cursosOrdenados = CursosData
    ? [...CursosData].sort((a, b) => a.Titulo?.localeCompare(b.Titulo))
    : []

  const clientesFiltrados = Clientes
    ? Clientes.filter(c => c.email?.toLowerCase().includes(search.toLowerCase()))
    : []

  const handleClienteSeleccionado = async (cliente) => {
    setClienteSeleccionado(cliente)
    setSearch(cliente.email)
    setOpen(false)
    setCursoSeleccionado(null)
    setConfirmando(false)
    setLoadingCliente(true)

    try {
      const data = await cursoCtrl.getCursosCliente(cliente.id)
      const activos = CursosData?.filter(c => data.cursos?.includes(c.id)) || []
      setCursosDelCliente(activos)
    } catch {
      setCursosDelCliente([])
    } finally {
      setLoadingCliente(false)
    }
  }

  const yaInscrito = cursosDelCliente?.some(c => c.id === cursoSeleccionado?.id)

  const handleActivar = async () => {
    setIsLoading(true)
    try {
      const data = await cursoCtrl.getCursosCliente(clienteSeleccionado.id)
      const cursosActuales = data.cursos || []

      if (cursosActuales.includes(cursoSeleccionado.id)) {
        toast({ title: "Este cliente ya tiene el curso activo" })
        return
      }

      await cursoCtrl.activarCurso(clienteSeleccionado.id, {
        cursos: [...cursosActuales, cursoSeleccionado.id]
      })

      toast({ title: "Curso activado exitosamente" })
      queryClient.invalidateQueries("clientes")
      router.push("/")
    } catch {
      toast({ variant: "destructive", title: "Error al activar el curso" })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-green-50 py-10 px-4">
        <div className="max-w-lg mx-auto">

          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-green-500 rounded-2xl mb-4 shadow-lg">
              <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none"
                stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                <polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-800">Activar Curso a Cliente</h1>
            <p className="text-sm text-gray-500 mt-1">Busca el cliente y selecciona el curso a activar</p>
          </div>

          {/* Paso 1 — Buscar cliente */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-4">
            <div className="flex items-center gap-2 mb-3">
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-green-500 text-white text-xs font-bold">1</span>
              <label className="text-sm font-semibold text-gray-700">Busca el cliente por correo</label>
            </div>

            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <button
                  aria-expanded={open}
                  className="w-full border-2 border-gray-200 bg-gray-50 hover:bg-white text-gray-700 py-2.5 px-3 rounded-lg flex items-center justify-between text-sm transition-colors focus:border-green-400 focus:outline-none"
                >
                  <span className={clienteSeleccionado ? 'text-gray-800 font-medium' : 'text-gray-400'}>
                    {clienteSeleccionado ? clienteSeleccionado.email : 'Buscar por correo...'}
                  </span>
                  <ChevronsUpDown size={16} className="text-gray-400 shrink-0" />
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0" style={{ width: 'var(--radix-popover-trigger-width)' }}>
                <Command>
                  <CommandInput
                    placeholder="Escribe el correo..."
                    value={search}
                    onValueChange={(val) => { setSearch(val) }}
                  />
                  <CommandEmpty>No se encontraron clientes.</CommandEmpty>
                  <CommandGroup className="overflow-y-auto max-h-52">
                    {clientesFiltrados.map(cliente => (
                      <CommandItem
                        key={cliente.id}
                        value={cliente.email}
                        onSelect={() => handleClienteSeleccionado(cliente)}
                      >
                        {cliente.email}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>

            {/* Cursos activos del cliente */}
            {loadingCliente && (
              <div className="flex items-center gap-2 mt-3 text-sm text-gray-400">
                <Loader2 size={14} className="animate-spin" /> Cargando cursos del cliente...
              </div>
            )}

            {clienteSeleccionado && !loadingCliente && cursosDelCliente !== null && (
              <div className="mt-3">
                {cursosDelCliente.length > 0 ? (
                  <div className="bg-green-50 border border-green-200 rounded-lg overflow-hidden">
                    <p className="text-xs font-semibold text-green-700 px-3 py-2 border-b border-green-100 uppercase tracking-wide">
                      Cursos activos ({cursosDelCliente.length})
                    </p>
                    <div className="divide-y divide-green-100 max-h-36 overflow-y-auto">
                      {cursosDelCliente.map(c => (
                        <div key={c.id} className="flex items-center gap-2 px-3 py-2 text-sm text-green-800">
                          <span className="text-green-500">✓</span>
                          <span className="truncate">{c.Titulo}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-3 text-xs text-gray-400 text-center">
                    Este cliente no tiene cursos activos aún
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Paso 2 — Seleccionar curso */}
          {clienteSeleccionado && !loadingCliente && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-6">
              <div className="flex items-center gap-2 mb-3">
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-green-500 text-white text-xs font-bold">2</span>
                <label className="text-sm font-semibold text-gray-700">Selecciona el curso a activar</label>
              </div>

              {(errorCursos || errorClientes) && (
                <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3 mb-3">
                  <AlertCircle size={16} className="shrink-0" />
                  No se pudieron cargar los cursos. Recarga la página.
                </div>
              )}

              {loadingCursos ? (
                <div className="flex flex-col gap-2">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-12 bg-gray-100 rounded-lg animate-pulse" />
                  ))}
                </div>
              ) : (
                <div className="divide-y divide-gray-100 border border-gray-200 rounded-lg overflow-hidden max-h-64 overflow-y-auto">
                  {cursosOrdenados.map(curso => {
                    const activo = cursosDelCliente?.some(c => c.id === curso.id)
                    const seleccionado = cursoSeleccionado?.id === curso.id

                    return (
                      <button
                        key={curso.id}
                        type="button"
                        disabled={activo}
                        onClick={() => { setCursoSeleccionado(curso); setConfirmando(false) }}
                        className={`w-full flex items-center gap-3 px-3 py-3 text-left transition-colors
                          ${activo ? 'bg-green-50 cursor-not-allowed opacity-70' :
                            seleccionado ? 'bg-green-50 border-l-2 border-green-500' :
                            'hover:bg-gray-50'}`}
                      >
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0
                          ${activo ? 'bg-green-400 border-green-400' :
                            seleccionado ? 'border-green-500 bg-green-500' :
                            'border-gray-300'}`}>
                          {(activo || seleccionado) && (
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                              <polyline points="20 6 9 17 4 12"/>
                            </svg>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-800 truncate">{curso.Titulo}</p>
                          {curso.precio != null && (
                            <p className="text-xs text-gray-400">${curso.precio} USD</p>
                          )}
                        </div>
                        {activo && (
                          <span className="text-xs text-green-600 font-semibold shrink-0">Ya activo</span>
                        )}
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
          )}

          {/* Resumen + confirmación */}
          {cursoSeleccionado && !yaInscrito && (
            <div className={`bg-white rounded-2xl border-2 shadow-sm p-5 mb-6 transition-colors
              ${confirmando ? 'border-green-300' : 'border-gray-100'}`}>

              <p className="text-sm text-gray-600 mb-4">
                Vas a activar <span className="font-semibold text-gray-800">"{cursoSeleccionado.Titulo}"</span> para{' '}
                <span className="font-semibold text-gray-800">{clienteSeleccionado.email}</span>.
              </p>

              {!confirmando ? (
                <button
                  type="button"
                  onClick={() => setConfirmando(true)}
                  className="w-full py-3 rounded-xl font-semibold text-sm bg-green-500 hover:bg-green-600 text-white transition-all active:scale-[0.98] shadow-sm"
                >
                  Activar curso
                </button>
              ) : (
                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-3 text-center">¿Confirmas la activación?</p>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setConfirmando(false)}
                      disabled={isLoading}
                      className="flex-1 py-2.5 rounded-xl font-semibold text-sm border-2 border-gray-200 text-gray-600 hover:bg-gray-50 transition-all disabled:opacity-40"
                    >
                      Cancelar
                    </button>
                    <button
                      type="button"
                      onClick={handleActivar}
                      disabled={isLoading}
                      className="flex-1 py-2.5 rounded-xl font-semibold text-sm bg-green-500 hover:bg-green-600 text-white transition-all disabled:opacity-40 flex items-center justify-center gap-2"
                    >
                      {isLoading
                        ? <><Loader2 size={16} className="animate-spin" /> Activando...</>
                        : '✓ Sí, activar'
                      }
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {yaInscrito && cursoSeleccionado && (
            <div className="bg-green-50 border border-green-200 rounded-2xl p-5 text-center text-sm text-green-700 mb-6">
              ✓ Este cliente ya tiene activo <strong>"{cursoSeleccionado.Titulo}"</strong>
            </div>
          )}

        </div>
      </div>

      <Footer />
    </>
  )
}

export default ActivarCursos
