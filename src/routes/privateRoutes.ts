import { Router } from 'express';
import { healthGet, healthPost } from '../controllers/health';
import { getMe } from '../controllers/auth';

export const privateApiRoutes = Router();

privateApiRoutes.get("/health-get", healthGet);
privateApiRoutes.post("/health-post", healthPost);
privateApiRoutes.post("/me", getMe);