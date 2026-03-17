import { Request, Response, NextFunction } from 'express';
import { ZodObject, ZodError } from 'zod';

export const validate = (schema: ZodObject) => {
   return async (req: Request, res: Response, next: NextFunction) => {
      try {

         await schema.parseAsync({
            body: req.body,
            query: req.query,
            params: req.params
         });

         // No error thrown by schema.parseAsync, continue.

         next();

      } catch (error) {

         if (error instanceof ZodError) {
            const formattedErrors = error.issues.map(issue => ({
               field: issue.path.join('.'),
               message: issue.message
            }));

            return res.status(400).json({
               error: "Validation Field",
               details: formattedErrors
            });
         }

         return res.status(500).json({
            error: "Internal Server Error during validation"
         });

      }
   }
};