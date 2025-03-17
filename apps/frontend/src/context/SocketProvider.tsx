import { readMessages } from "@/services/api";
import { IMessage, ISocketMessage } from "@chattonapp/types";
import { createContext, ReactNode, useContext, useMemo, useState } from "react";

export const SocketContext = createContext({
  messages: [] as IMessage[],
});

export function SocketProvider({
  children,
}: Readonly<{ children: ReactNode }>) {
  const [messages, setMessages] = useState<IMessage[]>([]);
  const socket = useMemo(() => new WebSocket("ws://localhost:3001"), []);

  socket.onopen = () => {
    console.log("Connected to WebSocket server");
    readMessages().then((messages) => setMessages(messages));
  };

  socket.onmessage = (event) => {
    const socketMessage = JSON.parse(event.data) as ISocketMessage;
    console.log("Received message:", socketMessage);

    if (socketMessage.event === "clear") {
      setMessages([]);
      return;
    }

    const message = socketMessage.data;
    if (!message) return;
    setMessages((prevMessages) => {
      if (prevMessages.find((msg) => msg.id === message.id))
        return prevMessages;
      const updatedMessages = [...(prevMessages ?? []), message];
      return updatedMessages;
    });
  };

  socket.onclose = () => {
    console.log("WebSocket connection closed");
  };

  socket.onerror = (error) => {
    console.error("WebSocket error:", error);
  };

  const value = useMemo(() => ({ messages }), [messages]);

  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  );
}

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
};
