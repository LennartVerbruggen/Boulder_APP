const getAllBuilders = () => {
    const token = sessionStorage.getItem('token');
    console.log('getAllBuilders')
    return fetch(`${process.env.API_URL}/builders`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
    })
}

const updateBuilder = async (builder: any) => {
    const token = sessionStorage.getItem('token');
    console.log('updateBuilder')
    return await fetch(`${process.env.API_URL}/builders/edit/${builder.builder_id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(builder)
    })
}

const getBuildRoutes = async (id: number) => {
    const token = sessionStorage.getItem('token');
    console.log('getBuildRoutes')
    return await fetch(`${process.env.API_URL}/builders/buildRoutes/${id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
    })
}

const BuilderService = {
    getAllBuilders, updateBuilder, getBuildRoutes
}

export default BuilderService