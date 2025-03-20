import { IUser } from "@chattonapp/types";
import { createContext } from "react";

export const AuthContext = createContext({
  user: null as IUser | null,
  token: null as string | null,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  login: (_: { username: string; password: string }) => {},
  logout: () => {},
});
