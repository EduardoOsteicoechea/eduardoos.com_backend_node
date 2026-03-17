import { email, z } from 'zod';

export const registerSchema = z.object({
   body: z.object({
      email: z.email({ message: "invalid email format" })


      password: z.string({}),

      name: z.strin
   })
});