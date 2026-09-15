"use client";

import { useSearchParams } from "next/navigation";
import { getCoreRowModel, useReactTable } from "@tanstack/react-table";

import DataTable from "@/components/admin/shared/table/DataTable";
import TableSkeleton from "@/components/admin/shared/table/TableSkeleton";
import TableError from "@/components/admin/shared/table/TableError";

import { getColumns, skeletonColumns } from "./columns";
import { useGetInventoriesQuery, useUpdateStatusInventoryMutation } from "@/redux/services/inventory";
import { toasterError, toasterSuccess } from "@/components/core/Toaster";
import { Inventory } from "@/types/inventory.types";

type Props = {
  onEdit: (inventory: Inventory) => void;
};

export default function InventoriesTable({onEdit }: Props) {
  const searchParams = useSearchParams();

  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 10;
  const search = searchParams.get("search") || "";

  const {
    data,
    isLoading,
    isError,
    refetch,
  } = useGetInventoriesQuery({
    page,
    limit,
    search,
  });

const [updateStatusInventory] = useUpdateStatusInventoryMutation();

const columns = getColumns({
  page,
  limit,
  onToggleArchived: async (
    id,
    archived
  ) => {
    try {
      await updateStatusInventory({
        id,
        archived,
      }).unwrap();

      toasterSuccess(
        "Inventory updated successfully."
      );
    } catch {
      toasterError(
        "Unable to update inventory."
      );
    }
  },
  onEdit,
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
        errorMessage="Unable to load Inventories."
        refetch={refetch}
      />
    );
  }

  
  return (
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
  );
}