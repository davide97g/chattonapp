import { IShade } from "@pixel-world/types";
import { sql } from "../../config/database";

export async function getShades() {
  try {
    const shades: IShade[] = await sql`select * from public."SHADES";`;
    return shades;
  } catch (error) {
    console.log(error);
    return null;
  }
}
