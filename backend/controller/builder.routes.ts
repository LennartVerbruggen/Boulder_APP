/**
 * @swagger
 *  tags:
 *   - name: Builders
 *     description: Builders endpoints
 */

/**
 * @swagger
 *  components:
 *     schemas:
 *         Climber:
 *            type: object
 *            properties:
 *              climber_id:
 *                  type: integer
 *                  format: int32
 *                  description: The ID of the climber.
 *              naam:
 *                  type: string
 *                  description: The name of the climber.
 *              email:
 *                  type: string
 *                  description: The email of the climber.
 *              wachtwoord:
 *                  type: string
 *                  description: The password of the climber.
 *         Builder:
 *            type: object
 *            properties:
 *              builder_id:
 *                  type: integer
 *                  format: int32
 *                  description: The ID of the builder.
 *              naam:
 *                  type: string
 *                  description: The name of the builder.
 *              email:
 *                  type: string
 *                  description: The email of the builder.
 *              wachtwoord:
 *                  type: string
 *                  description: The password of the builder.
 *         builderInput:
 *            type: object
 *            properties:
 *              name:
 *                  type: string
 *                  description: The name of the builder.
 *              email:
 *                  type: string
 *                  description: The email of the builder.
 *              password:
 *                  type: string
 *                  description: The password of the builder.
 */  

import express, { Router } from "express";
import { Climber } from "../domain/model/climber";
import builderServcie from "../service/builder.service";
import builderService from "../service/builder.service";

export const builderRouter = express.Router();

/** 
 * @swagger
 * /builders:
 *  get:
 *    summary: Get all builders
 *    tags: [Builders]
 *    responses:
 *     200:
 *      description: Returns all builders
 *      content:
 *       application/json:
 *        schema:
 *         $ref: '#/components/schemas/Builder'
 */

builderRouter.get('/', async (req, res) => {
    try {
        const builders = await builderServcie.getAllBuilders();
        res.status(200).json(builders);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

/**
 * @swagger
 * /builders/edit/{id}:
 *   put:
 *     summary: Edit a builder
 *     tags: [Builders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The id of the builder to edit.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/builderInput'
 *     responses:
 *       '200':
 *         description: The builder was successfully edited.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Builder'
 *       '400':
 *         description: Invalid data was supplied to edit the builder.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Invalid data was supplied to edit the builder.
 *       '401':
 *         description: The builder was not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: The builder was not found.
 *       '500':
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal server error.
 */
builderRouter.put('/edit/:id', async (req, res) => {
    const {user_name, user_email, user_password} = req.body;
    try {
        if (Number.isNaN(parseInt(req.params.id))) {
            console.log("Invalid id.");
            res.status(400).json({message: "Invalid id."});
            return;
        }
        const builderId = parseInt(req.params.id);

        //check if builder exists
        const builder = await builderServcie.getBuilderById(builderId);
        if (builder === null) {
            console.log("No builder with this id.");
            res.status(401).json({message: "No builder with this id."});
            return;
        }

        //check if everything is filled in
        if (!user_name || !user_email || !user_password) {
            console.log("Invalid data was supplied to edit the builder.");
            res.status(400).json({message: "Invalid data was supplied to edit the builder."});
            return;
        }

        //check if email is valid
        const emailRegex: RegExp = /\S+@\S+\.\S+/;
        if (!emailRegex.test(user_email)) {
            console.log('Invalid email address format.');
            res.status(422).json({ message: 'Invalid email address format.' });
            return;
        }

        //check if someone else already got the (new) email
        const builderWithSameEmailWithoutHimself = await builderServcie.getBuilderByEmailAndId(user_email, builderId);
        if (builderWithSameEmailWithoutHimself !== null) {
            console.log("There already exists a builder with the same email.");
            res.status(409).json({message: "There already exists a builder with the same email."});
            return;
        }


        //edit builder
        const result = await builderService.editBuilder(builderId, req.body);
        res.status(200).json({message: "Builder edited."});
        console.log("Builder edited.");
    } catch (err) {
        console.log(err.message);
        res.status(500).send(err.message);
    }
});

/**
 * @swagger
 * /builders/{id}:
 *   get:
 *     summary: Get a builder by id
 *     tags: [Builders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The id of the builder to get.
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: The builder was successfully found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Builder'
 *       '400':
 *         description: Invalid id was supplied to get the builder.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Invalid id was supplied to get the builder.
 *       '401':
 *         description: The builder was not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: The builder was not found.
 *       '500':
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal server error.
 */
builderRouter.get('/:id', async (req, res) => {
    try {
        if (Number.isNaN(parseInt(req.params.id))) {
            console.log("Invalid id.");
            res.status(400).json({message: "Invalid id."});
            return;
        }
        const builderId = parseInt(req.params.id);

        const builder = await builderServcie.getBuilderById(builderId);
        if (builder === null) {
            console.log("No builder with this id.");
            res.status(401).json({message: "No builder with this id."});
            return;
        }

        res.status(200).json(builder);
        console.log("Builder found.");
    } catch (err) {
        console.log(err.message);
        res.status(500).send(err.message);
    }
});

/**
 * @swagger
 * /builders/buildRoutes/{id}:
 *  get:
 *      summary: Get all build routes from builder
 *      tags: [Builders]
 *      parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The id of the builder to get the build routes from.
 *         schema:
 *          type: string
 *      responses:
 *        '200':
 *          description: Returns all build routes from builder
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Builder'
 */

builderRouter.get('/buildRoutes/:id', async (req, res) => {
    try {
        if (Number.isNaN(parseInt(req.params.id))) {
            console.log("Invalid id.");
            res.status(400).json({message: "Invalid id."});
            return;
        }
        const builderId = parseInt(req.params.id);

        const buildRoutes = await builderServcie.getBuildRoutesFromBuilder(builderId);
        if (buildRoutes === null) {
            console.log("No build routes from this builder.");
            res.status(401).json({message: "No build routes from this builder."});
            return;
        }

        res.status(200).json(buildRoutes);
        console.log("Build routes from builder found.");
    } catch (err) {
        console.log(err.message);
        res.status(500).send(err.message);
    }
}
);