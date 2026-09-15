"use client";

import { useSearchParams } from "next/navigation";
import { getCoreRowModel, useReactTable } from "@tanstack/react-table";

import DataTable from "@/components/admin/shared/table/DataTable";
import TableSkeleton from "@/components/admin/shared/table/TableSkeleton";
import TableError from "@/components/admin/shared/table/TableError";

import { getColumns, skeletonColumns } from "./columns";
import { useDeleteProductMutation, useGetProductsQuery, useUpdateStatusProductMutation} from "@/redux/services/product";
import { toasterError, toasterSuccess } from "@/components/core/Toaster";
import {
  ProductStatus,
} from "../page";
import { Product } from "@/types/product.types";
import DeleteProductDialog from "./DeleteProductDialog";
import { useState } from "react";

type Props = {
  status:
    ProductStatus;
  
  onEdit: (
    product: Product
  ) => void;
};


export default function ProductsTable({
  status,
  onEdit,
}: Props) {
  const searchParams = useSearchParams();

  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 10;
  const search = searchParams.get("search") || "";
  const archived =
    status === "active"
      ? false
      : status === "archived"
        ? true
        : undefined;

  const {
    data,
    isLoading,
    isError,
    refetch,
  } = useGetProductsQuery({
    page,
    limit,
    search,
    archived,
  });

const [updateStatusProduct] =  useUpdateStatusProductMutation();

  const [
    deleteProduct,
    { isLoading: deleting },
  ] = useDeleteProductMutation();

  const [
    deleteDialogOpen,
    setDeleteDialogOpen,
  ] = useState(false);

  const [
    selectedProduct,
    setSelectedProduct,
  ] = useState<Product | null>(null);

  const handleDelete = (Product: Product) => {
    setSelectedProduct(Product);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedProduct) {
      return;
    }

    try {
      const response = await deleteProduct({
        id: selectedProduct.id,
      }).unwrap();

      toasterSuccess(
        response?.data?.message ??
        "Product deleted successfully."
      );

      setDeleteDialogOpen(false);
      setSelectedProduct(null);
    } catch (err: any) {
      toasterError(
        err?.data?.error?.message ??
        err?.data?.message ??
        "Unable to delete product."
      );
    }
  };

const columns = getColumns({
  page,
  limit,

  onToggleArchived: async (
    id,
    archived
  ) => {
    try {
      await updateStatusProduct({
        id,
        archived,
      }).unwrap();

      toasterSuccess(
        "Product updated successfully."
      );
    } catch {
      toasterError(
        "Unable to update product."
      );
    }
  },
  onEdit,

  onDelete:
    handleDelete,
});

  const table = useReactTable({
    data: data?.data ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (isLoading) {
    return (
      <TableSkeleton
        perPage={limit}
        columns={skeletonColumns}
      />
    );
  }

  if (isError || !data) {
    return (
      <TableError
        errorMessage="Unable to load products."
        refetch={refetch}
      />
    );
  }

  return (
    <>
    <DataTable
      table={table}
      pagination={{
        current: page,
        limit,
        items: data.count,
        pages: Math.ceil(data.count / limit),
        next:
          page < Math.ceil(data.count / limit)
            ? page + 1
            : null,
        prev: page > 1 ? page - 1 : null,
      }}
    />
        <DeleteProductDialog
          open={deleteDialogOpen}
          productName={selectedProduct?.description}
          loading={deleting}
          onOpenChange={(open) => {
            setDeleteDialogOpen(open);
    
            if (!open && !deleting) {
              setSelectedProduct(null);
            }
          }}
          onConfirm={handleConfirmDelete}
        />
      </>
  );
}