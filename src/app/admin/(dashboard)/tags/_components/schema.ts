import * as z from "zod";

export const tagFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Tag name is required")
    .max(255, "Tag name must be less than 255 characters"),
});

export type TagFormInput = z.input<typeof tagFormSchema>;
export type TagFormData = z.output<typeof tagFormSchema>;