export interface IUser {
  id: string;
  username: string;
  password: string;
}

export interface IUserChat {
  id: string;
  username: string;
  lastReadTime: number; // timestamp
}
