import { headers } from "next/dist/client/components/headers"
import { Route } from "../types"
import { RouteCreate } from "../types"

const getAllRoutes = () => {
    return fetch(`${process.env.API_URL}/routes`)
}

//make an async create function
const createRoute = async (route: RouteCreate) => {
    const token = sessionStorage.getItem('token')
    const response = await fetch(`${process.env.API_URL}/routes/create`, {
        method: 'POST',
        body: JSON.stringify(route),
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        }
    })
    return response
}

const deleteRoute = async (id: number) => {
    const token = sessionStorage.getItem('token')
    const response = await fetch(`${process.env.API_URL}/routes/delete/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        }
    })
    return response.json()
}

const updateRoute = async (route: RouteCreate) => {
    const token = sessionStorage.getItem('token')
    try {
        const response = await fetch(`${process.env.API_URL}/routes/edit/${route.id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,

        },
        body: JSON.stringify(route)
        })
        return response
    } catch (error) {
        console.log(error)
    }   
}

const markRoute = async (routeId: number) => {
    const token = sessionStorage.getItem('token')
    const email = sessionStorage.getItem('email')
    try {
        const response = await fetch(`${process.env.API_URL}/routes/mark/${routeId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,

        },
        body: JSON.stringify({email: email})
        })
        return response.json()
    } catch (error) {
        console.log(error)
    }
}


const RouteService = {
    getAllRoutes,
    createRoute,
    deleteRoute,
    updateRoute,
    markRoute
}

export default RouteService