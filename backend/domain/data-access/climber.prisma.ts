import { PrismaClient, climber as prismaClimber } from "@prisma/client";
import { Climber } from "../model/climber";

const prisma = new PrismaClient();

//get all climbers
export async function getAllClimbers(): Promise<Climber[]> {
  const climbers: prismaClimber[] = await prisma.climber.findMany(
    {
        include: {routes: true},
        orderBy: {id: 'asc'}
    }
  );
  //console.log(climbers);
  return climbers.map(climber => Climber.from(<Climber><unknown>climber))
}

//get climber by email
export async function getClimberByEmail(email: string): Promise<Climber> {
  const climber: prismaClimber = await prisma.climber.findUnique({
    where: { email: email },
  });
  if (climber === null) {
    return null;
  }
  return Climber.from(<Climber><unknown>climber);
}

//create climber
export async function createClimber(json: any): Promise<Climber> {
  try {
    const newClimber: prismaClimber = await prisma.climber.create({
      data: {
        name: json.name,
        email: json.email,
        password: json.password,
      },
    });
    return Climber.from(<Climber><unknown>newClimber);
  } catch (error) {
    throw new Error("Could not create climber: " + error.message);
  }
}

//get climber by id
export async function getClimberById(id: number): Promise<Climber> {
  const climber: prismaClimber = await prisma.climber.findUnique({
    where: { id: id },
  });
  if (climber === null) {
    return null;
  }
  return Climber.from(<Climber><unknown>climber);
}

//get climber by email and different id
export async function getClimberByEmailAndId(email: string, id: number): Promise<Climber> {
    const climber: prismaClimber = await prisma.climber.findUnique({
        where: { email: email },
    });
    if (climber === null) {
        return null;
    }
    if (climber.id === id){
        return null;
    }
    return Climber.from(<Climber><unknown>climber);
}

//edit climber
export async function editClimber(id_to_edit: number, json: any): Promise<Climber> {
    try {
        const editedClimber: prismaClimber = await prisma.climber.update({
            where: { id: id_to_edit },
            data: {
                name: json.user_name,
                email: json.user_email,
                password: json.user_password,
            },
        });
        return Climber.from(<Climber><unknown>editedClimber);
    } catch (error) {
        throw new Error("Could not edit climber: " + error.message);
    }
}


//add route to climber list
export async function addRouteToClimberList(routeId: number, email: string): Promise<Climber> {
  const climber: prismaClimber = await prisma.climber.update({
    where: { email: email },
    data: {
      routes: {
        connect: {
          id: routeId,
        },
      },
    },
  });
  if (climber === null) {
    return null;
  }
  return Climber.from(<Climber><unknown>climber);
}

//get climbed routes from climber by id, also include the builders of these routes
export async function getClimbedRoutes(climberId: number): Promise<Climber> {
  const climber: prismaClimber = await prisma.climber.findUnique({
    where: { id: climberId },
    include: {
      routes: {
        include: {
          builders: true,
        },
      },
    },
  });
  if (climber === null) {
    return null;
  }
  return Climber.from(<Climber><unknown>climber);
}

export default { getAllClimbers, getClimberByEmail, createClimber, getClimberById, addRouteToClimberList, getClimberByEmailAndId, editClimber, getClimbedRoutes}
