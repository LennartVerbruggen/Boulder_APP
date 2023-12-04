import react, { useState } from "react";
import RouteService from "../../services/RouteService";
import  { useRouter } from "next/router";


type Props = {
    onSubmit: (route: any) => void;
};

const RouteForm: react.FC<Props> = ({ onSubmit }: Props) => {

    const router = useRouter()

    //Initialize variables and corresponding error messages
    const [sectorId, setSectorId] = useState("");
    const [sectorIdError, setSectorIdError] = useState("");
    const [grade, setGrade] = useState("");
    const [gradeError, setGradeError] = useState("");
    const [builders, setBuilders] = useState("");
    const [buildersError, setBuildersError] = useState("");

    //Initialize backend errors and status messages
    const [statusMessage, setStatusMessage] = useState("");
    const [excecutionError, setExcecutionError] = useState("");

    //Variable for checking if input is invalid    
    const [flagged, setFlagged] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();

        validateSectorId();
        validateGrade();
        validateBuilders();

        if(flagged){
            return;
        }

        const newRoute = {
            sectorId: sectorId,
            grade: grade,
            builders: builders
        };

        const res = await RouteService.createRoute(newRoute);
        const data = await res.json()
        if (res.status === 200) {
            setStatusMessage("Route created successfully");
            setTimeout(() => {
                router.push("/routes");
            }, 1000);
        } else {
            setStatusMessage(data.errorMessage);
            setExcecutionError(data.message)
        }

    };
    
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
            setFlagged(true);
        }
    };


  return (
    <>
        {statusMessage && ( <div className={`font-bold ${ statusMessage === "Route created successfully" ? "text-green-500" : "text-red-500" }`}>{statusMessage}</div>) }
        <form className="bg-white p-4 rounded-md shadow-md" onSubmit={handleSubmit}>
            {excecutionError && (<div className="text-red-500 text-2xl font-bold text-center">{excecutionError}</div>)}
            <div className="mb-4">
                <label className="block text-gray-700 font-bold mb-2" htmlFor="sectorId">
                Sector ID:
                </label>
                <input
                className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="sectorId"
                type="text"
                value={sectorId}
                onChange={(event) => setSectorId(event.target.value)}
                />
                {sectorIdError && <div className="text-red-500 text-xs italic">{sectorIdError}</div>}
            </div>
            <div className="mb-4">
                <label className="block text-gray-700 font-bold mb-2" htmlFor="grade">
                Grade:
                </label>
                <input
                className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="grade"
                type="text"
                value={grade}
                onChange={(event) => setGrade(event.target.value)}
                />
                {gradeError && <div className="text-red-500 text-xs italic">{gradeError}</div>}
            </div>
            <div className="mb-4">
                <label className="block text-gray-700 font-bold mb-2" htmlFor="builders">
                Builders:
                </label>
                <input
                className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="builders"
                type="text"
                value={builders}
                onChange={(event) => setBuilders(event.target.value)}
                />
                {buildersError && <div className="text-red-500 text-xs italic">{buildersError}</div>}
            </div>
            <div className="flex justify-end">
                <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="submit"
                >
                Create Route
                </button>
            </div>
        </form>
    </>
  );
}

export default RouteForm;