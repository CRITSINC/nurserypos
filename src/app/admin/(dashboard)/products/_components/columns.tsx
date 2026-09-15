"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ZoomIn, PenSquare, Trash2 } from "lucide-react";

import { Button } from "@/components/admin/ui/button";
import Typography from "@/components/admin/ui/typography";

import { Product } from "@/types/product.types";
import { Skeleton } from "@/components/admin/ui/skeleton";
import { SkeletonColumn } from "@/types/skeleton";
import { Switch } from "@/components/admin/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/admin/ui/avatar";
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
    product: Product
  ) => void;

  onDelete: (
    product: Product
  ) => void;
}): ColumnDef<Product>[] => [
  {
    header: "ID",
    cell: ({ row }) => (page - 1) * limit + row.index + 1,
  },
  
  {
    header: "Item",
    accessorKey: "description",
    cell: ({ row }) => {
      const image = row.original.images?.[0];

      return (
        <div className="flex items-center gap-3">
          <Avatar className="h-11 w-11 border">
            <AvatarImage
              src={image?.local_path ? image?.local_path : image?.lightspeed_url ? image?.lightspeed_url : "/assets/not-available.png"}
              alt={row.original.description ?? "Product"}
              className="object-cover"
            />
          </Avatar>

          <Typography className="font-medium truncate">
            {row.original.description}
          </Typography>
        </div>
      );
    }
  },

  {
    header: "Qty",
    accessorKey: "qoh",
  },
  
  {
    header: "Price",
    cell: ({ row }) => `$${row.original.price.toFixed(2)}`,
  },

  {
    header: "Category",
    cell: ({ row }) => row.original.category?.full_path_name || "—",
  },

  {
    header: "UPC",
    cell: ({ row }) => row.original.upc || "—",
  },  

  {
    header: "Custom SKU",
    cell: ({ row }) =>
      row.original.custom_sku || "-",
  },

  {
    header: "MCR SKU",
    accessorKey: "manufacturerSKU",
    cell: ({ row }) => row.original.manufacturer_sku || "—",
  },

  {
    header: "Published",
    cell: ({ row }) =>
      row.original.publish_to_ecom ? "Yes" : "No",
  },
  {
    header: "view",
    cell: ({ row }) => (
      <Button size="icon" asChild variant="ghost" className="text-foreground">
        <Link href={`/admin/products/${row.original.id}`}>
          <ZoomIn className="size-5" />
        </Link>
      </Button>
    ),
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
    header: "ID",
    cell: <Skeleton className="w-12 h-8" />,
  },
  {
    header: "Item",
    cell: <Skeleton className="w-60 h-8" />,
  },
  {
    header: "Qty",
    cell: <Skeleton className="w-12 h-8" />,
  },
  {
    header: "Price",
    cell: <Skeleton className="w-20 h-8" />,
  },
  {
    header: "Category",
    cell: <Skeleton className="w-20 h-8" />,
  },
  {
    header: "UPC",
    cell: <Skeleton className="w-32 h-8" />,
  },
  {
    header: "Custom SKU",
    cell: <Skeleton className="w-32 h-8" />,
  },
  {
    header: "MCR SKU",
    cell: <Skeleton className="w-32 h-8" />,
  },
  {
    header: "Published",
    cell: <Skeleton className="w-16 h-8" />,
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
    cell: <Skeleton className="w-12 h-8" />,
  },
  {
    header: "Actions",
    cell: <Skeleton className="w-24 h-8" />,
  },
];