import { IMessage } from "./chat.types";

type ISocketEvent = "message" | "clear" | "typing";

export interface ISocketMessage {
  event: ISocketEvent;
  sender?: string;
  data?: IMessage;
}
