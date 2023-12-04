import react, { use, useEffect, useState } from 'react';
import { Route, Sector } from '../../types';
import SectorService from '../../services/SectorService';
import RouteOverviewTable from '../routes/RouteOverviewTable';
import { useRouter } from 'next/router';

type Props = {
    sectors: Array<Sector>;
}




const SectorOverviewTable: react.FC<Props> = ({ sectors }: Props) => {
    const router = useRouter();

    const [showRoutes, setShowRoutes] = useState<boolean>(false);
    const [loadedRoutes, setLoadedRoutes] = useState<Array<Route>>([]);
    const [sectorId, setSectorId] = useState<number>(null);
    const [statusMessage, setStatusMessage] = useState<string>('');

    const loadRoutes = async (sector_id: number) => {
        
        if(sector_id === null || sector_id === undefined){
            return;
        }

        const id = sector_id.toString();
        setSectorId(sector_id);
        const response = await SectorService.getRoutesFromSector(id);
        const routes = await response.json();
        setShowRoutes(true);
        setLoadedRoutes(routes);
    }

    const cancelSelection = () => {
        setShowRoutes(false);
        setLoadedRoutes([]);
        setSectorId(null);
    }

    const handleClearSector = async (sector: any) => {
        if(sector.sector_routes.length > 0){
            const res = await SectorService.clearSector(sector.sector_id);
            if(res.status === 200){
                setStatusMessage('Sector is cleared successfully.');
                setTimeout(() => {
                    router.push("/sectors");
                }, 1000);
            } else {
                setStatusMessage("Something went wrong.");
            }
        } else {
            setStatusMessage("Sector is already empty.");
        }   
    }

    
    return (
        <>
            {statusMessage && (<div className={`text-2xl font-bold text-center ${statusMessage.includes("successfully") ? "text-green-500" : "text-red-500"}`}>{statusMessage}</div>)}
            <table className="table-auto w-full">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="px-4 py-2">Sector</th>
                        <th className="px-4 py-2">Karakteristieken</th>
                        <th className="px-4 py-2">Count of routes</th>
                        {sessionStorage.getItem("email") && <th className="px-4 py-2">Load all routes/Clear sector</th>}
                    </tr>
                </thead>
                <tbody>
                    {sectors &&
                        sectors.map((sector, index)  => {
                            if(sectorId === sector.sector_id || sectorId === null) {
                                return (
                                   <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                                        <td className="border px-4 py-2">{sector.sector_id}</td>
                                        <td className="border px-4 py-2">{sector.sector_karakteristieken}</td>
                                        <td className="border px-4 py-2">{sector.sector_routes.length}</td>
                                        {sessionStorage.getItem("email") && <td className="border flex items-center justify-center hover:transition hover:bg-stone-200"><img className='cursor-pointer' src="/rock.png" alt="Icon to load routes of sector." width={50} height={50} onClick={() => loadRoutes(sector.sector_id) } /></td>}
                                        {sessionStorage.getItem("email") && <td className="border flex items-center justify-center hover:transition hover:bg-red-200"><img className='cursor-pointer' src="/delete.png" alt="Delete icon." width={50} height={50} onClick={() => handleClearSector(sector)} /></td>}
                                    </tr> 
                                )
                            }
                        }
                    )}
                </tbody>
            </table>
            {sessionStorage.getItem("email") && <div className='mt-6'>
            {showRoutes && loadedRoutes.length > 0 && 
                <RouteOverviewTable routes={loadedRoutes} />}
                {showRoutes && loadedRoutes.length === 0 && 
                <p className='text-xl'>Er zijn geen routes beschikbaar voor sector {sectorId}.</p>}
                {showRoutes === false &&
                <p className='text-xl'>Selecteer een sector om de routes weer te geven.</p>}
                {showRoutes &&  
                <button className='bg-slate-400 hover:transition hover:bg-slate-700 text-white font-bold py-2 px-4 rounded mt-4 mb-4' onClick={() => cancelSelection()}>Cancel sector selection</button>}   
            </div> }
            
        </>
    )
}

export default SectorOverviewTable;
