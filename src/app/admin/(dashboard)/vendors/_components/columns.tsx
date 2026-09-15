"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ZoomIn, PenSquare, Trash2 } from "lucide-react";

import { Button } from "@/components/admin/ui/button";
import Typography from "@/components/admin/ui/typography";

import { Vendor } from "@/types/vendor.types";
import { Skeleton } from "@/components/admin/ui/skeleton";
import { SkeletonColumn } from "@/types/skeleton";
import { Switch } from "@/components/admin/ui/switch";
import Link from "next/link";

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
    vendor: Vendor
  ) => void;

  onDelete: (
    vendor: Vendor
  ) => void;
}): ColumnDef<Vendor>[] => [
    {
      header: "ID",
      cell: ({ row }) => (
        (page - 1) * limit + row.index + 1
      ),
    },
    {
      header: "Vendor Name",
      accessorKey: "name",
    },
    {
      header: "Phone",
      cell: ({ row }) => row.original.phone || "—",
    },
    {
      header: "Email",
      cell: ({ row }) => row.original.email || "—",
    },
    {
      header: "Account Number",
      accessorKey: "account_number",
      cell: ({ row }) => row.original.account_number || "—",
    },

    {
      header: "Representative",
      cell: ({ row }) => (
        <Typography>
          {`${row.original.rep_first_name ?? ""} ${row.original.rep_last_name ?? ""}`.trim() || "—"}
        </Typography>
      ),
    },

    {
      header: "Currency",
      cell: ({ row }) =>
        row.original.purchasing_currency_code || "—",
    },

    {
      header: "Price Level",
      cell: ({ row }) =>
        row.original.price_level || "—",
    },
    {
      header: "view",
      cell: ({ row }) => (
        <Button size="icon" asChild variant="ghost" className="text-foreground">
          <Link href={`/admin/vendors/${row.original.id}`}>
            <ZoomIn className="size-5" />
          </Link>
        </Button>
      ),
    },
    {
      header: "Status",
      cell: ({ row }) =>
        row.original.archived ? (
          <span className="text-red-500">Archived</span>
        ) : (
          <span className="text-green-600">Active</span>
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
        <div className="text-center">Actions</div>
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
                row.original
              )
            }
          >
            <Trash2 className="size-5 text-red-500" />
          </Button>

        </div>
      ),
    },
  ];


export const skeletonColumns: SkeletonColumn[] = [
  {
    header: "Vendor ID",
    cell: <Skeleton className="w-20 h-8" />,
  },
  {
    header: "Vendor Name",
    cell: <Skeleton className="w-40 h-8" />,
  },
  {
    header: "Phone",
    cell: <Skeleton className="w-40 h-8" />,
  },
  {
    header: "Email",
    cell: <Skeleton className="w-40 h-8" />,
  },
  {
    header: "Account No",
    cell: <Skeleton className="w-28 h-8" />,
  },
  {
    header: "Price Level",
    cell: <Skeleton className="w-24 h-8" />,
  },
  {
    header: "Representative",
    cell: <Skeleton className="w-36 h-8" />,
  },
  {
    header: "view",
    cell: <Skeleton className="w-8 h-8" />,
  },
  {
    header: "Status",
    cell: <Skeleton className="w-16 h-8" />,
  },
  {
    header: "Archived",
    cell: <Skeleton className="w-16 h-8" />,
  },
  {
    header: "Actions",
    cell: <Skeleton className="w-24 h-8" />,
  },
];