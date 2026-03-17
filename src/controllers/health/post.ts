import type { Request, Response } from 'express';

export const healthPost = (req: Request, res: Response) => {

   if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ error: "Empty Payload" });
   }

   const requestBody = req.body;

   res.status(200).json({
      status: "success",
      message: "Successfully processed by AWS Lambda Controller",
      echo: requestBody,
      timeStamp: new Date().toISOString(),
   });

};