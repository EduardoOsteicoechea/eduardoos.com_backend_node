import type { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { TransactWriteItemsCommand } from '@aws-sdk/client-dynamodb';

import { dbClient } from '../../utils/dbClient';
import { authTableName } from '../../utils/authTable';

export const register = async (req: Request, res: Response) => {
   try {

      const { email, password, name } = req.body;

      if(!email || !password){
         return res.status(400).json({
            error: "Email and Password are required."
         });
      }

      const normalizedEmail = email.toLowerCase().trim();
      const userId = crypto.randomUUID();
      const now = new Date().toISOString();

      const userPk = `USER#${userId}`;
      const emailPk = `EMAIL#${normalizedEmail}`;

      const saltRounds = 10;
      const passwordHash = await bcrypt.hash(password, saltRounds);

      const transactionCommand = new TransactWriteItemsCommand({
         TransactItems: [
            {
               Put: {
                  TableName: authTableName,
                  Item: {
                     pk: { S: emailPk },
                     targetUserId: { S: userPk},
                     type: { S: "EMAIL_POINTER"}
                  },
                  ConditionExpression: "attribute_not_exists(pk)"
               }
            },
            {
               Put: {
                  TableName: authTableName,
                  Item: {
                     pk: { S: userPk },
                     id: { S: userId },
                     email: { S: normalizedEmail },
                     name: { S: name || "" },
                     passwordHash: { S: passwordHash },
                     type: { S: "USER" },
                     createdAt: { S: now },
                  }
               }
            }
         ]
      });

      await dbClient.send(transactionCommand);

      return res.status(200).json({
         status: "success",
         message: "User registerede successfully",
         user: {
            id: userId,
            email: normalizedEmail,
            name: name || ""
         }
      });

    } catch (error: any) {

      if(error.name === "TransactionCanceledException"){
         return res.status(409).json({
            error: "Conflict",
            message: "An user with this email already exists."
         });
      }

    }
};