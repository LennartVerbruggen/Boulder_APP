import prismaBuilder from "../domain/data-access/builder.prisma";
import { Climber } from "../domain/model/climber";
import { Builder } from "../domain/model/builder";

const getAllBuilders = () => {return prismaBuilder.getAllBuilders();}
const addClimberToBuilder = (newClimber: Climber) => {return prismaBuilder.addClimberToBuilder(newClimber)};
const getBuilderByEmail = (email: string) => {return prismaBuilder.getBuilderByEmail(email);}
const getBuilderById = (id: number) => {return prismaBuilder.getBuilderById(id);}
const getBuilderByEmailAndId = (email: string, id: number) => {return prismaBuilder.getBuilderByEmailAndId(email, id);}
const editBuilder = (id: number, json: any) => {return prismaBuilder.editBuilder(id, json);}
const getBuildRoutesFromBuilder = (id: number) => {return prismaBuilder.getBuildRoutesFromBuilder(id);}

export default { getAllBuilders, addClimberToBuilder, getBuilderByEmail, getBuilderById, getBuilderByEmailAndId, editBuilder, getBuildRoutesFromBuilder};
