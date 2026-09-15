"use client";

import { ColumnDef } from "@tanstack/react-table";

import { Button } from "@/components/admin/ui/button";

import { AlertCircle } from "lucide-react";

import { SyncState } from "@/types/lightspeed.types";

import StatusBadge from "./StatusBadge";

import { Skeleton } from "@/components/admin/ui/skeleton";
import { SkeletonColumn } from "@/types/skeleton";


export const getColumns = (
  onViewError: (error: string) => void
): ColumnDef<SyncState>[] => [
  {
    accessorKey: "entity_type",

    header: "Entity",

    cell: ({ row }) => (
      <span className="capitalize">
        {row.original.entity_type}
      </span>
    ),
  },

  {
    accessorKey: "status",

    header: "Status",

    cell: ({ row }) => (
      <StatusBadge
        status={row.original.status}
      />
    ),
  },

  {
    accessorKey: "last_synced_at",

    header: "Last Sync",

    cell: ({ row }) =>
      row.original.last_synced_at
        ? new Date(
            row.original.last_synced_at
          ).toLocaleString()
        : "—",
  },

  {
    accessorKey: "last_cursor_ts",

    header: "Cursor",

    cell: ({ row }) =>
      row.original.last_cursor_ts
        ? new Date(
            row.original.last_cursor_ts
          ).toLocaleString()
        : "—",
  },

  {
    accessorKey: "records_processed",

    header: "Records",

    cell: ({ row }) =>
      row.original.records_processed,
  },

  {
    id: "error",

    header: "Last Error",

    cell: ({ row }) => {
      if (!row.original.last_error)
        return "—";

      return (
        <Button
          variant="ghost"
          size="icon"
          onClick={() =>
            onViewError(
              row.original.last_error!
            )
          }
        >
          <AlertCircle className="h-4 w-4 text-red-500" />
        </Button>
      );
    },
  },
];


export const skeletonColumns: SkeletonColumn[] = [
  {
    header: "Entity",
    cell: <Skeleton className="h-4 w-24" />,
  },
  {
    header: "Status",
    cell: <Skeleton className="h-6 w-20 rounded-full" />,
  },
  {
    header: "Last Sync",
    cell: <Skeleton className="h-4 w-36" />,
  },
  {
    header: "Cursor",
    cell: <Skeleton className="h-4 w-36" />,
  },
  {
    header: "Records",
    cell: <Skeleton className="h-4 w-16" />,
  },
  {
    header: "Last Error",
    cell: <Skeleton className="h-8 w-8 rounded-md" />,
  },
];