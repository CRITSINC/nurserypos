import { z } from "zod";

export const passwordSchema = z
  .object({
    oldPassword: z
      .string()
      .min(1, "Current password is required"),

    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters"),

    confirmPassword: z
      .string()
      .min(1, "Please confirm your password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match.",
  });

export type PasswordFormData = z.infer<typeof passwordSchema>;