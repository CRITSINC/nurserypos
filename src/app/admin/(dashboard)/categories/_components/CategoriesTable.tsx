"use client";

import { useSearchParams } from "next/navigation";

import {
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import DataTable from "@/components/admin/shared/table/DataTable";
import TableSkeleton from "@/components/admin/shared/table/TableSkeleton";
import TableError from "@/components/admin/shared/table/TableError";

import {
  getColumns,
  skeletonColumns,
} from "./columns";

import {
  useDeleteCategoryMutation,
  useGetCategoriesQuery,
} from "@/redux/services/category";

import { Category } from "@/types/category.types";
import { useState } from "react";
import { toasterError, toasterSuccess } from "@/components/core/Toaster";
import DeleteCategoryDialog from "./DeleteCategoryDialog";

type Props = {
  onEdit: (
    category: Category
  ) => void;
};

export default function CategoriesTable({
  onEdit,
}: Props) {

  const searchParams =
    useSearchParams();

  const page =
    Number(
      searchParams.get("page")
    ) || 1;

  const limit =
    Number(
      searchParams.get("limit")
    ) || 10;

  const search =
    searchParams.get("search") || "";

  const {
    data,
    isLoading,
    isError,
    refetch,
  } = useGetCategoriesQuery({
    page,
    limit,
    search,
    sort: "desc",
    pagination: true,
  });

  const [
    deleteCategory,
    { isLoading: deleting },
  ] = useDeleteCategoryMutation();

  const [
    deleteDialogOpen,
    setDeleteDialogOpen,
  ] = useState(false);

  const [
    selectedCategory,
    setSelectedCategory,
  ] = useState<Category | null>(null);

  const handleDelete = (category: Category) => {
    setSelectedCategory(category);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedCategory) {
      return;
    }

    try {
      const response = await deleteCategory({
        id: selectedCategory.id,
      }).unwrap();

      toasterSuccess(
        response?.data?.message ??
        "Category deleted successfully."
      );

      setDeleteDialogOpen(false);
      setSelectedCategory(null);
    } catch (err: any) {
      toasterError(
        err?.data?.error?.message ??
        err?.data?.message ??
        "Unable to delete category."
      );
    }
  };

  const columns =
    getColumns({
      page,
      limit,
      onEdit,
      onDelete: handleDelete,
    });

  const table =
    useReactTable<Category>({
      data: data?.data ?? [],
      columns,
      getCoreRowModel:
        getCoreRowModel(),
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
        errorMessage="Unable to load categories."
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
        pages: Math.ceil(
          data.count / limit
        ),
        next:
          page <
          Math.ceil(
            data.count / limit
          )
            ? page + 1
            : null,
        prev:
          page > 1
            ? page - 1
            : null,
      }}
    />
    <DeleteCategoryDialog
      open={deleteDialogOpen}
      categoryName={selectedCategory?.name}
      loading={deleting}
      onOpenChange={(open) => {
        setDeleteDialogOpen(open);

        if (!open && !deleting) {
          setSelectedCategory(null);
        }
      }}
      onConfirm={handleConfirmDelete}
    />
    </>
  );
}