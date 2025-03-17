import { IShade } from "@pixel-world/types";
import { sql } from "../../config/database";

export async function getUserColorsForTeam({
  userId,
  teamId,
}: Readonly<{ userId: string; teamId: string }>) {
  try {
    const colors: IShade[] =
      await sql`select public."SHADES".id from public."VAULT" INNER JOIN public."SHADES" on public."VAULT".shade_id=public."SHADES".id where public."SHADES".team_color_id=${teamId} and public."VAULT".user_id=${userId}`;

    return { status: 200, data: colors };
  } catch (error) {
    console.log(error);
    return {
      status: 500,
      message: `Failed to retrieve user's colors`,
    };
  }
}
