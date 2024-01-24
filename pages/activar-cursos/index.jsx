import React, { useEffect, useState } from 'react'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '../../src/components/ui/select'
import { useQuery } from 'react-query'
import { Cursos } from "../../db/Cursos";
import { useAuth } from '../../hooks/useAuth'
import { User } from '../../db/User'

const cursoCtrl = new Cursos();
const userCtrl = new User();
const index = () => {
    const {User} = useAuth()
    const [ClienteID, setClienteID] = useState(null)

    const { data: CursosData, isLoading: isLoaCursos, isError: isErrCursos } = useQuery("cursos", () => cursoCtrl.getCursos())
    //const {data:UsersData,isLoading:IsloaUsers,isError:IsErrUsers} = useQuery("usuarios",()=> userCtrl.obteColecciones())

    useEffect(() => {
      if(User?.cursos){
        console.log("Tiene cursos")
      }

      //console.log(UsersData)
    }, [User])
    

    return (
        <>
            <Navbar />

            <div className='lg:w-[30%] md:w-[60%] w-[90%] h-fit mt-[5%] bg-white/90 overflow-hidden rounded-md shadow-md mx-auto'>
                <h2 className='text-2xl font-bold text-center text-gray-600 mt-2'>Activar Cursos a Clientes</h2>
                <p className='text-gray-400 font-semibold text-center'>
                    Selecciona al cliente que deseas activar el curso
                </p>

                <div className='w-full flex justify-center'>
                    <Select onValueChange={setClienteID}>
                        <SelectTrigger className="w-[80%] my-5">
                            <SelectValue placeholder="Selecciona un Curso" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                {/* {
                                    DataCursos?.map((curso) => (<SelectItem value={curso.id}>{curso.Titulo}</SelectItem>))
                                } */}
                                <SelectItem value={"deded"}>pedroduran2710@gmail.com</SelectItem>


                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>

                {
                    ClienteID &&
                    (<>
                        <div className='w-full flex justify-center'>
                            <Select onValueChange={setClienteID}>
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
                    </>)
                }
            </div>

            <div className='pb-[40vh] ' />
            <div className='relative'>
                <Footer />
            </div>
        </>
    )
}

export default index