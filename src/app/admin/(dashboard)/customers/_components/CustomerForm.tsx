"use client";

import { useEffect, useState } from "react";
import { useWatch } from "react-hook-form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
} from "@/components/admin/ui/sheet";

import { Form } from "@/components/admin/ui/form";

import {
  FormSheetBody,
  FormSheetContent,
  FormSheetFooter,
  FormSheetHeader,
} from "@/components/admin/shared/form/FormSheet";

import {
  FormTextInput,
} from "@/components/admin/shared/form";

import {
  FormSubmitButton,
} from "@/components/admin/shared/form/FormSubmitButton";

import {
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/admin/ui/form";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/admin/ui/select";

import { Textarea } from "@/components/admin/ui/textarea";

import { Checkbox } from "@/components/admin/ui/checkbox";

import {
  customerFormSchema,
  CustomerFormInput,
  CustomerFormData,
} from "./schema";

import {
  useCreateCustomerMutation,
  useUpdateCustomerMutation,
  useGetCustomerTypesQuery,
  useGetDiscountsQuery,
  useGetTaxCategoriesQuery,
} from "@/redux/services/customer";

import { useGetTagsQuery } from "@/redux/services/tag";

import { countriesList } from "@/constants/countries";

type Props = {
  open: boolean;

  onOpenChange: (
    open: boolean
  ) => void;

  isEdit?: boolean;

  customerId?: number;

  initialData?: Partial<CustomerFormData>;
};

export default function CustomerForm({
  open,
  onOpenChange,
  isEdit = false,
  customerId,
  initialData,
}: Props) {
  const [
    createCustomer,
    {
      isLoading: creating,
    },
  ] = useCreateCustomerMutation();

  const [
    updateCustomer,
    {
      isLoading: updating,
    },
  ] = useUpdateCustomerMutation();


  const {
    data: customerTypesResponse,
    isLoading: loadingCustomerTypes,
  } =
    useGetCustomerTypesQuery(
      undefined,
      {
        skip: !open,
      }
    );

  const {
    data: discountsResponse,
    isLoading: loadingDiscounts,
  } =
    useGetDiscountsQuery(
      undefined,
      {
        skip: !open,
      }
    );

  const {
    data: taxCategoriesResponse,
    isLoading: loadingTaxCategories,
  } =
    useGetTaxCategoriesQuery(
      undefined,
      {
        skip: !open,
      }
    );

  const {
    data: tagsResponse,
    isLoading: loadingTags,
  } = useGetTagsQuery(
    {
      page: 1,
      limit: 1000,
    },
    {
      skip: !open,
    }
  );

  const customerTypes =
    customerTypesResponse?.data ?? [];

  const discounts =
    discountsResponse?.data ?? [];

  const taxCategories =
    taxCategoriesResponse?.data ?? [];

  const tags =
    tagsResponse?.data ?? [];

  const [provinces, setProvinces] =
    useState<any[]>([]);

  const isSubmitting =
    creating || updating;

  const form = useForm<
    CustomerFormInput,
    undefined,
    CustomerFormData
  >({
    resolver: zodResolver(
      customerFormSchema
    ),

    defaultValues: {
      type: "none",
      created: "",
      discount: "default",
      salesTax: "default",

      first_name: "",

      last_name: "",

      title: "",

      company: "",

      dob: "",

      address_1: "",

      address_2: "",

      city: "",

      state: "",

      zip: "",

      country: "",

      country_code: "",

      phone_home: "",

      phone_work: "",

      phone_mobile: "",

      phone_pager: "",

      phone_fax: "",

      email_primary: "",

      email_secondary: "",

      website: "",

      custom: "",

      tags: "",

      no_email: false,

      no_mail: false,

      no_phone: false,

      contact_consent: false,

      note: "",

      note_is_public: false,

      ...initialData,
    },
  });

  const contactConsent = useWatch({
    control: form.control,
    name: "contact_consent",
  });

  const selectedCountry = useWatch({
    control: form.control,
    name: "country",
  });

useEffect(() => {
  if (!open) {
    return;
  }

  // ADD CUSTOMER
  // No initialData means this is a new customer.
  if (!initialData) {
    form.reset({
      type: "none",
      created: "",
      discount: "default",
      salesTax: "default",

      first_name: "",
      last_name: "",
      title: "",
      company: "",
      dob: "",

      address_1: "",
      address_2: "",
      city: "",
      state: "",
      zip: "",
      country: "",
      country_code: "",

      phone_home: "",
      phone_work: "",
      phone_mobile: "",
      phone_pager: "",
      phone_fax: "",

      email_primary: "",
      email_secondary: "",

      website: "",
      custom: "",

      tags: "",

      no_email: false,
      no_mail: false,
      no_phone: false,
      contact_consent: false,

      note: "",
      note_is_public: false,
    });

    return;
  }

  // EDIT CUSTOMER
  form.reset({
    type:
      initialData.type ?? "none",

    created:
      initialData.created ?? "",

    discount:
      initialData.discount ?? "default",

    salesTax:
      initialData.salesTax ?? "default",

    first_name:
      initialData.first_name ?? "",

    last_name:
      initialData.last_name ?? "",

    title:
      initialData.title ?? "",

    company:
      initialData.company ?? "",

    dob:
      initialData.dob ?? "",

    address_1:
      initialData.address_1 ?? "",

    address_2:
      initialData.address_2 ?? "",

    city:
      initialData.city ?? "",

    state:
      initialData.state ?? "",

    zip:
      initialData.zip ?? "",

    country:
      initialData.country ?? "",

    country_code:
      initialData.country_code ?? "",

    phone_home:
      initialData.phone_home ?? "",

    phone_work:
      initialData.phone_work ?? "",

    phone_mobile:
      initialData.phone_mobile ?? "",

    phone_pager:
      initialData.phone_pager ?? "",

    phone_fax:
      initialData.phone_fax ?? "",

    email_primary:
      initialData.email_primary ?? "",

    email_secondary:
      initialData.email_secondary ?? "",

    website:
      initialData.website ?? "",

    custom:
      initialData.custom ?? "",

    tags:
      initialData.tags ?? "",

    no_email:
      initialData.no_email ?? false,

    no_mail:
      initialData.no_mail ?? false,

    no_phone:
      initialData.no_phone ?? false,

    contact_consent:
      initialData.contact_consent ?? false,

    note:
      initialData.note ?? "",

    note_is_public:
      initialData.note_is_public ?? false,
  });
}, [
  open,
  initialData,
  form,
]);

  useEffect(() => {
    const getProvinces = async () => {
      try {
        const response = await fetch(
          "https://countriesnow.space/api/v0.1/countries/states/q?country=Canada"
        );

        const result = await response.json();

        if (!result.error) {
          setProvinces(result.data.states);
        }
      } catch (error) {
        console.error("Failed to fetch provinces:", error);
      }
    };

    getProvinces();
  }, []);

  const uniqueTags = Array.from(
  new Map(
    tags.map((tag) => [tag.name, tag])
  ).values()
);

  const onSubmit = async (
    values: CustomerFormData
  ) => {
    try {
      const selectedCountryData =
        countriesList.find(
          (country) =>
            country.name === values.country
        );

      const selectedProvince =
        values.country === "Canada"
          ? provinces.find(
              (province) =>
                province.name === values.state
            )
          : undefined;

      const stateCode =
        selectedProvince?.iso2 ||
        (initialData as any)?.state_code ||
        null;

      const customerTypeId =
        values.type && values.type !== "none"
          ? Number(values.type)
          : null;

      const discountId =
        values.discount && values.discount !== "default"
          ? Number(values.discount)
          : null;

      const taxCategoryId =
        values.salesTax && values.salesTax !== "default"
          ? Number(values.salesTax)
          : null;

      const customerTags =
        typeof values.tags === "string"
          ? values.tags
              .split(",")
              .map((tag) => tag.trim())
              .filter(Boolean)
          : Array.isArray((values as any).tags)
          ? (values as any).tags
              .map((tag: any) =>
                typeof tag === "string"
                  ? tag.trim()
                  : tag?.name?.trim()
              )
              .filter(Boolean)
          : [];

      const payload = {
        first_name:
          values.first_name,

        last_name:
          values.last_name,

        title:
          values.title || null,

        company:
          values.company || null,

        dob:
          values.dob
            ? new Date(
                `${values.dob}T00:00:00.000Z`
              ).toISOString()
            : null,

        company_registration_number:
          null,

        vat_number:
          null,

        customer_type_id:
          customerTypeId,

        discount_id:
          discountId,

        tax_category_id:
          taxCategoryId,

        phone_mobile:
          values.phone_mobile || null,

        phone_home:
          values.phone_home || null,

        phone_work:
          values.phone_work || null,

        phone_pager:
          values.phone_pager || null,

        phone_fax:
          values.phone_fax || null,

        email_primary:
          values.email_primary || null,

        email_secondary:
          values.email_secondary || null,

        website:
          values.website || null,

        custom:
          values.custom || null,

        address_1:
          values.address_1 || null,

        address_2:
          values.address_2 || null,

        city:
          values.city || null,

        state:
          values.state || null,

        state_code:
          stateCode,

        zip:
          values.zip || null,

        country:
          values.country || null,

        country_code:
          selectedCountryData?.code ||
          values.country_code ||
          null,

        tags:
          customerTags,

        no_email:
          values.no_email === true,

        no_phone:
          values.no_phone === true,

        no_mail:
          values.no_mail === true,

        note:
          values.note || null,

        note_is_public:
          values.note_is_public === true,
      };

      console.log("payload-----------",payload)
      if (isEdit && customerId) {
        await updateCustomer({
          id: customerId,
          body: payload,
        }).unwrap();

        toast.success(
          "Customer updated successfully."
        );
      } else {
        await createCustomer(payload).unwrap();

        toast.success(
          "Customer created successfully."
        );
      }

      form.reset();
      onOpenChange(false);
    } catch (error: any) {
      toast.error(
        error?.data?.message ??
          error?.message ??
          "Something went wrong."
      );
    }
  };

  /*
   * ==========================================
   * RENDER
   * ==========================================
   */

  return (
    <Sheet
      open={open}
      onOpenChange={
        onOpenChange
      }
    >
      <SheetContent
        className="
          w-full
          sm:max-w-5xl
          p-0
        "
      >
        <Form {...form}>

          <form
            onSubmit={
              form.handleSubmit(
                onSubmit
              )
            }
            className="h-full"
          >

            <FormSheetContent>

              {/* =========================================
                  HEADER
              ========================================= */}

              <FormSheetHeader>
                <div>
                  <SheetTitle>
                    {isEdit
                      ? "Edit Customer"
                      : "Add Customer"}
                  </SheetTitle>

                  <SheetDescription>
                    {isEdit
                      ? "Update customer information."
                      : "Add a new customer."}
                  </SheetDescription>
                </div>
              </FormSheetHeader>

              {/* =========================================
                  BODY
              ========================================= */}

              <FormSheetBody>

                <div className="space-y-6">

                  {/* =======================================
                      CUSTOMER INFORMATION
                  ======================================= */}

                  <CustomerSection title="Customer Information">

                    <CustomerFieldRow label="Type">
                      <FormField
                        control={
                          form.control
                        }
                        name="type"
                        render={({
                          field,
                        }) => (
                          <FormItem className="space-y-0">
                            <FormControl>
                              <Select
                                value={field.value || "none"}
                                onValueChange={field.onChange}
                              >
                                <SelectTrigger
                                  className="w-full"
                                  disabled={loadingCustomerTypes}
                                >
                                  <SelectValue />
                                </SelectTrigger>

                                <SelectContent>
                                  <SelectItem value="none">
                                    None
                                  </SelectItem>

                                  {customerTypes.map((item) => (
                                    <SelectItem
                                      key={item.id}
                                      value={String(item.id)}
                                    >
                                      {item.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </FormControl>

                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </CustomerFieldRow>

                    {
                      isEdit && (
                        <CustomerFieldRow label="Created">
                          <FormTextInput
                            control={
                              form.control
                            }
                            name="created"
                            label=""
                            placeholder="Created"
                            disabled
                          />
                        </CustomerFieldRow>
                      )}

                    <CustomerFieldRow label="Discount">
                      <FormField
                        control={
                          form.control
                        }
                        name="discount"
                        render={({
                          field,
                        }) => (
                          <FormItem className="space-y-0">
                            <FormControl>
                              <Select
                                value={field.value || "default"}
                                onValueChange={field.onChange}
                              >
                                <SelectTrigger
                                  className="w-full"
                                  disabled={loadingDiscounts}
                                >
                                  <SelectValue />
                                </SelectTrigger>

                                <SelectContent>
                                  <SelectItem value="default">
                                    Default/None
                                  </SelectItem>

                                  {discounts.map((item) => (
                                    <SelectItem
                                      key={item.id}
                                      value={String(item.id)}
                                    >
                                      {item.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </FormControl>

                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </CustomerFieldRow>

                    <CustomerFieldRow label="Sales Tax">
                      <FormField
                        control={form.control}
                        name="salesTax"
                        render={({ field }) => (
                          <FormItem className="space-y-0">
                            <FormControl>
                              <Select
                                value={field.value || "default"}
                                onValueChange={field.onChange}
                              >
                                <SelectTrigger
                                  className="w-full"
                                  disabled={loadingTaxCategories}
                                >
                                  <SelectValue />
                                </SelectTrigger>

                                <SelectContent>
                                  <SelectItem value="default">
                                    Default/None
                                  </SelectItem>

                                  {taxCategories.map((item) => (
                                    <SelectItem
                                      key={item.id}
                                      value={String(item.id)}
                                    >
                                      {item.tax_1_name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </FormControl>

                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </CustomerFieldRow>

                  </CustomerSection>


                  {/* =======================================
                      BIOGRAPHICAL
                  ======================================= */}

                  <CustomerSection title="Biographical">

                    <CustomerFieldRow label="First Name">
                      <FormTextInput
                        control={
                          form.control
                        }
                        name="first_name"
                        label=""
                        placeholder="First Name"
                      />
                    </CustomerFieldRow>

                    <CustomerFieldRow label="Last Name">
                      <FormTextInput
                        control={
                          form.control
                        }
                        name="last_name"
                        label=""
                        placeholder="Last Name"
                      />
                    </CustomerFieldRow>

                    <CustomerFieldRow label="Title">
                      <FormTextInput
                        control={
                          form.control
                        }
                        name="title"
                        label=""
                        placeholder="Title"
                      />
                    </CustomerFieldRow>

                    <CustomerFieldRow label="Company">
                      <FormTextInput
                        control={
                          form.control
                        }
                        name="company"
                        label=""
                        placeholder="Company"
                      />
                    </CustomerFieldRow>

                    <CustomerFieldRow label="Birth Date">
                      <FormTextInput
                        control={
                          form.control
                        }
                        name="dob"
                        label=""
                        type="date"
                        placeholder="Birth Date"
                      />
                    </CustomerFieldRow>

                  </CustomerSection>


                  {/* =======================================
                      PHONES
                  ======================================= */}

                  <CustomerSection title="Phones (numeric only)">

                    <CustomerFieldRow label="Home">
                      <FormTextInput
                        control={
                          form.control
                        }
                        name="phone_home"
                        label=""
                        placeholder="Home"
                        type="tel"
                      />
                    </CustomerFieldRow>

                    <CustomerFieldRow label="Work">
                      <FormTextInput
                        control={
                          form.control
                        }
                        name="phone_work"
                        label=""
                        placeholder="Work"
                        type="tel"
                      />
                    </CustomerFieldRow>

                    <CustomerFieldRow label="Mobile">
                      <FormTextInput
                        control={
                          form.control
                        }
                        name="phone_mobile"
                        label=""
                        placeholder="Mobile"
                        type="tel"
                      />
                    </CustomerFieldRow>

                    <CustomerFieldRow label="Pager">
                      <FormTextInput
                        control={
                          form.control
                        }
                        name="phone_pager"
                        label=""
                        placeholder="Pager"
                        type="tel"
                      />
                    </CustomerFieldRow>

                    <CustomerFieldRow label="Fax">
                      <FormTextInput
                        control={
                          form.control
                        }
                        name="phone_fax"
                        label=""
                        placeholder="Fax"
                        type="tel"
                      />
                    </CustomerFieldRow>

                  </CustomerSection>


                  {/* =======================================
                      ADDRESS
                  ======================================= */}

                  <CustomerSection title="Address">

                    <CustomerFieldRow label="Country">
                      <FormField
                        control={
                          form.control
                        }
                        name="country"
                        render={({
                          field,
                        }) => (
                          <FormItem className="space-y-0">
                            <FormControl>
                              <Select
                                value={
                                  field.value ||
                                  ""
                                }
                                onValueChange={
                                  (value) => {
                                    field.onChange(
                                      value
                                    );

                                    const selectedCountry =
                                      countriesList.find(
                                        (
                                          country
                                        ) =>
                                          country.name ===
                                          value
                                      );

                                    if (
                                      selectedCountry
                                    ) {
                                      form.setValue(
                                        "country_code",
                                        selectedCountry.code
                                      );
                                    }

                                    form.setValue(
                                      "state",
                                      ""
                                    );
                                  }
                                }
                              >
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="Country" />
                                </SelectTrigger>

                                <SelectContent>
                                  {countriesList.map(
                                    (
                                      country
                                    ) => (
                                      <SelectItem
                                        key={
                                          country.code
                                        }
                                        value={
                                          country.name
                                        }
                                      >
                                        {
                                          country.name
                                        }
                                      </SelectItem>
                                    )
                                  )}
                                </SelectContent>
                              </Select>
                            </FormControl>

                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </CustomerFieldRow>

                    <CustomerFieldRow label="Address">
                      <FormTextInput
                        control={
                          form.control
                        }
                        name="address_1"
                        label=""
                        placeholder="Address"
                      />
                    </CustomerFieldRow>

                    <CustomerFieldRow label="Address 2">
                      <FormTextInput
                        control={
                          form.control
                        }
                        name="address_2"
                        label=""
                        placeholder="Address 2"
                      />
                    </CustomerFieldRow>

                    <CustomerFieldRow label="City">
                      <FormTextInput
                        control={
                          form.control
                        }
                        name="city"
                        label=""
                        placeholder="City"
                      />
                    </CustomerFieldRow>

                    <CustomerFieldRow label="Province">
                      {selectedCountry === "Canada" ? (
                        <FormField
                          control={form.control}
                          name="state"
                          render={({ field }) => (
                            <FormItem className="space-y-0">
                              <FormControl>
                                <Select
                                  value={field.value || ""}
                                  onValueChange={field.onChange}
                                >
                                  <SelectTrigger
                                    className="w-full"
                                    disabled={provinces.length === 0}
                                  >
                                    <SelectValue placeholder="Select province" />
                                  </SelectTrigger>

                                  <SelectContent>
                                    {provinces.map((province) => (
                                      <SelectItem
                                        key={
                                          province.iso2 ||
                                          province.name
                                        }
                                        value={province.name}
                                      >
                                        {province.name}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </FormControl>

                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      ) : (
                        <FormTextInput
                          control={form.control}
                          name="state"
                          label=""
                          placeholder="Province / State"
                        />
                      )}
                    </CustomerFieldRow>

                    <CustomerFieldRow label="Postal code">
                      <FormTextInput
                        control={
                          form.control
                        }
                        name="zip"
                        label=""
                        placeholder="Postal code"
                      />
                    </CustomerFieldRow>

                  </CustomerSection>


                  {/* =======================================
                      OTHER
                  ======================================= */}

                  <CustomerSection title="Other">

                    <CustomerFieldRow label="Website">
                      <FormTextInput
                        control={
                          form.control
                        }
                        name="website"
                        label=""
                        placeholder="Website"
                      />
                    </CustomerFieldRow>

                    <CustomerFieldRow label="Email 1">
                      <FormTextInput
                        control={
                          form.control
                        }
                        name="email_primary"
                        label=""
                        placeholder="Email 1"
                        type="email"
                      />
                    </CustomerFieldRow>

                    <CustomerFieldRow label="Email 2">
                      <FormTextInput
                        control={
                          form.control
                        }
                        name="email_secondary"
                        label=""
                        placeholder="Email 2"
                        type="email"
                      />
                    </CustomerFieldRow>

                    <CustomerFieldRow label="Custom">
                      <FormTextInput
                        control={
                          form.control
                        }
                        name="custom"
                        label=""
                        placeholder="Custom"
                      />
                    </CustomerFieldRow>

                  </CustomerSection>


                  {/* =======================================
                      CONTACT
                  ======================================= */}

                  <CustomerSection title="Contact">

                    <div className="px-3 py-3 text-sm text-muted-foreground border-b">
                      To select your customer&apos;s
                      preferred contact method, you need
                      their explicit consent.
                    </div>

                    <div className="px-3 py-3 border-b">
                      <FormField
                        control={
                          form.control
                        }
                        name="contact_consent"
                        render={({
                          field,
                        }) => (
                          <FormItem className="flex items-center gap-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={
                                  field.value
                                }
                                onCheckedChange={
                                  field.onChange
                                }
                              />
                            </FormControl>

                            <div className="text-sm font-medium">
                              Yes, I have consent from
                              my customer.
                            </div>
                          </FormItem>
                        )}
                      />
                    </div>

                    <CustomerCheckboxRow
                      label="Email"
                      control={form.control}
                      name="no_email"
                      disabled={!contactConsent}
                    />

                    <CustomerCheckboxRow
                      label="Mail"
                      control={form.control}
                      name="no_mail"
                      disabled={!contactConsent}
                    />

                    <CustomerCheckboxRow
                      label="Call"
                      control={form.control}
                      name="no_phone"
                      disabled={!contactConsent}
                    />

                  </CustomerSection>


                  {/* =======================================
                      TAGS
                  ======================================= */}

                  <CustomerSection title="Tags">

                    <div className="px-3 py-2">
                      <FormField
                        control={form.control}
                        name="tags"
                        render={({ field }) => {
                          const selectedTags =
                            typeof field.value === "string"
                              ? field.value
                                  .split(",")
                                  .map((tag) => tag.trim())
                                  .filter(Boolean)
                              : [];

                          const toggleTag = (
                            tagName: string
                          ) => {
                            const nextTags = selectedTags.includes(
                              tagName
                            )
                              ? selectedTags.filter(
                                  (tag) => tag !== tagName
                                )
                              : [...selectedTags, tagName];

                            field.onChange(
                              nextTags.join(", ")
                            );
                          };

                          return (
                            <FormItem className="space-y-0">
                              <FormControl>
                                <Select
                                  value=""
                                  onValueChange={toggleTag}
                                >
                                  <SelectTrigger className="w-full">
                                    <SelectValue
                                      placeholder={
                                        selectedTags.length > 0
                                          ? selectedTags.join(", ")
                                          : loadingTags
                                          ? "Loading tags..."
                                          : "Select tags"
                                      }
                                    />
                                  </SelectTrigger>

                                  <SelectContent>
                                   {uniqueTags.map((tag) => {
                                      const isSelected =
                                        selectedTags.includes(tag.name);

                                      return (
                                        <SelectItem
                                          key={tag.name}
                                          value={tag.name}
                                        >
                                          {isSelected
                                            ? `✓ ${tag.name}`
                                            : tag.name}
                                        </SelectItem>
                                      );
                                    })}
                                  </SelectContent>
                                </Select>
                              </FormControl>

                              <FormMessage />
                            </FormItem>
                          );
                        }}
                      />
                    </div>

                  </CustomerSection>


                  {/* =======================================
                      SAVED PAYMENT METHODS
                  ======================================= */}

                  <CustomerSection title="Saved Payment Methods">

                    <div className="flex items-center justify-between border-b px-3 py-2">
                      <span className="text-sm">
                        Saved Payment Methods
                      </span>

                      <span
                        className="
                          rounded
                          bg-green-600
                          px-2
                          py-1
                          text-xs
                          font-semibold
                          text-white
                        "
                      >
                        NEW
                      </span>
                    </div>

                    <div className="px-3 py-3 text-sm text-muted-foreground">
                      Save the customer before adding
                      a saved card.
                    </div>

                  </CustomerSection>


                  {/* =======================================
                      NOTES
                  ======================================= */}

                  <CustomerSection title="Notes">

                    <div className="p-3">
                      <Textarea
                        {...form.register(
                          "note"
                        )}
                        placeholder="Don't enter sensitive information like login or credit card details"
                        className="
                          min-h-[120px]
                          resize-none
                        "
                      />
                    </div>

                  </CustomerSection>

                </div>

              </FormSheetBody>


              {/* =========================================
                  FOOTER
              ========================================= */}

              <FormSheetFooter>

                <FormSubmitButton
                  isPending={
                    isSubmitting
                  }
                  className="w-full"
                >
                  {isEdit
                    ? "Update Customer"
                    : "Create Customer"}
                </FormSubmitButton>

              </FormSheetFooter>

            </FormSheetContent>

          </form>

        </Form>
      </SheetContent>
    </Sheet>
  );
}


/*
 * ============================================================
 * CUSTOMER SECTION
 * ============================================================
 */

function CustomerSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section
      className="
        overflow-hidden
        rounded-md
        border
        bg-background
      "
    >
      <div
        className="
          border-b
          bg-muted/50
          px-3
          py-2
        "
      >
        <h3
          className="
            text-sm
            font-semibold
          "
        >
          {title}
        </h3>
      </div>

      <div>
        {children}
      </div>
    </section>
  );
}


/*
 * ============================================================
 * CUSTOMER FIELD ROW
 *
 * Every field uses:
 *
 * Label | Input
 *
 * There is no two-column field layout.
 * ============================================================
 */

function CustomerFieldRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className="
        grid
        grid-cols-[140px_minmax(0,1fr)]
        items-center
        border-b
        last:border-b-0
      "
    >
      <div
        className="
          px-3
          py-3
          text-sm
          text-foreground
        "
      >
        {label}
      </div>

      <div
        className="
          min-w-0
          w-full
          px-3
          py-2
          [&>div>label]:hidden
          [&>div]:w-full
          [&>div]:min-w-0
          [&>div>div]:w-full
          [&>div>div]:min-w-0
          [&_input]:w-full
          [&_button]:w-full
        "
      >
        {children}
      </div>
    </div>
  );
}


/*
 * ============================================================
 * CHECKBOX ROW
 * ============================================================
 */

function CustomerCheckboxRow({
  label,
  control,
  name,
  disabled = false,
}: {
  label: string;
  control: any;
  name:
  | "no_email"
  | "no_mail"
  | "no_phone";
  disabled?: boolean;
}) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem
          className="
            flex
            items-center
            justify-between
            border-b
            px-3
            py-2.5
            space-y-0
          "
        >
          <div
            className={
              disabled
                ? "text-sm text-muted-foreground"
                : "text-sm"
            }
          >
            {label}
          </div>

          <FormControl>
            <Checkbox
              checked={field.value}
              disabled={disabled}
              onCheckedChange={field.onChange}
            />
          </FormControl>
        </FormItem>
      )}
    />
  );
}