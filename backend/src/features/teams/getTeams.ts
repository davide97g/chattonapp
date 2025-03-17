import { ITeamColor } from "@pixel-world/types";
import { sql } from "../../config/database";

export async function getTeams() {
  try {
    const teams: ITeamColor[] = await sql`SELECT * FROM public."TEAM_COLORS";`;

    return teams;
  } catch (error) {
    console.log(error);
    return null;
  }
}
