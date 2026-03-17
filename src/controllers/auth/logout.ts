import { application, Request, Response } from "express";
import { DeleteItemCommand } from "@aws-sdk/client-dynamodb";
import { dbClient } from "../../utils/dbClient";
import { authTableName } from "../../utils/authTable";

export const logout = async (req: Request, res: Response) => {

   try {

      const currentRefreshToken = req.cookies?.refreshToken;

      if (currentRefreshToken) {
         const refreshTokenPk = `REFRESH#${currentRefreshToken}`;

         await dbClient.send(new DeleteItemCommand({
            TableName: authTableName,
            Key: { pk: { S: refreshTokenPk } }
         }));
      }

      const cookieOptions = {
         httpOnly: true,
         secure: process.env.NODE_ENV === "production",
         sameSite: "strict" as const
      };

      res.clearCookie("accessToken", cookieOptions);

      res.clearCookie("refreshToken", {
         ...cookieOptions,
         path: "/api/refresh"
      });

      return res.status(200).json({
         status: "success",
         message: "Logged out successfully."
      });

   } catch (error) {

      console.error("Logout Error:", error);

      res.status(500).json({ error: "Internal Server Error during logout." });

   }

};












