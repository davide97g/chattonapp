import { sql } from "../../config/database";

export async function addUserShade({
  userId,
  shadeId,
}: Readonly<{ userId: string; shadeId: string }>) {
  try {
    const shade = await sql`select id from public."SHADES" where id=${shadeId}`;
    if (!shade) return { status: 404, message: `Shade not found` };

    const result =
      await sql`insert into public."VAULT" (user_id, shade_id) values (${userId}, ${shadeId}) returning *`;
    if (!result)
      return { status: 500, message: `Failed to add shade to user's vault` };

    return { status: 200, data: result };
  } catch (error) {
    console.log(error);
    return {
      status: 500,
      message: `Failed to retrieve user's colors`,
    };
  }
}
