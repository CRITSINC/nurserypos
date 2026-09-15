"use client";

import {
  useSearchParams,
} from "next/navigation";

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
  useGetCustomersQuery,
  useUpdateStatusCustomerMutation,
} from "@/redux/services/customer";

import {
  toasterError,
  toasterSuccess,
} from "@/components/core/Toaster";

import {
  Customer,
} from "@/types/customer.types";

import {
  CustomerStatus,
} from "../page";


type Props = {
  status:
    CustomerStatus;


  onEdit: (
    customer: Customer
  ) => void;
};


export default function CustomersTable({
  status,
  onEdit,
}: Props) {

  const searchParams =
    useSearchParams();

  const page =
    Number(
      searchParams.get(
        "page"
      )
    ) || 1;


  const limit =
    Number(
      searchParams.get(
        "limit"
      )
    ) || 10;

  const search =
    searchParams.get(
      "search"
    ) || "";

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
  } =
    useGetCustomersQuery({
      page,
      limit,
      search,
      archived,
    });

  const [
    updateStatusCustomer,
  ] =
    useUpdateStatusCustomerMutation();

  const handleDelete = async (
    id: number
  ) => {

    console.log(
      "Delete customer:",
      id
    );
  };

  const columns =
    getColumns({

      page,

      limit,

      onToggleArchived:
        async (
          id,
          archived
        ) => {

          try {

            await updateStatusCustomer({
              id,
              archived,
            }).unwrap();


            toasterSuccess(
              "Customer updated successfully."
            );

          } catch {

            toasterError(
              "Unable to update customer."
            );
          }
        },

      onEdit,

      onDelete:
        handleDelete,
    });

  const table =
    useReactTable({

      data:
        data?.data ?? [],

      columns,

      getCoreRowModel:
        getCoreRowModel(),
    });

  if (
    isLoading
  ) {

    return (
      <TableSkeleton
        perPage={
          limit
        }

        columns={
          skeletonColumns
        }
      />
    );
  }

  if (
    isError ||
    !data
  ) {

    return (
      <TableError

        errorMessage={
          "Unable to load customers."
        }

        refetch={
          refetch
        }

      />
    );
  }

  return (
    <DataTable

      table={
        table
      }

      pagination={{

        current:
          page,

        limit:
          limit,

        items:
          data.count,

        pages:
          Math.ceil(
            data.count /
              limit
          ),

        next:
          page <
          Math.ceil(
            data.count /
              limit
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