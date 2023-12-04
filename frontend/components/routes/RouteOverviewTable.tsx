import react, { useState } from 'react';
import { Route, RouteCreate, Builder } from '../../types';
import RouteService from '../../services/RouteService';
import router, { useRouter } from "next/router";
//import handleEditFunction from './EditModal';

type Props = {
    routes: Array<Route>;
}

const RouteOverviewTable: react.FC<Props> = ({ routes }: Props) => {
    const router = useRouter();

    const [selectedRoute, setSelectedRoute] = useState<RouteCreate | null>(null);
    const [expandedRow, setExpandedRow] = useState(null);

    //set errors and status messages
    const [sectorIdError, setSectorIdError] = useState("");
    const [gradeError, setGradeError] = useState("");
    const [buildersError, setBuildersError] = useState("");
    const [statusMessage, setStatusMessage] = useState("");
    const [excecutionError, setExcecutionError] = useState("");
    //Initialize state and variables
    const [sectorId, setSectorId] = useState("");
    const [grade, setGrade] = useState("");
    const [builders, setBuilders] = useState("");

    //Make original to compare with edited route
    const [originalRoute, setOriginalRoute] = useState<RouteCreate | null>(null);

    //Flag to check if there are errors
    const [flagged, setFlagged] = useState(false);

    const validateSectorId = () => {
        setSectorIdError("");
        setExcecutionError("");
        setStatusMessage(null)
        if (!sectorId || sectorId.trim() === "") {
            setSectorIdError("Sector ID is required");
            setFlagged(true);
        }
        };  
        
        const validateGrade = () => {
            setGradeError("");
            setExcecutionError("");
            setStatusMessage(null)
            if (!grade || grade.trim() === "") {
                setGradeError("Grade is required");
                setFlagged(true);
            }
        };
        
        const validateBuilders = () => {
            setBuildersError("");
            setExcecutionError("");
            setStatusMessage(null)
            if (!builders || builders.trim() === "") {
                setBuildersError("Builders are required");
                setFlagged(true)
            }
        };

    const handleEditFunction = (route: Route) => {
        //Edit scherm zichtbaar maken
        setExpandedRow(route);

        //Convert route to routeCreate
        let buildersArray = "";
        for (let builder of route.route_builders) {
            buildersArray += builder.email + ", ";
        }        
        const routeInput: RouteCreate = {
            sectorId: route.route_sectorId.toString(),
            grade: route.route_grade,
            builders: buildersArray,
            id: route.route_id,
            createdAt: route.route_createdAt,
            climbers: route.route_climbers
        }

        //Set route and show edit menu
        setSelectedRoute(routeInput);
    };

    const handleEditSave = async () => {

        //Validate input
        validateSectorId();
        validateGrade();
        validateBuilders();
        if(flagged) {
            return
        }

        selectedRoute.sectorId = sectorId;
        selectedRoute.grade = grade;
        selectedRoute.builders = builders;
        
        const res = await RouteService.updateRoute(selectedRoute);
        const data = await res.json();

        if (res.status === 200) {
            setStatusMessage("Route updated successfully");
            setExpandedRow(null);
            setTimeout(() => {
                router.push("/routes");
            }, 100);
        } else {
            setStatusMessage(data.errorMessage);
            setExcecutionError(data.message)
        }
    };

    const handleEditCancel = () => {
        setSelectedRoute(null);
        setSectorId('');
        setGrade('');
        setBuilders('');
        setExcecutionError('');
        setExpandedRow(null);
        setOriginalRoute(null);
    };

    const builderArrayToString = (builders: Array<any>) => {
        let builderString = "";
        for (let builder of builders) {
            builderString += builder.email + ", ";
        }
        return builderString;
    }

    const handleMarkRoute = async (id: number) => {
        const res = await RouteService.markRoute(id);
        if (res.status === 200) {
            setStatusMessage("Route marked successfully");
            setTimeout(() => {
                router.push("/routes");
            }, 1000);
        } else {
            setStatusMessage(res.message);
        }
    }

    const handleDeleteRoute = async (id: number) => {
        const res = await RouteService.deleteRoute(id);
        if (res.status === 200) {
            setStatusMessage("Route deleted successfully");
            setTimeout(() => {
                router.push("/routes");
            }, 1000);
        } else {
            setStatusMessage(res.message);
        }
    }    
    
    return (
        <>
            {statusMessage && (<div className={`text-2xl font-bold text-center ${statusMessage.includes("successfully") ? "text-green-500" : "text-red-500"}`}>{statusMessage}</div>)}
            <table className="table-auto w-full">
                <thead>
                    <tr className="bg-gray-100">
                        <th scope="col" className="px-4 py-2">Id</th>
                        <th scope="col" className="px-4 py-2">Sector ID</th>
                        <th scope="col" className="px-4 py-2">Grade</th>
                        <th scope="col" className="px-4 py-2">Created At</th>
                        <th scope="col" className="px-4 py-2">Builders email</th>
                        {sessionStorage.getItem("email") && <th scope="col" className="px-4 py-2">Edit/Delete</th>}
                        {sessionStorage.getItem("email") && <th scope="col" className="px-4 py-2">Mark route</th>}
                    </tr>
                </thead>
                <tbody>
                    {routes && routes.map((route, index) => (
                        <>
                                <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                                    <td className="border px-4 py-2">{route.route_id}</td>
                                    <td className="border px-4 py-2">{route.route_sectorId}</td>
                                    <td className="border px-4 py-2">{route.route_grade}</td>
                                    <td className="border px-4 py-2">{new Date(route.route_createdAt).toLocaleDateString()}</td>
                                    <td className="border px-4 py-2">{builderArrayToString(route.route_builders)}</td>
                                    {sessionStorage.getItem("email") && <td className="border flex items-center justify-center hover:transition hover:bg-green-200"><img className='cursor-pointer' src="/edit.png" alt="Edit icon." width={50} height={50} onClick={() => handleEditFunction(route)}/></td>}
                                    {sessionStorage.getItem("email") && <td className="border flex items-center justify-center hover:transition hover:bg-red-200"><img className='cursor-pointer' src="/delete.png" alt="Delete icon." width={50} height={50} onClick={() => handleDeleteRoute(route.route_id)}/></td>}
                                    {sessionStorage.getItem("email") && <td className="border px-4 py-2 hover:transition hover:bg-green-200"><img className='cursor-pointer ml-auto mr-auto pt-auto pt-auto' src='/check.png' alt='Check in the box' width={50} height={50} onClick={() => {handleMarkRoute(route.route_id)}}/></td>}
                                </tr>

                            {expandedRow === route && (
                            <tr>
                                <td colSpan={7} className='blur-none'>
                                    <div className="absolute top-0 left-0 right-0 bottom-0 bg-gray-200 z-10 flex justify-center items-center">
                                        <div className="bg-white w-1/3 p-4 shadow-lg rounded-lg">
                                        <h2 className="text-lg font-medium mb-4">
                                            Edit Route
                                        </h2>
                                        {excecutionError && (<div className="text-red-500 text-2xl font-bold text-center">{excecutionError}</div>)}
                                        <form className="flex flex-col gap-4">
                                            <label className="font-medium">Sector ID:</label>
                                            <input
                                            className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                            type="text"
                                            placeholder={selectedRoute.sectorId}
                                            onChange={(e) => setSectorId(e.target.value)}
                                            />
                                            {sectorIdError && <div className="text-red-500 text-xs italic">{sectorIdError}</div>}
                                            <label className="font-medium">Grade:</label>
                                            <input
                                            className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                            type="text"
                                            placeholder={selectedRoute.grade}
                                            onChange={(e) => setGrade(e.target.value)}
                                            />
                                            {gradeError && <div className="text-red-500 text-xs italic">{gradeError}</div>}
                                            <label className="font-medium">Builders email:</label>
                                            <input
                                            className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                            type="text"
                                            placeholder={selectedRoute.builders}
                                            onChange={(e) => setBuilders(e.target.value)}
                                            />
                                            {buildersError && <div className="text-red-500 text-xs italic">{buildersError}</div>}
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
                    ))}
                </tbody>
            </table>
        </>
    )
}

export default RouteOverviewTable;