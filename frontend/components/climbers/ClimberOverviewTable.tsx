import react, {useState} from "react";
import { Climber, Route } from "../../types";
import ClimberService from "../../services/ClimberService";
import RouteOverviewTable from "../routes/RouteOverviewTable";
import router, { useRouter } from "next/router";

type Props = {
    climbers: Array<Climber>;
}

const ClimberOverviewTable: react.FC<Props> = ({ climbers }: Props) => {

    const router = useRouter();

    const [showRoutes, setShowRoutes] = useState<boolean>(false);
    const [loadedRoutes, setLoadedRoutes] = useState<Array<Route>>([]);
    const [climber_id, setClimberId] = useState<number>(null);
    const [statusMessages, setStatusMessages] = useState("");

    const [expandedRow, setExpandedRow] = useState(null);
    const [selectedClimber, setSelectedClimber] = useState<Climber | null>(null);
    const [name, setName] = useState("");
    const [nameError, setNameError] = useState("");
    const [email, setEmail] = useState("");
    const [emailError, setEmailError] = useState("");
    const [password, setPassword] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [excecutionError, setExcecutionError] = useState("");

    const [flagged, setFlagged] = useState(false);

    const loadRoutes = async (climber_id: number) => {
        
        if(climber_id === null || climber_id === undefined){
            return;
        }

        const id = climber_id.toString();
        setClimberId(climber_id);
        const response = await ClimberService.getClimbedRoutes(id);
        const climber = await response.json();
        const routes = climber.user_routes.map(converter);
        setShowRoutes(true);
        setLoadedRoutes(routes);
    }

    const addToBuilder = async (climber_id: number) => {
        if(climber_id === null || climber_id === undefined){
            return;
        }

        const id = climber_id.toString();
        const response = await ClimberService.addToBuilder(id);
        const data = await response.json();
        if (response.status === 200) {
            setStatusMessages(data.message);
            setTimeout(() => {
                setStatusMessages("");
            }, 5000);
        } else {
            setStatusMessages(data.message);
        }
    }

    const cancelSelection = () => {
        setShowRoutes(false);
        setLoadedRoutes([]);
        setClimberId(null);
    }

    //Converting route in climber object to Route type
    const converter = (route: any) => {
        const newRoute: Route = {
            route_id: route.id,
            route_grade: route.grade,
            route_sectorId: route.sectorId,
            route_builders: route.builders,
            route_createdAt: route.createdAt,
            route_climbers: null,
        }
        return newRoute;
    }


    const validateName = () => {
        setNameError("");
        setExcecutionError("");
        setStatusMessages(null);
        if (!name || name.trim() === "") {
            setNameError("Name cannot be empty.");
            setFlagged(true);
        }
    }

    const validateEmail = () => {
        setEmailError("");
        setExcecutionError("");
        setStatusMessages(null);
        // check if email is empty
        if (!email || email.trim() === "") {
            setEmailError("Email cannot be empty.");
            setFlagged(true);
            return;
        }
        // check email regex
        const regex = /\S+@\S+\.\S+/;
        if (!regex.test(email)) {
            setEmailError("Email format is incorrect.");
            setFlagged(true);
            return;
        }
    }

    const validatePassword = () => {
        setPasswordError("");
        setExcecutionError("");
        setStatusMessages(null);
        if (!password || password.trim() === "") {
            setPasswordError("Password cannot be empty.");
            setFlagged(true);
        }
    }

    const handleEditFunction = (climber: Climber) => {
        setExpandedRow(climber);
        setSelectedClimber(climber);
    }

    const handleEditSave = async () => {

        // validate input
        validateName();
        validateEmail();
        validatePassword();
        if (flagged) {
            return;
        }

        selectedClimber.user_name = name;
        selectedClimber.user_email = email;
        selectedClimber.user_password = password;

        const res = await ClimberService.updateClimber(selectedClimber);
        const data = await res.json();

        if (res.status === 200) {
            setStatusMessages(data.message);
            setExpandedRow(null);
            setTimeout(() => {
                router.push("/climbers");
            }, 1000);
        } else {
            setExcecutionError(data.message);
            setStatusMessages(data.errorMessage);
        }
    };

    const handleEditCancel = () => {
        setSelectedClimber(null);
        setName("");
        setEmail("");
        setPassword("");
        setExcecutionError("");
        setExpandedRow(null);
    };



    return (
        <>
            {statusMessages && <p className={`font-bold ${statusMessages === "Climber added to builder." ? "text-green-500" : "text-red-500"}`}>{statusMessages}</p>}
            <table className="table-auto w-full">
                <thead>
                <tr className="bg-gray-100">
                    <th className="px-4 py-2">Id</th>
                    <th className="px-4 py-2">Naam</th>
                    <th className="px-4 py-2">E-mail</th>
                    <th className="px-4 py-2">Count of routes</th>
                    <th className="px-4 py-2">Edit climber/show climbed routes</th>
                    <th className="px-4 py-2">Make builder</th>
                </tr>
                </thead>
                <tbody>
                {climbers &&
                climbers.map((climber, index) => {
                    if (climber_id === climber.climber_id || climber_id === null) {
                        return (
                            <>
                                <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                                    <td className="border px-4 py-2">{climber.climber_id}</td>
                                    <td className="border px-4 py-2">{climber.user_name}</td>
                                    <td className="border px-4 py-2">{climber.user_email}</td>
                                    <td className="border px-4 py-2">{climber.user_routes.length}</td>
                                    <td className="border flex items-center justify-center hover:transition hover:bg-green-200"><img className='cursor-pointer' src="/edit.png" alt="Edit icon." width={50} height={50} onClick={() => handleEditFunction(climber)}/></td>
                                    <td className="border flex items-center justify-center hover:transition hover:bg-stone-200"><img className='cursor-pointer' src="/rock.png" alt="Icon to load routes of sector." width={50} height={50} onClick={() => loadRoutes(climber.climber_id) } /></td>
                                    <td className="border px-4 py-2 hover:transistion hover:bg-stone-200"><img className='cursor-pointer ml-auto mr-auto' src="/builder.png" alt="Icon to add this climber to builder" width={50} height={50} onClick={() => addToBuilder(climber.climber_id)}/></td>
                                </tr>
                                {expandedRow === climber && (
                                    <tr>
                                        <td colSpan={7} className='blur-none'>
                                            <div className="absolute top-0 left-0 right-0 bottom-0 bg-gray-200 z-10 flex justify-center items-center">
                                                <div className="bg-white w-1/3 p-4 shadow-lg rounded-lg">
                                                <h2 className="text-lg font-medium mb-4">
                                                    Edit Climber
                                                </h2>
                                                {excecutionError && (<div className="text-red-500 text-2xl font-bold text-center">{excecutionError}</div>)}
                                                <form className="flex flex-col gap-4">
                                                    <label className="font-medium">Name:</label>
                                                    <input
                                                    className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                                    type="text"
                                                    placeholder={selectedClimber.user_name}
                                                    onChange={(e) => setName(e.target.value)}
                                                    />
                                                    {nameError && <div className="text-red-500 text-xs italic">{nameError}</div>}
                                                    <label className="font-medium">Email:</label>
                                                    <input
                                                    className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                                    type="text"
                                                    placeholder={selectedClimber.user_email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                    />
                                                    {emailError && <div className="text-red-500 text-xs italic">{emailError}</div>}
                                                    <label className="font-medium">Password:</label>
                                                    <input
                                                    className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                                    type="text"
                                                    onChange={(e) => setPassword(e.target.value)}
                                                    />
                                                    {passwordError && <div className="text-red-500 text-xs italic">{passwordError}</div>}
                                                    <div className="flex justify-end gap-4">
                                                    <button
                                                        className="bg-blue-500 text-white rounded-lg px-4 py-2"
                                                        type="button"
                                                        onClick={handleEditSave}
                                                    >
                                                        Save
                                                    </button>
                                                    <button
                                                        className="bg-gray-500 text-white rounded-lg px-4 py-2"
                                                        type="button"
                                                        onClick={handleEditCancel}
                                                    >
                                                        Cancel
                                                    </button>
                                                    </div>
                                                </form>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>    
                                )}
                            </>
                        )                     
                    }
                })}
                </tbody>
            </table>
            <div className='mt-6'>
            {showRoutes && loadedRoutes.length > 0 && 
                <RouteOverviewTable routes={loadedRoutes} />}
                {showRoutes && loadedRoutes.length === 0 && 
                <p className='text-xl'>Klimmer met id {climber_id} heeft nog geen routes geklommen.</p>}
                {showRoutes === false &&
                <p className='text-xl'>Selecteer een klimmer om de routes weer te geven.</p>}
                {showRoutes &&  
                <button className='bg-slate-400 hover:transition hover:bg-slate-700 text-white font-bold py-2 px-4 rounded mt-4 mb-4' onClick={() => cancelSelection()}>Cancel climber selection</button>}   
            </div>
        </>
    )
}

export default ClimberOverviewTable;