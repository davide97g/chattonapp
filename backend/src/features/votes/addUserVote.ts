import { sql } from "../../config/database";

export async function addUserVote({
  userId,
  teamId,
  shadeId,
}: {
  userId: string;
  teamId: string;
  shadeId: string;
}) {
  try {
    const res =
      await sql`SELECT team_color_id from public."SHADES" where id=${shadeId} and team_color_id=${teamId};`;
    console.log(res);

    if (res.count > 0) {
      await sql`INSERT INTO public."VOTES" (user_id, team_id, shade_id) VALUES (${userId}, ${teamId}, ${shadeId});`;

      return {
        status: 201,
        message: `User ${userId} voted with for ${teamId} with shade ${shadeId}`,
      };
    } else {
      return {
        status: 400,
        message: `Shade ${shadeId} does not belong to team ${teamId}`,
      };
    }
  } catch (error) {
    console.log(error);
    return {
      status: 500,
      message: `Failed to add user ${userId} vote for team ${teamId} with shade ${shadeId}`,
    };
  }
}
