import { z } from "zod";

export const bannerFormSchema = z.object({
    // Required
    title: z
        .string()
        .trim()
        .min(1, "Title is required"),

    // Required
    description: z
        .string()
        .trim()
        .min(1, "Description is required"),

    // Required
    color: z
        .string()
        .trim()
        .min(1, "Banner text color is required"),

    // Optional
    link_url: z
        .string()
        .trim()
        .optional(),

    // Optional
    button_text: z
        .string()
        .trim()
        .optional(),

    // Optional
    button_color: z
        .string()
        .trim()
        .optional(),

    // Optional
    button_text_color: z
        .string()
        .trim()
        .optional(),

    // Required
    is_active: z
        .boolean(),

    // Required
    sort_order: z
        .number()
        .min(0, "Sort order cannot be negative"),

    // Required during CREATE,
    // handled separately in BannerForm
    file: z
        .any()
        .optional(),
});

export type BannerFormData = z.infer<
    typeof bannerFormSchema
>;