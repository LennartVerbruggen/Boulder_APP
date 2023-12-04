/**
 * @swagger
 *  tags:
 *   - name: Climbers
 *     description: Climbers endpoints
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
 *              name:
 *                  type: string
 *                  description: The name of the climber.
 *              email:
 *                  type: string
 *                  description: The email of the climber.
 *              password:
 *                  type: string
 *                  description: The password of the climber.
 *         climberInput:
 *            type: object
 *            properties:
 *              user_name:
 *                  type: string
 *                  description: The name of the climber.
 *              user_email:
 *                  type: string
 *                  description: The email of the climber.
 *              user_password:
 *                  type: string
 *                  description: The password of the climber.
 *         climberLogin:
 *            type: object
 *            properties:
 *              email:
 *                  type: string
 *                  description: The email of the climber.
 *              password:
 *                  type: string
 *                  description: The password of the climber.
 *         climberLogout:
 *            type: object
 *            properties:
 *              email:
 *                  type: string
 *                  description: The email of the climber.
 *         Builder:
 *            type: object
 *            properties:
 *              builder_id:
 *                  type: integer
 *                  format: int32
 *                  description: The ID of the builder.
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
import builderService from "../service/builder.service";
import climberService from "../service/climber.service";
import {log} from "util";
import routeService from "../service/route.service";

export const climberRouter = express.Router();

/**
 * @swagger
 * /climbers:
 *  get:
 *     summary: Get all climbers
 *     tags: [Climbers]
 *     responses:
 *       200:
 *        description: Returns all climbers
 *        content:
 *         application/json:
 *          schema:
 *           $ref: '#/components/schemas/Climber'
 */

climberRouter.get('/', async (req, res) => {
    try {
        const climbers = await climberService.getAllClimbers();
        res.status(200).json(climbers);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

/**
 * @swagger
 * /climbers/create:
 *   post:
 *     summary: Create a new climber
 *     tags: [Climbers]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/climberInput'
 *     responses:
 *       '200':
 *         description: Returns the edited climber.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Climber'
 *       '400':
 *         description: Invalid data.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Invalid data.
 *       '401':
 *         description: Customer account not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Customer account not found.
 *       '422':
 *         description: Invalid email address provided.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Invalid email address.
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
climberRouter.post('/create', async (req, res) => {
    const { name, email, password } = req.body;
    try {
        // check if all data is provided
        if (!name || !email || !password) {
            console.log('Invalid data.');
            res.status(400).json({ message: 'Invalid data.' });
            return;
        }

        // check if email is valid
        const emailRegex: RegExp = /\S+@\S+\.\S+/;
        if (!emailRegex.test(email)) {
            console.log('Invalid email address format.');
            res.status(422).json({ message: 'Invalid email address format.' });
            return;
        }

        // check if email is already in use
        const mailCheck = await climberService.getClimberByEmail(email);
        if (mailCheck !== null) {
            console.log('Email address already in use.');
            res.status(422).json({ message: 'Email address already in use.' });
            return;
        }

        //hash password
        const hashedPassword = await climberService.hashPassword(password);
        console.log(hashedPassword);

        // create climber
        const create = await climberService.createClimber({name, email, password: hashedPassword});
        res.status(200).json(create);
        console.log('Climber created.');
    }   catch (err) {
        console.log(err);
        res.status(500).send(err.message);
    }
});

/**
 * @swagger
 * /climbers/login:
 *   post:
 *     summary: Login climber
 *     tags: [Climbers]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/climberLogin'
 *     responses:
 *       '200':
 *         description: Returns the logged in climber.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Climber'
 *       '400':
 *         description: Invalid data.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Invalid data.
 *       '401':
 *         description: Customer account not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Customer account not found.
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
climberRouter.post('/login', async (req, res) => {
    try{
        const { email, password } = req.body;

        // check if all data is provided
        if (!email || !password) {
            console.log('Invalid data.');
            res.status(400).json({ message: 'Invalid data. Please fill in both your email and password.' });
            return;
        }

        // search for customer account
        const climber = await climberService.getClimberByEmail(email);
        if (climber === null) {
            console.log('Invalid credentials.');
            res.status(401).json({ message: 'Invalid credentials.' });
            return;
        }
        // check if password is correct
        const token = await climberService.authenticateClimber(email, password);
        if (token != null) {
            console.log('Login successful.');
            res.status(200).json({message: "Authentication successful.", token});
        }
        else {
            console.log('Invalid credentials.');
            res.status(401).json({ status: "unauthorized", message: 'Invalid credentials.' });
        }

    } catch (err) {
        console.log(err);
        res.status(500).send(err.message);
    }
});


/**
 * @swagger
 * /climbers/addToBuilder:
 *   post:
 *     summary: Add climber to builder
 *     tags: [Climbers]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 example: 1
 *     responses:
 *       '200':
 *         description: Returns the added climber.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Climber'
 *       '400':
 *         description: Invalid data.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Invalid data.
 *       '401':
 *         description: Customer account not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Customer account not found.
 *       '402':
 *         description: Builder already exists with this email.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Builder already exists with this email.
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
climberRouter.post('/addToBuilder', async (req, res) => {
    try {
        //Validate climber id
        console.log(req.body);
        const climberId = parseInt(req.body.id);
        console.log(climberId);

        if(climberId === null || Number.isNaN(climberId)) {
            console.log('Invalid data.');
            res.status(400).json({ message: 'Invalid data.' });
            return;
        }

        //check if climber exists
        const climber = await climberService.getClimberById(climberId);
        if(climber === null) {
            console.log('No climber with this id.');
            res.status(401).json({ message: 'No climber with this id' });
            return;
        } else {
            //check if builder already exists with this email
            const builderWithSameEmail = await builderService.getBuilderByEmail( climber.email);
            if(builderWithSameEmail !== null) {
                console.log('Builder already exists with this email.');
                res.status(402).json({ message: 'Builder already exists with this email.' });
                return;
            } else {
                const result = await builderService.addClimberToBuilder(climber);
                console.log('Climber added to builder.');
                res.status(200).json({message: "Climber added to builder."});
            }
        }
    } catch (err) {
        console.log(err);
        res.status(500).send(err.message);
    }
});

/**
 * @swagger
 * /climbers/logout:
 *   post:
 *     summary: Logout climber
 *     tags: [Climbers]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/climberLogout'
 *     responses:
 *       '200':
 *         description: Returns the logged out climber.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Climber'
 *       '400':
 *         description: Invalid data.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Invalid data.
 *       '401':
 *         description: Unauthorized - the climber is not logged in.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Unauthorized - the climber is not logged in.
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
climberRouter.post('/logout', async (req, res) => {
    try {
        const email = req.body.email;
        console.log(email);

        if (email === null || !email){
            console.log('Unauthorized - the climber is not logged in.');
            res.status(401).json({ message: 'Unauthorized - the climber is not logged in.' });
            return;
        }

        const climberExists = await climberService.getClimberByEmail(email);
        if (climberExists === null) {
            console.log('Unauthorized - the climbers email does not exist.');
            res.status(401).json({ message: 'Unauthorized - the climbers email does not exist.' });
            return;
        }

        const endedToken = await climberService.logout(email);
        console.log(endedToken)
        console.log('Climber logged out.');
        res.status(200).json({ message: "Climber logged out."});
    } catch (err) {
        console.log(err);
        res.status(500).send(err.message);
    }
});


/**
 * @swagger
 * /climbers/edit/{id}:
 *   put:
 *     summary: Edit climber
 *     tags: [Climbers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The id of the climber to edit.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/climberInput'
 *     responses:
 *       '200':
 *         description: Returns the edited climber.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Climber'
 *       '400':
 *         description: Invalid data.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Invalid data.
 *       '401':
 *         description: Customer account not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Customer account not found.
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
climberRouter.put('/edit/:id', async (req, res) => {
    const {user_name, user_email, user_password} = req.body;
    try {
        if(Number.isNaN(parseInt(req.params.id))) {
            console.log('Invalid data.');
            res.status(400).json({ message: 'Invalid id.' });
            return;
        }
        const climberId = parseInt(req.params.id);

        //check if climber exists
        const climber = await climberService.getClimberById(climberId);
        if(climber === null) {
            console.log('No climber with this id.');
            res.status(401).json({ message: 'No climber with this id.' });
            return;
        }

        //check if everything is filled in
        if (!user_name || !user_email || !user_password) {
            console.log('Invalid data.');
            res.status(400).json({ message: 'Invalid data.' });
            return;
        }

        // check if email is valid
        const emailRegex: RegExp = /\S+@\S+\.\S+/;
        if (!emailRegex.test(user_email)) {
            console.log('Invalid email address format.');
            res.status(422).json({ message: 'Invalid email address format.' });
            return;
        }

        //check if someone else already got the (new) email
        const climberWithSameEmailWithoutHimself = await climberService.getClimberByEmailAndId(user_email, climberId)
        if(climberWithSameEmailWithoutHimself !== null) {
            console.log('Climber already exists with this email.');
            res.status(400).json({message: 'Climber already exists with this email.'});
            return;
        }

        //edit climber
        const result = await climberService.editClimber(climberId, req.body);
        res.status(200).json({message: "Climber edited."});

    } catch (err) {
        console.log(err);
        res.status(500).send(err.message);
    }
});

/**
 * @swagger
 * /climbers/climbedRoutes/{id}:
 *  get:
 *      summary: Get all climbed routes from climber
 *      tags: [Climbers]
 *      parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The id of the climber to get the climbed routes from.
 *         schema:
 *          type: string
 *      responses:
 *        '200':
 *          description: Returns all climbed routes from climber
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Climber'
 */

climberRouter.get('/climbedRoutes/:id', async (req, res) => {
    try {
        //Validate climber id
        const climberId = parseInt(req.params.id);

        if(climberId === null || Number.isNaN(climberId)) {
            console.log('Invalid data.');
            res.status(400).json({ message: 'Invalid data.' });
            return;
        }

        //check if climber exists
        const climber = await climberService.getClimberById(climberId);
        if(climber === null) {
            console.log('No climber with this id.');
            res.status(401).json({ message: 'No climber with this id' });
            return;
        } else {
            const result = await climberService.getClimbedRoutes(climberId);
            console.log('Climbed routes retrieved.');
            res.status(200).json(result);
        }
    } catch (err) {
        console.log(err);
        res.status(500).send(err.message);
    }
}
);

/**
 * @swagger
 * /climbers/{id}:
 *   get:
 *     summary: Get climber by id
 *     tags: [Climbers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The id of the climber to get.
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Returns the climber with the given id.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Climber'
 *       '400':
 *         description: Invalid data.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Invalid data.
 *       '401':
 *         description: Climber not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Climber not found.
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
climberRouter.get('/:id', async (req, res) => {
    try {
        //Validate climber id
        const climberId = parseInt(req.params.id);

        if(climberId === null || Number.isNaN(climberId)) {
            console.log('Invalid data.');
            res.status(400).json({ message: 'Invalid data.' });
            return;
        }

        //check if climber exists
        const climber = await climberService.getClimberById(climberId);
        if(climber === null) {
            console.log('No climber with this id.');
            res.status(401).json({ message: 'No climber with this id' });
            return;
        } else {
            console.log('Climber retrieved.');
            res.status(200).json(climber);
        }
    } catch (err) {
        console.log(err);
        res.status(500).send(err.message);
    }
});