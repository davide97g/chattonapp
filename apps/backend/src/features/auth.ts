import { IUser } from "@chattonapp/types";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

export function sign({ user }: { user: IUser }) {
  if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined");
  }
  return jwt.sign(user, JWT_SECRET, {
    expiresIn: "1h",
  });
}

export { JWT_SECRET };
