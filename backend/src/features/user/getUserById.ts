import { IUser } from "@pixel-world/types";
import { sql } from "../../config/database";

export async function getUserById({ userId }: Readonly<{ userId: string }>) {
  try {
    const user: IUser[] =
      await sql`SELECT * FROM public."USERS" WHERE id = ${userId};`;

    return user[0];
  } catch (error) {
    console.log(error);
    return null;
  }
}
