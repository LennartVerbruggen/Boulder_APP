import Link from "next/link"
import { useRouter } from 'next/router';
import LogoutForm from "./LogoutForm";

const header : React.FC = () => {

    const router = useRouter();
    const user = typeof window !== "undefined" ? sessionStorage.getItem("email") : null;

    return (
        <header className="bg-gray-200 py-4 px-10">
            <div className="container mx-auto flex items-center justify-between">
                <h1 className="text-3xl font-bold">Boulder</h1>
                <nav className="flex">
                    <Link href="/" className={`mx-4 text-lg ${router.pathname === "/" ? "text-emerald-500" : "hover:text-emerald-400"}`}>Home</Link>
                    <Link href="/sectors" className={`mx-4 text-lg ${router.pathname === "/sectors" ? "text-emerald-500" : "hover:text-emerald-400"}`}>Sectors</Link>
                    <Link href="/routes" className={`mx-4 text-lg ${router.pathname === "/routes" ? "text-emerald-500" : "hover:text-emerald-400"}`}>Routes</Link>
                    {user && <Link href="/builders" className={`mx-4 text-lg ${router.pathname === "/builders" ? "text-emerald-500" : "hover:text-emerald-400"}`}>Builders</Link>}
                    {user &&<Link href="/climbers" className={`mx-4 text-lg ${router.pathname === "/climbers" ? "text-emerald-500" : "hover:text-emerald-400"}`}>Climbers</Link>}
                </nav>
                <LogoutForm/>
            </div>
        </header>

    )
}

export default header