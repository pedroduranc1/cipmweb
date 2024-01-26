import React, { useState } from 'react'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import { useQuery } from 'react-query'
import { Cursos } from "../../db/Cursos";
import { useAuth } from '../../hooks/useAuth'
import { User } from '../../db/User'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '../../src/components/ui/select';
import { useRouter } from 'next/router';
import { toast } from '../../src/components/ui/use-toast';

const cursoCtrl = new Cursos();
const userCtrl = new User();
const index = () => {
    const { User } = useAuth()
    const [CursoID, setCursoID] = useState(null)
    const [UserID, setUserID] = useState(null)

    const router = useRouter()

    const { data: CursosData, isLoading: isLoaCursos, isError: isErrCursos } = useQuery("cursos", () => cursoCtrl.getCursos())
    const { data: CursosCliente, isLoading: IsloaCC, isError: IsErrCC } = useQuery("clientes", () => userCtrl.getUsers())


    const handleSubmit = async () => {
        let cursos = []
        cursos.push(CursoID)
        await cursoCtrl.activarCurso(UserID, {
            cursos
        })

        router.push("/")
        toast({
            title: "Curso activado",
        })

    }

    return (
        <>
            <Navbar />

            <div className='lg:w-[30%] md:w-[60%] w-[90%] h-fit mt-[5%] bg-white/90 overflow-hidden rounded-md shadow-md mx-auto'>
                <h2 className='text-2xl font-bold text-center text-gray-600 mt-2'>Activar Cursos a Clientes</h2>
                <p className='text-gray-400 font-semibold text-center'>
                    Ingresa el correo del cliente
                </p>
                <div className='w-full flex justify-center'>
                    <Select key={0} onValueChange={setUserID}>
                        <SelectTrigger className="w-[80%] my-5">
                            <SelectValue placeholder="Selecciona al Cliente" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                {
                                    CursosCliente?.map((curso) => (<SelectItem value={curso.id}>{curso.email}</SelectItem>))
                                }
                            </SelectGroup>
                        </SelectContent>
                    </Select>
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
                    <button onClick={handleSubmit} disabled={CursoID && UserID ? false : true} className='w-[80%] disabled:opacity-50 hover:bg-blue-300 transition-colors mx-auto py-2 mb-[5%] text-white bg-blue-500 rounded-md'>Activar Curso</button>
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