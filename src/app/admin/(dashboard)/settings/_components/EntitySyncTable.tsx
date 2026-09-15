"use client";

import { useMemo, useState } from "react";
import { getCoreRowModel, useReactTable } from "@tanstack/react-table";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/admin/ui/card";

import DataTable from "@/components/admin/shared/table/DataTable";
import TableSkeleton from "@/components/admin/shared/table/TableSkeleton";
import TableError from "@/components/admin/shared/table/TableError";

import { useDashboardQuery } from "@/redux/services/lightspeed";

import ErrorSheet from "./ErrorSheet";
import { getColumns, skeletonColumns } from "./SyncColumns";

interface EntitySyncTableProps {
  pollingInterval?: number;
}

export default function EntitySyncTable({
  pollingInterval,
}: EntitySyncTableProps) {
  const [error, setError] = useState("");

  const {
    data,
    isLoading,
    isError,
    refetch,
  } = useDashboardQuery(undefined, {
    pollingInterval,
    skipPollingIfUnfocused: true,
    refetchOnReconnect: true,
  });

  const columns = useMemo(
    () => getColumns(setError),
    []
  );

  const table = useReactTable({
    data: data?.data.syncStates ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (isLoading) {
    return (
      <TableSkeleton
        perPage={5}
        columns={skeletonColumns}
      />
    );
  }

  if (isError || !data) {
    return (
      <TableError
        errorMessage="Unable to load sync states."
        refetch={refetch}
      />
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Entity Sync States</CardTitle>
        </CardHeader>

        <CardContent>
          <DataTable
            table={table}       
          />
        </CardContent>
      </Card>

      <ErrorSheet
        error={error}
        onClose={() => setError("")}
      />
    </>
  );
}