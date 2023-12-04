import * as dotenv from "dotenv";
import express, {NextFunction} from "express";
import cors from "cors";
import * as bodyParser from "body-parser";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { sectorRouter } from "./controller/sector.routes";
import { climberRouter } from "./controller/climber.routes";
import { builderRouter } from "./controller/builder.routes";
import { routeRouter } from "./controller/route.routes";
import {expressjwt} from "express-jwt";

const app = express();
dotenv.config();
const port = process.env.APP_PORT || 3000;

const swaggerOpts = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Back-end",
      version: "1.0.0",
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["./controller/*.routes.ts"],
};
const swaggerSpec = swaggerJSDoc(swaggerOpts);

app.use(cors());
app.use(bodyParser.json());

app.get("/status", (req, res) => {
  res.json({ message: "Back-end is running..." });
});

//You exited the mine field

// r.getAllSectors().then((sectors) => {
//   console.log(sectors);
// });

app.use(
    expressjwt({secret: process.env.JWT_SECRET, algorithms: ['HS256']}).unless({
      path: [/^\/api-docs($|\/.*)/, '/climbers/login', '/climbers/create', '/routes', '/sectors', '/status', '/climbers/logout'],
    }))

app.use("/sectors", sectorRouter);
app.use("/climbers", climberRouter)
app.use("/routes", routeRouter)
app.use("/builders", builderRouter);

// app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
//   if (error.name === "UnauthorizedError") {
//     res.status(401).json({ status: 'error', message: error.message });
//   }
//   else if (error.name === "WhattError") {
//     res.status(400).json({ status: 'error', message: error.message });
//   }
//   else {
//     next();
//   }
// });
//DANGER ZONE
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.listen(port || 3000, () => {
  console.log(`Back-end is running on port ${port}.`);
});

