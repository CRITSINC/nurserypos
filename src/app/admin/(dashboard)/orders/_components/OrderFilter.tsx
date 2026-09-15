"use client";

import {
  useRouter,
  useSearchParams,
} from "next/navigation";

import { useState } from "react";

import { Card } from "@/components/admin/ui/card";

import { Input } from "@/components/admin/ui/input";

import { Button } from "@/components/admin/ui/button";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/admin/ui/select";

import { OrderStatus } from "../page";

type Props = {
  status: OrderStatus;

  onStatusChange: (
    status: OrderStatus
  ) => void;

  onFilter: (
    status: OrderStatus
  ) => void;

  onReset: () => void;
};

export default function OrderFilter({
  status,
  onStatusChange,
  onFilter,
  onReset,
}: Props) {
  const router = useRouter();

  const searchParams = useSearchParams();

  const [search, setSearch] = useState(
    searchParams.get("search") || ""
  );

  const handleFilter = (
    event: React.FormEvent
  ) => {
    event.preventDefault();

    const params = new URLSearchParams(
      searchParams.toString()
    );

    // Always start from page 1 when applying a filter.
    params.set("page", "1");

    const trimmedSearch = search.trim();

    // Search
    if (trimmedSearch) {
      params.set(
        "search",
        trimmedSearch
      );
    } else {
      params.delete("search");
    }

    // Order status
    if (status === "all") {
      params.delete("status");
    } else {
      params.set(
        "status",
        status
      );
    }

    const queryString =
      params.toString();

    router.push(
      queryString
        ? `/admin/orders?${queryString}`
        : "/admin/orders"
    );

    onFilter(status);
  };

  const handleReset = () => {
    setSearch("");

    onReset();

    router.push(
      "/admin/orders?page=1"
    );
  };

  return (
    <Card className="mb-5">
      <form
        onSubmit={handleFilter}
        className="
          flex
          flex-col
          gap-4
          lg:flex-row
          lg:items-center
        "
      >
        {/* Search */}
        <Input
          type="search"
          placeholder="Search by Order"
          className="
            h-12
            lg:flex-1
          "
          value={search}
          onChange={(event) =>
            setSearch(
              event.target.value
            )
          }
        />

        {/* Status */}
        <Select
          value={status}
          onValueChange={(value) => {
            onStatusChange(
              value as OrderStatus
            );
          }}
        >
          <SelectTrigger
            className="
              h-12
              w-full
              lg:w-[220px]
            "
          >
            <SelectValue placeholder="Order Status" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="all">
              All
            </SelectItem>
            
            <SelectItem value="shipped">
              Shipped
            </SelectItem>

            <SelectItem value="completed">
              Completed
            </SelectItem>

            <SelectItem value="cancelled">
              Cancelled
            </SelectItem>
          </SelectContent>
        </Select>

        {/* Actions */}
        <div
          className="
            flex
            w-full
            gap-4
            lg:w-auto
          "
        >
          <Button
            type="submit"
            size="lg"
            className="
              flex-1
              lg:w-[120px]
              lg:flex-none
            "
          >
            Filter
          </Button>

          <Button
            type="button"
            size="lg"
            variant="secondary"
            className="
              flex-1
              lg:w-[120px]
              lg:flex-none
            "
            onClick={handleReset}
          >
            Reset
          </Button>
        </div>
      </form>
    </Card>
  );
}