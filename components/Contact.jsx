import React, { useState } from 'react'
import * as emailjs from '@emailjs/browser'


const Contact = ({ fullpage }) => {
  const [nombre, setnombre] = useState("")
  const [apellido, setapellido] = useState('')
  const [from_name, setfrom_name] = useState("")
  const [message, setmessage] = useState("")
  const [telefono, settelefono] = useState('')

  let values = {
    nombre,
    apellido,
    from_name,
    message,
    telefono
  }

  const enviarcorreo = () => {
    //console.log(values)
    emailjs.send('service_zf4o6rf', 'template_ba8iocf', values, 'mHjoux4EbEL8zmau2');
  }

  return (
    <div className='flex flex-col md:flex-row w-full'>
      <div className='flex flex-col justify-end w-full md:w-1/2 bg-blue-600'>
        <div className='flex flex-col px-5 sm:px-0 md:translate-x-[10%]'>
          <h1 className='text-center text-white text-2xl font-semibold pt-10 pb-7'>Contacto</h1>
          <div className='w-full flex justify-center'>
            <input type="text" placeholder='Nombre y Apellido'
              onChange={(e) => {
                let nombrecompleto = e.target.value.split(' ')
                setnombre(nombrecompleto[0])
                setapellido(nombrecompleto[1])
              }}
              className='bg-white w-full sm:w-1/2 px-5 py-4 rounded-lg my-1' />
          </div>
          <div className='w-full flex justify-center'>
            <input type="text" placeholder='Numero de telefono'
              onChange={(e) => {
                settelefono(e.target.value)
              }}
              className='bg-white w-full sm:w-1/2 px-5 py-4 rounded-lg my-1' />
          </div>
          <div className='w-full flex justify-center'>
            <input type="email" placeholder='Correo electronico'
              onChange={(e) => {
                setfrom_name(e.target.value)
              }}
              className='bg-white w-full sm:w-1/2 px-5 py-4 rounded-lg my-1' />
          </div>
          <div className='w-full flex justify-center'>
            <textarea
              onChange={(e) => {
                setmessage(e.target.value)
              }}
              placeholder='Mensaje'
              className='bg-white w-full sm:w-1/2 resize-none px-5 py-4 rounded-lg my-1'
            ></textarea>
          </div>

          <div className='flex justify-center mt-8 mb-20 w-full'>
            <div className='w-full sm:w-1/2 flex justify-center bg-blue-600'>
              <div className='flex w-full justify-between items-center'>
                <div
                  onClick={enviarcorreo}
                  className='px-8 py-2 border-2 cursor-pointer border-white rounded-lg text-white font-semibold'
                >Enviar</div>

                <div className='grid grid-cols-4 place-items-center gap-4'>
                  <img
                    className="h-8 w-auto sm:h-7 hover:cursor-pointer"
                    src="/ws.svg"
                    alt=""
                    layout='fill'
                    onClick={() => {
                      window.location.href = "https://wa.link/8ebgdv";
                    }}
                  ></img>

                  <img
                    className="h-8 w-auto sm:h-7 hover:cursor-pointer"
                    src="/fb.svg"
                    alt=""
                    layout='fill'
                    onClick={() => {
                      window.location.href = "https://www.facebook.com/olympusgroupmx";
                    }}
                  ></img>

                  <img
                    className="h-8 w-auto sm:h-7 hover:cursor-pointer"
                    src="/tiktok.svg"
                    alt=""
                    layout='fill'
                    onClick={() => {
                      window.location.href = "https://www.tiktok.com/@adrianlealcaldera?lang=en";
                    }}
                  ></img>

                  <img
                    className="h-8 w-auto sm:h-9 hover:cursor-pointer"
                    src="/youtube.svg"
                    alt=""
                    layout='fill'
                    onClick={() => {
                      window.location.href = "https://www.youtube.com/channel/UCV2OnDpkWlcIdpNoilCBiYA";
                    }}
                  ></img>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
      <div className='flex flex-col justify-start w-full md:w-1/2'>
        <div className='flex flex-col md:-translate-x-[10%]'>
          <h1 className='text-center text-gray-600  
          text-2xl font-semibold pt-10 pb-7'>Ubicación</h1>

          <div className='flex justify-center w-full'>
            <div className='w-1/2'>
              <img src="/googlemap.svg"
                className='w-screen h-auto'
                layout='fill'
                alt="" ></img>
            </div>
          </div>

          <div className='flex justify-center w-full'>
            <div className='sm:w-1/2 w-full px-5 sm:px-0'>
              <h1 className='text-center mt-10 text-xl pb-10 md:pb-0 text-gray-600'>
                Monterrey - Mexico <br />
                Horario de trabajo 9 - 5 pm / Lunes - Viernes <br />
                Correo electrónico : Noeadrianleal@gmail.com
              </h1>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default Contact;