import react, {useEffect, useState} from "react";
import ClimberService from "../services/ClimberService";
import router, {useRouter} from "next/router";

const LogoutForm: react.FC = () => {
    //Checking if user is logged in to show/don't show logout button
    const router = useRouter();

    const [loggedIn, setLoggedIn] = useState(true);
    const [statusMessage, setStatusMessage] = useState<string>('');

    useEffect(() => {
        const emailCheck = typeof window !== "undefined" ? sessionStorage.getItem("email") : null;
        if (!emailCheck || emailCheck === null || emailCheck.trim() === "") {
            setLoggedIn(false);
        }
    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault();
        const email = sessionStorage.getItem("email");
        const response = await ClimberService.logoutClimber(email);
        const res = await response.json();
        if (response.status === 200){
            setStatusMessage("Logged out.");
            sessionStorage.removeItem("token");
            sessionStorage.removeItem("email");
            setTimeout(() => {
                router.push("/")
            }, 500);
        }
        else {
            setStatusMessage(res.message);
        }
    }

    return (
        <>
            {statusMessage && <p className="text-red-600">{statusMessage}</p>}
            <form className="pl-3" onSubmit={handleSubmit}>
                {loggedIn && <button className="bg-emerald-500 hover:bg-emerald-400 text-white font-bold py-2 px-4 rounded" type="submit">Logout</button>}
            </form>
        </>
    )
}

export default LogoutForm