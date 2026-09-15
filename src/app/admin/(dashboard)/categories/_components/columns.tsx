"use client";

import {
  ColumnDef,
} from "@tanstack/react-table";

import {
  PenSquare,
  Trash2,
} from "lucide-react";

import {
  Button,
} from "@/components/admin/ui/button";

import {
  Skeleton,
} from "@/components/admin/ui/skeleton";

import {
  Category,
} from "@/types/category.types";

import {
  SkeletonColumn,
} from "@/types/skeleton";


type GetColumnsProps = {
  page: number;
  limit: number;

  onEdit: (
    category: Category
  ) => void;

  onDelete: (
    category: Category
  ) => void;
};


export const getColumns = ({
  page,
  limit,
  onEdit,
  onDelete,
}: GetColumnsProps): ColumnDef<Category>[] => [
  {
    header: "ID",

    cell: ({
      row,
    }) => (
      (page - 1) *
        limit +
        row.index +
        1
    ),
  },

  {
    header: "Category Name",

    accessorKey: "name",
  },

  {
    id: "actions",

    header: () => (
      <div className="text-center">
        Actions
      </div>
    ),

    cell: ({
      row,
    }) => (
      <div className="flex justify-center gap-2">

        {/* EDIT */}
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


        {/* DELETE */}
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
    header: "Category ID",

    cell: (
      <Skeleton className="h-8 w-20" />
    ),
  },

  {
    header: "Category Name",

    cell: (
      <Skeleton className="h-8 w-40" />
    ),
  },

  {
    header: "Actions",

    cell: (
      <Skeleton className="h-8 w-24" />
    ),
  },

];