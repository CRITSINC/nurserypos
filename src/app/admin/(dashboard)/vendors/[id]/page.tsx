"use client";

import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { useGetVendorByIdQuery } from "@/redux/services/vendor";

import PageTitle from "@/components/admin/shared/PageTitle";

import { Badge } from "@/components/admin/ui/badge";
import { Button } from "@/components/admin/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/admin/ui/card";
import { Skeleton } from "@/components/admin/ui/skeleton";

function DetailRow({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-[160px_1fr] items-center border-b py-3 last:border-0">
      <span className="text-sm font-medium text-muted-foreground">
        {label}
      </span>

      <div className="text-sm font-medium break-words">
        {value || "-"}
      </div>
    </div>
  );
}

function DetailSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Card className="overflow-hidden rounded-none border">
      <CardHeader className="border-b bg-muted/60 px-4 py-3">
        <CardTitle className="text-base font-semibold">
          {title}
        </CardTitle>
      </CardHeader>

      <CardContent className="px-4 py-0">
        {children}
      </CardContent>
    </Card>
  );
}

function BooleanValue({
  value,
}: {
  value: boolean | null | undefined;
}) {
  return (
    <Badge variant={value ? "success" : "secondary"}>
      {value ? "Yes" : "No"}
    </Badge>
  );
}

export default function VendorDetailsPage() {
  const { id } = useParams();

  const {
    data,
    isLoading,
    isError,
  } = useGetVendorByIdQuery(Number(id), {
    skip: !id,
  });

  if (isLoading) {
    return (
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-9 w-48" />
          <Skeleton className="h-10 w-24" />
        </div>

        <div className="grid gap-5 xl:grid-cols-2">
          {Array.from({ length: 8 }).map((_, index) => (
            <Skeleton
              key={index}
              className="h-[180px] rounded-xl"
            />
          ))}
        </div>
      </section>
    );
  }

  if (isError || !data?.data) {
    return notFound();
  }

  const vendor: any = data.data;

  const representative =
    vendor.Reps || vendor.reps || vendor.rep || {};

  const purchasingCurrency =
    vendor.purchasingCurrency ||
    vendor.PurchasingCurrency ||
    {};

  return (
    <section className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <PageTitle className="mb-0">
          Vendor Details
        </PageTitle>

        <Button
          variant="outline"
          asChild
        >
          <Link href="/admin/vendors">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Link>
        </Button>
      </div>

      {/* Main Details */}
      <div className="grid gap-5 xl:grid-cols-2">

        {/* =========================
            SETUP
        ========================== */}
        <DetailSection title="Setup">
          <DetailRow
            label="Vendor Name"
            value={vendor.name}
          />

          <DetailRow
            label="Account Number"
            value={
              vendor.accountNumber ??
              vendor.account_number ??
              "-"
            }
          />

          <DetailRow
            label="Vendor Currency"
            value={
              purchasingCurrency?.code ??
              vendor.currency ??
              vendor.vendorCurrency ??
              "-"
            }
          />
        </DetailSection>

        {/* =========================
            SALES REP
        ========================== */}
        <DetailSection title="Sales Rep">
          <DetailRow
            label="First Name"
            value={
              representative.first_name ??
              representative.firstName ??
              vendor.rep_first_name ??
              vendor.repFirstName ??
              "-"
            }
          />

          <DetailRow
            label="Last Name"
            value={
              representative.last_name ??
              representative.lastName ??
              vendor.rep_last_name ??
              vendor.repLastName ??
              "-"
            }
          />
        </DetailSection>

        {/* =========================
            CATALOG
        ========================== */}
        <DetailSection title="Catalog">
          <DetailRow
            label="Enabled"
            value={
              <BooleanValue
                value={
                  vendor.catalogEnabled ??
                  vendor.catalog_enabled ??
                  vendor.enabled
                }
              />
            }
          />

          <DetailRow
            label="Catalog"
            value={
              vendor.catalog ??
              vendor.catalogName ??
              vendor.catalog_name ??
              "-"
            }
          />

          <DetailRow
            label="Last Updated"
            value={
              vendor.lastUpdated
                ? new Date(
                    vendor.lastUpdated
                  ).toLocaleDateString()
                : vendor.last_updated
                ? new Date(
                    vendor.last_updated
                  ).toLocaleDateString()
                : "-"
            }
          />

          <DetailRow
            label="Pricing Level"
            value={
              vendor.priceLevel ??
              vendor.pricingLevel ??
              vendor.pricing_level ??
              "-"
            }
          />
        </DetailSection>

        {/* =========================
            PHONES
        ========================== */}
        <DetailSection title="Phones (numeric only)">
          <DetailRow
            label="Phone"
            value={
              vendor.phone ??
              vendor.phoneNumber ??
              vendor.phone_number ??
              "-"
            }
          />

          <DetailRow
            label="Mobile"
            value={
              vendor.mobile ??
              vendor.mobileNumber ??
              vendor.mobile_number ??
              "-"
            }
          />

          <DetailRow
            label="Fax"
            value={
              vendor.fax ??
              "-"
            }
          />
        </DetailSection>

        {/* =========================
            UPDATE FROM CATALOG
        ========================== */}
        <DetailSection title="Update From Catalog">
          <DetailRow
            label="Price"
            value={
              <BooleanValue
                value={
                  vendor.updatePrice ??
                  vendor.update_price
                }
              />
            }
          />

          <DetailRow
            label="Cost"
            value={
              <BooleanValue
                value={
                  vendor.updateCost ??
                  vendor.update_cost
                }
              />
            }
          />

          <DetailRow
            label="Description"
            value={
              <BooleanValue
                value={
                  vendor.updateDescription ??
                  vendor.update_description
                }
              />
            }
          />
        </DetailSection>

        {/* =========================
            ADDRESS
        ========================== */}
        <DetailSection title="Address">
          <DetailRow
            label="Country"
            value={
              vendor.country ??
              vendor.address?.country ??
              "-"
            }
          />

          <DetailRow
            label="Address"
            value={
              vendor.address ??
              vendor.address1 ??
              vendor.address_line_1 ??
              "-"
            }
          />

          <DetailRow
            label="Address 2"
            value={
              vendor.address2 ??
              vendor.address_line_2 ??
              "-"
            }
          />

          <DetailRow
            label="City"
            value={
              vendor.city ??
              "-"
            }
          />

          <DetailRow
            label="Province"
            value={
              vendor.province ??
              vendor.state ??
              vendor.region ??
              "-"
            }
          />

          <DetailRow
            label="Postal code"
            value={
              vendor.postalCode ??
              vendor.postal_code ??
              vendor.zipCode ??
              vendor.zip_code ??
              "-"
            }
          />
        </DetailSection>

        {/* =========================
            OTHER
        ========================== */}
        <DetailSection title="Other">
          <DetailRow
            label="Website"
            value={
              vendor.website ??
              "-"
            }
          />

          <DetailRow
            label="Email 1"
            value={
              vendor.email1 ??
              vendor.email_1 ??
              vendor.email ??
              "-"
            }
          />

          <DetailRow
            label="Email 2"
            value={
              vendor.email2 ??
              vendor.email_2 ??
              "-"
            }
          />

          <DetailRow
            label="Custom"
            value={
              vendor.custom ??
              "-"
            }
          />
        </DetailSection>

        {/* =========================
            NOTES
        ========================== */}
        <DetailSection title="Notes">
          <div className="min-h-[145px] py-4">
            <p className="whitespace-pre-wrap text-sm text-muted-foreground">
              {vendor.notes ??
                vendor.note ??
                "No notes available."}
            </p>
          </div>
        </DetailSection>

      </div>
    </section>
  );
}