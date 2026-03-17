import { CorsOptions } from "cors";
import cors from 'cors';

const devAllowedFrontendOrigin = process.env.DEV_FRONTEND_ORIGIN || 'http://localhost:3000';

const corsOptions: CorsOptions = {
   origin: (origin, callback) => {
      const allowed = process.env.FRONTEND_ORIGIN;
      if (!origin || origin === devAllowedFrontendOrigin) {
         callback(null, true);
      } else {
         console.warn(`[CORS] Blocked CORS origin: ${origin}`);
         callback(new Error("Not allowed by CORS"))
      }
   },
   credentials: true,
   maxAge: 86400
};

export default cors(corsOptions)