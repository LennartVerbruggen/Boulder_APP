import {Route} from '../domain/model/route';
import routePrisma from '../domain/data-access/route.prisma';

const getAllRoutes = () => {return routePrisma.getAllRoutes();}

const getRouteById = (id: number) => {return routePrisma.getRouteById(id);}

const createRoute = (route: Route) => {return routePrisma.createRoute(route);}

const updateRoute = (route: Route) => {return routePrisma.updateRoute(route);}

const deleteRoute = (id: number) => {return routePrisma.deleteRoute(id);}


export default { getAllRoutes, getRouteById, createRoute, updateRoute, deleteRoute }