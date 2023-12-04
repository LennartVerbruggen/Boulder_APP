import react, {useState} from "react";
import ClimberService from "../../services/ClimberService";
import router, {useRouter} from "next/router";

const createAccountForm: react.FC = () => {
    const router = useRouter();

    const [name, setName] = useState("");
    const [nameError, setNameError] = useState("");
    const [email, setEmail] = useState("");
    const [emailError, setEmailError] = useState("");
    const [password, setPassword] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [excecutionError, setExcecutionError] = useState("");
    const [statusMessages, setStatusMessages] = useState("");

    //Variable for checking if input is invalid
    const [flagged, setFlagged] = useState(false);

    const clearErrors = () => {
        setNameError("");
        setEmailError("");
        setPasswordError("");
        setExcecutionError("");
        setStatusMessages("");
        setFlagged(false);
    }

    const validateName = () => {
        if (!name || name.trim() === "") {
            setNameError("Name is required.");
            setFlagged(true);
        }
    }

    const validateEmail = () => {
        if (!email || email.trim() === "") {
            setEmailError("Email is required.");
            setFlagged(true);
        }
    }

    const validatePassword = () => {
        if (!password || password.trim() === "") {
            setPasswordError("Password is required.");
            setFlagged(true);
        }
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        clearErrors();

        validateName();
        validateEmail();
        validatePassword();

        if(flagged === false){
            const newClimber = {
                name: name,
                email: email,
                password: password
            }

            const response = await ClimberService.createClimber(newClimber);
            const data = await response.json();

            if (response.status === 200) {
                setStatusMessages("Climber created successfully");
                setTimeout(() => {
                    router.push("/climbers/loginForm");
                }, 500);
            } else {
                //setStatusMessages(data.message);
                setExcecutionError(data.message);
            }
        }
        else {
            return;
        }
    }

    return (
        <form className="w-full max-w-lg" onSubmit={handleSubmit}>
            {statusMessages && (<div className="text-green-500 text-2xl font-bold text-center">{statusMessages}</div>)}
            {excecutionError && (<div className="text-red-500 text-2xl font-bold text-center">{excecutionError}</div>)}
            <label className="block text-grey-700 font-bold mb-2" htmlFor="name">Name: </label>
            <input type="text" id="name" value={name} onChange={(event) => setName(event.target.value)} className="appearance-none border rounded w-full py-2 px-3 text-grey-700 leading-tight focus:outline-none focus:shadow-outline"/>
            {nameError && (<div className="text-red-500 text-xs italic">{nameError}</div>)}
            <label className="block text-gray-700 font-bold mb-2" htmlFor="email">Email: </label>
            <input type="text" id="email" value={email} onChange={(event) => setEmail(event.target.value)} className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"/>
            {emailError && (<div className="text-red-500 text-xs italic">{emailError}</div>)}
            <label className="block text-gray-700 font-bold mb-2" htmlFor="password">Password: </label>
            <input type="password" id="password" value={password} onChange={(event) => setPassword(event.target.value)} className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"/>
            {passwordError && (<div className="text-red-500 text-xs italic">{passwordError}</div>)}
            <button className="mt-6 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Create account</button>
        </form>
    )
}

export default createAccountForm;