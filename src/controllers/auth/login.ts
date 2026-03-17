import type { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { GetItemCommand, PutItemCommand } from '@aws-sdk/client-dynamodb';

import { dbClient } from '../../utils/dbClient';
import { authTableName } from '../../utils/authTable';
import { LoginInput } from '../../schemas/authSchema';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_dev_secret';

export const login = async (req: Request, res: Response) => {

   try 
   {

      

   } catch (error) 
   {



   }

}










