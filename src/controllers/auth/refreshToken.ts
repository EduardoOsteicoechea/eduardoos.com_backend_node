import type { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { GetItemCommand } from "@aws-sdk/client-dynamodb";
import { dbClient } from "../../utils/dbClient";
import { authTableName } from "../../utils/authTable";
import { JWT_SECRET } from "../../utils/jwtSecret";
import setSecureCookie from "../../utils/setSecureCookie";
import generateAccessToken from "../../utils/generateAccessToken";

function unauthorizedRequestError(res: Response, errorMessage: string) {

   return res.status(401).json({
      error: "Unauthorized",
      message: errorMessage
   });

}

export const refreshToken = async (req: Request, res: Response) => {

   try {

      const currentRefreshToken = req.cookies?.refreshToken;

      if (!currentRefreshToken) {
         return unauthorizedRequestError(res, "No refresh token provided.");
      }

      const refreshTokenPk = `REFRESH#${currentRefreshToken}`;

      const tokenResult = await dbClient.send(new GetItemCommand({
         TableName: authTableName,
         Key: { pk: { S: refreshTokenPk } }
      }));

      if (!tokenResult.Item) {
         return unauthorizedRequestError(res, "Invalid or Revoked refresh token.");
      }

      // double check token expiration date
      // DynamoDB TTL can sometimes take up to 48 hours to delete the row

      const expiresAt = parseInt(tokenResult.Item.expiresAt.N!);
      const now = Math.floor(Date.now() / 1000);

      if (now > expiresAt) {
         return unauthorizedRequestError(res, "Refresh token expired.");
      }
      
      const targetUserId = tokenResult.Item.targetUserId.S!;
      
      const userResult = await dbClient.send(new GetItemCommand({
         TableName: authTableName,
         Key: { pk: { S: targetUserId } }
      }));
      
      if(!userResult.Item){
         return unauthorizedRequestError(res, "User account no longer exists.");
      }

      const userId = userResult.Item.id.S!;
      const userEmail = userResult.Item.email.S!;
      const accessToken = generateAccessToken(userId, userEmail);

      setSecureCookie(res,
         'accessToken',
         accessToken,
         15 * 60 * 1000
      );

      return res.status(200).json({
         status: "success",
         message: "Access token refreshed."
      });

   } catch (error) {

      console.error("Refresh Token Error:", error);
      return res.status(500).json({
         error: "Internal server error during token refresh"
      });

   }

};













