"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
} from "@/components/admin/ui/sheet";

import { Form } from "@/components/admin/ui/form";

import {
  FormSheetBody,
  FormSheetContent,
  FormSheetFooter,
  FormSheetHeader,
} from "@/components/admin/shared/form/FormSheet";

import { FormSubmitButton } from "@/components/admin/shared/form/FormSubmitButton";

import {
  FormSwitch,
  FormTextInput
} from "@/components/admin/shared/form";

import {
  inventoryFormSchema,
  InventoryFormInput,
  InventoryFormData,
} from "./schema";

import {
  useUpdateInventoryMutation,
} from "@/redux/services/inventory";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;

  isEdit?: boolean;

  id?: number;

  initialData?: Partial<InventoryFormData>;
};

export default function InventoryForm({
  open,
  onOpenChange,
  isEdit = false,
  id,
  initialData,
}: Props) {
  const [updateInventory, { isLoading: updating }] =
    useUpdateInventoryMutation();

  const isSubmitting = updating;

  const form = useForm<
    InventoryFormInput,
    undefined,
    InventoryFormData
  >({
    resolver: zodResolver(inventoryFormSchema),

    defaultValues: {
      reorder_point: "",
      reorder_level: "",
      ...initialData,
    },
  });

useEffect(() => {
  if (initialData) {
    form.reset({
      reorder_point: initialData.reorder_point ?? "",
      reorder_level: initialData.reorder_level ?? "",
    });
  } else {
    form.reset({
      reorder_point: "",
      reorder_level: "",
    });
  }
}, [initialData, form]);

  const onSubmit = async (
    values: InventoryFormData
  ) => {
    try {
      const payload = {
        reorder_point: values.reorder_point,
        reorder_level: values.reorder_level
      };

      if (isEdit && id) {
        await updateInventory({
          id: id,
          body: payload,
        }).unwrap();

        toast.success("Inventory updated successfully.");
      }
      form.reset();

      onOpenChange(false);
    } catch (error: any) {
      toast.error(
        error?.data?.message ??
          "Something went wrong."
      );
    }
  };

  return (
    <Sheet
      open={open}
      onOpenChange={onOpenChange}
    >
      <SheetContent className="sm:max-w-5xl p-0">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="h-full"
          >
            <FormSheetContent>
              <FormSheetHeader>
                <div>
                  <SheetTitle>
                    {isEdit
                      ? "Edit Inventory"
                      : "Add Inventory"}
                  </SheetTitle>

                  <SheetDescription>
                    {isEdit
                      ? "Update inventory information."
                      : "Add a new inventory."}
                  </SheetDescription>
                </div>
              </FormSheetHeader>

              <FormSheetBody>
                <div className="space-y-8">

                    <FormTextInput
                      control={form.control}
                      name="reorder_point"
                      label="Reorder Point"
                      placeholder="Reorder Point"
                    />

                    <FormTextInput
                      control={form.control}
                      name="reorder_level"
                      label="Reorder Level"
                      placeholder="Reorder Level"
                    />

                </div>
              </FormSheetBody>

              <FormSheetFooter>
                <FormSubmitButton
                  isPending={isSubmitting}
                  className="w-full"
                >
                  {isEdit ? "Update Inventory" : "Create Inventory"}
                </FormSubmitButton>
              </FormSheetFooter>

            </FormSheetContent>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}