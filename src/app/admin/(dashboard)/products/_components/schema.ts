import * as z from "zod";

export const productFormSchema = z.object({
  description: z
    .string()
    .trim()
    .min(
      1,
      "Product description is required"
    )
    .max(
      255,
      "Description must be less than 255 characters"
    ),

  item_type: z
    .string()
    .min(
      1,
      "Product type is required"
    ),

  serialized:
    z.boolean(),

  qoh:
    z.coerce
      .number()
      .min(
        0,
        "Quantity cannot be negative"
      ),

  system_sku:
    z.string().optional(),

  custom_sku:
    z.string().optional(),

  manufacturer_sku:
    z.string().optional(),

  upc:
    z
      .string()
      .trim()
      .regex(
        /^(\d{7,8}|\d{11,18})$/,
        "UPC must contain 7–8 or 11–18 digits"
      )
      .optional()
      .or(z.literal("")),

  ean:
    z
      .string()
      .trim()
      .regex(
        /^(\d{7,8}|\d{11,18})$/,
        "EAN must contain 7–8 or 11–18 digits"
      )
      .optional()
      .or(z.literal("")),

  brand_id:
    z
      .union([
        z.number(),
        z.null(),
      ])
      .optional(),

  category_id:
    z
      .union([
        z.number(),
        z.null(),
      ])
      .optional(),

  tags:
    z.string().optional(),

  price:
    z.coerce
      .number()
      .min(
        0,
        "Price cannot be negative"
      ),

  msrp:
    z.coerce
      .number()
      .min(
        0,
        "MSRP cannot be negative"
      ),

  online_price:
    z.coerce
      .number()
      .min(
        0,
        "Online price cannot be negative"
      ),

  discountable:
    z.boolean(),

  taxable:
    z.boolean(),

  tax_class_id:
    z
      .union([
        z.number(),
        z.null(),
      ])
      .optional(),

  default_cost:
    z.coerce
      .number()
      .min(
        0,
        "Default cost cannot be negative"
      ),

  // vendor_cost:
  //   z.coerce
  //     .number()
  //     .min(
  //       0,
  //       "Vendor cost cannot be negative"
  //     ),

  vendor_id:
    z
      .union([
        z.number(),
        z.null(),
      ])
      .optional(),

  vendor_sku:
    z.string().optional(),

  reorder_point:
    z.coerce
      .number()
      .min(
        0,
        "Reorder point cannot be negative"
      ),

  reorder_level:
    z.coerce
      .number()
      .min(
        0,
        "Desired inventory level cannot be negative"
      ),


  publish_to_ecom:
    z.boolean(),


  attribute_1_value:
    z.string().optional(),

  attribute_2_value:
    z.string().optional(),

  attribute_3_value:
    z.string().optional(),

  note:
    z.string().optional(),

  display_note:
    z.boolean(),
});


export type ProductFormInput =
  z.input<
    typeof productFormSchema
  >;


export type ProductFormData =
  z.output<
    typeof productFormSchema
  >;