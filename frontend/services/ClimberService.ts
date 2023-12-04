import { Climber } from "../types";

const getAllClimbers = async () => {
    const token = sessionStorage.getItem('token');
    console.log('getAllClimbers')
    return await fetch(`${process.env.API_URL}/climbers`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
    })
}

const loginClimber = async (climber: any) => {
     return fetch(`${process.env.API_URL}/climbers/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(climber)
    })
}

const logoutClimber = async (email: string) => {
    console.log('logoutClimber')
    return fetch(`${process.env.API_URL}/climbers/logout`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({email})
    })
}

const getClimbedRoutes = async (climberId: string) => {
    const token = sessionStorage.getItem('token');
    console.log('getClimbedRoutes')
    return await fetch(`${process.env.API_URL}/climbers/climbedRoutes/${climberId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
    })
}

const createClimber = async (climber: any) => {
    console.log('createClimber')
    return await fetch(`${process.env.API_URL}/climbers/create`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(climber)
    })
}

const addToBuilder = async (id: string) => {
    const token = sessionStorage.getItem('token');
    console.log('addToBuilder')
    return await fetch(`${process.env.API_URL}/climbers/addToBuilder`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({id})
    })
}

const updateClimber = async (climber: Climber) => {
    const token = sessionStorage.getItem('token');
    console.log('editClimber')
    return await fetch(`${process.env.API_URL}/climbers/edit/${climber.climber_id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(climber)
    })
}

const ClimberService = {
    getAllClimbers, loginClimber, logoutClimber, getClimbedRoutes, createClimber, addToBuilder, updateClimber
}

export default ClimberService