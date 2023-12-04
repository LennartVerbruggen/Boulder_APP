import Routetable from "../../components/routes/RouteOverviewTable";
import RouteService from "../../services/RouteService";
import React, { useState, useEffect } from "react";
import Head from "next/head";
import { Route } from "../../types";
import Header from "../../components/header";
import Footer from "../../components/footer";
import RouteForm from "../../components/routes/CreateRouteForm";
import useInterval from "use-interval";

const Routes: React.FC = () => {
    const [routes, setRoutes] = useState<Array<Route>>([])
    const getRoutes = async () => {
        RouteService.getAllRoutes()
            .then((response) => response.json())
            .then((routes) => setRoutes(routes))
    };
    useInterval(getRoutes, 60000);
    useEffect(() => {
        getRoutes();
    }, []);

    return (
        <>
            <Head>
                <title>Routes</title>
            </Head>
            <Header></Header>
            <div className="container mx-auto py-6">
                <main className="mx-auto max-w-screen-lg">
                    <h2 className="text-4xl text-center mb-4">Routes</h2>
                    {sessionStorage.getItem("email") && <RouteForm onSubmit={RouteService.createRoute} />}
                    <h2 className="py-4">Here you can find all the routes.</h2>
                    <Routetable routes={routes}/>
                </main>
            </div>
            <Footer></Footer>
        </>
    )
}

export default Routes;