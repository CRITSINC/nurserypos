'use client';

import PageTitle from "@/components/admin/shared/PageTitle";
import BrandsTable from "./_components/BrandsTable";
import BrandFilter from "./_components/BrandFilter";
import BrandForm from "./_components/BrandForm";
import { Button } from "@/components/admin/ui/button";
import { Plus, SquarePen } from "lucide-react";
import { useState } from "react";
import { Brand } from "@/types/brand.types";

export default function BrandsPage() {
  const [open, setOpen] =
    useState(false);

  const [selectedBrand, setSelectedBrand] =
    useState<Brand | null>(null);

    const handleAdd = () => {
      setSelectedBrand(null);
      setOpen(true);
    };
  
    const handleEdit = (
      category: Brand
    ) => {
      setSelectedBrand(category);
      setOpen(true);
    };
  
    const handleClose = (
      value: boolean
    ) => {
      setOpen(value);
  
      if (!value) {
        setSelectedBrand(null);
      }
    };  

  return (
    <section>
      <PageTitle>Brands</PageTitle>
      <div className="mb-6 flex items-center justify-end gap-3">
        {/* <Button variant="outline">
          <SquarePen className="mr-2 h-4 w-4" />
          Bulk Upload
        </Button> */}

        <Button onClick={handleAdd}>
          <Plus className="mr-2 h-4 w-4" />
          Add Brand
        </Button>
      </div>
      <BrandFilter />
      <BrandsTable 
        onEdit={handleEdit}/>
      <BrandForm
        open={open}
        onOpenChange={handleClose}
        isEdit={!!selectedBrand}
        brandId={
          selectedBrand?.id
        }
        initialData={
          selectedBrand ?? undefined
        }
      />
    </section>
  );
}