"use client";

import { PenSquare, Plus } from "lucide-react";

import { Button } from "@/components/admin/ui/button";
import { Card } from "@/components/admin/ui/card";

import { RowSelectionProps } from "@/types/data-table";

type Props = RowSelectionProps & {
  onAdd: () => void;
};

export default function CustomerActions({
  rowSelection,
  setRowSelection,
  onAdd,
}: Props) {
  return (
    <Card className="mb-5">
      <div className="flex flex-col xl:flex-row xl:justify-end gap-4">

          <div className="flex flex-col sm:flex-row gap-4">

              <Button
                variant="secondary"
                size="lg"
                type="button"
                className="sm:flex-grow xl:flex-grow-0 transition-opacity duration-300"
              >
                <PenSquare className="mr-2 size-4" /> Bulk Action
              </Button>
            
                <Button
                  variant="default"
                  size="lg"
                  className="sm:flex-grow xl:flex-grow-0"
                  onClick={onAdd}
                >
                  <Plus className="mr-2 size-4" /> Add Customer
                </Button>
        
          </div>
      
      </div>
    </Card>
  );
}
