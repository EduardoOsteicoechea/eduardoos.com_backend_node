import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

const dbClient = new DynamoDBClient({ region: process.env.AWS_REGION || "us-east-1" });

export { dbClient }