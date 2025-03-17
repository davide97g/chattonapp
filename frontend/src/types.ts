export type MessageInfo = {
  readBy?: string[];
  deliveredTo?: string[];
};

export type Message = {
  id: string;
  content: string;
  sender: string;
  timestamp: number;
  info?: MessageInfo;
};
