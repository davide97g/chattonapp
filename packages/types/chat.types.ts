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
  readBy?: string[]; // user id list
  read: boolean;
  replyTo?: string; // ID of the message being replied to
};
