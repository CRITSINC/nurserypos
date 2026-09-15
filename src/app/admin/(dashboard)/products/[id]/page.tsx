"use client";

import { useState } from "react";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { ArrowLeft, Check, ImageOff } from "lucide-react";

import { useGetProductByIdQuery } from "@/redux/services/product";

import PageTitle from "@/components/admin/shared/PageTitle";

import { Button } from "@/components/admin/ui/button";
import { Badge } from "@/components/admin/ui/badge";
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
    <div className="grid grid-cols-[150px_1fr] items-center border-b py-2.5 last:border-0">
      <span className="text-sm font-medium text-muted-foreground">
        {label}
      </span>

      <div className="text-sm font-medium break-words">
        {value !== null &&
        value !== undefined &&
        value !== ""
          ? value
          : "-"}
      </div>
    </div>
  );
}

function StockRow({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex min-w-0 items-center justify-between gap-3 border-b py-2.5 last:border-0">
      <span className="shrink-0 text-sm font-medium text-muted-foreground">
        {label}
      </span>

      <div className="min-w-0 whitespace-nowrap text-right text-sm font-medium">
        {value !== null &&
        value !== undefined &&
        value !== ""
          ? value
          : "-"}
      </div>
    </div>
  );
}

function Section({
  title,
  children,
  className = "",
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Card className={`overflow-hidden ${className}`}>
      <CardHeader className="border-b bg-muted/60 px-4 py-2.5">
        <CardTitle className="text-sm font-semibold">
          {title}
        </CardTitle>
      </CardHeader>

      <CardContent className="px-4 py-0">
        {children}
      </CardContent>
    </Card>
  );
}

function YesNoBadge({
  value,
}: {
  value: boolean | string | null | undefined;
}) {
  if (
    value === null ||
    value === undefined
  ) {
    return <span>-</span>;
  }

  const enabled =
    value === true ||
    value === "true";

  return (
    <Badge
      variant={
        enabled
          ? "success"
          : "secondary"
      }
    >
      {enabled ? "Yes" : "No"}
    </Badge>
  );
}

function formatCurrency(
  value: any
) {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return "-";
  }

  const number = Number(value);

  if (Number.isNaN(number)) {
    return value;
  }

  return `$${number.toFixed(2)}`;
}

function formatNumber(
  value: any
) {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return "-";
  }

  const number = Number(value);

  if (Number.isNaN(number)) {
    return value;
  }

  return number.toLocaleString();
}

function formatDate(
  value: any
) {
  if (!value) {
    return "-";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString();
}

export default function ProductDetailsPage() {
  const { id } = useParams();

  const {
    data,
    isLoading,
    isError,
  } = useGetProductByIdQuery(
    Number(id),
    {
      skip: !id,
    }
  );

  const [
    selectedImage,
    setSelectedImage,
  ] = useState(0);

  if (isLoading) {
    return (
      <section className="space-y-5">
        <div className="flex items-center justify-between">
          <Skeleton className="h-9 w-56" />
          <Skeleton className="h-10 w-24" />
        </div>

        <div className="grid gap-4 xl:grid-cols-12">
          <Skeleton className="h-[360px] xl:col-span-6" />
          <Skeleton className="h-[360px] xl:col-span-4" />
          <Skeleton className="h-[360px] xl:col-span-2" />
        </div>

        <div className="grid gap-4 xl:grid-cols-3">
          <Skeleton className="h-[220px]" />
          <Skeleton className="h-[220px]" />
          <Skeleton className="h-[220px]" />
        </div>
      </section>
    );
  }

  if (
    isError ||
    !data?.data
  ) {
    return notFound();
  }

  const product: any =
    data.data;

  const images =
    product.images ?? [];

  const image =
    images[selectedImage] ??
    images[0];

  const inventory =
    product.inventories?.[0] ?? {};

  const price = Number(product.price ?? 0);
  const msrp = Number(product.msrp ?? 0);
  const onlinePrice = Number(product.online_price ?? 0);
  const cost = Number(
    inventory.unit_cost ?? product.default_cost ?? 0
  );

  const calculateMarkup = (sellingPrice: number) => {
    if (!cost) return "-";
    return `${(((sellingPrice - cost) / cost) * 100).toFixed(1)}%`;
  };

  const calculateMargin = (sellingPrice: number) => {
    if (!sellingPrice) return "-";
    return `${(((sellingPrice - cost) / sellingPrice) * 100).toFixed(1)}%`;
  };

  return (
    <section className="space-y-4">

      {/* Page Header */}
      <div className="flex items-center justify-between">
        <PageTitle className="mb-0">
          Product Details
        </PageTitle>

        <Button
          variant="outline"
          asChild
        >
          <Link href="/admin/products">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Link>
        </Button>
      </div>

      <div className="rounded-md border bg-background px-4 py-2.5">
        <div className="flex items-center gap-3">
          <h1 className="min-w-0 flex-1 truncate text-lg font-semibold">
            {product.description}
          </h1>

          <span className="text-xs text-muted-foreground">
            Type:
          </span>

          <span className="text-xs font-medium">
            {product.item_type == "default" ? "Single" : product.item_type || "-"}
          </span>

          <span className="text-xs text-muted-foreground">
            Serialized
          </span>

          <YesNoBadge value={product.serialized} />
        </div>
      </div>

      <div className="grid items-stretch gap-4 xl:grid-cols-[minmax(0,5fr)_minmax(0,5fr)_minmax(220px,2fr)]">

        <Card className="h-full min-w-0">
          <CardHeader className="border-b bg-muted/60 px-2 py-1.5">
            <CardTitle className="text-xs font-semibold">
              Images
            </CardTitle>
          </CardHeader>

          <CardContent className="p-2">

            <div className="flex h-[270px] items-center justify-center rounded-md border bg-muted/20">
              {image ? (
                <img
                  src={
                    image.local_path ||
                    image.lightspeed_url
                  }
                  alt={product.description || ""}
                  className="max-h-[255px] max-w-full object-contain"
                />
              ) : (
                <div className="text-center text-xs text-muted-foreground">
                  <ImageOff className="mx-auto mb-2 h-8 w-8" />
                  No Image
                </div>
              )}
            </div>

            <div className="mt-2 flex items-center justify-center gap-5 text-xs">
              <span className="text-muted-foreground">
                {images.length}{" "}
                {images.length === 1 ? "Image" : "Images"}
              </span>
            </div>

            {images.length > 1 && (
              <div className="mt-2 flex justify-center gap-1.5">
                {images.map((img: any, index: number) => (
                  <button
                    key={img.id ?? index}
                    type="button"
                    onClick={() => setSelectedImage(index)}
                    className={`h-9 w-9 overflow-hidden rounded border ${
                      selectedImage === index
                        ? "ring-2 ring-primary"
                        : ""
                    }`}
                  >
                    <img
                      src={img.local_path || img.lightspeed_url}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="h-full min-w-0">
          <CardHeader className="border-b bg-muted/60 px-4 py-2.5">
            <CardTitle className="text-xs font-semibold">
              Pricing
            </CardTitle>
          </CardHeader>

          <CardContent className="px-4 py-0">

            <div className="grid grid-cols-[1.2fr_1fr_1fr_1fr] border-b py-2 text-[10px] uppercase text-muted-foreground">
              <span>Name</span>
              <span>Price</span>
              <span>Markup</span>
              <span>Margin</span>
            </div>

            <div className="grid grid-cols-[1.2fr_1fr_1fr_1fr] border-b py-2.5 text-xs">
              <span className="font-medium">Default</span>
              <span>{formatCurrency(price)}</span>
              <span>{calculateMarkup(price)}</span>
              <span>{calculateMargin(price)}</span>
            </div>

            <div className="grid grid-cols-[1.2fr_1fr_1fr_1fr] border-b py-2.5 text-xs">
              <span className="font-medium">MSRP</span>
              <span>{formatCurrency(msrp)}</span>
              <span>{calculateMarkup(msrp)}</span>
              <span>{calculateMargin(msrp)}</span>
            </div>

            <div className="grid grid-cols-[1.2fr_1fr_1fr_1fr] border-b py-2.5 text-xs">
              <span className="font-medium">Online</span>
              <span>{formatCurrency(onlinePrice)}</span>
              <span>{calculateMarkup(onlinePrice)}</span>
              <span>{calculateMargin(onlinePrice)}</span>
            </div>

            <DetailRow
              label="Discounts Allowed"
              value={<YesNoBadge value={product.discountable} />}
            />

            <DetailRow
              label="Taxable"
              value={<YesNoBadge value={product.taxable} />}
            />

            <div className="grid grid-cols-[150px_1fr] items-center border-b py-2.5">
              <span className="text-sm font-medium">
                Tax Class
              </span>

              <span className="text-sm">
                {product.tax_class_name || "-"}
              </span>
            </div>
          </CardContent>
        </Card>

        <Section
          title="Stock"
          className="h-full min-w-0"
        >
          <StockRow
            label="Available"
            value={formatNumber(inventory.qoh)}
          />

          <StockRow
            label="Reserved"
            value={formatNumber(inventory.reserved)}
          />

          <StockRow
            label="Avg. Cost"
            value={formatCurrency(
              inventory.unit_cost ?? product.avg_cost
            )}
          />

          <StockRow
            label="Total Value"
            value={formatCurrency(inventory.total_value)}
          />

          <StockRow
            label="Total Sale Value"
            value={formatCurrency(inventory.total_sale_value)}
          />

          <StockRow
            label="Margin"
            value={calculateMargin(price)}
          />
        </Section>
      </div>

      <div className="grid gap-3 xl:grid-cols-12">
        <Section
          title="IDs"
          className="xl:col-span-4"
        >
          <DetailRow
            label="System ID"
            value={product.systemID ?? product.id}
          />

          <DetailRow
            label="UPC"
            value={product.upc}
          />

          <DetailRow
            label="EAN"
            value={product.ean}
          />

          <DetailRow
            label="Custom SKU"
            value={product.customSKU ?? product.custom_sku}
          />

          <DetailRow
            label="Manufact. SKU"
            value={
              product.manufacturerSKU ??
              product.manufacturer_sku
            }
          />
        </Section>

                <Section
          title="Organize"
          className="xl:col-span-4"
        >
          <DetailRow
            label="Category"
            value={product.category?.full_path_name}
          />

          <DetailRow
            label="Brand"
            value={product.brand?.name}
          />

          <DetailRow
            label="Tags"
            value={
              product.tags?.length
                ? product.tags
                    .map((tag: any) => tag.name)
                    .filter(Boolean)
                    .join(", ")
                : "-"
            }
          />
        </Section>

        <Section
          title="Reservations"
          className="xl:col-span-4"
        >
          <DetailRow
            label="Layaway"
            value={formatNumber(inventory.layaway)}
          />

          <DetailRow
            label="Special Order"
            value={formatNumber(inventory.special_order)}
          />
        </Section>

        {/* <Section
          title="Sales History"
          className="xl:col-span-4"
        >
          <DetailRow label="Day" value="0" />
          <DetailRow label="Week" value="0" />
          <DetailRow label="Month" value="0" />
          <DetailRow label="Year" value="0" />
          <DetailRow label="All" value="0" />
        </Section> */}
      </div>

      <div className="grid gap-3 xl:grid-cols-12">
        <Section
          title="Orders"
          className="xl:col-span-4"
        >
          <DetailRow
            label="On Order"
            value="0"
          />

          <DetailRow
            label="Pending Special Order"
            value="0"
          />

          <DetailRow
            label="Pending Return"
            value="0"
          />
        </Section>


        <Section
          title="Inventory Defaults"
          className="xl:col-span-4"
        >
          <DetailRow
            label="Default Cost"
            value={formatCurrency(product.default_cost)}
          />

          <DetailRow
            label="Vendor"
            value={
              product.productVendors?.length
                ? product.productVendors
                    .map(
                      (item: any) =>
                        item.vendor?.name ?? item.name
                    )
                    .filter(Boolean)
                    .join(", ")
                : "-"
            }
          />

          <DetailRow
            label="Vendor ID"
            value={product.defaultVendorID}
          />
        </Section>

        <Section
          title="Inventory reordering"
          className="xl:col-span-4"
        >
          <div className="border-b py-2.5 text-sm font-medium">
            Manual reordering
          </div>

          <DetailRow
            label="Reorder Point"
            value={formatNumber(inventory.reorder_point)}
          />

          <DetailRow
            label="Desired Inventory Level"
            value={formatNumber(inventory.reorder_level)}
          />
        </Section>

      </div>

      <Card>
        <CardHeader className="border-b bg-muted/60 px-2 py-1.5">
          <CardTitle className="text-xs font-semibold">
            Notes
          </CardTitle>
        </CardHeader>

        <CardContent className="p-2">

          <div className="mb-3 flex items-center">
            <div className="flex items-center gap-2 text-sm">
              <span
                className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-sm border ${
                  Boolean(product.display_note)
                    ? "border-primary bg-primary text-white"
                    : "border-input bg-background"
                }`}
                aria-hidden="true"
              >
                {Boolean(product.display_note) && (
                  <Check className="h-3 w-3" strokeWidth={3} />
                )}
              </span>

              <span className="text-sm">
                Display Note On Sales and Receipts
              </span>
            </div>
          </div>

          <div className="min-h-[90px] whitespace-pre-wrap rounded-sm border bg-background p-3 text-sm leading-5">
            {product.note ||
              product.Note?.note ||
              "-"}
          </div>

        </CardContent>
      </Card>

  </section>
  )
}