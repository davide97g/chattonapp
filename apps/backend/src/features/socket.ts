import { ISocketMessage } from "@chattonapp/types";
import { WebSocketServer } from "ws";

// Creates a new WebSocket connection to the specified URL.
const socket = new WebSocketServer({
  port: 3001,
});

socket.on("connection", (ws) => {
  console.log("Client connected");

  ws.on("message", (message) => {
    const socketMessage = JSON.parse(message.toString()) as ISocketMessage;
    if (socketMessage.event === "typing") {
      broadcast(socketMessage);
      return;
    }
    ws.send(`Received message: ${message.toString()}`);
  });

  ws.on("close", () => {
    console.log("Client disconnected");
  });
});

export function broadcast(message: ISocketMessage) {
  socket.clients.forEach((client) => {
    if (client.readyState === 1) {
      client.send(JSON.stringify(message));
    }
  });
}
