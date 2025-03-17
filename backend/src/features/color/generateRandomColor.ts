import { sql } from "../../config/database";

function extractRandomColorFromUnchosen(alreadyChosenColors: string[]) {
  if (alreadyChosenColors.length !== 0)
    return sql`SELECT id, name FROM public."COLORS" WHERE id NOT IN (${alreadyChosenColors}) ORDER BY RANDOM() LIMIT 1;`;
  return sql`SELECT id, name FROM public."COLORS" ORDER BY RANDOM() LIMIT 1;`;
}

export async function generateRandomColorForUser() {
  try {
    const data: { color_hex_id: string }[] =
      await sql`SELECT color_hex_id FROM public."USERS";`;
    console.log(data);

    const colors = data.map((user) => user.color_hex_id);

    const notChosenColorsQuery = await extractRandomColorFromUnchosen(colors);

    if (!notChosenColorsQuery.length) {
      console.log(notChosenColorsQuery);
      return null;
    }

    return notChosenColorsQuery[0] as {
      id: string;
      name: string;
    };
  } catch (error) {
    console.log(error);
    return null;
  }
}
