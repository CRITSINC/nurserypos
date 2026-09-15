"use client";

import { useState } from "react";
import Image from "next/image";
import { notFound, useParams } from "next/navigation";
import {
  ArrowLeft,
  ImageOff,
  DollarSign,
  Package,
  Barcode,
  Warehouse,
} from "lucide-react";

import Link from "next/link";

import { useGetProductByIdQuery } from "@/redux/services/product";

import PageTitle from "@/components/admin/shared/PageTitle";

import { Button } from "@/components/admin/ui/button";
import { Badge } from "@/components/admin/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/admin/ui/card";
import { Separator } from "@/components/admin/ui/separator";
import { Skeleton } from "@/components/admin/ui/skeleton";

function DetailRow({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between py-3 border-b last:border-0">
      <span className="text-sm font-medium text-muted-foreground">
        {label}
      </span>

      <span className="font-medium text-right">
        {value}
      </span>
    </div>
  );
}

export default function ProductDetailsPage() {
  const { id } = useParams();

  const {
    data,
    isLoading,
    isError,
  } = useGetProductByIdQuery(Number(id), {
    skip: !id,
  });

  const [selectedImage, setSelectedImage] = useState(0);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-72" />
        <Skeleton className="h-[750px] rounded-xl" />
      </div>
    );
  }

  if (isError || !data?.data) {
    return notFound();
  }

  const product = data.data;

  const images = product.images ?? [];

  const image =
    images[selectedImage] ??
    images[0];

  return (
    <section className="space-y-6">

      <div className="flex items-center justify-between">

        <PageTitle className="mb-0">
          Product Details
        </PageTitle>

        <div className="flex gap-3">

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
      </div>

      <div className="grid gap-6 xl:grid-cols-12">

        {/* IMAGE */}

        <Card className="xl:col-span-3">

          <CardContent className="p-6">

            {image ? (
              <Image
                src={image?.local_path ? image?.lightspeed_url : "/assets/not-available.png"}
                alt={product.description ?? ""}
                width={400}
                height={400}
                className="aspect-square w-full rounded-xl border object-cover"
              />
            ) : (
              <div className="flex aspect-square items-center justify-center rounded-xl border bg-muted">

                <div className="text-center">

                  <ImageOff className="mx-auto mb-3 h-12 w-12 text-muted-foreground" />

                  <p className="text-muted-foreground">
                    No Image
                  </p>

                </div>

              </div>
            )}

            {images.length > 1 && (
              <div className="mt-4 grid grid-cols-4 gap-2">

                {images.map((img, index) => (
                  <button
                    key={img.id}
                    onClick={() =>
                      setSelectedImage(index)
                    }
                    className={`overflow-hidden rounded-lg border ${
                      selectedImage === index
                        ? "ring-2 ring-primary"
                        : ""
                    }`}
                  >
                    <Image
                      src={
                        img.local_path ||
                        img.lightspeed_url
                      }
                      alt=""
                      width={100}
                      height={100}
                      className="aspect-square object-cover"
                    />
                  </button>
                ))}

              </div>
            )}

          </CardContent>

        </Card>

        {/* PRODUCT SUMMARY */}

        <Card className="xl:col-span-5">

          <CardHeader>

            <CardTitle className="flex items-center gap-2">

              Product Information

            </CardTitle>

          </CardHeader>

          <CardContent>

            <div className="mb-6">

              <Badge
                variant={
                  product.archived
                    ? "destructive"
                    : "success"
                }
              >
                {product.archived
                  ? "Archived"
                  : "Active"}
              </Badge>

              <h1 className="mt-3 text-3xl font-bold leading-tight">
                {product.description}
              </h1>

            </div>

            <Separator className="mb-4" />

            <DetailRow
              label="Category"
              value={
                product.category?.full_path_name ?? "-"
              }
            />

            <DetailRow
              label="Brand"
              value={
                product.brand?.name ?? "-"
              }
            />

            <DetailRow
              label="Matrix"
              value={
                product.matrix?.description ??
                "-"
              }
            />

            <DetailRow
              label="Quantity On Hand"
              value={product.qoh}
            />

            <DetailRow
              label="Item Type"
              value={product.item_type}
            />

          </CardContent>

        </Card>

        {/* PRICING */}

        <Card className="xl:col-span-4">

          <CardHeader>

            <CardTitle className="flex items-center gap-2">

              Pricing

            </CardTitle>

          </CardHeader>

          <CardContent>

            <DetailRow
              label="Price"
              value={`$${product.price}`}
            />

            <DetailRow
              label="MSRP"
              value={`$${product.msrp}`}
            />

            <DetailRow
              label="Online Price"
              value={`$${product.online_price}`}
            />

            <DetailRow
              label="Price"
              value={`$${product.price}`}
            />

          </CardContent>

        </Card>
        {/* PRODUCT IDS */}

        <Card className="xl:col-span-6">

          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Product IDs
            </CardTitle>
          </CardHeader>

          <CardContent>

            <DetailRow
              label="System SKU"
              value={product.system_sku ?? "-"}
            />

            <DetailRow
              label="Custom SKU"
              value={product.custom_sku ?? "-"}
            />

            <DetailRow
              label="Manufacturer SKU"
              value={product.manufacturer_sku ?? "-"}
            />

            <DetailRow
              label="UPC"
              value={product.upc ?? "-"}
            />

            <DetailRow
              label="EAN"
              value={product.ean ?? "-"}
            />

          </CardContent>

        </Card>

        {/* INVENTORY */}

        <Card className="xl:col-span-6">

          <CardHeader>

            <CardTitle className="flex items-center gap-2">

              Inventory

            </CardTitle>

          </CardHeader>

          <CardContent>

            <DetailRow
              label="Archived"
              value={
                <Badge
                  variant={
                    product.archived
                      ? "destructive"
                      : "success"
                  }
                >
                  {product.archived
                    ? "Yes"
                    : "No"}
                </Badge>
              }
            />

            <DetailRow
              label="Publish to Ecommerce"
              value={
                <Badge
                  variant={
                    product.publish_to_ecom
                      ? "success"
                      : "secondary"
                  }
                >
                  {product.publish_to_ecom
                    ? "Yes"
                    : "No"}
                </Badge>
              }
            />

            <DetailRow
              label="Taxable"
              value={
                <Badge
                  variant={
                    product.taxable
                      ? "success"
                      : "secondary"
                  }
                >
                  {product.taxable
                    ? "Yes"
                    : "No"}
                </Badge>
              }
            />

            <DetailRow
              label="Discountable"
              value={
                <Badge
                  variant={
                    product.discountable
                      ? "success"
                      : "secondary"
                  }
                >
                  {product.discountable
                    ? "Yes"
                    : "No"}
                </Badge>
              }
            />

            <DetailRow
              label="Serialized"
              value={
                <Badge
                  variant={
                    product.serialized
                      ? "success"
                      : "secondary"
                  }
                >
                  {product.serialized
                    ? "Yes"
                    : "No"}
                </Badge>
              }
            />

          </CardContent>

        </Card>

        {/* ATTRIBUTES */}

        <Card className="xl:col-span-6">

          <CardHeader>

            <CardTitle>
              Attributes
            </CardTitle>

          </CardHeader>

          <CardContent>

            <DetailRow
              label="Attribute 1"
              value={
                product.attribute_1_value ??
                "-"
              }
            />

            <DetailRow
              label="Attribute 2"
              value={
                product.attribute_2_value ??
                "-"
              }
            />

            <DetailRow
              label="Attribute 3"
              value={
                product.attribute_3_value ??
                "-"
              }
            />

          </CardContent>

        </Card>

        {/* NOTES */}

        <Card className="xl:col-span-6">

          <CardHeader>

            <CardTitle>
              Notes
            </CardTitle>

          </CardHeader>

          <CardContent>

            <DetailRow
              label="Display Note"
              value={
                <Badge
                  variant={
                    product.display_note
                      ? "success"
                      : "secondary"
                  }
                >
                  {product.display_note
                    ? "Yes"
                    : "No"}
                </Badge>
              }
            />

            <DetailRow
              label="Internal Note"
              value={
                product.note || "-"
              }
            />

            <DetailRow
              label="Created"
              value={new Date(
                product.createdAt
              ).toLocaleString()}
            />

            <DetailRow
              label="Updated"
              value={new Date(
                product.updatedAt
              ).toLocaleString()}
            />

          </CardContent>

        </Card>

      </div>

    </section>
  );
}