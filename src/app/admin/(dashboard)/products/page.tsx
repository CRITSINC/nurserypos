'use client';

import { useState } from "react";
import PageTitle from "@/components/admin/shared/PageTitle";
import ProductsTable from "./_components/ProductsTable";
import ProductFilter from "./_components/ProductFilter";
import ProductForm from "./_components/ProductForm";

import { Button } from "@/components/admin/ui/button";
import { Plus, SquarePen } from "lucide-react";

import { Product } from "@/types/product.types";

import { ProductFormData } from "./_components/schema";

export type ProductStatus =
  | "all"
  | "active"
  | "archived";

export default function ProductPage() {
  const [open, setOpen] = useState(false);

  const [bulkOpen, setBulkOpen] =
    useState(false);

  const [selectedProduct, setSelectedProduct] =
    useState<Product | null>(null);

  const [
    status,
    setStatus,
  ] = useState<ProductStatus>(
    "active"
  );


  const [
    appliedStatus,
    setAppliedStatus,
  ] = useState<ProductStatus>(
    "active"
  );

  const handleAdd = () => {
    setSelectedProduct(null);
    setOpen(true);
  };

  const handleEdit = (
    product: Product
  ) => {
    setSelectedProduct(product);
    setOpen(true);
  };

  const handleClose = (
    value: boolean
  ) => {

    setOpen(value);

    if (!value) {
      setSelectedProduct(null);
    }
  };

  const handleBulkAdd = () => {
    setBulkOpen(true);
  };

  const handleResetFilter = () => {

    setStatus(
      "active"
    );

    setAppliedStatus(
      "active"
    );
  };


  const handleApplyFilter = (
    selectedStatus: ProductStatus
  ) => {

    setAppliedStatus(
      selectedStatus
    );
  };

  const inventory =
    selectedProduct?.inventories?.[0];

  const primaryVendor =
    selectedProduct?.productVendors?.find(
      (vendor) => vendor.is_primary
    ) ??
    selectedProduct?.productVendors?.[0];


  function mapProductToFormData(
    product: Product
  ): ProductFormData {

    const primaryVendor =
      product.productVendors?.find(
        (vendor) =>
          vendor.is_primary
      ) ??
      product.productVendors?.[0];


    const inventory =
      product.inventories?.[0];


    return {
      description:
        product.description ?? "",

      item_type:
        product.item_type ?? "default",

      serialized:
        product.serialized ?? false,

      qoh:
        0,

      system_sku:
        product.system_sku ?? "",

      upc:
        product.upc ?? "",

      ean:
        product.ean ?? "",

      custom_sku:
        product.custom_sku ?? "",

      manufacturer_sku:
        product.manufacturer_sku ?? "",

      category_id:
        product.category_id ?? null,

      brand_id:
        product.brand_id ?? null,

      tags:
        product.tags
          ?.map(
            (tag) =>
              tag.name
          )
          .join(", ") ?? "",

      price:
        product.price ?? 0,

      msrp:
        product.msrp ?? 0,

      online_price:
        product.online_price ?? 0,

      discountable:
        product.discountable ?? true,

      taxable:
        product.taxable ?? true,

      tax_class_id:
        product.tax_class_id
          ? Number(
            product.tax_class_id
          )
          : null,

      default_cost:
        product.default_cost ?? 0,

      vendor_id:
        primaryVendor?.vendor_id ??
        null,

      vendor_sku:
        primaryVendor?.vendor_sku ??
        "",

      reorder_point:
        inventory?.reorder_point ??
        0,

      reorder_level:
        inventory?.reorder_level ??
        0,

      publish_to_ecom:
        product.publish_to_ecom ??
        false,

      attribute_1_value:
        product.attribute_1_value ??
        "",

      attribute_2_value:
        product.attribute_2_value ??
        "",

      attribute_3_value:
        product.attribute_3_value ??
        "",

      note:
        product.note ?? "",

      display_note:
        product.display_note ??
        false,
    };
  }


  return (
    <section>
      <PageTitle>Products</PageTitle>
      <div className="          
          mb-6
          flex
          items-center
          justify-end
          gap-3
        ">

        <Button onClick={
          handleAdd
        }>
          <Plus className="mr-2 h-4 w-4" />
          Add Product
        </Button>
      </div>
      <ProductFilter
        status={
          status
        }

        onStatusChange={
          setStatus
        }

        onFilter={
          handleApplyFilter
        }

        onReset={
          handleResetFilter
        }
      />
      <ProductsTable
        status={appliedStatus}
        onEdit={handleEdit}
      />

      <ProductForm
        open={open}
        onOpenChange={handleClose}
        isEdit={!!selectedProduct}
        productId={selectedProduct?.id}
        initialData={
          selectedProduct
            ? mapProductToFormData(
              selectedProduct
            )
            : undefined
        }
        images={
          selectedProduct?.images ?? []
        }
        editStats={
          selectedProduct
            ? {
              available:
                inventory?.qoh ?? 0,

              reserved:
                inventory?.reserved ?? 0,

              avgCost:
                selectedProduct.avg_cost ??
                inventory?.unit_cost ??
                0,

              totalValue:
                inventory?.total_value ?? 0,

              totalSaleValue:
                inventory?.total_sale_value ??
                0,

              layaway:
                inventory?.layaway ?? 0,

              specialOrder:
                inventory?.special_order ?? 0,

              workorder:
                inventory?.workorder ?? 0,
            }
            : undefined
        }
      />


    </section>
  );
}