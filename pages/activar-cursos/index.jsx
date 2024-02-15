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
        if (searchValue === '') {
            setFilteredClientes(Clientes); // Muestra todos los clientes si el filtro está vacío
        } else {
            const emailsSimilares = Clientes.filter(cliente =>
                cliente.email.toLowerCase().includes(searchValue.toLowerCase())
            );
            setFilteredClientes(emailsSimilares);
        }
    };
    
    const router = useRouter()

    useEffect(() => {
        if (!User) {
            router.push('/')
        }
    }, [User])

    const handleSubmit = async () => {
        // Buscar el cliente por correo electrónico
        const cliente = Clientes.find((c) => c.email.toLowerCase() === Value.toLowerCase());

        // Verificar si se encontró el cliente
        if (!cliente) {
            toast({
                title: "Cliente no encontrado.",
            });
            return; // Detener ejecución si no se encuentra el cliente
        }

        setIsLoading(true);

        try {
            const CursosCliente = await cursoCtrl.getCursosCliente(cliente.id);

            // Verificar si el cliente ya tiene cursos
            if (CursosCliente.cursos.length === 0) {
                // El cliente no tiene cursos, agregar el nuevo curso
                await cursoCtrl.activarCurso(cliente.id, { cursos: [CursoID] });
                toast({
                    title: "Curso activado",
                });
            } else if (CursosCliente.cursos.includes(CursoID)) {
                // El cliente ya tiene este curso
                toast({
                    title: "Este Cliente ya posee el curso",
                });
            } else {
                // El cliente no tiene este curso, agregarlo a su lista
                const cursos = [...CursosCliente.cursos, CursoID];
                await cursoCtrl.activarCurso(cliente.id, { cursos });
                toast({
                    title: "Curso activado",
                });
            }
        } catch (error) {
            //console.error("Error activando el curso para el cliente:", error);
            toast({
                title: "Error al activar el curso",
            });
        } finally {
            setIsLoading(false);
        }

        router.push("/");
    };


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
                                {Value || "Buscar Correo"}
                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </button>
                        </PopoverTrigger>
                        <PopoverContent className="w-full h-[40dvh] p-0">
                            <Command>
                                <CommandInput
                                    placeholder="Buscar Correo"
                                    value={Value} // Asegúrate de vincular el valor del CommandInput al estado Value
                                    onValueChange={(e) => {
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
                                                setValue(currentValue);
                                                setUserID(cliente?.id); // Asegúrate de establecer correctamente el UserID basado en la selección
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
                                    CursosData?.map((curso, index) => (<SelectItem key={index} value={curso.id}>{curso.Titulo}</SelectItem>))
                                }
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
                <div className='flex justify-center'>
                    <button onClick={handleSubmit}
                        disabled={!CursoID || !UserID || IsLoading}
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