import * as z from "zod";

export const inventoryFormSchema = z.object({
  reorder_point: z
    .string()
    .trim()
    .min(1, "Reorder Point is required")
    .max(255, "Reorder Point must be less than 255 characters"),
  reorder_level: z
    .string()
    .trim()
    .min(1, "Reorder Level is required")
    .max(255, "Reorder Level must be less than 255 characters"),
});

export type InventoryFormInput = z.input<typeof inventoryFormSchema>;
export type InventoryFormData = z.output<typeof inventoryFormSchema>;