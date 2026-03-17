import type { Request, Response } from 'express';

export const healthGet = (req: Request, res: Response) => {

   res.status(200).json({
      status: "online",
      mode: "Enterprise Controller Enabled"
   });
   
};