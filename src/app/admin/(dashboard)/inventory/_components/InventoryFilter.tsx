"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Card } from "@/components/admin/ui/card";
import { Input } from "@/components/admin/ui/input";
import { Button } from "@/components/admin/ui/button";

export default function InventoryFilter() {

  const router = useRouter();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(
    searchParams.get("search") || ""
  );

  const handleFilter = () => {
    const params = new URLSearchParams(searchParams);

    params.set("page", "1");

    if (search) {
      params.set("search", search);
    } else {
      params.delete("search");
    }

    router.push(`?${params.toString()}`);
  };

  const handleReset = () => {
    setSearch("");
    router.push("/admin/inventory");
  };

  return (
    <Card className="mb-5">
      <form
        onSubmit={handleFilter}
        className="flex flex-col md:flex-row gap-4 lg:gap-6"
      >
        <Input
          type="search"
          placeholder="Search by Inventory"
          className="h-12 md:basis-1/2"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="flex flex-wrap sm:flex-nowrap gap-4 md:basis-1/2">
          <Button type="button" onClick={handleFilter} size="lg" className="flex-grow">
            Filter
          </Button>
          <Button
            type="button"
            size="lg"
            variant="secondary"
            className="flex-grow"
            onClick={handleReset}
          >
            Reset
          </Button>
        </div>
      </form>
    </Card>
  );
}