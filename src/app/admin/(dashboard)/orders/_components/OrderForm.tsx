"use client";

import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
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

import { FormTextInput } from "@/components/admin/shared/form";
import { FormSubmitButton } from "@/components/admin/shared/form/FormSubmitButton";

import {
  FormField,
  FormItem,
  FormLabel,
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

import { Checkbox } from "@/components/admin/ui/checkbox";

import { Order } from "@/types/order.types";
import { useUpdateOrderMutation } from "@/redux/services/order";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isEdit?: boolean;
  orderId?: number;
  initialData?: Order;
};

type OrderAddressFormData = {
  zip: string;
  city: string;
  state: string;
  country: string;
  address1: string;
  lastName: string;
  shipNote: string;
  firstName: string;
  countryCode: string;
};

type OrderFormData = {
  order_uuid: string;
  user_id: string;
  status: string;
  total_amount: string;
  subtotal_amount: string;
  tax_amount: string;
  shipping_amount: string;
  stripe_payment_intent: string;
  lightspeed_sale_id: string;
  lightspeed_ship_to_id: string;
  ticket_number: string;
  shipped_locally: boolean;
  shipped_at: string;
  carrier: string;
  tracking_number: string;
  estimated_delivery: string;
  shipping_address: OrderAddressFormData;
  billing_address: OrderAddressFormData;
};

const emptyAddress: OrderAddressFormData = {
  zip: "",
  city: "",
  state: "",
  country: "",
  address1: "",
  lastName: "",
  shipNote: "",
  firstName: "",
  countryCode: "",
};

const defaultValues: OrderFormData = {
  order_uuid: "",
  user_id: "",
  status: "pending",
  total_amount: "",
  subtotal_amount: "",
  tax_amount: "",
  shipping_amount: "",
  stripe_payment_intent: "",
  lightspeed_sale_id: "",
  lightspeed_ship_to_id: "",
  ticket_number: "",
  shipped_locally: false,
  shipped_at: "",
  carrier: "",
  tracking_number: "",
  estimated_delivery: "",
  shipping_address: emptyAddress,
  billing_address: emptyAddress,
};

const formatDateForInput = (
  value: string | null | undefined
) => {
  if (!value) {
    return "";
  }

  return value.split("T")[0];
};

const formatDateTimeForInput = (
  value: string | null | undefined
) => {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const pad = (number: number) =>
    String(number).padStart(2, "0");

  return `${date.getFullYear()}-${pad(
    date.getMonth() + 1
  )}-${pad(date.getDate())}T${pad(
    date.getHours()
  )}:${pad(date.getMinutes())}`;
};

const mapAddress = (
  address: Order["shipping_address"]
): OrderAddressFormData => ({
  zip: address?.zip ?? "",
  city: address?.city ?? "",
  state: address?.state ?? "",
  country: address?.country ?? "",
  address1: address?.address1 ?? "",
  lastName: address?.lastName ?? "",
  shipNote: address?.shipNote ?? "",
  firstName: address?.firstName ?? "",
  countryCode: address?.countryCode ?? "",
});

export default function OrderForm({
  open,
  onOpenChange,
  isEdit = false,
  orderId,
  initialData,
}: Props) {
  const [updateOrder, { isLoading: updating }] =
    useUpdateOrderMutation();

  const [countries, setCountries] = useState<
    { name: string; iso2?: string }[]
  >([]);

  const [provinces, setProvinces] = useState<
    { name: string; iso2?: string }[]
  >([]);

  const [countriesLoading, setCountriesLoading] =
    useState(false);

  const [provincesLoading, setProvincesLoading] =
    useState(false);

  const form = useForm<OrderFormData>({
    defaultValues,
  });

  const shippingCountry = useWatch({
    control: form.control,
    name: "shipping_address.country",
  });

  const billingCountry = useWatch({
    control: form.control,
    name: "billing_address.country",
  });

  useEffect(() => {
    if (!open || countries.length > 0) {
      return;
    }

    const getCountries = async () => {
      try {
        setCountriesLoading(true);

        const response = await fetch(
          "https://countriesnow.space/api/v0.1/countries/iso"
        );

        const result = await response.json();

        if (!result.error && Array.isArray(result.data)) {
          setCountries(
            result.data
              .filter((country: any) => country?.name)
              .map((country: any) => ({
                name: country.name,
                iso2: country.Iso2 ?? country.iso2,
              }))
          );
        }
      } catch (error) {
        console.error("Failed to fetch countries:", error);
      } finally {
        setCountriesLoading(false);
      }
    };

    getCountries();
  }, [open, countries.length]);

  useEffect(() => {
    if (!open) {
      return;
    }

    const countriesToLoad = new Set<string>();

    if (shippingCountry === "Canada") {
      countriesToLoad.add("Canada");
    }

    if (billingCountry === "Canada") {
      countriesToLoad.add("Canada");
    }

    if (countriesToLoad.size === 0) {
      setProvinces([]);
      return;
    }

    const getProvinces = async () => {
      try {
        setProvincesLoading(true);

        const response = await fetch(
          "https://countriesnow.space/api/v0.1/countries/states/q?country=Canada"
        );

        const result = await response.json();

        if (!result.error && Array.isArray(result.data?.states)) {
          setProvinces(
            result.data.states.map((province: any) => ({
              name: province.name,
              iso2: province.iso2,
            }))
          );
        }
      } catch (error) {
        console.error("Failed to fetch Canadian provinces:", error);
      } finally {
        setProvincesLoading(false);
      }
    };

    getProvinces();
  }, [
    open,
    shippingCountry,
    billingCountry,
  ]);

  useEffect(() => {
    if (!open || !initialData) {
      return;
    }

    form.reset({
      order_uuid: initialData.order_uuid ?? "",
      user_id:
        initialData.user_id != null
          ? String(initialData.user_id)
          : "",
      status: initialData.status ?? "pending",
      total_amount:
        initialData.total_amount ?? "",
      subtotal_amount:
        initialData.subtotal_amount ?? "",
      tax_amount: initialData.tax_amount ?? "",
      shipping_amount:
        initialData.shipping_amount ?? "",
      stripe_payment_intent:
        initialData.stripe_payment_intent ?? "",
      lightspeed_sale_id:
        initialData.lightspeed_sale_id ?? "",
      lightspeed_ship_to_id:
        initialData.lightspeed_ship_to_id ?? "",
      ticket_number:
        initialData.ticket_number ?? "",
      shipped_locally:
        initialData.shipped_locally ?? false,
      shipped_at: formatDateTimeForInput(
        initialData.shipped_at
      ),
      carrier: initialData.carrier ?? "",
      tracking_number:
        initialData.tracking_number ?? "",
      estimated_delivery: formatDateForInput(
        initialData.estimated_delivery
      ),
      shipping_address: mapAddress(
        initialData.shipping_address
      ),
      billing_address: mapAddress(
        initialData.billing_address
      ),
    });
  }, [open, initialData, form]);

  const onSubmit = async (
    values: OrderFormData
  ) => {
    if (!isEdit || !orderId) {
      return;
    }

    try {
      const payload = {
        order_uuid: values.order_uuid || null,
        user_id: values.user_id
          ? Number(values.user_id)
          : null,
        status: values.status,
        total_amount:
          values.total_amount || null,
        subtotal_amount:
          values.subtotal_amount || null,
        tax_amount: values.tax_amount || null,
        shipping_amount:
          values.shipping_amount || null,
        stripe_payment_intent:
          values.stripe_payment_intent || null,
        lightspeed_sale_id:
          values.lightspeed_sale_id || null,
        lightspeed_ship_to_id:
          values.lightspeed_ship_to_id || null,
        ticket_number:
          values.ticket_number || null,
        shipped_locally:
          values.shipped_locally,
        shipped_at: values.shipped_at
          ? new Date(
            values.shipped_at
          ).toISOString()
          : null,
        carrier: values.carrier || null,
        tracking_number:
          values.tracking_number || null,
        estimated_delivery:
          values.estimated_delivery
            ? new Date(
              `${values.estimated_delivery}T00:00:00.000Z`
            ).toISOString()
            : null,
        shipping_address: {
          zip:
            values.shipping_address.zip || null,
          city:
            values.shipping_address.city || null,
          state:
            values.shipping_address.state || null,
          country:
            values.shipping_address.country || null,
          address1:
            values.shipping_address.address1 || null,
          lastName:
            values.shipping_address.lastName || null,
          shipNote:
            values.shipping_address.shipNote || null,
          firstName:
            values.shipping_address.firstName || null,
          countryCode:
            values.shipping_address.countryCode || null,
        },
        billing_address: {
          zip:
            values.billing_address.zip || null,
          city:
            values.billing_address.city || null,
          state:
            values.billing_address.state || null,
          country:
            values.billing_address.country || null,
          address1:
            values.billing_address.address1 || null,
          lastName:
            values.billing_address.lastName || null,
          shipNote:
            values.billing_address.shipNote || null,
          firstName:
            values.billing_address.firstName || null,
          countryCode:
            values.billing_address.countryCode || null,
        },
      };

      await updateOrder({
        id: orderId,
        body: payload,
      }).unwrap();

      toast.success(
        "Order updated successfully."
      );

      form.reset(defaultValues);
      onOpenChange(false);
    } catch (error: any) {
      toast.error(
        error?.data?.message ??
        error?.message ??
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
          w-full
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
              <FormSheetHeader>
                <div>
                  <SheetTitle>
                    Edit Order
                  </SheetTitle>

                  <SheetDescription>
                    Update the order information.
                  </SheetDescription>
                </div>
              </FormSheetHeader>

              <FormSheetBody>
                <div className="space-y-6">
                  <OrderSection title="Order Information">
                    <OrderFieldRow label="Order UUID">
                      <FormTextInput
                        control={form.control}
                        name="order_uuid"
                        label=""
                        disabled
                        placeholder="Order UUID"
                      />
                    </OrderFieldRow>

                    {/* <OrderFieldRow label="User ID">
                      <FormTextInput
                        control={form.control}
                        name="user_id"
                        label=""
                        type="number"
                        placeholder="User ID"
                      />
                    </OrderFieldRow> */}

                    <OrderFieldRow label="Status">
                      <FormField
                        control={form.control}
                        name="status"
                        render={({ field }) => (
                          <FormItem className="space-y-0">
                            <FormControl>
                              <Select
                                value={field.value}
                                onValueChange={field.onChange}
                              >
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="Status" />
                                </SelectTrigger>

                                <SelectContent>
                                  <SelectItem value="shipped">
                                    Shipped
                                  </SelectItem>
                                  <SelectItem value="completed">
                                    Completed
                                  </SelectItem>
                                  <SelectItem value="cancelled">
                                    Cancelled
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </OrderFieldRow>

                    {/* <OrderFieldRow label="Ticket Number">
                      <FormTextInput
                        control={form.control}
                        name="ticket_number"
                        label=""
                        placeholder="Ticket Number"
                      />
                    </OrderFieldRow> */}

                    <OrderFieldRow label="Lightspeed Sale ID">
                      <FormTextInput
                        control={form.control}
                        name="lightspeed_sale_id"
                        label=""
                        placeholder="Lightspeed Sale ID"
                        disabled
                      />
                    </OrderFieldRow>

                    {/* <OrderFieldRow label="Lightspeed Ship To ID">
                      <FormTextInput
                        control={form.control}
                        name="lightspeed_ship_to_id"
                        label=""
                        placeholder="Lightspeed Ship To ID"
                      />
                    </OrderFieldRow> */}

                    <OrderFieldRow label="Stripe Payment Intent">
                      <FormTextInput
                        control={form.control}
                        name="stripe_payment_intent"
                        label=""
                        placeholder="Stripe Payment Intent"
                        disabled
                      />
                    </OrderFieldRow>
                  </OrderSection>

                  {/* <OrderSection title="Shipping">
                    <OrderFieldRow label="Carrier">
                      <FormTextInput
                        control={form.control}
                        name="carrier"
                        label=""
                        placeholder="Carrier"
                      />
                    </OrderFieldRow>

                    <OrderFieldRow label="Tracking Number">
                      <FormTextInput
                        control={form.control}
                        name="tracking_number"
                        label=""
                        placeholder="Tracking Number"
                      />
                    </OrderFieldRow>

                    <OrderFieldRow label="Estimated Delivery">
                      <FormTextInput
                        control={form.control}
                        name="estimated_delivery"
                        label=""
                        type="date"
                        placeholder="Estimated Delivery"
                      />
                    </OrderFieldRow>

                    <OrderFieldRow label="Shipped At">
                      <FormTextInput
                        control={form.control}
                        name="shipped_at"
                        label=""
                        type="datetime-local"
                        placeholder="Shipped At"
                      />
                    </OrderFieldRow>

                    {/* <OrderFieldRow label="Shipped Locally">
                      <FormField
                        control={form.control}
                        name="shipped_locally"
                        render={({ field }) => (
                          <FormItem className="flex items-center space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>

                            <FormLabel className="ml-3 font-normal">
                              Shipped locally
                            </FormLabel>

                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </OrderFieldRow>
                  </OrderSection> */}

                  <OrderSection title="Amounts">
                    <OrderFieldRow label="Subtotal">
                      <FormTextInput
                        control={form.control}
                        name="subtotal_amount"
                        label=""
                        type="number"
                        placeholder="Subtotal"
                        disabled
                      />
                    </OrderFieldRow>

                    <OrderFieldRow label="Tax">
                      <FormTextInput
                        control={form.control}
                        name="tax_amount"
                        label=""
                        type="number"
                        placeholder="Tax"
                        disabled
                      />
                    </OrderFieldRow>

                    <OrderFieldRow label="Shipping Amount">
                      <FormTextInput
                        control={form.control}
                        name="shipping_amount"
                        label=""
                        type="number"
                        placeholder="Shipping Amount"
                        disabled
                      />
                    </OrderFieldRow>

                    <OrderFieldRow label="Total">
                      <FormTextInput
                        control={form.control}
                        name="total_amount"
                        label=""
                        type="number"
                        placeholder="Total"
                        disabled
                      />
                    </OrderFieldRow>
                  </OrderSection>

                  <OrderSection title="Shipping Address">
                    <AddressFields
                      control={form.control}
                      setValue={form.setValue}
                      prefix="shipping_address"
                      countries={countries}
                      provinces={provinces}
                      countriesLoading={countriesLoading}
                      provincesLoading={provincesLoading}
                    />
                  </OrderSection>

                  <OrderSection title="Billing Address">
                    <AddressFields
                      control={form.control}
                      setValue={form.setValue}
                      prefix="billing_address"
                      countries={countries}
                      provinces={provinces}
                      countriesLoading={countriesLoading}
                      provincesLoading={provincesLoading}
                    />
                  </OrderSection>
                </div>
              </FormSheetBody>

              <FormSheetFooter>
                <FormSubmitButton
                  isPending={updating}
                  className="w-full"
                >
                  Update Order
                </FormSubmitButton>
              </FormSheetFooter>
            </FormSheetContent>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}

function AddressFields({
  control,
  setValue,
  prefix,
  countries,
  provinces,
  countriesLoading,
  provincesLoading,
}: {
  control: any;
  setValue: any;
  prefix:
    | "shipping_address"
    | "billing_address";
  countries: { name: string; iso2?: string }[];
  provinces: { name: string; iso2?: string }[];
  countriesLoading: boolean;
  provincesLoading: boolean;
}) {
  const countryFieldName = `${prefix}.country` as const;
  const countryCodeFieldName = `${prefix}.countryCode` as const;
  const stateFieldName = `${prefix}.state` as const;

  const selectedCountry = useWatch({
    control,
    name: countryFieldName,
  });

  useEffect(() => {
    if (!selectedCountry) {
      return;
    }

    const selectedCountryData = countries.find(
      (country) => country.name === selectedCountry
    );

    setValue(
      countryCodeFieldName,
      selectedCountryData?.iso2?.toUpperCase() ?? ""
    );
  }, [
    selectedCountry,
    countries,
    setValue,
    countryCodeFieldName,
  ]);

  return (
    <>
      <OrderFieldRow label="First Name">
        <FormTextInput
          control={control}
          name={`${prefix}.firstName`}
          label=""
          placeholder="First Name"
        />
      </OrderFieldRow>

      <OrderFieldRow label="Last Name">
        <FormTextInput
          control={control}
          name={`${prefix}.lastName`}
          label=""
          placeholder="Last Name"
        />
      </OrderFieldRow>

      <OrderFieldRow label="Address">
        <FormTextInput
          control={control}
          name={`${prefix}.address1`}
          label=""
          placeholder="Address"
        />
      </OrderFieldRow>

      <OrderFieldRow label="Country">
        <FormField
          control={control}
          name={countryFieldName}
          render={({ field }) => (
            <FormItem className="space-y-0">
              <FormControl>
                <Select
                  value={field.value ?? ""}
                  onValueChange={field.onChange}
                  disabled={countriesLoading}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue
                      placeholder={
                        countriesLoading
                          ? "Loading countries..."
                          : "Select Country"
                      }
                    />
                  </SelectTrigger>

                  <SelectContent>
                    {countries.map((country) => (
                      <SelectItem
                        key={country.iso2 || country.name}
                        value={country.name}
                      >
                        {country.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
      </OrderFieldRow>

      <OrderFieldRow label="Country Code">
        <FormField
          control={control}
          name={countryCodeFieldName}
          render={({ field }) => (
            <FormItem className="space-y-0">
              <FormControl>
                <input
                  {...field}
                  value={field.value ?? ""}
                  readOnly
                  className="h-12 w-full rounded-md border bg-muted px-3 text-sm"
                  placeholder="Country Code"
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
      </OrderFieldRow>

      <OrderFieldRow label="City">
        <FormTextInput
          control={control}
          name={`${prefix}.city`}
          label=""
          placeholder="City"
        />
      </OrderFieldRow>

      <FormField
        control={control}
        name={stateFieldName}
        render={({ field }) => {
          const country = control._formValues?.[
            prefix
          ]?.country;

          return (
            <OrderFieldRow label="Province / State">
              <FormItem className="space-y-0">
                <FormControl>
                  {country === "Canada" ? (
                    <Select
                      value={field.value ?? ""}
                      onValueChange={field.onChange}
                      disabled={provincesLoading}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue
                          placeholder={
                            provincesLoading
                              ? "Loading provinces..."
                              : "Select Province"
                          }
                        />
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
                  ) : (
                    <FormTextInput
                      control={control}
                      name={stateFieldName}
                      label=""
                      placeholder="Province / State"
                    />
                  )}
                </FormControl>

                <FormMessage />
              </FormItem>
            </OrderFieldRow>
          );
        }}
      />

      <OrderFieldRow label="Postal Code">
        <FormTextInput
          control={control}
          name={`${prefix}.zip`}
          label=""
          placeholder="Postal Code"
        />
      </OrderFieldRow>

      {prefix !== "billing_address" &&
        <OrderFieldRow label="Shipping Note">
          <FormTextInput
            control={control}
            name={`${prefix}.shipNote`}
            label=""
            placeholder="Shipping Note"
          />
        </OrderFieldRow>
      }
    </>
  );
}


function StateField({
  control,
  prefix,
  provinces,
  provincesLoading,
}: {
  control: any;
  prefix:
    | "shipping_address"
    | "billing_address";
  provinces: { name: string; iso2?: string }[];
  provincesLoading: boolean;
}) {
  const country = useWatch({
    control,
    name: `${prefix}.country`,
  });

  if (country === "Canada") {
    return (
      <FormField
        control={control}
        name={`${prefix}.state`}
        render={({ field }) => (
          <FormItem className="space-y-0">
            <FormControl>
              <Select
                value={field.value ?? ""}
                onValueChange={field.onChange}
                disabled={provincesLoading}
              >
                <SelectTrigger className="w-full">
                  <SelectValue
                    placeholder={
                      provincesLoading
                        ? "Loading provinces..."
                        : "Select Province"
                    }
                  />
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
    );
  }

  return (
    <FormTextInput
      control={control}
      name={`${prefix}.state`}
      label=""
      placeholder="Province / State"
    />
  );
}

function OrderSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-md border bg-background">
      <div className="border-b bg-muted/50 px-3 py-2">
        <h3 className="text-sm font-semibold">
          {title}
        </h3>
      </div>

      <div>{children}</div>
    </section>
  );
}

function OrderFieldRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-[140px_minmax(0,1fr)] items-center border-b last:border-b-0">
      <div className="px-3 py-3 text-sm">
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
