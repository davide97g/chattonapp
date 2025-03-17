import { sql } from "../../config/database";

export async function assignToTeam(): Promise<{
  id: string;
  total: number;
}> {
  const teamDistribution = await sql`SELECT public."TEAM_COLORS".id,COUNT(*)
FROM public."USERS" 
RIGHT OUTER JOIN public."TEAM_COLORS" 
ON public."USERS".team_color_id = public."TEAM_COLORS".id
group by public."TEAM_COLORS".id
`;
  console.log({ teamDistribution });

  const teamColors = teamDistribution.map((team) => ({
    id: team.id,
    total: team.count,
  }));
  // sort by total ascending
  teamColors.sort((a, b) => a.total - b.total);

  return teamColors[0] ?? { id: "#FF0000", total: 0 };
}
