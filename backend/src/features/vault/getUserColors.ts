import { IShade } from "@pixel-world/types";
import { sql } from "../../config/database";

export async function getUserColors({ userId }: Readonly<{ userId: string }>) {
  try {
    const colors: IShade[] =
      await sql`select id, name, team_color_id, public."SHADES".created_at from public."VAULT" join public."SHADES" on public."VAULT".shade_id=public."SHADES".id where user_id=${userId}`;

    return { status: 200, data: colors };
  } catch (error) {
    console.log(error);
    return {
      status: 500,
      message: `Failed to retrieve user's colors`,
    };
  }
}
