import { IUser } from "@chattonapp/types";
import { jwtDecode } from "jwt-decode";

export function extractInfoFromToken(token?: string | null) {
  if (!token) return null;
  try {
    const decoded = jwtDecode(token);
    if (!decoded) return null;

    const user = decoded as IUser & {
      iat: number;
      exp: number;
    };

    return user;
  } catch {
    return null;
  }
}
