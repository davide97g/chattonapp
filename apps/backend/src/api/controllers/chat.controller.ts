import { IMessage } from "@chattonapp/types";
import { type Express, type Request, type Response } from "express";
import { chat, updateChatMessagesFile } from "../../config/database";
import { broadcast } from "../../features/socket";
import { authenticateToken } from "../../middleware/authMiddleware";

export const createChatController = (app: Express) => {
  app.get(
    "/chat/messages",
    authenticateToken,
    async (_: Request, res: Response) => {
      try {
        const messagesWithReadInfo = chat.messages
          .slice(-100)
          .map((message) => {
            const readBy =
              chat.users
                .filter((user) => user.lastReadTime > message.timestamp)
                .map((user) => user.id) ?? [];
            const read = readBy.length === chat.users.length;
            return { ...message, read };
          });
        return res.status(200).send(messagesWithReadInfo);
      } catch (error) {
        console.log(error);
        return res.status(500).send({ message: "Failed to retrieve votes" });
      }
    },
  );

  app.post(
    "/chat/message",
    authenticateToken,
    async (req: Request, res: Response) => {
      try {
        const messageRequest = req.body;
        const message: IMessage = {
          id: crypto.randomUUID(),
          content: messageRequest.text,
          sender: messageRequest.sender,
          timestamp: Date.now(),
          readBy: [(req as any).user.id],
          read: false,
          replyTo: messageRequest.replyTo,
        };
        chat.messages.push(message);
        updateChatMessagesFile({ chat });
        broadcast({
          event: "message",
          data: message,
        });
        return res.status(200).send(message);
      } catch (error) {
        console.log(error);
        return res.status(500).send({ message: "Failed to retrieve votes" });
      }
    },
  );

  app.put(
    "/chat/lastRead",
    authenticateToken,
    async (req: Request, res: Response) => {
      try {
        const userRead = (req as any).user;
        console.log("userRead", userRead);
        const user = chat.users.find((user) => user.id === userRead.id);
        if (!user) {
          return res.status(400).send({ message: "User not found" });
        }
        user.lastReadTime = Date.now();
        chat.users[chat.users.indexOf(user)] = user;
        updateChatMessagesFile({ chat });
        return res.status(200).send({ success: true });
      } catch (error) {
        console.log(error);
        return res.status(500).send({ message: "Failed to retrieve chat" });
      }
    },
  );

  app.delete(
    "/chat/clear",
    authenticateToken,
    async (_: Request, res: Response) => {
      try {
        chat.messages.splice(0, chat.messages.length);
        chat.messages.push({
          id: crypto.randomUUID(),
          content: "Chat has been cleared",
          sender: "System",
          timestamp: Date.now(),
          readBy: [],
          read: false,
        });
        broadcast({
          event: "clear",
        });
        broadcast({
          event: "message",
          data: chat.messages[0],
        });
        updateChatMessagesFile({ chat });
        return res.status(200).send({ success: true });
      } catch (error) {
        console.log(error);
        return res.status(500).send({ message: "Failed to retrieve chat" });
      }
    },
  );

  app.get("/chat/info", authenticateToken, (req: Request, res: Response) => {
    res.json({
      users: chat.users,
    });
  });
};
