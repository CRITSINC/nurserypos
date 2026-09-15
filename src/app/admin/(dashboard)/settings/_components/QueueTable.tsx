"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import DataTable from "@/components/admin/shared/table/DataTable";
import TableSkeleton from "@/components/admin/shared/table/TableSkeleton";
import TableError from "@/components/admin/shared/table/TableError";

import {
  useQueueQuery,
  useRetryJobMutation,
} from "@/redux/services/lightspeed";

import { toasterError, toasterSuccess } from "@/components/core/Toaster";

import PayloadSheet from "./PayloadSheet";
import ErrorSheet from "./ErrorSheet";
import {
  getColumns,
  skeletonColumns,
} from "./QueueColumns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/admin/ui/card";

interface QueueTableProps {
  pollingInterval?: number;
}

export default function QueueTable({
  pollingInterval,
}: QueueTableProps) {
  const searchParams = useSearchParams();

  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 10;

  const [payload, setPayload] = useState<Record<string, unknown> | null>(null);
  const [error, setError] = useState("");

  const {
    data,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useQueueQuery(
    {
      page,
      limit,
    },
    {
      pollingInterval,
      skipPollingIfUnfocused: true,
      refetchOnReconnect: true,
    }
  );

  const [retryJob] = useRetryJobMutation();

  const columns = useMemo(
    () =>
      getColumns({
        onViewPayload: setPayload,

        onViewError: setError,

        onRetry: async (jobId: string): Promise<void> => {
          try {
            const response = await retryJob(jobId).unwrap();

            toasterSuccess(response.data.message);
          } catch (err: any) {
            toasterError(
              err?.data?.error?.message ??
              err?.data?.message ??
              "Unable to retry job."
            );
          }
        },
      }),
    [retryJob]
  );

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
        errorMessage="Unable to load queue."
        refetch={refetch}
      />
    );
  }

  return (
    <>
  <Card>
    <CardHeader>
      <CardTitle>Queue Inspector / Dead Letter Queue</CardTitle>
    </CardHeader>

    <CardContent>
  
    <DataTable
        table={table}
        pagination={{
            current: page,
            limit,
            items: data.count ?? 0,
            pages: Math.ceil((data.count ?? 0) / limit),
            next:
                page < Math.ceil((data.count ?? 0) / limit)
                    ? page + 1
                    : null,
            prev: page > 1 ? page - 1 : null,
        }}
    />
           </CardContent>
          </Card>

      <PayloadSheet
        payload={payload}
        onClose={() => setPayload(null)}
      />

      <ErrorSheet
        error={error}
        onClose={() => setError("")}
      />
    </>
  );
}