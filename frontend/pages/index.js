import Head from "next/head";
import Header from "../components/header";
import Footer from "../components/footer";
import ImageLoader from "../components/image";

const HomePage = () => {
    return (
        <>
            <Head>
                <title>Home</title>
                <link rel="shortcut icon" href="../../public/favicon.png"/>
            </Head>
            <Header></Header>
            <div className="container mx-auto py-6">
                <main className="mx-auto max-w-screen-lg">
                    <h2 className="text-4xl text-center mb-4">Welcome to klimzaal Boulder</h2>
                    <form className="m-5">
                        <button className="m-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                            <a href="/climbers/loginForm">Login</a>
                        </button>
                        <button className="m-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                            <a href="/climbers/createAccount">Register</a>
                        </button>
                    </form>
                    <p className="text-center text-lg mb-6">
                        This is a website for climbers and builders who love to explore new
                        sectors and routes.
                    </p>
                    <div className="flex justify-center mb-6">
                        <ImageLoader.MyImage />
                    </div>
                </main>
            </div>
            <Footer></Footer>
        </>
    );
};

export default HomePage;