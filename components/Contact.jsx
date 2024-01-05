import React, { useEffect, useState } from 'react'
import * as emailjs from '@emailjs/browser'
import swal from 'sweetalert'
import { useFormik } from 'formik';
import * as Yup from 'yup';


const Contact = ({ fullpage }) => {

  const [EnviandoCorreoContac, setEnviandoCorreoContac] = useState(false)

  const formik = useFormik({
    initialValues: {
      nombrecompleto: '',
      email: '',
      message: '',
      telefono: ''
    },
    validationSchema: Yup.object({
      nombrecompleto: Yup.string()
        .required('Required'),
      email: Yup.string()
        .email('Invalid email address')
        .required('Required'),
      message: Yup.string()
        .required('Required'),
      telefono: Yup.number()
        .required('Required'),
    }),
    onSubmit: (values) => {

      let valuesemaill = {
        nombre: values.nombrecompleto,
        from_name: values.email,
        message: values.message,
        telefono: values.telefono
      }

      setEnviandoCorreoContac(true)
      emailjs.send('service_5s7kuca', 'template_92ao3zk', valuesemaill, 'zqIzI2_ekxMdEySHy')
        .then(function (response) {
          swal(`Felicidades ${valuesemaill.nombre}`, "Tu correo a sido enviado con exito", "success");
          limpiarinp()
          setEnviandoCorreoContac(false)
        }, function (error) {
          swal("Oops", "Ocurrio un error al enviar el correo", "error");
          setEnviandoCorreoContac(false)
        });
    },
  });

  const limpiarinp = () => {
    formik.values.nombrecompleto = ""
    formik.values.email = ""
    formik.values.telefono = ""
    formik.values.message = ""
  }


  return (
    <div className='flex flex-col md:flex-row w-full pb-[12%]'>
      <div className='flex flex-col justify-end w-full md:w-1/2 bg-blue-600'>
        <form onSubmit={formik.handleSubmit}>
          <div className='flex flex-col px-5 sm:px-0 md:translate-x-[10%]'>
            <h1 className='text-center text-white text-2xl font-semibold pt-10 pb-7'>Contacto</h1>
            <div className='w-full flex justify-center'>
              <input
                placeholder='Nombre y Apellido'
                id="nombrecompleto"
                name="nombrecompleto"
                type="text"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.nombrecompleto}
                className={`bg-white border-2 ${formik.errors.nombrecompleto && 'border-red-500'} w-full sm:w-1/2 px-5 py-4 rounded-lg my-1`} />
            </div>
            <div className='w-full flex justify-center'>
              <input
                placeholder='Numero de telefono'
                id="telefono"
                name="telefono"
                type="number"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.telefono}
                className={`bg-white border-2 ${formik.errors.telefono && 'border-red-500'} w-full sm:w-1/2 px-5 py-4 rounded-lg my-1`} />
            </div>
            <div className='w-full flex justify-center'>
              <input
                type="email"
                placeholder='Correo electronico'
                id="email"
                name="email"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.email}
                className={`bg-white border-2 ${formik.errors.email && 'border-red-500'} w-full sm:w-1/2 px-5 py-4 rounded-lg my-1`} />
            </div>
            <div className='w-full flex justify-center'>
              <textarea
                id="message"
                name="message"
                type="text"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.message}
                placeholder='Mensaje'
                className={`bg-white border-2 ${formik.errors.message && 'border-red-500'} w-full sm:w-1/2 px-5 py-4 rounded-lg my-1`}
              ></textarea>
            </div>

            <div className='flex justify-center mt-8 mb-20 w-full'>
              <div className='w-full sm:w-1/2 flex justify-center bg-blue-600'>
                <div className='flex w-full justify-between items-center'>
                  {
                    EnviandoCorreoContac !== true && <button
                      type="submit"
                      // onClick={limpiarinp}
                      className='px-8 py-2 border-2 cursor-pointer border-white rounded-lg text-white font-semibold'
                    >Enviar</button>
                  }


                  <div className='grid grid-cols-4 place-items-center gap-4'>
                    <img
                      className="h-8 w-auto sm:h-7 hover:cursor-pointer"
                      src="/ws.svg"
                      alt=""
                      layout='fill'
                      onClick={() => {
                        window.location.href = "https://wa.link/fm0w6y";
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
        </form>

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
                Correo electrónico : cipm3gh@gmail.com
              </h1>
            </div>
          </div>

        </div>
      </div>

    </div>
  )
}

export default Contact;
