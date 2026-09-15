import { z } from "zod";

export const vendorFormSchema = z.object({
  // Setup
  name: z
    .string()
    .trim()
    .min(1, "Vendor name is required."),

  accountNumber: z.string().optional(),

  currencyCode: z.string().optional(),

  // Catalog
  enabled: z.boolean(),

  catalog: z.string().optional(),

  priceLevel: z.string().optional(),

  // Update From Catalog
  updatePrice: z.boolean(),

  updateCost: z.boolean(),

  updateDescription: z.boolean(),

  // Sales Rep
  repFirstName: z.string().optional(),

  repLastName: z.string().optional(),

  // Phones
  phone: z.string().optional(),

  mobile: z.string().optional(),

  fax: z.string().optional(),

  // Address
  country: z.string().optional(),

  address1: z.string().optional(),

  address2: z.string().optional(),

  city: z.string().optional(),

  province: z.string().optional(),

  postalCode: z.string().optional(),

  // Other
  website: z.string().optional(),

  email1: z.string().optional(),

  email2: z.string().optional(),

  custom: z.string().optional(),

  // Notes
  notes: z.string().optional(),
});

export type VendorFormInput =
  z.input<typeof vendorFormSchema>;

export type VendorFormData =
  z.output<typeof vendorFormSchema>;