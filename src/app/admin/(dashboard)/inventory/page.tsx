'use client';

import { useState } from "react";
import PageTitle from "@/components/admin/shared/PageTitle";
import InventoriesTable from "./_components/InventoriesTable";
import InventoryFilter from "./_components/InventoryFilter";
import { Button } from "@/components/admin/ui/button";
import { Plus, SquarePen } from "lucide-react";
import InventoryForm from "./_components/InventoryForm";

export default function InventoriesPage() {
  const [open, setOpen] = useState(false);
  const [selectedInventory, setSelectedInventory] = useState<any>(null);

  const handleEdit = (inventory: any) => {
    setSelectedInventory(inventory);
    setOpen(true);
  };

  const handleClose = (value: boolean) => {
    setOpen(value);

    if (!value) {
      setSelectedInventory(null);
    }
  };
  return (
    <section>
      <PageTitle>Inventory</PageTitle>
      {/* <div className="mb-6 flex items-center justify-end gap-3">
        <Button variant="outline">
          <SquarePen className="mr-2 h-4 w-4" />
          Bulk Upload
        </Button>

        <Button onClick={() => setOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Inventory
        </Button>
      </div> */}
      <InventoryFilter />
      <InventoriesTable onEdit={handleEdit}/>
      <InventoryForm
        open={open}
        onOpenChange={handleClose}
        isEdit={!!selectedInventory}
        id={selectedInventory?.id}
        initialData={selectedInventory}
      />
    </section>
  );
}