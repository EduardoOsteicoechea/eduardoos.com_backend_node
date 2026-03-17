import { Router } from 'express';
import { getHealth, postHealth } from '../controllers/apiHealthControllers';
import { getMe  } from '../controllers/apiAuthControllers';

export const privateApiRoutes = Router();

privateApiRoutes.get("/get_health", getHealth);
privateApiRoutes.post("/post_health", postHealth);
privateApiRoutes.post("/me", getMe);