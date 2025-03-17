import { type Express, type Request, type Response } from "express";
// import { getUserInfoFromToken } from "../../middleware/utils";
import { IMessage } from "@chattonapp/types";
import { broadcast } from "../../features/socket";

const messages: IMessage[] = [
  {
    id: crypto.randomUUID(),
    content: "Hello, world! 🌍",
    sender: "Alice",
    timestamp: Date.now(),
  },
];

export const createChatController = (app: Express) => {
  app.get("/chat/messages", async (req: Request, res: Response) => {
    try {
      return res.status(200).send(messages);
    } catch (error) {
      console.log(error);
      return res.status(500).send({ message: "Failed to retrieve votes" });
    }
  });

  app.post("/chat/message", async (req: Request, res: Response) => {
    try {
      const messageRequest = req.body;
      const message: IMessage = {
        id: crypto.randomUUID(),
        content: messageRequest.text,
        sender: messageRequest.sender,
        timestamp: Date.now(),
      };
      messages.push(message);
      broadcast({
        event: "message",
        data: message,
      });
      return res.status(200).send(message);
    } catch (error) {
      console.log(error);
      return res.status(500).send({ message: "Failed to retrieve votes" });
    }
  });

  app.delete("/chat/clear", async (req: Request, res: Response) => {
    try {
      messages.splice(0, messages.length);
      messages.push({
        id: crypto.randomUUID(),
        content: "Chat has been cleared",
        sender: "System",
        timestamp: Date.now(),
      });
      broadcast({
        event: "clear",
      });
      broadcast({
        event: "message",
        data: messages[0],
      });
      return res.status(200).send({ success: true });
    } catch (error) {
      console.log(error);
      return res.status(500).send({ message: "Failed to retrieve chat" });
    }
  });
};
