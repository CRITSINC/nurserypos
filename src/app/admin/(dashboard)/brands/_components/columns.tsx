"use client";

import { ColumnDef } from "@tanstack/react-table";
import { PenSquare, Trash2 } from "lucide-react";

import { Button } from "@/components/admin/ui/button";
import Typography from "@/components/admin/ui/typography";

import { Skeleton } from "@/components/admin/ui/skeleton";
import { SkeletonColumn } from "@/types/skeleton";
import { Brand } from "@/types/brand.types";
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
    category: Brand
  ) => void;

  onDelete: (
    brand: Brand
  ) => void;
}): ColumnDef<Brand>[] => [
  {
    header: "ID",
    cell: ({ row }) => (
      (page - 1) * limit + row.index + 1
    ),
  },
  {
    header: "Brand Name",
    accessorKey: "name",
  },
  {
    header: "Product Count",
    accessorKey: "productCount",
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

        {/* <Button
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
        </Button> */}

      </div>
    ),
  },
];


export const skeletonColumns: SkeletonColumn[] = [
  {
    header: "Brand ID",
    cell: <Skeleton className="w-20 h-8" />,
  },
  {
    header: "Brand Name",
    cell: <Skeleton className="w-40 h-8" />,
  },
  {
    header: "Product Count",
    cell: <Skeleton className="w-40 h-8" />
  },
  {
    header: "Actions",
    cell: <Skeleton className="w-24 h-8" />,
  },
];