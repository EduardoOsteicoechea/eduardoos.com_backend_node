import { Router } from 'express';
import { indexPage } from '../controllers/pages'; 
import { 
   register, 
   login, 
   validateEmail, 
   forgotPassword, 
   resetPassword, 
   logout, 
   refreshToken 
} from '../controllers/auth'; 
import { validate } from '../middleware/authRequestValidator';
import { 
   registerSchema, 
   loginSchema ,
   forgotPasswordSchema,
   resetPasswordSchema,
   validateEmailSchema
} from '../schemas/authSchema';

export const publicApiRoutes = Router();

publicApiRoutes.get("/", indexPage);

publicApiRoutes.post("/register", validate(registerSchema), register);
publicApiRoutes.post("/login", validate(loginSchema), login);
publicApiRoutes.post("/validate-email", validate(validateEmailSchema), validateEmail);

publicApiRoutes.post("/forgot-password", validate(forgotPasswordSchema), forgotPassword);
publicApiRoutes.post("/reset-password", validate(resetPasswordSchema), resetPassword);

publicApiRoutes.post("/logout", logout);

publicApiRoutes.post("/refresh-token", refreshToken);