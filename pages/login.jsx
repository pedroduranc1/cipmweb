import React from 'react'

import Link from 'next/link';
import Head from 'next/head'

import { Form, Field, Formik } from 'formik'
import * as Yup from "yup";
import { useRouter } from 'next/router';
import { Auth } from '../db/Auth';
import { useAuth } from '../hooks/useAuth';

import { useToast } from "../src/components/ui/use-toast"
import { Loader2 } from 'lucide-react';


const AuthCtrl = new Auth();

const login = () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { login } = useAuth();
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const router = useRouter();

    const { toast } = useToast()
    return (
        <>
            <Head>
                <title>Login - CIPM</title>
                <link rel="icon" href="logo.svg" />
                <meta name="viewport" content="initial-scale=1.0, width=device-width" />
                <script async custom-element="amp-analytics" src="https://cdn.ampproject.org/v0/amp-analytics-0.1.js"></script>

            </Head>

            <div className="w-full h-full min-h-screen bg-blue-500 flex flex-col space-y-3 justify-center items-center">
                {/* Imagen CIPM */}
                <img src="/logo.svg" alt="" />

                {/* Formularion de login */}
                <div className="bg-white shadow-md w-[90%] md:w-[30%] transition-all h-fit rounded-md p-4 flex flex-col">
                    <h1 className="text-center font-bold text-2xl py-3">Login</h1>
                    <Formik
                        initialValues={{
                            email: '',
                            password: '',
                        }}
                        validationSchema={Yup.object({
                            email: Yup.string().required("Porfavor. Ingrese el correo"),
                            password: Yup.string().required("Porfavor. Ingrese la contraseña")
                        })}
                        onSubmit={async (values) => {
                            // same shape as initial values
                            const { email, password } = values

                            const data = await AuthCtrl.login(email, password);

                            if (typeof data === 'string' && data.startsWith("Firebase:")) {
                                // Es un error de Firebase
                                if (data == "Firebase: Error (auth/wrong-password).") {
                                    toast({
                                        variant: "destructive",
                                        title: "Login Error",
                                        description: "Contraseña Incorrecta",
                                    })
                                }

                                if (data == "Firebase: Error (auth/user-not-found).") {
                                    toast({
                                        variant: "destructive",
                                        title: "Login Error",
                                        description: "Su correo no existe",
                                    })
                                }

                            }
                            else {
                                const { accessToken, uid } = data;
                                await login(accessToken, uid);
                                router.push("/")
                            }

                        }}
                    >
                        {({ errors, touched, isValid, isSubmitting }) => (
                            <Form className="flex flex-col h-full p-4">
                                <label className="font-bold text-gray-600" htmlFor="password">Correo</label>
                                <Field className={`py-2 w-full ${errors.email && touched.email ? "border-red-500" : "border-gray-200"}  border-2 px-2 rounded-md outline-none focus:border-gray-400`} name="email" />
                                {errors.email && touched.email ? (
                                    <div>{errors.email}</div>
                                ) : null}

                                <label className="font-bold mt-3 text-gray-600" htmlFor="password">Contraseña</label>
                                <Field
                                    className={`py-2 w-full ${errors.password && touched.password ? "border-red-500" : "border-gray-200"}  border-2 px-2 rounded-md outline-none focus:border-gray-400`}
                                    name="password"
                                    type="password" />
                                {errors.password && touched.password ? (
                                    <div>{errors.password}</div>
                                ) : null}

                                <button
                                    disabled={isValid || isSubmitting ? false : true}
                                    className="py-2 px-4 mt-5 disabled:opacity-20 transition-colors bg-blue-500 
            rounded-md text-white hover:bg-blue-300 "
                                    type="submit">{isSubmitting ? <div className='w-full h-full flex justify-center items-center'><Loader2 className='animate-spin' /></div> : "Login"}</button>

                                <Link className="mt-3 inline-block" href="/registro" >No tienes cuenta? haz click aqui</Link>
                            </Form>
                        )}
                    </Formik>
                </div>

            </div>
        </>
    )
}

export default login