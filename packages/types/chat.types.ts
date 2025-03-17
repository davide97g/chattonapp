export type IMessageInfo = {
  readBy?: string[];
  deliveredTo?: string[];
};

export type IMessage = {
  id: string;
  content: string;
  sender: string;
  timestamp: number;
  info?: IMessageInfo;
};
