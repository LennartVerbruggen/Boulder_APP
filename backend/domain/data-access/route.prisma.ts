import { PrismaClient, route as prismaRoute } from "@prisma/client";
import { Route } from "../model/route";

const prisma = new PrismaClient();

//get all routes
export async function getAllRoutes(): Promise<Route[]> {
  const routes: prismaRoute[] = await prisma.route.findMany(
    {
      orderBy: {
        id: 'asc'
      },
        include: {builders: true}
    }
  );
  return routes.map(route => Route.from(<Route><unknown>route))
}

//get a route by id if route not found return null
export async function getRouteById(id: number): Promise<Route> {
  const route: prismaRoute = await prisma.route.findUnique({
    where: {
      id: id
    },
  });
  if(route == null) return null;
  return Route.from(<Route><unknown>route);
}


//create a new route and link the builder to the route, return the new route with the builder
export async function createRoute(route: Route): Promise<Route> {
  const newRoute: prismaRoute = await prisma.route.create({
    data: {  
      sectorId: route.sectorId,
      grade: route.grade,
      createdAt: route.createdAt,
      builders: {
        connect: 
        route.builders.map(builder => {
          return {id: builder.id}
        }
        )
      }
    },
    include: {builders: true}
  });
  return Route.from(<Route><unknown>newRoute);
}

//Update a route
export async function updateRoute(route: Route): Promise<Route> {

  const updatedRoute: prismaRoute = await prisma.route.update({
    where: {
      id: route.id
    },
    data: {
      sectorId: route.sectorId,
      grade: route.grade,
      createdAt: route.createdAt,
      builders: {
        set : 
        route.builders.map(builder => {
          return {id: builder.id}
        })
      }
    },
    include: {builders: true}
  });
  return Route.from(<Route><unknown>updatedRoute);
}

//Delete a route and the connection with the builder
export async function deleteRoute(id: number): Promise<Route> {
  const deletedRoute: prismaRoute = await prisma.route.delete({
    where: {
      id: id
    },
    include: {builders: true}
  });
  return Route.from(<Route><unknown>deletedRoute);
}

export default { getAllRoutes, getRouteById, createRoute, updateRoute, deleteRoute}