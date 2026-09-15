"use client";

import { useEffect, useState } from "react";
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
  FormSwitch,
} from "@/components/admin/shared/form";

import { FormSubmitButton } from "@/components/admin/shared/form/FormSubmitButton";

import { Textarea } from "@/components/admin/ui/textarea";

import {
  vendorFormSchema,
  VendorFormInput,
  VendorFormData,
} from "./schema";

import {
  useCreateVendorMutation,
  useUpdateVendorMutation,
} from "@/redux/services/vendor";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/admin/ui/select";

import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/admin/ui/form";

import { countriesList } from "@/constants/countries";
import {
  useGetCurrencyRatesQuery,
} from "@/redux/services/currencyRate";
import { getCurrencySymbol } from "@/lib/currency";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;

  isEdit?: boolean;

  vendorId?: number;

  initialData?: Partial<VendorFormData>;
};

export default function VendorForm({
  open,
  onOpenChange,
  isEdit = false,
  vendorId,
  initialData,
}: Props) {
  const [createVendor, { isLoading: creating }] =
    useCreateVendorMutation();

  const [updateVendor, { isLoading: updating }] =
    useUpdateVendorMutation();

  const {
    data: currencyRatesResponse,
    isLoading: currencyRatesLoading,
  } = useGetCurrencyRatesQuery({
    pagination: false,
  });
  const currencyRates = currencyRatesResponse?.data ?? [];

  const isSubmitting = creating || updating;

  const defaultValues: VendorFormData = {
    name: "",
    accountNumber: "",
    currencyCode: "",

    enabled: true,
    catalog: "",
    priceLevel: "",

    updatePrice: false,
    updateCost: false,
    updateDescription: false,

    repFirstName: "",
    repLastName: "",

    phone: "",
    mobile: "",
    fax: "",

    country: "",
    address1: "",
    address2: "",
    city: "",
    province: "",
    postalCode: "",

    website: "",
    email1: "",
    email2: "",
    custom: "",

    notes: "",

    ...initialData,
  };

  const [provinces, setProvinces] = useState<any[]>([]);

  const form = useForm<
    VendorFormInput,
    undefined,
    VendorFormData
  >({
    resolver: zodResolver(vendorFormSchema),
    defaultValues,
  });

  useEffect(() => {
    if (!open) {
      return;
    }

    form.reset({
      ...defaultValues,
      ...initialData,
    });
  }, [open, initialData]);

  const selectedCountry = form.watch("country");
  useEffect(() => {
    if (selectedCountry !== "Canada") {
      form.setValue("province", "");
    }
  }, [selectedCountry, form]);

  useEffect(() => {
    getProvinces();
  }, []);

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

  const onSubmit = async (values: VendorFormData) => {
    try {
      const selectedCountry = countriesList.find(
        (country) => country.name === values.country
      );
      const selectedProvince = provinces.find(
        (province) => province.name === values.province
      );

      const stateCode = selectedProvince?.state_code || "";

      const selectedCurrency = currencyRates.find(
        (currency) => currency.currencyCode === values.currencyCode
      );

      const currencySymbol = await getCurrencySymbol(
        values.currencyCode || ""
      );

      const payload = {
        name: values.name,

        accountNumber: values.accountNumber,

        priceLevel: values.priceLevel,

        updatePrice: values.updatePrice,

        updateCost: values.updateCost,

        updateDescription: values.updateDescription,

        shareSellThrough: false,
        b2bSellerUID: "",

        Reps: {
          VendorRep: {
            firstName: values.repFirstName,
            lastName: values.repLastName,
          },
        },

        purchasingCurrency: {
          code: values.currencyCode,

          symbol: currencySymbol,

          rate: selectedCurrency?.rate || "1.0000",
        },

        Contact: {
          Addresses: {
            ContactAddress: {

              address1: values.address1,

              address2: values.address2,

              city: values.city,

              state: values.province,

              stateCode: stateCode,

              zip: values.postalCode,

              country: values.country,
              countryCode: selectedCountry?.code || "",
            }
          },

          Phones: {
            ContactPhone: [
              ...(values.phone
                ? [{
                  number: values.phone,
                  useType: "Work",
                }]
                : []),

              ...(values.mobile
                ? [{
                  number: values.mobile,
                  useType: "Mobile",
                }]
                : []),

              ...(values.fax
                ? [{
                  number: values.fax,
                  useType: "Fax",
                }]
                : []),
            ],
          },
          Emails: {
            ContactEmail: [
              ...(values.email1
                ? [{
                  address: values.email1,
                  useType: "Primary",
                }]
                : []),

              ...(values.email2
                ? [{
                  address: values.email2,
                  useType: "Secondary",
                }]
                : []),
            ],
          },

          Websites: values.website,
          custom: values.custom,
          notes: values.notes
        }
      };

      if (isEdit && vendorId) {
        await updateVendor({
          id: vendorId,
          body: payload,
        }).unwrap();

        toast.success(
          "Vendor updated successfully."
        );
      } else {
        await createVendor(payload).unwrap();

        toast.success(
          "Vendor created successfully."
        );
      }

      form.reset();

      onOpenChange(false);
    } catch (error: any) {
      toast.error(
        error?.data?.message ??
        "Something went wrong."
      );
    }
  };

  return (
    <Sheet
      open={open}
      onOpenChange={onOpenChange}
    >
      <SheetContent
        className="
          sm:max-w-5xl
          p-0
        "
      >
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="h-full"
          >
            <FormSheetContent>

              {/* HEADER */}

              <FormSheetHeader>
                <div>
                  <SheetTitle>
                    {isEdit
                      ? "Edit Vendor"
                      : "Add Vendor"}
                  </SheetTitle>

                  <SheetDescription>
                    {isEdit
                      ? "Update vendor information."
                      : "Add a new vendor."}
                  </SheetDescription>
                </div>
              </FormSheetHeader>

              {/* BODY */}

              <FormSheetBody>
                <div className="space-y-6">
                  <VendorSection title="Setup">

                    <FormTextInput
                      control={form.control}
                      name="name"
                      label="Vendor Name"
                      placeholder="Vendor Name"
                    />

                    <FormTextInput
                      control={form.control}
                      name="accountNumber"
                      label="Account Number"
                      placeholder="Account Number"
                    />

                    <FormField
                      control={form.control}
                      name="currencyCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Vendor Currency
                          </FormLabel>

                          <Select
                            value={field.value}
                            onValueChange={
                              field.onChange
                            }
                          >
                            <FormControl>
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select currency" />
                              </SelectTrigger>
                            </FormControl>

                            <SelectContent>
                             <SelectItem
                                  key={0}
                                  value={"CAD"}
                                >
                                  CAD
                                </SelectItem>
                              {currencyRates.map((currency) => (
                                <SelectItem
                                  key={currency.currencyRateID}
                                  value={currency.currencyCode}
                                >
                                  {currency.currencyCode}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>

                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="priceLevel"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Pricing Level
                          </FormLabel>

                          <Select
                            value={field.value}
                            onValueChange={
                              field.onChange
                            }
                          >
                            <FormControl>
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select pricing level" />
                              </SelectTrigger>
                            </FormControl>

                            <SelectContent>
                              <SelectItem value="Default">
                                Default
                              </SelectItem>

                              <SelectItem value="Level 1">
                                Level 1
                              </SelectItem>

                              <SelectItem value="Level 2">
                                Level 2
                              </SelectItem>

                              <SelectItem value="Level 3">
                                Level 3
                              </SelectItem>
                            </SelectContent>
                          </Select>

                          <FormMessage />
                        </FormItem>
                      )}
                    />

                  </VendorSection>

                  <VendorSection title="Sales Rep">

                    <FormTextInput
                      control={form.control}
                      name="repFirstName"
                      label="First Name"
                      placeholder="First Name"
                    />

                    <FormTextInput
                      control={form.control}
                      name="repLastName"
                      label="Last Name"
                      placeholder="Last Name"
                    />

                  </VendorSection>

                  <VendorSection title="Phones (numeric only)">

                    <FormTextInput
                      control={form.control}
                      name="phone"
                      label="Phone"
                      placeholder="Phone"
                      type="tel"
                    />

                    <FormTextInput
                      control={form.control}
                      name="mobile"
                      label="Mobile"
                      placeholder="Mobile"
                      type="tel"
                    />

                    <FormTextInput
                      control={form.control}
                      name="fax"
                      label="Fax"
                      placeholder="Fax"
                      type="tel"
                    />

                  </VendorSection>

                  <VendorSection title="Address">

                    <FormField
                      control={form.control}
                      name="country"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Country
                          </FormLabel>

                          <Select
                            value={field.value}
                            onValueChange={
                              field.onChange
                            }
                          >
                            <FormControl>
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select country" />
                              </SelectTrigger>
                            </FormControl>

                            <SelectContent>
                              {countriesList.map(
                                (country) => (
                                  <SelectItem
                                    key={country.code}
                                    value={country.name}
                                  >
                                    {country.name}
                                  </SelectItem>
                                )
                              )}
                            </SelectContent>
                          </Select>

                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormTextInput
                      control={form.control}
                      name="address1"
                      label="Address"
                      placeholder="Address"
                    />

                    <FormTextInput
                      control={form.control}
                      name="address2"
                      label="Address 2"
                      placeholder="Address 2"
                    />

                    <FormTextInput
                      control={form.control}
                      name="city"
                      label="City"
                      placeholder="City"
                    />

                    {selectedCountry === "Canada" ? (
                      <FormField
                        control={form.control}
                        name="province"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Province</FormLabel>

                            <Select
                              value={field.value}
                              onValueChange={field.onChange}
                            >
                              <FormControl>
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="Select province" />
                                </SelectTrigger>
                              </FormControl>

                              <SelectContent>
                                {provinces.map((province) => (
                                  <SelectItem
                                    key={province.iso2 || province.name}
                                    value={province.name}
                                  >
                                    {province.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>

                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    ) : (
                      <FormTextInput
                        control={form.control}
                        name="province"
                        label="Province"
                        placeholder="Enter province/state"
                      />
                    )}

                    <FormTextInput
                      control={form.control}
                      name="postalCode"
                      label="Postal code"
                      placeholder="Postal code"
                    />

                  </VendorSection>

                  {/* <VendorSection title="Catalog"> */}

                  {/* <FormSwitch
                      control={form.control}
                      name="enabled"
                      label="Enabled"
                    />

                    <FormTextInput
                      control={form.control}
                      name="catalog"
                      label="Catalog"
                      placeholder="Catalog"
                    /> */}



                  {/* </VendorSection> */}

                  <VendorSection title="Update From Catalog">

                    <FormSwitch
                      control={form.control}
                      name="updatePrice"
                      label="Price"
                    />

                    <FormSwitch
                      control={form.control}
                      name="updateCost"
                      label="Cost"
                    />

                    <FormSwitch
                      control={form.control}
                      name="updateDescription"
                      label="Description"
                    />

                  </VendorSection>

                  <VendorSection title="Other">

                    <FormTextInput
                      control={form.control}
                      name="website"
                      label="Website"
                      placeholder="Website"
                    />

                    <FormTextInput
                      control={form.control}
                      name="email1"
                      label="Email 1"
                      placeholder="Email 1"
                      type="email"
                    />

                    <FormTextInput
                      control={form.control}
                      name="email2"
                      label="Email 2"
                      placeholder="Email 2"
                      type="email"
                    />

                    <FormTextInput
                      control={form.control}
                      name="custom"
                      label="Custom"
                      placeholder="Custom"
                    />

                  </VendorSection>

                  <VendorSection title="Notes">

                    <Textarea
                      {...form.register("notes")}
                      placeholder="Don't enter sensitive information like login or credit card details"
                      className="
                        min-h-[100px]
                        resize-none
                      "
                    />

                  </VendorSection>

                </div>
              </FormSheetBody>

              <FormSheetFooter>
                <FormSubmitButton
                  isPending={isSubmitting}
                  className="w-full"
                >
                  {isEdit
                    ? "Update Vendor"
                    : "Create Vendor"}
                </FormSubmitButton>
              </FormSheetFooter>

            </FormSheetContent>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}

function VendorSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-md border">
      <div className="border-b bg-muted px-3 py-2">
        <h3 className="text-sm font-semibold">
          {title}
        </h3>
      </div>

      <div className="space-y-2 p-2">
        {children}
      </div>
    </section>
  );
}