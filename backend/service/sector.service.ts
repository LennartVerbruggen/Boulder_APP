import {Sector} from '../domain/model/sector';
import sectorPrisma from "../domain/data-access/sector.prisma";

const getAllSectors = () => {return sectorPrisma.getAllSectors();}

const getAllRoutesFromSector = (id: number) => {return sectorPrisma.getRoutesFromSectorById(id);}

const validateSectorById = (id: number) => {return sectorPrisma.validateSectorById(id);}

const clearSector = (id: number) => {return sectorPrisma.clearSector(id);}


export default { getAllSectors, getAllRoutesFromSector, validateSectorById, clearSector}