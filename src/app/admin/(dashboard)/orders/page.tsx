"use client";

import { useState } from "react";

import PageTitle from "@/components/admin/shared/PageTitle";

import OrdersTable from "./_components/OrdersTable";
import OrderFilter from "./_components/OrderFilter";
import OrderForm from "./_components/OrderForm";

import { Order } from "@/types/order.types";

export type OrderStatus =
  | "all"
  | "pending_payment"
  | "authorized"
  | "paid"
  | "synced"
  | "completed"
  | "cancelled"
  | "shipped"
  | "sync_failed"
  | "manual_fulfillment_alert";

export default function OrdersPage() {
  const [status, setStatus] =
    useState<OrderStatus>("all");

  const [appliedStatus, setAppliedStatus] =
    useState<OrderStatus>("all");

  const [open, setOpen] =
    useState(false);

  const [selectedOrder, setSelectedOrder] =
    useState<Order | null>(null);

  const handleAdd = () => {
    setSelectedOrder(null);
    setOpen(true);
  };

  const handleEdit = (order: Order) => {
    setSelectedOrder(order);
    setOpen(true);
  };

  const handleClose = (value: boolean) => {
    setOpen(value);

    if (!value) {
      setSelectedOrder(null);
    }
  };

  const handleApplyFilter = (
    selectedStatus: OrderStatus
  ) => {
    setAppliedStatus(selectedStatus);
  };

  const handleResetFilter = () => {
    setStatus("all");
    setAppliedStatus("all");
  };

  return (
    <section>
      <PageTitle>
        Orders
      </PageTitle>

      <OrderFilter
        status={status}
        onStatusChange={setStatus}
        onFilter={handleApplyFilter}
        onReset={handleResetFilter}
      />

      <OrdersTable
        status={appliedStatus}
        onEdit={handleEdit}
      />

      <OrderForm
        open={open}
        onOpenChange={handleClose}
        isEdit={!!selectedOrder}
        orderId={selectedOrder?.id}
        initialData={selectedOrder ?? undefined}
      />
    </section>
  );
}