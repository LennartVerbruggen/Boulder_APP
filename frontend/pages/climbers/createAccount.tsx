import React, { useState, useEffect } from "react";
import Head from "next/head";
import Header from "../../components/header";
import Footer from "../../components/footer";
import ClimberCreateAccountForm from "../../components/climbers/CreateAccountForm";

const CreateAccountForm: React.FC = () => {
    return (
        <>
            <Head>
                <title>Create Account</title>
            </Head>
            <Header></Header>
            <div className="container mx-auto py-6">
                <main className="mx-auto max-w-screen-lg">
                    <h2 className="text-4xl text-center mb-4">Create Account</h2>
                    <p className="py-4">Please fill in your details to create an account.</p>
                    <ClimberCreateAccountForm />
                </main>
            </div>
            <Footer></Footer>
        </>
    )
}

export default CreateAccountForm;