"use client";

import { useState } from "react";

import PageTitle from "@/components/admin/shared/PageTitle";

import CategoriesTable from "./_components/CategoriesTable";
import CategoryFilter from "./_components/CategoryFilter";
import CategoryForm from "./_components/CategoryForm";

import { Button } from "@/components/admin/ui/button";

import {
  Plus,
  SquarePen,
} from "lucide-react";

import { Category } from "@/types/category.types";
import BulkUpload from "./_components/BulkUpload";

export default function CategoriesPage() {
  const [open, setOpen] =
    useState(false);

  const [bulkOpen, setBulkOpen] = useState(false);

  const [selectedCategory, setSelectedCategory] =
    useState<Category | null>(null);

  const handleAdd = () => {
    setSelectedCategory(null);
    setOpen(true);
  };

  const handleEdit = (
    category: Category
  ) => {
    setSelectedCategory(category);
    setOpen(true);
  };

  const handleClose = (
    value: boolean
  ) => {
    setOpen(value);

    if (!value) {
      setSelectedCategory(null);
    }
  };

  const handleBulkAdd =  () => {
    setBulkOpen(true);
  }

  return (
    <section>

      <PageTitle>
        Categories
      </PageTitle>

      <div className="mb-6 flex items-center justify-end gap-3">

        {/* <Button variant="outline" onClick={handleBulkAdd}>
          <SquarePen className="mr-2 h-4 w-4" />
          Bulk Upload
        </Button> */}

        <Button onClick={handleAdd}>
          <Plus className="mr-2 h-4 w-4" />
          Add Category
        </Button>

      </div>

      <CategoryFilter />

      <CategoriesTable
        onEdit={handleEdit}
      />

      <CategoryForm
        open={open}
        onOpenChange={handleClose}
        isEdit={!!selectedCategory}
        categoryId={
          selectedCategory?.id
        }
        initialData={
          selectedCategory ?? undefined
        }
      />

      <BulkUpload 
       open={bulkOpen}
       onOpenChange={setBulkOpen}/>

    </section>
  );
}