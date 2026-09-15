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
  useGetOrdersQuery,
} from "@/redux/services/order";

import { Order } from "@/types/order.types";

import { OrderStatus } from "../page";

type Props = {
  status: OrderStatus;

  onEdit: (
    order: Order
  ) => void;
};

export default function OrdersTable({
  status,
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

  const urlStatus =
    searchParams.get("status") || "";

  const {
    data,
    isLoading,
    isError,
    refetch,
  } = useGetOrdersQuery({
    page,
    limit,
    pagination: true,
    search,
    ...(urlStatus
      ? {
          status: urlStatus,
        }
      : status !== "all"
      ? {
          status,
        }
      : {}),
  });

  const columns =
    getColumns({
      page,
      limit,
      onEdit,
    });

  const table =
    useReactTable({
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
        errorMessage={
          "Unable to load orders."
        }
        refetch={refetch}
      />
    );
  }

  return (
    <DataTable
      table={table}
      pagination={{
        current: page,
        limit: limit,
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
  );
}