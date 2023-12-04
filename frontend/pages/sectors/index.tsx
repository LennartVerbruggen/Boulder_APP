import React, { useState, useEffect } from "react";
import { Sector } from "../../types";
import SectorOverviewTable from "../../components/sectors/SectorOverviewTable";
import SectorService from "../../services/SectorService";
import Head from "next/head";
import Header from "../../components/header";
import Footer from "../../components/footer";

const Sectors: React.FC = () => {
    const [sectors, setSectors] = useState<Array<Sector>>([])
    const getSectors = async () => {
        try {
            const response = await SectorService.getAllSectors();
            const data = await response.json();
            setSectors(data);
        } catch (error) {
            console.log("Error fetching players", error);
        }
    };

    useEffect(() => {
        getSectors();
    }, []);

    return (
        <>
            <Head>
                <title>Sectors</title>
            </Head>
            <Header></Header>
            <div className="container mx-auto py-6">
                <main className="mx-auto max-w-screen-lg">
                    <h2 className="text-4xl text-center mb-4">Sectors</h2>
                    <p className="py-4 text-xl">Here you can find all the sectors.</p>
                    <SectorOverviewTable sectors={sectors} />
                </main>
            </div>
            <Footer></Footer>
        </>
    )
}

export default Sectors;