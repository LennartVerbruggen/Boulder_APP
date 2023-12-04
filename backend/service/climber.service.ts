import prismaBuilder from "../domain/data-access/builder.prisma";
import prismaClimber from "../domain/data-access/climber.prisma";
import { Climber } from "../domain/model/climber";
import { Builder } from "../domain/model/builder";
import bcrypt from "bcrypt";
import { generateJwtToken, endJwtToken } from "../jwt";

const getAllClimbers = () => {return prismaClimber.getAllClimbers();}
const createClimber = (json: any) => {return prismaClimber.createClimber(json)};
const hashPassword = (password: string) => {return bcrypt.hash(password, 10);}
const editClimber = (id: number, json: any) => {return prismaClimber.editClimber(id, json);}
const getClimberById = (id: number) => {return prismaClimber.getClimberById(id);}
const getClimberByEmail = (email: string) => {return prismaClimber.getClimberByEmail(email);}
const getClimberByEmailAndId = (email: string, id: number) => {return prismaClimber.getClimberByEmailAndId(email, id);}
const logout = (email: string) => {
    return endJwtToken(email);
}
const addRouteToClimberList = (id: number, email: string)=> {return prismaClimber.addRouteToClimberList(id, email);}
const authenticateClimber = async (email: string, password: string) => {
    //check password
    const climber = await getClimberByEmail(email);
    const isValidPassword = await bcrypt.compare(password, climber.password);
    if (!isValidPassword) {
        return null;
    }
    return generateJwtToken(climber.email);
}

const getClimbedRoutes = (climberId: number) => { return prismaClimber.getClimbedRoutes(climberId);}

export default { getAllClimbers, createClimber, getClimberByEmail, getClimberById, addRouteToClimberList, getClimberByEmailAndId, logout, editClimber, authenticateClimber, hashPassword, getClimbedRoutes};