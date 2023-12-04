const getAllSectors = async () => {
    console.log('getAllSectors')
    return await fetch(`${process.env.API_URL}/sectors`)
}

const clearSector = (id: number) => {
    const token = sessionStorage.getItem('token');
    return fetch(`${process.env.API_URL}/sectors/clearSector/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        }
    })
}

const getRoutesFromSector = async (id: string) => {
    const token = sessionStorage.getItem('token');
    return await fetch(`${process.env.API_URL}/sectors/${id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        },
    })
}

const SectorService = {
    getAllSectors,
    clearSector,
    getRoutesFromSector
}

export default SectorService