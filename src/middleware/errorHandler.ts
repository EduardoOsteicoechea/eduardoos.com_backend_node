import type { Request, Response, NextFunction } from 'express';

export const globalErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {

   if (err.message === "Not allowed by CORS") {
      return res.status(403).json({ status: "error", message: "Cross-Origin Request Blocked." });
   }

   if (err.type === 'entity.too.large') {
      return res.status(413).json({ status: "error", message: "Payload too large (Max 50kb)." });
   }

   console.error(`[Server Error] ${err.message}`);

   return res.status(500).json({ status: "error", message: "Internal Server Error" });
};