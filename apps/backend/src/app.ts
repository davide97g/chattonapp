import cors from "cors";
import express from "express";
import "./config";

import swaggerJsdoc from "swagger-jsdoc";
import * as swaggerUi from "swagger-ui-express";
import { version } from "../package.json";
import { addPublicRoutes } from "./api/public";
import "./features/socket";

import bodyParser from "body-parser";

const app = express();

app.use(bodyParser.json());

const allowedOrigins = ["http://localhost:8080", "http://192.168.15.143:8080"];

const options = {
  failOnErrors: true, // Whether or not to throw when parsing errors. Defaults to false.
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Chattonapp API",
      version,
    },
    components: {
      securitySchemes: {
        BearerAuth: {
          type: "http",
          scheme: "bearer",
        },
      },
    },
    security: [
      {
        BearerAuth: [],
      },
    ],
  },
  apis: ["./src/api/controllers/*.ts"],
};

const swaggerSpec = swaggerJsdoc(options);

// **** SWAGGER ****

app.use(
  "/api-docs",
  swaggerUi.serve as any,
  swaggerUi.setup(swaggerSpec) as any,
);

app.use(
  cors({
    origin: allowedOrigins,
  }),
);

app.use(express.json());

const port = process.env.PORT ?? 3000;

// **** PUBLIC ****
addPublicRoutes(app);

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
