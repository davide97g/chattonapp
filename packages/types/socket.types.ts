import { IMessage } from "./chat.types";

type ISocketEvent = "message" | "clear";

export interface ISocketMessage {
  event: ISocketEvent;
  data?: IMessage;
}
