import React, { useState } from 'react'
import * as emailjs from '@emailjs/browser'
import swal from 'sweetalert'
import { useFormik } from 'formik';
import * as Yup from 'yup';

const Plans = () => {
  const [EnviandoCorreoPlans, setEnviandoCorreoPlans] = useState(false)

  const formik = useFormik({
    initialValues: {
      nombrecompleto: '',
      email: '',
      message: '',
      telefono: 'No Disponible'
    },
    validationSchema: Yup.object({
      nombrecompleto: Yup.string()
        .required('Required'),
      email: Yup.string()
        .email('Invalid email address')
        .required('Required'),
      message: Yup.string()
        .required('Required'),
    }),
    onSubmit: (values) => {

      let valuesemaill = {
        nombre: values.nombrecompleto,
        from_name: values.email,
        message: values.message,
        telefono: values.telefono
      }

      setEnviandoCorreoPlans(true)
      emailjs.send('service_zf4o6rf', 'template_ba8iocf', valuesemaill, 'mHjoux4EbEL8zmau2')
        .then(function (response) {
          swal(`Felicidades ${valuesemaill.nombrecompleto}`, "Tu correo a sido enviado con exito", "success");
          limpiarinp()
          setEnviandoCorreoPlans(false)
        }, function (error) {
          swal("Oops", "Ocurrio un error al enviar el correo", "error");
          setEnviandoCorreoPlans(false)
        });
    },
  });

  const limpiarinp = () => {
    formik.values.nombrecompleto = ""
    formik.values.email = ""
    formik.values.message = ""
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6">
      <div className="flex flex-col justify-between py-6 px-10 md:px-20 md:justify-start md:space-x-10">
        <h1 className='mt-8 mb-8 text-slate-800 text-center text-3xl font-semibold'>Nuestros planes</h1>
        <div className='grid grid-cols-1  md:grid-cols-4 gap-4'>
          <div className='p-6 flex flex-col border-2 border-yellow-400 rounded-2xl'>
            <h1 className='text-center mt-4 text-lg text-yellow-400 font-semibold'>Personalizada</h1>
            <h1 className='font-bold mt-6 uppercase text-center text-gray-600 text-3xl'>275 MXN</h1>
            <p className='text-center text-xs mt-2'>Por hora</p>
            <hr className='border-2 border-yellow-400 my-4' />
            <p className='text-center mt-4 text-xs'>Clases individuales <br />
              Minimo 3 horas por semana <br />
              Lunes - Viernes
            </p>
            <p className='text-center mt-4 mb-8 text-xs'>
              12 semanas
            </p>
          </div>
          <div className='p-6 flex flex-col border-2 border-blue-600 rounded-2xl'>
            <h1 className='text-center mt-4 text-lg text-blue-600 font-semibold'>Grupal</h1>
            <h1 className='font-bold mt-6 uppercase text-center text-gray-600 text-3xl'>375 MXN</h1>
            <p className='text-center text-xs mt-2'>Cuota semanal</p>
            <hr className='border-2 border-blue-600 my-4' />
            <p className='text-center mt-4 text-xs'>Clases Grupales <br />
              Horario de Lunes - Viernas <br />

            </p>
            <p className='text-center mt-8 mb-8 text-xs'>
              12 semanas
            </p>
          </div>
          <div className='p-6 flex flex-col border-2 border-violet-700 rounded-2xl'>
            <h1 className='text-center mt-4 text-lg text-violet-700 font-semibold'>Grupal, Fin de semana</h1>
            <h1 className='font-bold mt-6 uppercase text-center text-gray-600 text-3xl'>225 MXN</h1>
            <p className='text-center text-xs mt-2'>Por hora</p>
            <hr className='border-2 border-violet-700 my-4' />
            <p className='text-center mt-4 text-xs'>Clases grupales <br />
              3 horas por dia <br />
              Fines de semana
            </p>
            <p className='text-center mt-4 mb-8 text-xs'>
              20 semanas
            </p>
          </div>
          <div className='p-6 flex flex-col border-2 border-pink-500 rounded-2xl'>
            <h1 className='text-center mt-4 text-lg text-pink-500 font-semibold'>Super Intensivo</h1>
            <h1 className='font-bold mt-6 uppercase text-center text-gray-600 text-3xl'>3.500 MXN</h1>
            <p className='text-center text-xs mt-2'>Total</p>
            <hr className='border-2 border-pink-500 my-4' />
            <p className='text-center mt-4 text-xs'>Intensivo de 1 semana <br />
              Lunes - Sabado <br />
              9-6 pm + hora de comida
            </p>
            <p className='text-center mt-4 mb-8 text-xs'>
              1 semana
            </p>
          </div>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-4 gap-y-4 md:gap-y-0 md:gap-4 mt-8 mb-20'>
          <div className='col-span-1 p-6 flex flex-col border-2 border-green-400 rounded-2xl'>
            <h1 className='text-center mt-4 text-lg text-green-400 font-semibold'>Curso pregrabado</h1>
            <h1 className='font-bold mt-6 uppercase text-center text-gray-600 text-3xl'>500 MXN</h1>
            <p className='text-center text-xs mt-2'></p>
            <hr className='border-2 border-green-400 my-4' />
            <p className='text-center mt-4 text-xs'>48GB <br />
              8.5 horas de video <br />
              55 estructuras del lenguaje <br />
              +500 palabras comunes <br />
              interferencias de español
            </p>
            <p className='text-center mt-4 mb-8 text-xs'>
              12 semanas
            </p>
          </div>
          <div className='col-span-3 p-6 flex flex-col border-2 border-gray-700 rounded-2xl'>
            <h1 className='text-center mt-4 text-lg text-gray-700 font-semibold'>Estoy interesado/a</h1>
            <div className='grid grid-cols-1 md:grid-cols-2 md:gap-4 my-8'>
              <form onSubmit={formik.handleSubmit}>
                <div className='grid md:border-r-2 border-gray-700 items-center px-4 gap-y-4'>
                  <input
                    type="text"
                    placeholder='Nombre y apellido'
                    id="nombrecompleto"
                    name="nombrecompleto"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.nombrecompleto}
                    className={`w-full px-6 py-2 border-2 border-gray-700 ${formik.errors.nombrecompleto && 'border-red-500'}
                    placeholder:text-gray-400 rounded-full`}
                  />
                  <input
                    type="email"
                    placeholder='Correo electronico'
                    id="email"
                    name="email"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.email}
                    className={`w-full px-6 py-2 border-2 border-gray-700 ${formik.errors.email && 'border-red-500'}
                    placeholder:text-gray-400 rounded-full`}  />
                  <textarea
                    className={`w-full px-6 py-2 border-2 border-gray-700 ${formik.errors.message && 'border-red-500'}
                    placeholder:text-gray-400 rounded-full`}
                    placeholder='mensaje'
                    id="message"
                    name="message"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.message}></textarea>
                  {
                    EnviandoCorreoPlans !== true && <button
                      type='submit'
                      className='w-full bg-yellow-500 py-2 font-semibold
                   text-gray-700 rounded-full'>Enviar</button>
                  }

                </div>
              </form>

              <div className='grid items-center p-8'>
                <h1 className='text-center mb-8 md:mb-0'>O Escribenos por cualquier red social</h1>
                <div className='grid grid-cols-4 place-items-center gap-2'>
                  <img
                    className="h-8 w-auto sm:h-14 hover:cursor-pointer"
                    src="/ws.svg"
                    alt=""
                    layout='fill'
                    onClick={() => {
                      window.location.href = "https://wa.link/8ebgdv";
                    }}
                  ></img>

                  <img
                    className="h-8 w-auto sm:h-14 hover:cursor-pointer"
                    src="/fb.svg"
                    alt=""
                    layout='fill'
                    onClick={() => {
                      window.location.href = "https://www.facebook.com/olympusgroupmx";
                    }}
                  ></img>

                  <img
                    className="h-8 w-auto sm:h-14 hover:cursor-pointer"
                    src="/tiktok.svg"
                    alt=""
                    layout='fill'
                    onClick={() => {
                      window.location.href = "https://www.tiktok.com/@adrianlealcaldera?lang=en";
                    }}
                  ></img>

                  <img
                    className="h-8 w-auto sm:h-16 hover:cursor-pointer"
                    src="/youtube.svg"
                    alt=""
                    layout='fill'
                    onClick={() => {
                      window.location.href = "https://youtube.com/channel/UCV2OnDpkWlcIdpNoilCBiYA";
                    }}
                  ></img>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Plans;
