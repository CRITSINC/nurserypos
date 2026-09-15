"use client";

import { PenSquare, Trash2, Plus } from "lucide-react";

import { Button } from "@/components/admin/ui/button";
import { Card } from "@/components/admin/ui/card";
import { SheetTrigger } from "@/components/admin/ui/sheet";

import { RowSelectionProps } from "@/types/data-table";

type Props = RowSelectionProps & {
  onAdd: () => void;
};

export default function ProductActions({
  rowSelection,
  setRowSelection,
  onAdd,
}: Props) {
  return (
    <Card className="mb-5">
      <div className="flex flex-col xl:flex-row xl:justify-end gap-4">

          <div className="flex flex-col sm:flex-row gap-4">

          {/* <ProductBulkActionSheet
            action={(formData) =>
              editProducts(Object.keys(rowSelection), formData)
            }
            onSuccess={() => setRowSelection({})}
          >
            <SheetTrigger asChild> */}
              <Button
                variant="secondary"
                size="lg"
                type="button"
                // disabled={!Boolean(Object.keys(rowSelection).length)}
                className="sm:flex-grow xl:flex-grow-0 transition-opacity duration-300"
              >
                <PenSquare className="mr-2 size-4" /> Bulk Action
              </Button>
            {/* </SheetTrigger>
          </ProductBulkActionSheet> */}
            

            {/* <ProductFormSheet
              title="Add Product"
              description="Add necessary product information here"
              submitButtonText="Add Product"
              actionVerb="added"
              action={addProduct}
            > */}
              {/* <SheetTrigger asChild> */}
                <Button
                  variant="default"
                  size="lg"
                  className="sm:flex-grow xl:flex-grow-0"
                  onClick={onAdd}
                >
                  <Plus className="mr-2 size-4" /> Add Product
                </Button>
              {/* </SheetTrigger> */}
            {/* </ProductFormSheet> */}
        
          </div>
      
      </div>
    </Card>
  );
}
