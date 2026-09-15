"use client";

import { ColumnDef } from "@tanstack/react-table";
import { PenSquare, Trash2 } from "lucide-react";

import { Button } from "@/components/admin/ui/button";
import { Customer } from "@/types/customer.types";
import { Skeleton } from "@/components/admin/ui/skeleton";
import { SkeletonColumn } from "@/types/skeleton";
import { Switch } from "@/components/admin/ui/switch";

export const getColumns = ({
  page,
  limit,
  onToggleArchived,
  onEdit,
  onDelete,
}: {
  page: number;
  limit: number;
  onToggleArchived: (
    id: number,
    archived: boolean
  ) => void;
  onEdit: (
    customer: Customer
  ) => void;

  onDelete: (
    id: number
  ) => void;
}): ColumnDef<Customer>[] => [
  {
    header: "ID",
    cell: ({ row }) => (page - 1) * limit + row.index + 1,
  },

  {
    header: "Customer",
    cell: ({ row }) => (
      <div>
        <div className="font-medium">
          {row.original.first_name} {row.original.last_name}
        </div>

        {row.original.company && (
          <div className="text-sm text-muted-foreground">
            {row.original.company}
          </div>
        )}
      </div>
    ),
  },

  {
    header: "Primary Email",
    cell: ({ row }) =>
      row.original.email_primary || "—",
  },

  {
    header: "Mobile",
    cell: ({ row }) =>
      row.original.phone_mobile || "—",
  },

  {
    header: "City",
    cell: ({ row }) =>
      row.original.city || "—",
  },

  {
    header: "Country",
    cell: ({ row }) =>
      row.original.country || "—",
  },

  {
    header: "Customer Type",
    cell: ({ row }) => "—",
  },

  {
    header: "Credit Account",
    cell: ({ row }) => "—",
  },

  {
    header: "Status",
    cell: ({ row }) =>
      row.original.archived ? (
        <span className="text-red-500">
          Archived
        </span>
      ) : (
        <span className="text-green-600">
          Active
        </span>
      ),
  },

  {
    header: "Archived",
    cell: ({ row }) => (
      <div className="flex justify-center">
        <Switch
          checked={row.original.archived}
          onCheckedChange={(checked) =>
            onToggleArchived(
              row.original.id,
              checked
            )
          }
        />
      </div>
    ),
  },

  {
    id: "actions",
    header: () => (
      <div className="text-center">
        Actions
      </div>
    ),

    cell: ({ row }) => (
      <div className="flex justify-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          type="button"
          onClick={() =>
            onEdit(
              row.original
            )
          }
        >
          <PenSquare className="size-5" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          type="button"
          onClick={() =>
            onDelete(
              row.original.id
            )
          }     
        >
          <Trash2 className="size-5" />
        </Button>
      </div>
    ),
  },
];

export const skeletonColumns: SkeletonColumn[] = [
  {
    header: "ID",
    cell: <Skeleton className="w-12 h-8" />,
  },
  {
    header: "Customer",
    cell: <Skeleton className="w-48 h-8" />,
  },
  {
    header: "Primary Email",
    cell: <Skeleton className="w-44 h-8" />,
  },
  {
    header: "Mobile",
    cell: <Skeleton className="w-32 h-8" />,
  },
  {
    header: "City",
    cell: <Skeleton className="w-24 h-8" />,
  },
  {
    header: "Country",
    cell: <Skeleton className="w-24 h-8" />,
  },
  {
    header: "Customer Type",
    cell: <Skeleton className="w-32 h-8" />,
  },
  {
    header: "Credit Account",
    cell: <Skeleton className="w-32 h-8" />,
  },
  {
    header: "Status",
    cell: <Skeleton className="w-20 h-8" />,
  },
  {
    header: "Archived",
    cell: <Skeleton className="w-12 h-8" />,
  },
  {
    header: "Actions",
    cell: <Skeleton className="w-24 h-8" />,
  },
];