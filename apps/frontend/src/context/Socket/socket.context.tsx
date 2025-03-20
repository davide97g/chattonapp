/* eslint-disable @typescript-eslint/no-unused-vars */
import { IMessage, IUserChat } from "@chattonapp/types";
import { createContext } from "react";

export const SocketContext = createContext({
  messages: [] as IMessage[],
  setMessages: (_: IMessage[]) => {},

  chatInfo: null as { users: IUserChat[] } | null,

  typingUsernameList: [] as string[],
  onUserTyping: (_: string) => {},
});
