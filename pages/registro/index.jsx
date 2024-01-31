import { Field, Form, Formik } from 'formik';
import Head from 'next/head'
import Link from 'next/link';
import React from 'react'
import * as Yup from "yup";
import { User } from "../../db/User";
import { toast } from '../../src/components/ui/use-toast';
import { useRouter } from 'next/router';
import { Loader2 } from 'lucide-react';

const userCtrl = new User();
const index = () => {
    const router = useRouter();
    return (
        <>
            <Head>
                <title>Registro - CIPM</title>
                <link rel="icon" href="logo.svg" />
                <meta name="viewport" content="initial-scale=1.0, width=device-width" />
                <script async custom-element="amp-analytics" src="https://cdn.ampproject.org/v0/amp-analytics-0.1.js"></script>

            </Head>

            <div className="w-full h-full min-h-screen bg-blue-500 flex flex-col space-y-3 justify-center items-center">
                {/* Imagen CIPM */}
                <img src="/logo.svg" alt="" />

                {/* Formularion de registro */}
                <div className="bg-white shadow-md w-[90%] md:w-[30%] h-fit rounded-md p-4 flex flex-col">
                    <h1 className="text-center font-bold text-2xl py-3">Registro</h1>
                    <Formik
                        initialValues={{
                            name: '',
                            lastName: "",
                            email: '',
                            password: '',
                        }}
                        validationSchema={Yup.object({
                            name: Yup.string().required("Porfavor. Ingrese el nombre completo"),
                            email: Yup.string().required("Porfavor. Ingrese el correo"),
                            password: Yup.string().required("Porfavor. Ingrese la contraseña")
                        })}
                        onSubmit={async (values) => {
                            // same shape as initial values
                            //console.log(values);

                            let UserData = {
                                nombre: values.name,
                                apellido: values.lastName,
                                email: values.email,
                                password: values.password
                            }

                            const result = await userCtrl.createUser(UserData)

                            if (!result) {
                                toast({
                                    variant: "destructive",
                                    title: "Error al registrarte",
                                })
                            } else {
                                router.push("/login")
                            }

                        }}
                    >
                        {({ errors, touched, isValid, isSubmitting }) => (
                            <Form className="flex flex-col h-full p-4">

                                <div className='flex space-x-3'>
                                    <div>
                                        <label className="font-bold text-gray-600" htmlFor="name">Nombre</label>
                                        <Field className={`py-2 w-full ${errors.name && touched.name ? "border-red-500" : "border-gray-200"}  border-2 px-2 rounded-md outline-none focus:border-gray-400`} name="name" />
                                        {errors.name && touched.name ? (
                                            <div>{errors.name}</div>
                                        ) : null}
                                    </div>

                                    <div>
                                        <label className="font-bold text-gray-600" htmlFor="lastName">Apellido</label>
                                        <Field className={`py-2 w-full ${errors.lastName && touched.lastName ? "border-red-500" : "border-gray-200"}  border-2 px-2 rounded-md outline-none focus:border-gray-400`} name="lastName" />
                                        {errors.lastName && touched.lastName ? (
                                            <div>{errors.lastName}</div>
                                        ) : null}
                                    </div>

                                </div>


                                <label className="font-bold text-gray-600" htmlFor="email">Correo</label>
                                <Field className={`py-2 w-full ${errors.email && touched.email ? "border-red-500" : "border-gray-200"}  border-2 px-2 rounded-md outline-none focus:border-gray-400`} name="email" />
                                {errors.email && touched.email ? (
                                    <div>{errors.email}</div>
                                ) : null}

                                <label className="font-bold text-gray-600" htmlFor="password">Contraseña</label>
                                <Field type="password" className={`py-2 w-full ${errors.password && touched.password ? "border-red-500" : "border-gray-200"}  border-2 px-2 rounded-md outline-none focus:border-gray-400`} name="password" />
                                {errors.password && touched.password ? (
                                    <div>{errors.password}</div>
                                ) : null}

                                <button
                                    disabled={isValid || isSubmitting ? false : true}
                                    className="py-2 px-4 mt-5 disabled:opacity-20 transition-colors bg-blue-500 
            rounded-md text-white hover:bg-blue-300 "
                                    type="submit">{isSubmitting ? <div className='w-full h-full flex justify-center items-center'><Loader2 className='animate-spin' /></div> : "Registrame"}</button>

                                <Link className="mt-3 inline-block" href="/login" >tienes cuenta? haz click aqui</Link>
                            </Form>
                        )}
                    </Formik>
                </div>
            </div>
        </>
    )
}

export default index