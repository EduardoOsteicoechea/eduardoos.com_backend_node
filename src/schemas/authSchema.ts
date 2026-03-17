import { email, z } from 'zod';

export const registerSchema = z.object({
   body: z.object({

      email: z.email({ message: "Invalid email format" }),

      password: z.string()
         .min(8,"Password must be at least 8 characters long")
         .max(64, "Password cannot exceed 64 characters")
         .regex(/A-Z/, "Password must contain at least one uppercase letter")
         .regex(/0-9/, "Password must contain at least a number")
         ,

      name: z.string()
         .min(2,"Username must be at least 2 characters long")
         .max(50, "Username cannot exceed 50 characters")
   })
});

export const loginSchema = z.object({
   body: z.object({
      email: z.email({ message: "Invalid email format"}),
      password: z.string().min(1, "Password cannot be empty")
   })
});

export const forgotPasswordSchema = z.object({
    body: z.object({
        email: z.email({ message: "Invalid email format" })
    })
});

export const resetPasswordSchema = z.object({
    body: z.object({
        token: z.string().min(1, "Reset token is required"),
        newPassword: z.string()
            .min(8, "Password must be at least 8 characters long")
            .max(64, "Password cannot exceed 64 characters")
    })
});

export const validateEmailSchema = z.object({
    body: z.object({
        token: z.string().min(1, "Verification token is required")
    })
});

export type RegisterInput = z.infer<typeof registerSchema>['body'];
export type LoginInput = z.infer<typeof loginSchema>['body'];
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>['body'];
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>['body'];
export type ValidateEmailInput = z.infer<typeof validateEmailSchema>['body'];