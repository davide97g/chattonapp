import { getChatInfo, getMessages } from "@/services/api";
import { IMessage, ISocketMessage, IUserChat } from "@chattonapp/types";
import { ReactNode, useCallback, useEffect, useMemo, useState } from "react";
import { useAuth } from "../Auth/useAuth";
import { SocketContext } from "./socket.context";

export function SocketProvider({
  children,
}: Readonly<{ children: ReactNode }>) {
  const { token } = useAuth();

  const [messages, setMessages] = useState<IMessage[]>([]);
  const [chatInfo, setChatInfo] = useState<{ users: IUserChat[] } | null>(null);
  const [socket, setSocket] = useState<WebSocket>();

  const [typingUsernameList, setTypingUsernameList] = useState<string[]>([]);

  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);

  const startSocketConnection = useCallback(() => {
    if (!socket || !token) return;

    socket.onopen = () => {
      console.log("Connected to WebSocket server");
      getMessages({ token }).then((messages) => setMessages(messages));
      getChatInfo({ token }).then((info) => setChatInfo(info));
    };

    socket.onmessage = (event) => {
      const socketMessage = JSON.parse(event.data) as ISocketMessage;
      console.log("Received message:", socketMessage);

      if (socketMessage.event === "clear") {
        setMessages([]);
        return;
      }

      if (socketMessage.event === "typing") {
        if (socketMessage.sender) {
          if (timer) clearTimeout(timer);
          setTimer(
            setTimeout(() => {
              setTypingUsernameList([]);
            }, 2000)
          );

          setTypingUsernameList((prev) => [
            ...new Set([
              ...((prev as string[]) ?? []),
              socketMessage.sender ?? "",
            ]),
          ]);
          return;
        }
        setTypingUsernameList([]);
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
  }, [socket, timer, token]);

  useEffect(() => {
    if (!token) socket?.close();
    if (!socket) {
      console.info("Creating new WebSocket connection");
      setSocket(new WebSocket(`ws://localhost:3001?token=${token}`));
      return;
    }
    startSocketConnection();
  }, [socket, startSocketConnection, token]);

  const onUserTyping = useCallback(
    (username: string) => {
      const message: ISocketMessage = {
        event: "typing",
        sender: username,
      };
      socket?.send(JSON.stringify(message));
    },
    [socket]
  );

  const value = useMemo(
    () => ({
      messages,
      setMessages,
      chatInfo,
      typingUsernameList,
      onUserTyping,
    }),
    [messages, chatInfo, typingUsernameList, onUserTyping]
  );

  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  );
}
