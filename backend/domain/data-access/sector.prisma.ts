import { PrismaClient, sector as prismaSector, route as prismaRoute } from "@prisma/client";
import { Sector } from "../model/sector";
import {Route} from "../model/route";

const prisma = new PrismaClient();

//get all sectors
export async function getAllSectors(): Promise<Sector[]> {
  const sectors: prismaSector[] = await prisma.sector.findMany(
    {
        include: {routes: true}
    }
  );
  //console.log(sectors);
  return sectors.map(sector => Sector.from(<Sector><unknown>sector))
}

//get all routes from a sector and connections with builders
export async function getRoutesFromSectorById(id: number): Promise<Route[]> {
  const routes: prismaRoute[] = await prisma.route.findMany(
    {
        where: {sectorId: id},
        include: {builders: true}
    }
  );
  return routes.map(route => Route.from(<Route><unknown>route))
}

//validate sector by id
export async function validateSectorById(id: number): Promise<boolean> {
  const sector: prismaSector = await prisma.sector.findUnique({
    where: {
      id: id
    }
  });
  if(sector) {
    return true;
  }
  return false;
}

//Delete all routes from a sector by id and connections with builders
export async function clearSector(id: number): Promise<boolean> {
  const routes: prismaRoute[] = await prisma.route.findMany(
    {
        where: {sectorId: id},
    }
  )
  if(routes) {
    for(let i = 0; i < routes.length; i++) {
      await prisma.route.delete({
        where: {
          id: routes[i].id
        }
      })
    }
    return true;
  }
  return false;
}


export default { getAllSectors, getRoutesFromSectorById, validateSectorById, clearSector }