import { getChatInfo, getMessages } from "@/services/api";
import { IMessage, ISocketMessage, IUserChat } from "@chattonapp/types";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

export const SocketContext = createContext({
  messages: [] as IMessage[],
  chatInfo: null as { users: IUserChat[] } | null,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setMessages: (_: IMessage[]) => {},
  token: null as string | null,
  logout: () => {},
  typingUsernameList: [] as string[],
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onUserTyping: (_: string) => {},
});

export function SocketProvider({
  children,
}: Readonly<{ children: ReactNode }>) {
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [chatInfo, setChatInfo] = useState<{ users: IUserChat[] } | null>(null);
  const socket = useMemo(() => new WebSocket("ws://localhost:3001"), []);
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("chattonapp-token")
  );

  const [typingUsernameList, setTypingUsernameList] = useState<string[]>([]);

  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);

  socket.onopen = () => {
    console.log("Connected to WebSocket server");
    if (token) {
      getMessages({ token }).then((messages) => setMessages(messages));
      getChatInfo({ token }).then((info) => setChatInfo(info));
    } else console.log("No token found => cannot fetch messages");
  };

  socket.onmessage = (event) => {
    console.info("Received event:", event);
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

  const logout = () => {
    setToken(null);
    localStorage.removeItem("chattonapp-token");
    window.location.reload();
  };

  const onUserTyping = useCallback(
    (username: string) => {
      const message: ISocketMessage = {
        event: "typing",
        sender: username,
      };
      socket.send(JSON.stringify(message));
    },
    [socket]
  );

  const value = useMemo(
    () => ({
      messages,
      token,
      logout,
      setMessages,
      chatInfo,
      typingUsernameList,
      onUserTyping,
    }),
    [messages, token, chatInfo, typingUsernameList, onUserTyping]
  );

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
