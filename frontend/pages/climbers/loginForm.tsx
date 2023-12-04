import React, { useState, useEffect } from "react";
import Head from "next/head";
import Header from "../../components/header";
import Footer from "../../components/footer";
import ClimberLoginForm from "../../components/LoginForm";

const LoginForm: React.FC = () => {
    return (
        <>
            <Head>
                <title>Login</title>
            </Head>
            <Header></Header>
            <div className="container mx-auto py-6">
                <main className="mx-auto max-w-screen-lg">
                    <h2 className="text-4xl text-center mb-4">Login</h2>
                    <p className="py-4">Please fill in your email and password to log in.</p>
                    <ClimberLoginForm />
                </main>
            </div>
            <Footer></Footer>
        </>
    )
}

export default LoginForm;