/**
 * @swagger
 *  tags:
 *   - name: Sectors
 *     description: Sectors endpoints
 */

/**
 * @swagger
 *  components:
 *      schemas:
 *          Route:
 *               type: object
 *               properties:
 *                  route_id:
 *                      type: integer
 *                      format: int32
 *                      description: The ID of the route.
 *                  plaats_datum:
 *                      type: string
 *                      format: date-time
 *                      description: The date and time the route is placed.
 *                  niveau:
 *                      type: string
 *                      description: The difficulty level of the route.
 *          Sector:
 *              type: object
 *              properties:
 *                  sector_id:
 *                      type: integer
 *                      format: int32
 *                      description: The ID of the sector.
 *                  karakteristieken:
 *                      type: string
 *                      description: The characteristics of the sector.
 *                  routes:
 *                      type: array
 *                      items:
 *                          $ref: '#/components/schemas/Route'
 *                      description: The routes that belong to the sector.
 */
import express, { Router } from "express";
import sectorService from "../service/sector.service";

export const sectorRouter = express.Router();

/**
 * @swagger
 * /sectors:
 *   get:
 *       summary: Get all sectors
 *       tags: [Sectors]
 *       responses:
 *          200:
 *             description: Returns all sectors
 *             content:
 *               application/json:
 *                schema:
 *                    $ref: '#/components/schemas/Sector' 
 */
sectorRouter.get('/', async (req, res) => {
    try {
        const sectors = await sectorService.getAllSectors();
        res.status(200).json(sectors);
    } catch (err) {
        res.status(500).send(err.message);
    }
});


/**
 * @swagger
 * /sectors/{id}:
 *  get:
 *      summary: Get all routes from a sector
 *      tags: [Sectors]
 *      responses:
 *         200:
 *            description: Returns all routes from a sector
 *            content: 
 *              application/json:
 *               schema:
 *                  $ref: '#/components/schemas/Route'
 *      parameters:
 *       - in: path
 *         name: id
 *         description: Sector id
 *         required: true
 *         schema:
 *          type: integer
 *          format: int64 
 */
sectorRouter.get('/:id', async (req, res) => {
    try {
        const sector = await sectorService.getAllRoutesFromSector(parseInt(req.params.id));
        res.status(200).json(sector);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

/**
 * @swagger
 * /sectors/clearSector/{id}:
 *  delete:
 *    summary: Delete all routes from a sector
 *    tags: [Sectors]
 *    parameters:
 *    - in: path
 *      name: id
 *      description: Sector id
 *      required: true
 *      schema:
 *        type: integer
 *        format: int32
 *    responses:
 *      '200':
 *        description: Sector cleared
 *        content:
 *          application/json:
 *            schema:
 *              type: string
 *              example: Sector cleared
 *      '400':
 *        description: Id not valid number
 *        content:
 *          application/json:
 *            schema:
 *              type: string
 *              example: Id not valid number
 *      '401':
 *        description: Sector not found
 *        content:
 *          application/json:
 *            schema:
 *              type: string
 *              example: Sector not found
 *      '500':
 *        description: Internal server error
 *        content:
 *          application/json:
 *            schema:
 *              type: string
 *              example: Internal server error
 */ 

sectorRouter.delete('/clearSector/:id', async (req, res) => {
    try {

        //Validate id
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            console.log("Id not valid number");
            res.status(400).send("Id not valid number");
            return;
        }

        //Validate sector
        const sectorExists = await sectorService.validateSectorById(id);
        if (!sectorExists) {
            console.log("Sector not found");
            res.status(401).send("Sector not found");
            return;
        }

        const sector = await sectorService.clearSector(id);
        res.status(200).json(sector);
    } catch (err) {
        res.status(500).send(err.message);
    }
});