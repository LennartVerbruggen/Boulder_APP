import React, { useState, useEffect } from "react";
import { Climber } from "../../types";
import ClimberOverviewTable from "../../components/climbers/ClimberOverviewTable";
import ClimberService from "../../services/ClimberService";
import Head from "next/head";
import Header from "../../components/header";
import Footer from "../../components/footer";

var showPage = false;

const Climbers: React.FC = () => {
    const [climbers, setClimbers] = useState<Array<Climber>>([])
    const getClimbers = async () => {
        try {
            const response = await ClimberService.getAllClimbers();
            const data = await response.json();
            setClimbers(data);
            showPage = true;
        } catch (error) {
            showPage = false;
            console.log("Error fetching players", error);
        }
    };

    useEffect(() => {
        getClimbers();
    }, []);

    return (
        <>
            <Head>
                <title>Climbers</title>
                <link rel="shortcut icon" href="../../public/favicon.png"/>
            </Head>
            <Header></Header>
            {showPage && (
                <div className="container mx-auto py-6">
                    <main className="mx-auto max-w-screen-lg">
                        <h2 className="text-4xl text-center mb-4">Climbers</h2>
                        <p className="py-4">Here you can find all the climbers.</p>
                        <ClimberOverviewTable climbers={climbers} />
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

export default Climbers;