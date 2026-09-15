"use client";

import { useRouter, useSearchParams } from "next/navigation";
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
import {
  ProductStatus,
} from "../page";


type Props = {
  status:
      ProductStatus,

  onStatusChange: (
    status: ProductStatus
  ) => void;

  onFilter: (
    status: ProductStatus
  ) => void;

  onReset: () => void;
};


export default function ProductFilter({
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


    const params =
      new URLSearchParams(
        searchParams.toString()
      );

    params.set(
      "page",
      "1"
    );

    const trimmedSearch =
      search.trim();


    if (
      trimmedSearch
    ) {

      params.set(
        "search",
        trimmedSearch
      );

    } else {

      params.delete(
        "search"
      );
    }

    if (
      status === "active"
    ) {

      params.set(
        "archived",
        "false"
      );

    } else if (
      status === "archived"
    ) {

      params.set(
        "archived",
        "true"
      );

    } else {
      params.delete(
        "archived"
      );
    }

    const queryString =
      params.toString();


    router.push(
      queryString
        ? `/admin/products?${queryString}`
        : "/admin/products"
    );

    onFilter(
      status
    );
  };

  const handleReset = () => {

    setSearch("");

    onReset();

    router.push(
      "/admin/products?page=1&archived=false"
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
        <Input
          type="search"
          placeholder="Search by Product"
          className="
            h-12
            lg:flex-1
          "
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

                <Select

          value={
            status
          }

          onValueChange={(
            value
          ) => {
            onStatusChange(
              value as ProductStatus
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

            <SelectValue />

          </SelectTrigger>


          <SelectContent>

            <SelectItem
              value="all"
            >
              All
            </SelectItem>


            <SelectItem
              value="active"
            >
              Active
            </SelectItem>


            <SelectItem
              value="archived"
            >
              Archived
            </SelectItem>

          </SelectContent>

        </Select>

        <div 
          className="
            flex
            w-full
            gap-4
            lg:w-auto
          ">
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