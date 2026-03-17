import { Router } from 'express';
import { indexPage } from '../controllers/pages';

export const publicPagesApiRoutes = Router();

publicPagesApiRoutes.get("/", indexPage);