import react, {useState} from "react";
import ClimberService from "../services/ClimberService";
import router, {useRouter} from "next/router";

const LoginForm: react.FC = () => {
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [emailError, setEmailError] = useState("");
    const [password, setPassword] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [excecutionError, setExcecutionError] = useState("");
    const [statusMessages, setStatusMessages] = useState("");

    const clearErrors = () => {
        setEmailError("");
        setPasswordError("");
        setExcecutionError("");
        setStatusMessages("");
    }


    const handleSubmit = async (event) => {
        event.preventDefault();

        clearErrors();

        const climber = {
            email: email,
            password: password
        }

        const response = await ClimberService.loginClimber(climber);
        const res = await response.json();
        if (response.status === 200){
            setStatusMessages(res.message);
            const { token } = await res;
            sessionStorage.setItem("token", token);
            sessionStorage.setItem("email", email);
            setTimeout(() => {
                router.push("/")
            }, 1000)
        }
        else {
            setStatusMessages(res.message);
        }
    }

    return (
        <form className="w-full max-w-lg" onSubmit={handleSubmit}>
        {statusMessages && (
            <div className={`font-bold ${
            statusMessages === "Authentication successful." ? "text-green-500" : "text-red-500"
            }`}>{statusMessages}</div>
        )}
        <label className="block text-gray-700 font-bold mb-2" htmlFor="email">Email: </label>
        <input type="text" id="email" value={email} onChange={(event) => setEmail(event.target.value)} className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"/>
        <label className="block text-gray-700 font-bold mb-2" htmlFor="password">Password: </label>
        <input type="password" id="password" value={password} onChange={(event) => setPassword(event.target.value)} className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"/>
        <button className="mt-6 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Log in</button>
        </form>
    )
}

export default LoginForm;