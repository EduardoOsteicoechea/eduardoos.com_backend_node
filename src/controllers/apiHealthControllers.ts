import type { Request, Response } from 'express';

export const getHealth = (req: Request, res: Response) => {

   res.status(200).json({
      status: "online",
      mode: "Enterprise Controller Enabled"
   });
   
};

export const postHealth = (req: Request, res: Response) => {

   // Validation logic lives here
   if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ error: "Empty Payload" });
   }

   // Business logic lives here
   const requestBody = req.body;

   // Response logic lives here
   res.status(200).json({
      status: "success",
      message: "Successfully processed by AWS Lambda Controller",
      echo: requestBody,
      timeStamp: new Date().toISOString(),
   });

};