import { z } from "zod";

export const customerFormSchema =
  z.object({
    type: z.string().default("none"),

    created: z.string().optional(),

    discount: z.string().default("default"),

    salesTax: z.string().default("default"),

    first_name: z
      .string()
      .min(
        1,
        "First name is required."
      ),

    last_name: z
      .string()
      .optional(),


    title: z
      .string()
      .optional(),

    company: z
      .string()
      .optional(),

    dob: z
      .string()
      .optional(),

    address_1: z
      .string()
      .optional(),

    address_2: z
      .string()
      .optional(),

    city: z
      .string()
      .optional(),

    state: z
      .string()
      .optional(),

    zip: z
      .string()
      .optional(),

    country: z
      .string()
      .optional(),

    country_code: z
      .string()
      .optional(),

    phone_home: z
      .string()
      .optional(),

    phone_work: z
      .string()
      .optional(),

    phone_mobile: z
      .string()
      .optional(),

    phone_pager: z
      .string()
      .optional(),

    phone_fax: z
      .string()
      .optional(),

    email_primary: z
      .string()
      .min(
        1,
        "Email 1 is required."
      ),

    email_secondary: z
      .string()
      .optional(),

    website: z
      .string()
      .optional(),

    custom: z
      .string()
      .optional(),

    tags: z
      .string()
      .optional(),

    no_email: z
      .boolean()
      .default(false),

    no_mail: z
      .boolean()
      .default(false),

    no_phone: z
      .boolean()
      .default(false),

    contact_consent: z
      .boolean()
      .default(false),

    note: z
      .string()
      .optional(),

    note_is_public: z
      .boolean()
      .default(false),
  });

export type CustomerFormInput =
  z.input<
    typeof customerFormSchema
  >;

export type CustomerFormData =
  z.output<
    typeof customerFormSchema
  >;