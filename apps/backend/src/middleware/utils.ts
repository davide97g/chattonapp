// import { Request } from "express";
// import { supabase } from "../config/supabase";

// export const getUserInfoFromToken = async (
//   req: Request,
// ): Promise<{
//   id?: string;
//   email?: string;
// } | null> => {
//   const bearerToken = req.header("Authorization");
//   if (!bearerToken) return null;
//   try {
//     const tokenString = bearerToken.split("Bearer ")[1];
//     if (!tokenString) return null;
//     const userInfo = await supabase.auth.getUser(tokenString);
//     const user = userInfo.data.user;
//     return {
//       id: user?.id,
//       email: user?.email,
//     };
//   } catch (err) {
//     return null;
//   }
// };
