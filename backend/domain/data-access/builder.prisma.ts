import {Builder} from "../model/builder"; 
import {Climber} from "../model/climber";
import { PrismaClient, builder as prismaBuilder } from "@prisma/client";

const prisma = new PrismaClient();

async function getAllBuilders(): Promise<Builder[]> {
    const builders: prismaBuilder[] = await prisma.builder.findMany(
      {
          include: {routes: true},
          orderBy: {id: 'asc'}
      }
    );
    return builders.map(builder => Builder.from(<Builder><unknown>builder))
}

async function createBuilder(json: any): Promise<Builder> {
    const newBuilder: prismaBuilder = await prisma.builder.create({
      data: {
        name: json.name,
        email: json.email,
        password: json.password,
      },
    });
    return Builder.from(<Builder><unknown>newBuilder);
  }

async function addClimberToBuilder(Climber: Climber): Promise<Builder> {
    const newBuilder: prismaBuilder = await prisma.builder.create({
      data: {
        name: Climber.name,
        email: Climber.email,
        password: Climber.password,
    },
    });
    return Builder.from(<Builder><unknown>newBuilder);
  }

async function getBuilderByEmail(email: string): Promise<Builder> {
    const builder: prismaBuilder = await prisma.builder.findUnique({
      where: { email: email },
    });
    if (builder === null) {
      return null;
    }
    return Builder.from(<Builder><unknown>builder);
}

//get builder by id
export async function getBuilderById(id: number): Promise<Builder> {
    const builder: prismaBuilder = await prisma.builder.findUnique({
      where: { id: id },
    });
    if (builder === null) {
      return null;
    }
    return Builder.from(<Builder><unknown>builder);
}

//get builder by email and different id
export async function getBuilderByEmailAndId(email: string, id: number): Promise<Builder> {
    const builder: prismaBuilder = await prisma.builder.findUnique({
      where: { email: email },
    });
    if (builder === null) {
      return null;
    }
    if (builder.id === id) {
        return null;
    }
    return Builder.from(<Builder><unknown>builder);
}

//edit builder
export async function editBuilder(id: number, json: any): Promise<Builder> {
    try{
        const builder: prismaBuilder = await prisma.builder.update({
            where: {id: id},
            data: {
                name: json.user_name,
                email: json.user_email,
                password: json.user_password
            }
        });
        return Builder.from(<Builder><unknown>builder);
    } catch (error) {
        throw new Error("Could not edit builder: " + error.message);
    }
}

//get build routes from builder
export async function getBuildRoutesFromBuilder(id: number): Promise<Builder> {
    const builder: prismaBuilder = await prisma.builder.findUnique({
      where: { id: id },
      include: {
        routes: {
          include : {
            builders: true
          } 
        }
      }
    });
    if (builder === null) {
      return null;
    }
    return Builder.from(<Builder><unknown>builder);
}

export default { getAllBuilders, createBuilder, addClimberToBuilder, getBuilderByEmail, getBuilderById, getBuilderByEmailAndId, editBuilder, getBuildRoutesFromBuilder}