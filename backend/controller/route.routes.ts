/**
 * @swagger
 *  tags:
 *   - name: Routes
 *     description: Route endpoints
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
 *          routeInput:
 *                type: object
 *                properties:
 *                  sectorId:
 *                     type: integer
 *                     format: int32
 *                     description: The ID of the sector.
 *                  grade:
 *                     type: string
 *                     description: The difficulty level of the route.
 *                  builders:
 *                     type: string
 *                     description: Emails of the builders that made the route, seperated by a ','.
                 
 */

import express, { Router } from "express";
import routeService from "../service/route.service";
import climberService from "../service/climber.service";
import sectorService from "../service/sector.service";
import { Route } from "../domain/model/route";
import { Climber } from "../domain/model/climber";
import { Builder } from "../domain/model/builder";
import builderService from "../service/builder.service";

export const routeRouter = express.Router();

/**
 * @swagger
 * /routes:
 *   get:
 *        summary: Get all routes
 *        tags: [Routes]
 *        responses:
 *           200:
 *              description: Returns all routes
 *              content:
 *                application/json:
 *                 schema:
 *                     $ref: '#/components/schemas/Route'
 */

routeRouter.get('/', async (req, res) => {
    try {
        const routes = await routeService.getAllRoutes();
        res.status(200).json(routes);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

/**
 * @swagger
 * /routes/mark/{id}:
 *   put:
 *        summary: Add a route to a climbers list
 *        tags: [Routes]
 *        parameters:
 *          - in: path
 *            name: id
 *        responses:
 *           200:
 *               description: Returns the route with the given id
 *               content:
 *                  application/json:
 *                    schema:
 *                        $ref: '#/components/schemas/Route'
 *           400:
 *             description: Bad request
 *             content:
 *               application/json:
 *                 schema:
 *                   type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                       description: Error message
 *                       example: Id given is not a number 
 *           401:
 *             description: Email not in climber list
 *             content:
 *               application/json:
 *                 schema:
 *                   type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                       description: Error message
 *                       example: Email not in climber list
 *           402:
 *             description: Route already marked
 *             content:
 *               application/json:
 *                 schema:
 *                   type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                       description: Error message
 *                       example: Route already marked
 *           404:
 *             description: Route not found
 *             content:
 *               application/json:
 *                 schema:
 *                   type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                       description: Error message
 *                       example: Route not found
 *           500:
 *             description: Internal server error
 */

routeRouter.put('/mark/:id', async (req, res) => {
    try {
        //Transform id to number
        const routeId = parseInt(req.params.id);
        //Check if id is a number
        if (isNaN(routeId) || !routeId ) {
            res.status(400).json({message: 'Id given is not a number'});
            return;
        }

        //Get route by id
        const route = await routeService.getRouteById(routeId);

        //Check if route exists
        if (!route) {
            res.status(404).json({message: 'Route not found'});
            return;
        }

        //Get email from requestbody
        const email = req.body.email;

        //Check if email is in climber list
        const climber = await climberService.getClimberByEmail(email);
        if (!climber) {
            res.status(401).json({message: 'Email not in climber list'});
            return;
        }

        //Check if route is already marked
        const climbedRoutes = await climberService.getClimbedRoutes(climber.id);
        for (let climbedRoute of climbedRoutes.routes) {
            if (climbedRoute.id === routeId) {
                res.status(402).json({message: 'Route already marked'});
                return;
            }
        }

        const climberUpdated = await climberService.addRouteToClimberList(routeId, email);
        if(climberUpdated === null) {
            res.status(500).json({message: 'Internal server error'});
            return;
        }
        //Send message that route is added to climber list
        res.status(200).json({message: 'Route added to climber list'});
    } catch (err) {
        res.status(500).send(err.message);
    }
}
);

/**
 * @swagger
 * /routes/create:
 *  post:
 *    summary: Create a new route
 *    tags:
 *      - Routes
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/routeInput'
 *    responses:
 *      '200':
 *        description: Route created
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Route'
 *      '400':
 *        description: Bad request
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  description: Error message
 *                  example: Route already exists
 *      '401':
 *        description: Builder does not exist
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  description: Error message
 *                  example: Builder does not exist
 *      '500':
 *        description: Internal server error
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  description: Error message
 *                  example: Internal server error
*/

routeRouter.post('/create', async (req, res) => {
    //Functie werkt maar de builder wordt niet gekoppeld aan de route
    try {
        //Validate Builders
        //Converting the string of builders emails to a list of builders
        const bodyBuilders = req.body.builders;
        const listOfBuilders: string[] = bodyBuilders.split(',');

        //Getting builders and validating, if builder not found, throws error
        const builders: Builder[] = [];

        for (let builder of listOfBuilders) {
            const newBuilder = await builderService.getBuilderByEmail(builder.trim());
            if (newBuilder !== null) {
                builders.push(newBuilder);
            } else {
                console.log('Builder with email ' + builder + ' does not exist');
                res.status(401).json({message: 'Builder with email ' + builder + ' does not exist'});
                return;
            }
        }
        //Checking if the sector exists
        const sector = await sectorService.validateSectorById(parseInt(req.body.sectorId));
        if(!sector) {
            console.log('Sector not found');
            res.status(402).json({message: 'Sector not found'});
            return;
        }

        //Adding a date and creating the input
        const currentDate = new Date();
        const createInput = new Route(parseInt(req.body.sectorId), req.body.grade, currentDate, builders);

        //Validating the grade
        if(!createInput.sectorId || !createInput.grade) {
            console.log('Bad request');
            res.status(400).json({message: 'Bad request'});
            return;
        }

        const route = await routeService.createRoute(createInput);
        console.log(route);
        res.status(200).json(route);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

/**
 * @swagger
 * /routes/edit/{id}:
 *   put:
 *     summary: Edit a route
 *     tags: [Routes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The id of the route to edit
 *         schema:
 *           type: integer
 *           format: int32
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/routeInput'
 *     responses:
 *       '200':
 *         description: Route edited
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Route'
 *       '400':
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message
 *                   example: Id given is not a number
 *       '401':
 *         description: Route not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message
 *                   example: Route not found
 *       '402':
 *         description: Builder does not exist
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message
 *                   example: Builder does not exist
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message
 *                   example: Internal server error
 */
routeRouter.put('/edit/:id', async (req, res) => {
   
    try {
        //Validate Ids
        console.log("hey 2")
        let id = parseInt(req.params.id);
        let sectorId = parseInt(req.body.sectorId);
        if (isNaN(id) || isNaN(sectorId)) {
            res.status(400).json({message: 'Id given is not a number'});
            return;
        }
        
        
        //Checking if route exists
        const route = await routeService.getRouteById(id);
        if (!route) {
            res.status(401).json({message: 'Route not found'});
            return;
        }

        //Validate Builders
        //Converting the string of builders emails to a list of builders
        const bodyBuilders = req.body.builders;
        const listOfBuilders: string[] = bodyBuilders.split(',');

        //Getting builders and validating, if builder not found, throws error
        const builders: Builder[] = [];

        for (let builder of listOfBuilders) {
            const newBuilder = await builderService.getBuilderByEmail(builder.trim());
            if (newBuilder !== null) {
                builders.push(newBuilder);
            } else {
                console.log('Builder with email ' + builder + ' does not exist');
                res.status(402).json({message: 'Builder with email ' + builder + ' does not exist'});
                return;
            }
        }
        route.builders = builders;
        
        //Validate Sector
        const sector = await sectorService.validateSectorById(sectorId);
        if(!sector) {
            console.log('Sector not found');
            res.status(402).json({message: 'Sector not found'});
            return;
        }
        route.sectorId = sectorId;

        //Validate Grade
        if(!req.body.grade) {
            console.log('Bad request');
            res.status(400).json({message: 'Bad request'});
            return;
        }
        route.grade = req.body.grade;
        route.createdAt = new Date();
        console.log(route);

        const updatedRoute = await routeService.updateRoute(route);
        console.log(updatedRoute);
        res.status(200).json(updatedRoute);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

/**
 * @swagger
 * /routes/delete/{id}:
 *  delete:
 *    summary: Delete a route
 *    tags: [Routes]
 *    parameters:
 *    - in: path
 *      name: id
 *      required: true
 *      schema:
 *        type: integer
 *        format: int32
 *        description: The route id
 *    responses:
 *      '200':
 *        description: Route deleted
 *        content:
 *          application/json:
 *            schema:
 *              type: string
 *              example: Route deleted
 *      '400':
 *        description: Bad request
 *        content:
 *          application/json:
 *            schema:
 *              type: string
 *              example: Id given is not a number
 *      '401':
 *        description: Route not found
 *        content:
 *          application/json:
 *            schema:
 *              type: string
 *              example: Route not found
 *      '500':
 *        description: Internal server error
 *        content:
 *          application/json:
 *            schema:
 *              type: string
 *              example: Internal server error
 */

routeRouter.delete('/delete/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        if(!id) {
            console.log('Id given is not a number');
            res.status(400).json({message: 'Id given is not a number'});
            return;
        }
        const route = await routeService.getRouteById(id);
        if(route === null) {
            console.log('Route not found');
            res.status(401).json({message: 'Route not found'});
            return;
        }
        await routeService.deleteRoute(id);
        console.log('Route deleted');
        res.status(200).json({message: 'Route met id: ' + id + ' deleted'});
    } catch (err) {
        res.status(500).send(err.message);
    }
});