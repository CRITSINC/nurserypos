"use client";

import { ColumnDef } from "@tanstack/react-table";
import { PenSquare, Trash2 } from "lucide-react";

import { Button } from "@/components/admin/ui/button";
import { Order } from "@/types/order.types";
import { Skeleton } from "@/components/admin/ui/skeleton";
import { SkeletonColumn } from "@/types/skeleton";

export const getColumns = ({
  page,
  limit,
  onEdit,
}: {
  page: number;
  limit: number;
  onEdit: (order: Order) => void;
}): ColumnDef<Order>[] => [
  {
    header: "ID",
    cell: ({ row }) =>
      (page - 1) * limit + row.index + 1,
  },
  {
    header: "Ticket Number",
    cell: ({ row }) => row.original.ticket_number || '-'
  },
  {
    header: "Order UUID",
    cell: ({ row }) => (
      <span
        className="font-medium"
        title={row.original.order_uuid}
      >
        {row.original.order_uuid}
      </span>
    ),
  },

  {
    header: "User",
    cell: ({ row }) => {
      const fullname = row.original.billing_address;

      if (!fullname) {
        return "—";
      }


      return (
        <span
          className="max-w-[250px] truncate block"
          title={fullname.firstName+' '+fullname.lastName}
        >
          {fullname.firstName+' '+fullname.lastName || "—"}
        </span>
      );
    }
  },

  {
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;

      return (
        <span className="capitalize">
          {status || "—"}
        </span>
      );
    },
  },

  {
    header: "Subtotal",
    cell: ({ row }) =>
      row.original.subtotal_amount
        ? `$${row.original.subtotal_amount}`
        : "$0.00",
  },

  {
    header: "Tax",
    cell: ({ row }) =>
      row.original.tax_amount
        ? `$${row.original.tax_amount}`
        : "$0.00",
  },

  {
    header: "Shipping",
    cell: ({ row }) =>
      row.original.shipping_amount
        ? `$${row.original.shipping_amount}`
        : "$0.00",
  },

  {
    header: "Total",
    cell: ({ row }) => (
      <span className="font-medium">
        {row.original.total_amount
          ? `$${row.original.total_amount}`
          : "$0.00"}
      </span>
    ),
  },

  {
    header: "Payment Intent",
    cell: ({ row }) => (
      <span
        className="max-w-[180px] truncate block"
        title={
          row.original.stripe_payment_intent ??
          undefined
        }
      >
        {row.original.stripe_payment_intent || "—"}
      </span>
    ),
  },

  // {
  //   header: "Lightspeed Sale ID",
  //   cell: ({ row }) =>
  //     row.original.lightspeed_sale_id || "—",
  // },

  {
    header: "Shipping Address",
    cell: ({ row }) => {
      const address = row.original.shipping_address;

      if (!address) {
        return "—";
      }

      const parts = [
        address.address1,
        address.city,
        address.state,
        address.zip,
        address.country,
      ].filter(Boolean);

      return (
        <span
          className="max-w-[250px] truncate block"
          title={parts.join(", ")}
        >
          {parts.join(", ") || "—"}
        </span>
      );
    },
  },

  {
    header: "Billing Address",
    cell: ({ row }) => {
      const address = row.original.billing_address;

      if (!address) {
        return "—";
      }

      const parts = [
        address.address1,
        address.city,
        address.state,
        address.zip,
        address.country,
      ].filter(Boolean);

      return (
        <span
          className="max-w-[250px] truncate block"
          title={parts.join(", ")}
        >
          {parts.join(", ") || "—"}
        </span>
      );
    },
  },

  {
    header: "Carrier",
    cell: ({ row }) =>
      row.original.carrier || "—",
  },

  {
    header: "Tracking Number",
    cell: ({ row }) =>
      row.original.tracking_number || "—",
  },

  {
    header: "Shipped At",
    cell: ({ row }) =>
      row.original.shipped_at
        ? new Date(
            row.original.shipped_at
          ).toLocaleString()
        : "—",
  },

  {
    header: "Created At",
    cell: ({ row }) =>
      row.original.createdAt
        ? new Date(
            row.original.createdAt
          ).toLocaleString()
        : "—",
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
            onEdit(row.original)
          }
        >
          <PenSquare className="size-5" />
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
    header: "Ticket Number",
    cell: <Skeleton className="w-24 h-8" />,
  },
  {
    header: "Order UUID",
    cell: <Skeleton className="w-48 h-8" />,
  },
  {
    header: "User ID",
    cell: <Skeleton className="w-20 h-8" />,
  },
  {
    header: "Status",
    cell: <Skeleton className="w-24 h-8" />,
  },
  {
    header: "Subtotal",
    cell: <Skeleton className="w-24 h-8" />,
  },
  {
    header: "Tax",
    cell: <Skeleton className="w-20 h-8" />,
  },
  {
    header: "Shipping",
    cell: <Skeleton className="w-24 h-8" />,
  },
  {
    header: "Total",
    cell: <Skeleton className="w-24 h-8" />,
  },
  {
    header: "Payment Intent",
    cell: <Skeleton className="w-44 h-8" />,
  },
  // {
  //   header: "Lightspeed Sale ID",
  //   cell: <Skeleton className="w-32 h-8" />,
  // },
  {
    header: "Shipping Address",
    cell: <Skeleton className="w-56 h-8" />,
  },
  {
    header: "Billing Address",
    cell: <Skeleton className="w-56 h-8" />,
  },
  {
    header: "Carrier",
    cell: <Skeleton className="w-24 h-8" />,
  },
  {
    header: "Tracking Number",
    cell: <Skeleton className="w-36 h-8" />,
  },
  {
    header: "Shipped At",
    cell: <Skeleton className="w-40 h-8" />,
  },
  {
    header: "Created At",
    cell: <Skeleton className="w-40 h-8" />,
  },
  {
    header: "Actions",
    cell: <Skeleton className="w-24 h-8" />,
  },
];