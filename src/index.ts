import express from 'express';
import serverless from 'serverless-http';
import cookieParser from 'cookie-parser';

import corsHandler from './middleware/corsConfig';
import { privateApiRoutes } from './routes/privateRoutes';
import { jwtValidator } from './middleware/jwtValidator';
import { userRateLimiter } from './middleware/userRateLimiter';
import { publicApiRoutes } from './routes/publicRoutes';
import { globalErrorHandler } from './middleware/errorHandler';

const app = express();

app.use(corsHandler);
app.use(express.json({ limit: '50kb' }));
app.use(cookieParser());
app.use('/api', publicApiRoutes);
app.use(jwtValidator);
app.use(userRateLimiter);
app.use('/api', privateApiRoutes);
app.use(globalErrorHandler);

export const handler = serverless(app);