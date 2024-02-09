import React, { useEffect, useState } from 'react'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import { useQuery } from 'react-query'
import { Cursos } from "../../db/Cursos";
import { useAuth } from '../../hooks/useAuth'
import { User } from '../../db/User'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '../../src/components/ui/select';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
} from "../../src/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "../../src/components/ui/popover"
import { useRouter } from 'next/router';
import { toast } from '../../src/components/ui/use-toast';
import { Check, ChevronsUpDown, Loader2 } from 'lucide-react';
import { cn } from "../../src/lib/utils"

const cursoCtrl = new Cursos();
const userCtrl = new User();
const index = () => {
    const { User } = useAuth()
    const [CursoID, setCursoID] = useState(null)
    const [UserID, setUserID] = useState(null)
    const [IsLoading, setIsLoading] = useState(false)

    const { data: CursosData, isLoading: isLoaCursos, isError: isErrCursos } = useQuery("cursos", () => cursoCtrl.getCursos())
    const { data: Clientes, isLoading: IsloaCC, isError: IsErrCC } = useQuery("clientes", () => userCtrl.getUsers())

    const [open, setOpen] = useState(false);
    const [Value, setValue] = useState('');
    const [filteredClientes, setFilteredClientes] = useState([]); // Inicialmente, muestra todos los clientes

    // Función para filtrar los clientes según el valor de búsqueda
    const filtrarClientes = (searchValue) => {
        let data = []
    
        const emailsSimilares = Clientes
            .filter(cliente =>
                cliente.email.toLowerCase().startsWith(searchValue.toLowerCase())
            )
            .map(cliente => cliente);

        if(emailsSimilares == []){
            data = Clientes
        }else{
            data = emailsSimilares
        }

        

        setFilteredClientes([...data])
    };

    const router = useRouter()

    useEffect(() => {
        if (!User) {
            router.push('/')
        }
    }, [User])

    const handleSubmit = async () => {

        const clienteID = Clientes.filter((cliente)=> cliente.email === Value)
        setIsLoading(true)
        const CursosCliente = await cursoCtrl.getCursosCliente(clienteID[0].id)
        const cursos = []

        console.log(CursosCliente)

        if (CursosCliente.cursos.length === 0) {
            cursos.push(CursoID)

            await cursoCtrl.activarCurso(clienteID[0].id, {
                cursos
            })
            setIsLoading(false)

            router.push("/")
            toast({
                title: "Curso activado",
            })
        }

        if (CursosCliente.cursos.includes(CursoID)) {
            setIsLoading(false)
            toast({
                title: "Este Cliente ya posee el curso",
            })
        }

        if (!CursosCliente.cursos.includes(CursoID)) {
            cursos = [
                ...CursosCliente.cursos,
                CursoID
            ]

            console.log(cursos)

            await cursoCtrl.activarCurso(clienteID[0].id, {
                cursos
            })

            setIsLoading(false)

            router.push("/")
            toast({
                title: "Curso activado",
            })
        }
    }

    return (
        <>
            <Navbar />

            <div className='lg:w-[30%] md:w-[60%] w-[90%] h-fit mt-[5%] bg-white/90 overflow-hidden rounded-md shadow-md mx-auto'>
                <h2 className='text-2xl font-bold text-center text-gray-600 mt-2'>Activar Cursos a Clientes</h2>
                <p className='text-gray-400 font-semibold text-center'>
                    Ingresa el correo del cliente
                </p>
                <div className='w-full mt-5 flex justify-center'>
                    <Popover open={open} onOpenChange={setOpen}>
                        <PopoverTrigger asChild>
                            <button
                                aria-expanded={open}
                                className="w-[80%] border-[1px] border-gray-200 text-black py-2 px-3 rounded-md flex items-center justify-between"
                            >
                                {Value ? Value : "Buscar Correo"}
                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </button>
                        </PopoverTrigger>
                        <PopoverContent className="w-full h-full max-h-[20dvh] p-0">
                            <Command>
                                <CommandInput
                                    placeholder="Buscar Correo"
                                    onValueChange={(e)=> {
                                        setValue(e);
                                        filtrarClientes(e);
                                    }}
                                />
                                <CommandEmpty>No se encontraron clientes.</CommandEmpty>
                                <CommandGroup className="overflow-y-auto">
                                    {filteredClientes?.map(cliente => (
                                        <CommandItem
                                            key={cliente?.id}
                                            value={cliente?.email}
                                            onSelect={(currentValue) => {
                                                setValue(currentValue === Value.email ? "" : currentValue);
                                                setUserID(currentValue === Value.id ? "" : currentValue)
                                                setOpen(false);
                                            }}
                                        >
                                            {cliente.email}
                                        </CommandItem>
                                    ))}
                                </CommandGroup>
                            </Command>
                        </PopoverContent>
                    </Popover>
                </div>

                <div className='w-full flex justify-center'>
                    <Select key={1} onValueChange={setCursoID}>
                        <SelectTrigger className="w-[80%] my-5">
                            <SelectValue placeholder="Selecciona un Curso" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                {
                                    CursosData?.map((curso) => (<SelectItem value={curso.id}>{curso.Titulo}</SelectItem>))
                                }
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
                <div className='flex justify-center'>
                    <button onClick={handleSubmit}
                        disabled={CursoID && UserID || IsLoading ? false : true}
                        className='w-[80%] disabled:opacity-50 hover:bg-blue-300 
                    transition-colors mx-auto py-2 mb-[5%] text-white bg-blue-500 rounded-md'>
                        {IsLoading ? <div className='w-full h-full flex justify-center items-center'><Loader2 className='animate-spin' /></div> : "Activar Curso"}

                    </button>
                </div>
            </div>



            <div className='pb-[40vh] ' />
            <div className='relative'>
                <Footer />
            </div>
        </>
    )
}

export default index