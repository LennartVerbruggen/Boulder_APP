import react, {useState} from "react";
import { Builder, Route } from "../../types";
import router, { useRouter } from "next/router";
import BuilderService from "../../services/BuilderService";
import RouteOverviewTable from "../routes/RouteOverviewTable";


type Props = {
    builders: Array<Builder>;
}

const BuilderOverviewTable: react.FC<Props> = ({ builders }: Props) => {

    const router = useRouter();

    const [statusMessages, setStatusMessages] = useState("");

    const [expandedRow, setExpandedRow] = useState(null);
    const [selectedBuilder, setSelectedBuilder] = useState<Builder | null>(null);
    const [name, setName] = useState("");
    const [nameError, setNameError] = useState("");
    const [email, setEmail] = useState("");
    const [emailError, setEmailError] = useState("");
    const [password, setPassword] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [excecutionError, setExcecutionError] = useState("");

    const [flagged, setFlagged] = useState(false);

    const [showRoutes, setShowRoutes] = useState<boolean>(false);
    const [loadedRoutes, setLoadedRoutes] = useState<Array<Route>>([]);
    const [builder_id, setBuilderId] = useState<number>(null);

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

    const handleEditFunction = (builder: Builder) => {
        setExpandedRow(builder);
        setSelectedBuilder(builder);
    }

    const handleEditSave = async () => {

        // validate input
        validateName();
        validateEmail();
        validatePassword();
        if (flagged) {
            return;
        }

        selectedBuilder.user_name = name;
        selectedBuilder.user_email = email;
        selectedBuilder.user_password = password;

        const res = await BuilderService.updateBuilder(selectedBuilder);
        const data = await res.json();

        if (res.status === 200) {
            setStatusMessages(data.message);
            setExpandedRow(null);
            setTimeout(() => {
                router.push("/builders");
            }, 1000);
        } else {
            setExcecutionError(data.message);
            setStatusMessages(data.errorMessage);
        }
    };

    const handleEditCancel = () => {
        setSelectedBuilder(null);
        setName("");
        setEmail("");
        setPassword("");
        setExcecutionError("");
        setExpandedRow(null);
    };

    const loadRoutes = async (builder_id: number) => {
        
        if(builder_id === null || builder_id === undefined){
            return;
        }

        const id = builder_id;
        setBuilderId(builder_id);
        const response = await BuilderService.getBuildRoutes(id);
        const builder = await response.json();
        const routes = builder.user_routes.map(converter);
        setShowRoutes(true);
        setLoadedRoutes(routes);
    }

    //Converting route in builder object to Route type
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

    const cancelSelection = () => {
        setShowRoutes(false);
        setLoadedRoutes([]);
        setBuilderId(null);
    }

    return (
        <>
            {statusMessages && <div className="text-green-500 text-2xl font-bold text-center">{statusMessages}</div>}
            <table className="table-auto w-full">
                <thead>
                <tr className="bg-gray-100">
                    <th className="px-4 py-2">Id</th>
                    <th className="px-4 py-2">Naam</th>
                    <th className="px-4 py-2">E-mail</th>
                    <th className="px-4 py-2">Count of routes</th>
                    <th className="px-4 py-2">Edit builder/Show build routes</th>
                </tr>
                </thead>
                <tbody>
                {builders &&
                builders.map((builder, index) => {
                    if(builder_id === builder.builder_id || builder_id === null) {
                        return (
                        <>
                        <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                            <td className="border px-4 py-2">{builder.builder_id}</td>
                            <td className="border px-4 py-2">{builder.user_name}</td>
                            <td className="border px-4 py-2">{builder.user_email}</td>
                            <td className="border px-4 py-2">{builder.user_routes.length}</td>
                            <td className="border flex items-center justify-center hover:transition hover:bg-green-200"><img className='cursor-pointer' src="/edit.png" alt="Edit icon." width={50} height={50} onClick={() => handleEditFunction(builder)}/></td>
                            <td className="border flex items-center justify-center hover:transition hover:bg-stone-200"><img className='cursor-pointer' src="/rock.png" alt="Icon to load routes of sector." width={50} height={50} onClick={() => loadRoutes(builder.builder_id) } /></td>
                        </tr>
                        {expandedRow === builder && (
                            <tr>
                                <td colSpan={7} className='blur-none'>
                                    <div className="absolute top-0 left-0 right-0 bottom-0 bg-gray-200 z-10 flex justify-center items-center">
                                        <div className="bg-white w-1/3 p-4 shadow-lg rounded-lg">
                                        <h2 className="text-lg font-medium mb-4">
                                            Edit Builder
                                        </h2>
                                        {excecutionError && (<div className="text-red-500 text-2xl font-bold text-center">{excecutionError}</div>)}
                                        <form className="flex flex-col gap-4">
                                            <label className="font-medium">Name:</label>
                                            <input
                                            className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                            type="text"
                                            placeholder={selectedBuilder.user_name}
                                            onChange={(e) => setName(e.target.value)}
                                            />
                                            {nameError && <div className="text-red-500 text-xs italic">{nameError}</div>}
                                            <label className="font-medium">Email:</label>
                                            <input
                                            className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                            type="text"
                                            placeholder={selectedBuilder.user_email}
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
                <p className='text-xl'>Bouwer met id {builder_id} heeft nog geen routes gebouwd.</p>}
                {showRoutes === false &&
                <p className='text-xl'>Selecteer een bouwer om de routes weer te geven.</p>}
                {showRoutes &&  
                <button className='bg-slate-400 hover:transition hover:bg-slate-700 text-white font-bold py-2 px-4 rounded mt-4 mb-4' onClick={() => cancelSelection()}>Cancel builder selection</button>}   
            </div>
        </>
    )
}

export default BuilderOverviewTable;