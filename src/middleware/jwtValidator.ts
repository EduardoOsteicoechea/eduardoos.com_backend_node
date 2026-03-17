import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { jwtEncryptionAlgorithmName } from '../utils/jwtEncryptionAlgorithmName';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_dev_secret';

export const jwtValidator = (req: Request, res: Response, next: NextFunction) => {
   try {
      
      const token = req.cookies?.accessToken;

      if (!token) {
         res.status(401).json({
            error: "Unauthorized",
            message: "No access token found. Please, log in."
         });
      }

      const decodedPayload = jwt.verify(token, JWT_SECRET, {
         algorithms: [jwtEncryptionAlgorithmName]
      });

      (req as any).user = decodedPayload;

      next(); // pass to the next middleware

   } catch (error) {

      if (error instanceof jwt.TokenExpiredError) {
         res.status(400).json({
            error: "TokenExpired",
            message: "Your acces token has expired.",
            action: "refresh"
         });
      }

      return res.status(403).json({
         error: "Forbidden",
         message: "Invalid authentication token."
      });

   }
};