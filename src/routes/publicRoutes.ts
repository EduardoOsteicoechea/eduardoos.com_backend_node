import { Router } from 'express';
import { indexPage } from '../controllers/apiPagesControllers'; 
import { login, resetPassword, logout, refreshToken } from '../controllers/auth'; 

export const publicApiRoutes = Router();

publicApiRoutes.get("/", indexPage);
publicApiRoutes.get("/login", login);
publicApiRoutes.get("/reset_password", resetPassword);
publicApiRoutes.get("/logout", logout);
publicApiRoutes.get("/refresh_token", refreshToken);