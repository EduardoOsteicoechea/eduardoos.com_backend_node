import jwt from "jsonwebtoken";
import { JWT_SECRET } from "./jwtSecret";
import { jwtEncryptionAlgorithmName } from "./jwtEncryptionAlgorithmName";

export default function generateAccessToken(userId: string, normalizedEmail: string){
   return jwt.sign(
            { id: userId, email: normalizedEmail },
            JWT_SECRET,
            {
               expiresIn: '15m',
               algorithm: jwtEncryptionAlgorithmName
            }
         );
};