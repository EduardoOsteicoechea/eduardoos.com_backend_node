import express from 'express';
import serverless from 'serverless-http';
import cookieParser from 'cookie-parser';

import corsHandler from './middleware/corsConfig';
import { privateApiRoutes } from './routes/privateApiRoutes';
import { jwtValidator } from './middleware/jwtValidator';
import { userRateLimiter } from './middleware/userRateLimiter';
import { publicPagesApiRoutes } from './routes/publicPagesRoutes';
import { publicApiRoutes } from './routes/publicApiRoutes';
import { globalErrorHandler } from './middleware/errorHandler';

const app = express();

app.use(corsHandler);
app.use(express.json({ limit: '50kb' }));
app.use(cookieParser());
app.use('/', publicPagesApiRoutes);
app.use('/api', publicApiRoutes);
app.use(jwtValidator);
app.use(userRateLimiter);
app.use('/api', privateApiRoutes);
app.use(globalErrorHandler);

export const handler = serverless(app);