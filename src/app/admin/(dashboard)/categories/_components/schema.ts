import * as z from "zod";

export const categoryFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Category name is required")
    .max(255, "Category name must be less than 255 characters"),
});

export type CategoryFormInput = z.input<typeof categoryFormSchema>;
export type CategoryFormData = z.output<typeof categoryFormSchema>;