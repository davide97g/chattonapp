import { sql } from "../../config/database";
import { assignToTeam } from "../color/assignToTeam";
import { generateRandomColorForUser } from "../color/generateRandomColor";

export async function createUser(userId: string, email: string) {
  try {
    const user: {
      uid: string;
      email: string;
      color_hex_id: string;
      team_color_id: string;
    }[] = await sql`SELECT * FROM public."USERS" WHERE email = ${email};`;
    console.log({ user });

    if (user.length > 0)
      return { isError: true, message: "User already exists" };

    const randomColor = await generateRandomColorForUser();
    if (!randomColor) throw new Error("Failed to generate random color");

    const teamColor = await assignToTeam();
    if (!teamColor.id) throw new Error("Failed to assign team color");

    await sql`INSERT INTO public."USERS" (id, email, color_hex_id, team_color_id) VALUES (${userId}, ${email}, ${randomColor.id}, ${teamColor.id});`;
    await sql`INSERT INTO public."VAULT" (user_id,shade_id) VALUES (${userId}, ${teamColor.id});`;

    return {
      isError: false,
      message: `Registered ${userId} with color: ${randomColor.id}`,
      teamColor,
      randomColor,
    };
  } catch (error) {
    console.log(error);
    return { isError: true, message: "Failed to create user" };
  }
}
