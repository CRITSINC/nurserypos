"use client";

import { ColumnDef } from "@tanstack/react-table";
import { PenSquare, Trash2 } from "lucide-react";

import { Button } from "@/components/admin/ui/button";
import Typography from "@/components/admin/ui/typography";

import { Skeleton } from "@/components/admin/ui/skeleton";
import { SkeletonColumn } from "@/types/skeleton";
import { Inventory } from "@/types/inventory.types";
import { Switch } from "@/components/admin/ui/switch";

export const getColumns = ({
  page,
  limit,
  onToggleArchived,
  onEdit,
}: {
  page: number;
  limit: number;
  onToggleArchived: (
    id: number,
    archived: boolean
  ) => void;
  onEdit: (inventory: Inventory) => void;
}): ColumnDef<Inventory>[] => [
  {
    header: "ID",
    cell: ({ row }) => (
      (page - 1) * limit + row.index + 1
    ),
  },
  {
    header: "Product",
    cell: ({ row }) => row.original.product.description || "—",
  },
  {
    header: "Available",
    cell: ({ row }) => row.original.qoh,
  },
  {
    header: "Reserved",
    cell: ({ row }) => row.original.reserved,
  },
  {
    header: "Avg. Cost",
    cell: ({ row }) => row.original.product.avg_cost,
  },
  {
    header: "Total Value",
    cell: ({ row }) => row.original.totalValue,
  },
  {
    header: "Total Sale Value",
    cell: ({ row }) => row.original.totalSaleValue,
  },
  {
    header: "Layaway",
    cell: ({ row }) => row.original.layaway,
  },
  {
    header: "Special Order",
    cell: ({ row }) => row.original.specialOrder,
  },
  {
    header: "Workorder",
    cell: ({ row }) => row.original.workorder,
  },   
  {
    header: "Reorder Level",
    cell: ({ row }) => row.original.reorderLevel,
  },
  {
    header: "Reorder Point",
    cell: ({ row }) => row.original.reorderPoint,
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
        onClick={() => onEdit(row.original)}
      >
        <PenSquare className="size-5" />
      </Button>

        {/* <Button
          variant="ghost"
          size="icon"
        >
          <Trash2 className="size-5" />
        </Button> */}

      </div>
    ),
  },
];


export const skeletonColumns: SkeletonColumn[] = [
  {
    header: "Inventory ID",
    cell: <Skeleton className="w-20 h-8" />,
  },
  {
    header: "Product Name",
    cell: <Skeleton className="w-40 h-8" />,
  },
  {
    header: "Available",
    cell: <Skeleton className="w-40 h-8" />,
  },
  {
    header: "Reserved",
    cell: <Skeleton className="w-40 h-8" />,
  },
  {
    header: "Avg. Cost",
    cell: <Skeleton className="w-40 h-8" />,
  },
  {
    header: "Total Value",
    cell: <Skeleton className="w-40 h-8" />,
  },
  {
    header: "Total Sale Value",
    cell: <Skeleton className="w-40 h-8" />,
  },
  {
    header: "Layaway",
    cell: <Skeleton className="w-40 h-8" />,
  }, 
  {
    header: "Special Order",
    cell: <Skeleton className="w-40 h-8" />,
  },  
  {
    header: "Workorder",
    cell: <Skeleton className="w-40 h-8" />,
  },  
  {
    header: "Reorder Level",
    cell: <Skeleton className="w-40 h-8" />,
  },  
  {
    header: "Reorder Point",
    cell: <Skeleton className="w-40 h-8" />,
  },   
  {
    header: "Actions",
    cell: <Skeleton className="w-24 h-8" />,
  },
];