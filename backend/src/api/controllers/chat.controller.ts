import { type Express, type Request, type Response } from "express";
// import { getUserInfoFromToken } from "../../middleware/utils";

const messages = [];

export const createChatController = (app: Express) => {
  app.get("/chat/messages", async (req: Request, res: Response) => {
    try {
      return res.status(200).send(messages);
    } catch (error) {
      console.log(error);
      return res.status(500).send({ message: "Failed to retrieve votes" });
    }
  });
};
