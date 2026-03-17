import type { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { GetItemCommand, PutItemCommand } from '@aws-sdk/client-dynamodb';

import { dbClient } from '../../utils/dbClient';
import { authTableName } from '../../utils/authTable';
import { LoginInput } from '../../schemas/authSchema';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_dev_secret';

function invalidRequestError(res: Response) {

   return res.status(401).json({
      error: "Unauthorized",
      message: "Invalid email or password."
   });

}

export const login = async (req: Request, res: Response) => {

   try {

      // note: trust the validator

      // 1. Get user id by email

      const { email, password } = req.body as LoginInput;
      const normalizedEmail = email.toLowerCase().trim();

      const emailPointerResult = await dbClient.send(new GetItemCommand({
         TableName: authTableName,
         Key: { pk: { S: `EMAIL#${normalizedEmail}` } }
      }));

      if (!emailPointerResult.Item || !emailPointerResult.Item.targetUserId) {
         return invalidRequestError(res);
      }

      // 2. Get user data, specially it's password hash by id

      const targetUserId = emailPointerResult.Item.targetUserId.S!;

      const userResult = await dbClient.send(new GetItemCommand({
         TableName: authTableName,
         Key: { pk: { S: targetUserId } }
      }));

      if (!userResult.Item) {
         return invalidRequestError(res);
      }

      // 3. validate the password

      const dbStoredPasswordHash = userResult.Item.passwordHash.S!;

      const passwordIsValid = await bcrypt.compare(password, dbStoredPasswordHash);

      if (!passwordIsValid) {
         return invalidRequestError(res);
      }

      // 4. Generate the access token

      const userId = userResult.Item.id.S!;
      const accessToken = jwt.sign(
         { id: userId, email: normalizedEmail },
         JWT_SECRET,
         { expiresIn: '15m' }
      );

      // 5. Generate the refresh token
      
      const refreshTokenId = crypto.randomBytes(32).toString('hex');
      const refreshTokenPk = `REFRESH#${refreshTokenId}`;
      const sevenDaysInSeconds = 7 * 24 * 60 * 60;
      const expiresAt = Math.floor(Date.now() / 1000) + sevenDaysInSeconds;

      // 6. Store the refresh token

      await dbClient.send(new PutItemCommand({
         TableName: authTableName,
         Item: {
            pk: { S: refreshTokenPk },
            targetUserId: { S: targetUserId },
            type: { S: "REFRESH_TOKEN" },
            expiresAt: { N: expiresAt.toString() }
         }
      }));

      // 7. Atach http only cookies 

      res.cookie("accessToken", refreshTokenId, {
         httpOnly: true,
         secure: process.env.NODE_ENV === "production",
         sameSite: 'strict',
         maxAge: 15 * 60 * 1000
      });

      res.cookie("refreshToken", refreshTokenId, {
         httpOnly: true,
         secure: process.env.NODE_ENV === "production",
         sameSite: "strict",
         path: "/api/refresh",
         maxAge: 7 * 24 * 60 * 60 * 1000
      });

      // 8. Return success

      return res.status(200).json({
         status: "success",
         user: {
            id: userId,
            email: normalizedEmail,
            name: userResult.Item.name?.S || ""
         }
      });

   } catch (error) {

      console.error("Login Error:", error);
      return res.status(500).json({
         error: "Internal Server Error during login."
      });

   }

}










