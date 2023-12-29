import React, { useEffect } from 'react'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import { useAuth } from '../../hooks/useAuth'
import { useRouter } from 'next/router'
import { useToast } from '../../src/components/ui/use-toast'

const index = () => {

  const { User } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    if (!User.IsPremium) {
      toast({
        variant: "destructive",
        title: "Debes ser Premium para poder acceder a Cursos",
      })
      router.replace("/")
    }

  }, [User])

  return (
    <>
      <Navbar />

      <div className="w-[80%] mx-auto ">
        <h2 className="text-2xl font-bold text-gray-500 my-5">Cursos Disponibles</h2>
      </div>

      <Footer />
    </>
  )
}

export default index
