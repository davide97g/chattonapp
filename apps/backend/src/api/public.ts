import { type Express, type Request, type Response } from "express";

import { version } from "../../package.json";
import { createAuthController } from "./controllers/auth.controller";
import { createChatController } from "./controllers/chat.controller";

const isDevelopment = process.env.MODE === "DEVELOPMENT";

export const addPublicRoutes = (app: Express) => {
  app.get("/", (_: Request, res: Response) => {
    res.send({ message: "Chattonapp Server", dev: isDevelopment, version });
  });

  createChatController(app);
  createAuthController(app);
};
