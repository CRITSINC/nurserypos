"use client";

import { ColumnDef } from "@tanstack/react-table";
import { RotateCcw, Eye, AlertCircle } from "lucide-react";

import { Button } from "@/components/admin/ui/button";
import { Badge } from "@/components/admin/ui/badge";
import { Skeleton } from "@/components/admin/ui/skeleton";

import { QueueJob } from "@/types/lightspeed.types";
import { SkeletonColumn } from "@/types/skeleton";
import RetryButton from "./RetryButton";

interface ColumnProps {
  onViewPayload: (payload: Record<string, unknown>) => void;
  onViewError: (error: string) => void;
  onRetry: (jobId: string) => Promise<void>;
}

const getStatusBadge = (status: QueueJob["status"]) => {
  switch (status) {
    case "pending":
      return <Badge variant="secondary">Pending</Badge>;

    case "processing":
      return <Badge>Processing</Badge>;

    case "done":
      return (
        <Badge className="bg-green-600 hover:bg-green-600">
          Done
        </Badge>
      );

    case "retry":
      return (
        <Badge className="bg-yellow-500 hover:bg-yellow-500">
          Retry
        </Badge>
      );

    case "dead_letter":
      return <Badge variant="destructive">Dead Letter</Badge>;

    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

export const getColumns = ({
  onViewPayload,
  onViewError,
  onRetry,
}: ColumnProps): ColumnDef<QueueJob>[] => [
  {
    accessorKey: "id",
    header: "Job ID",
  },

  {
    accessorKey: "job_type",
    header: "Job Type",
    cell: ({ row }) => (
      <span className="capitalize">
        {row.original.job_type.replaceAll("_", " ")}
      </span>
    ),
  },

  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) =>
      getStatusBadge(row.original.status),
  },

  {
    id: "attempts",
    header: "Attempts",
    cell: ({ row }) =>
      `${row.original.attempts} / ${row.original.max_attempts}`,
  },

  {
    accessorKey: "run_at",
    header: "Run At",
    cell: ({ row }) =>
      new Date(row.original.run_at).toLocaleString(),
  },

  {
    id: "payload",
    header: "Payload",
    cell: ({ row }) => (
      <Button
        variant="ghost"
        size="icon"
        onClick={() =>
          onViewPayload(row.original.payload)
        }
      >
        <Eye className="h-4 w-4" />
      </Button>
    ),
  },

  {
    id: "error",
    header: "Error",
    cell: ({ row }) => {
      if (!row.original.error_message) {
        return "-";
      }

      return (
        <Button
          variant="ghost"
          size="icon"
          onClick={() =>
            onViewError(row.original.error_message!)
          }
        >
          <AlertCircle className="h-4 w-4 text-red-500" />
        </Button>
      );
    },
  },

  {
    id: "retry",
    header: "Action",
    cell: ({ row }) => {
      const retryAllowed =
        row.original.status === "retry" ||
        row.original.status === "dead_letter";

      if (!retryAllowed) {
        return "-";
      }

      return (
       <RetryButton
        jobId={row.original.id}
        onRetry={onRetry}
        />
      );
    },
  },
];

export const skeletonColumns: SkeletonColumn[] = [
  {
    header: "Job ID",
    cell: <Skeleton className="h-4 w-10" />,
  },
  {
    header: "Job Type",
    cell: <Skeleton className="h-4 w-28" />,
  },
  {
    header: "Status",
    cell: <Skeleton className="h-6 w-20 rounded-full" />,
  },
  {
    header: "Attempts",
    cell: <Skeleton className="h-4 w-14" />,
  },
  {
    header: "Run At",
    cell: <Skeleton className="h-4 w-40" />,
  },
  {
    header: "Payload",
    cell: <Skeleton className="h-8 w-8 rounded-md" />,
  },
  {
    header: "Error",
    cell: <Skeleton className="h-8 w-8 rounded-md" />,
  },
  {
    header: "Action",
    cell: <Skeleton className="h-8 w-20 rounded-md" />,
  },
];