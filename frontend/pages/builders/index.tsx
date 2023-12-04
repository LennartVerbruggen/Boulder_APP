import React, { useState, useEffect } from "react";
import { Builder } from "../../types";
import BuilderOverviewTable from "../../components/builders/BuilderOverviewTable";
import BuilderService from "../../services/BuilderService";
import Head from "next/head";
import Header from "../../components/header";
import Footer from "../../components/footer";

var showPage = false;

const Builders: React.FC = () => {
    const [builders, setBuilders] = useState<Array<Builder>>([])
    const getBuilders = async () => {
        try {
            const response = await BuilderService.getAllBuilders();
            const data = await response.json();
            setBuilders(data);
            showPage = true;
        } catch (error) {
            showPage = false;
            console.log("Error fetching players", error);
        }
    };

    useEffect(() => {
        getBuilders();
    }, []);

    return (
        <>
            <Head>
                <title>Builders</title>
                <link rel="shortcut icon" href="../../public/favicon.png"/>
            </Head>
            <Header></Header>
            {showPage && (
                <div className="container mx-auto py-6">
                    <main className="mx-auto max-w-screen-lg">
                        <h2 className="text-4xl text-center mb-4">Builders</h2>
                        <p className="py-4">Here you can find all the builders.</p>
                        <BuilderOverviewTable builders={builders} />
                    </main>
                </div>
            )}
            {!showPage && (
                <div className="container mx-auto py-6">
                    <main className="mx-auto max-w-screen-lg">
                        <h2 className="text-red-500 text-lg font-bold mb-4 text-center">You are not authorized to view this page.</h2>
                    </main>
                </div>
            )}
            <Footer></Footer>
        </>
    )
}

export default Builders;