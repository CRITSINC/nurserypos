"use client";

import { useSearchParams } from "next/navigation";
import { getCoreRowModel, useReactTable } from "@tanstack/react-table";

import DataTable from "@/components/admin/shared/table/DataTable";
import TableSkeleton from "@/components/admin/shared/table/TableSkeleton";
import TableError from "@/components/admin/shared/table/TableError";

import { getColumns, skeletonColumns } from "./columns";
import { useDeleteBrandMutation, useGetBrandsQuery, useUpdateStatusBrandMutation } from "@/redux/services/brand";
import { toasterError, toasterSuccess } from "@/components/core/Toaster";
import { Brand } from "@/types/brand.types";
import DeleteBrandDialog from "./DeleteBrandDialog";
import { useState } from "react";

type Props = {
  onEdit: (
    brand: Brand
  ) => void;
};

export default function BrandsTable({
  onEdit,
}: Props) {
  const searchParams = useSearchParams();

  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 10;
  const search = searchParams.get("search") || "";
  const [
    deleteBrand,
    { isLoading: deleting },
  ] = useDeleteBrandMutation();

  const [
    deleteDialogOpen,
    setDeleteDialogOpen,
  ] = useState(false);

  const [
    selectedBrand,
    setSelectedBrand,
  ] = useState<Brand | null>(null);

  const {
    data,
    isLoading,
    isError,
    refetch,
  } = useGetBrandsQuery({
    page,
    limit,
    search,
    sort: "desc",
    pagination: true,
  });

const [updateStatusBrand] = useUpdateStatusBrandMutation();

  const handleDelete = (brand: Brand) => {
    setSelectedBrand(brand);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedBrand) {
      return;
    }

    try {
      const response = await deleteBrand({
        id: selectedBrand.id,
      }).unwrap();

      toasterSuccess(
        response?.data?.message ??
          "Brand deleted successfully."
      );

      setDeleteDialogOpen(false);
      setSelectedBrand(null);
    } catch (err: any) {
      toasterError(
        err?.data?.error?.message ??
          err?.data?.message ??
          "Unable to delete brand."
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
      await updateStatusBrand({
        id,
        archived,
      }).unwrap();

      toasterSuccess(
        "Brand updated successfully."
      );
    } catch {
      toasterError(
        "Unable to update brand."
      );
    }
  },
  onEdit,
  onDelete: handleDelete,
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
        errorMessage="Unable to load Brands."
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

      <DeleteBrandDialog
        open={deleteDialogOpen}
        brandName={selectedBrand?.name}
        loading={deleting}
        onOpenChange={(open) => {
          setDeleteDialogOpen(open);

          if (!open && !deleting) {
            setSelectedBrand(null);
          }
        }}
        onConfirm={handleConfirmDelete}
      />

    </>
  );
}