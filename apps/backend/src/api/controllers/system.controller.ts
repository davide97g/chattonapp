import { type Express, type Request, type Response } from "express";
import { getSystemDetails } from "../../features/system";

export const createSystemController = (app: Express) => {
  app.get("/system", async (req: Request, res: Response) => {
    const systemStats = await getSystemDetails();
    res.json(systemStats);
  });
};
