import React, { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { Popover, PopoverContent, PopoverTrigger } from '../../src/components/ui/popover';
import { ChevronsUpDown, Loader2 } from 'lucide-react';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '../../src/components/ui/command';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '../../src/components/ui/select';
import { Cursos } from '../../db/Cursos';
import { User } from '../../db/User';
import { useAuth } from '../../hooks/useAuth';
import { useRouter } from 'next/router';
import { useQuery } from 'react-query';
import { toast } from '../../src/components/ui/use-toast';

const cursoCtrl = new Cursos();
const userCtrl = new User();

const Index = () => {
    const { User } = useAuth();
    const [CursoID, setCursoID] = useState(null);
    const [UserID, setUserID] = useState(null);
    const [IsLoading, setIsLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [Value, setValue] = useState('');
    const [filteredClientes, setFilteredClientes] = useState([]);
    const router = useRouter();

    const { data: Clientes, isLoading: IsloaCC, isError: IsErrCC } = useQuery("clientes", () => userCtrl.getUsers())
    const { data: CursosData, isLoading: isLoaCursos, isError: isErrCursos } = useQuery("cursos", () => cursoCtrl.getCursos());

    useEffect(() => {
        if (!User) {
            router.push('/');
        }
    }, [User]);

    const handleSubmit = async () => {
        const DataCursos = await cursoCtrl.getCursoCli(UserID)

        const CursosAct = DataCursos?.cursos.filter(curso => curso !== CursoID);
        setIsLoading(true)

        await cursoCtrl.activarCurso(UserID, {
            cursos: CursosAct
        })

        setIsLoading(false)

        router.push("/")
        toast({
            title: "Curso Desactivado",
        })
    };

    const filtrarClientes = async (email) => {
        let data = []
        const clienteID = Clientes.filter((cliente) => cliente.email === email)
        setUserID(clienteID[0].id)
        const DataCursos = await cursoCtrl.getCursoCli(clienteID[0].id)

        CursosData.map((curso) => {
            if (DataCursos.cursos.includes(curso.id)) {
                data.push(curso)
            }
        })

        setFilteredClientes(data)
    };

    return (
        <>
            <Navbar />
            <div className='lg:w-[30%] md:w-[60%] w-[90%] h-fit mt-[5%] bg-white/90 overflow-hidden rounded-md shadow-md mx-auto'>
                <h2 className='text-2xl font-bold text-center text-gray-600 mt-2'>Desactivar Cursos a Clientes</h2>
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
                                    onValueChange={(e) => {
                                        setValue(e);
                                    }}
                                />
                                <CommandEmpty>No se encontraron clientes.</CommandEmpty>
                                <CommandGroup className="overflow-y-auto">
                                    {Clientes?.map(cliente => (
                                        <CommandItem
                                            key={cliente?.id}
                                            value={cliente?.email}
                                            onSelect={(currentValue) => {
                                                setValue(currentValue === Value.email ? "" : currentValue);
                                                setUserID(currentValue === Value.id ? "" : currentValue)
                                                setOpen(false);
                                                filtrarClientes(currentValue)
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
                                    filteredClientes &&
                                    (<>
                                        {
                                            filteredClientes.map((curso) => (
                                                <SelectItem key={curso.id} value={curso.id}>
                                                    {curso.Titulo}
                                                </SelectItem>
                                            ))
                                        }
                                    </>)
                                }
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
                <div className='flex justify-center'>
                    <button onClick={handleSubmit}
                        disabled={CursoID && UserID || IsLoading ? false : true}
                        className='w-[80%] disabled:opacity-50 hover:bg-red-300 
                    transition-colors mx-auto py-2 mb-[5%] text-white bg-red-500 rounded-md'>
                        {IsLoading ? <div className='w-full h-full flex justify-center items-center'><Loader2 className='animate-spin' /></div> : "Desactivar Curso"}
                    </button>
                </div>
            </div>
            <div className='pb-[40vh] ' />
            <div className='relative'>
                <Footer />
            </div>
        </>
    );
};

export default Index;
