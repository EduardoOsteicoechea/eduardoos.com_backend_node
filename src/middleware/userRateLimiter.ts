import { dbClient } from '../utils/dbClient';
import { authTableName } from '../utils/authTable';
import { Request, Response, NextFunction } from 'express';
import { UpdateItemCommand } from '@aws-sdk/client-dynamodb';

const MAX_REQUESTS_PER_MINUTE = 15;

export const userRateLimiter = async (req: Request, res: Response, next: NextFunction) => {
   try {

      const userId = (req as any).user?.id;

      if (!userId) {
         return res.status(401).json({
            error: "Unauthorized",
            message: "User Context missing."
         });
      }

      const currentMinute = Math.floor(Date.now() / 1000 / 60);

      const pk = `LIMIT#USER#${userId}#MIN#${currentMinute}`;

      const command = new UpdateItemCommand({
         TableName: authTableName,
         Key: { pk: { S: pk } },
         UpdateExpression: "SET hits = if_not_exists(hits, :zero) + :one, expiresAt = if_not_exists(expiresAt, :ttl)",
         ExpressionAttributeValues: {
            ":zero": { N: "0" },
            ":one": { N: "1" },
            ":ttl": { N: ((currentMinute * 60) + 120).toString() }
         },
         ReturnValues: "UPDATED_NEW"
      });

      const result = await dbClient.send(command);

      const currentHits = parseInt(result.Attributes?.hits?.N || "0", 10);

      if (currentHits > MAX_REQUESTS_PER_MINUTE) {
         return res.status(429).json({
            error: "Too Many Requests",
            message: `You have exeeded the limit of ${MAX_REQUESTS_PER_MINUTE} requests per minute.`
         });
      }

      next(); // because the request is under the limit, proceed down the pipeline

   } catch (error) {

      console.error("User Rate Limiter Error", error);

      // 5. FAIL OPEN STRATEGY
      // If DynamoDB has a temporary glitch, we don't want to break the entire application.
      // We log the error, but we let the user through so business can continue.
      next();

   }
};
