import * as z from "zod";

export const brandFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Brand name is required")
    .max(255, "Brand name must be less than 255 characters")
});

export type BrandFormInput = z.input<typeof brandFormSchema>;
export type BrandFormData = z.output<typeof brandFormSchema>;