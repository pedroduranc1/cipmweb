import React from 'react'

import Link from 'next/link';
import Head from 'next/head'

import { Form, Field, Formik } from 'formik'
import * as Yup from "yup";
import { Auth } from "../../db/Auth";
import { useAuth } from "../../hooks/useAuth";
import { useRouter } from 'next/router';

const AuthCtrl = new Auth();
const index = () => {

    const {login} = useAuth();
    const router = useRouter();

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
                <div className="bg-white shadow-md w-[30%] transition-all h-fit rounded-md p-4 flex flex-col">
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

                            //accessToken
                            const {uid,accessToken} = await AuthCtrl.login(email, password);
                            await login(accessToken,uid);
                            router.push('/');
                        }}
                    >
                        {({ errors, touched }) => (
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

                                <button className="py-2 px-4 mt-5 bg-blue-500 rounded-md text-white hover:bg-blue-300 transition-colors " type="submit">Login</button>
                                <Link className="mt-3 inline-block" href="/registro" >No tienes cuenta? haz click aqui</Link>
                            </Form>
                        )}
                    </Formik>
                </div>

            </div>
        </>
    )
}

export default index;