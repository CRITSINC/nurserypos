"use client";

import { ColumnDef } from "@tanstack/react-table";
import { PenSquare, Trash2 } from "lucide-react";

import { Button } from "@/components/admin/ui/button";
import { Skeleton } from "@/components/admin/ui/skeleton";

import { SkeletonColumn } from "@/types/skeleton";
import { Tag } from "@/types/tag.types";

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
    tag: Tag
  ) => void;

  onDelete: (
    tag: Tag
  ) => void;
}): ColumnDef<Tag>[] => [
  {
    header: "ID",

    cell: ({ row }) =>
      (page - 1) * limit + row.index + 1,
  },

  {
    header: "Tag Name",
    accessorKey: "name",
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
          onClick={() => onEdit(row.original)}
        >
          <PenSquare className="size-5" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          type="button"
          onClick={() => onDelete(row.original)}
        >
          <Trash2 className="size-5 text-red-500" />
        </Button>
      </div>
    ),
  },
];

export const skeletonColumns: SkeletonColumn[] = [
  {
    header: "Tag ID",
    cell: <Skeleton className="h-8 w-20" />,
  },

  {
    header: "Tag Name",
    cell: <Skeleton className="h-8 w-40" />,
  },

  {
    header: "Status",
    cell: <Skeleton className="h-8 w-16" />,
  },

  {
    header: "Actions",
    cell: <Skeleton className="h-8 w-24" />,
  },
];