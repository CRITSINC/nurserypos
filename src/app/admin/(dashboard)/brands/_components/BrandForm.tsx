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
  FormTextInput
} from "@/components/admin/shared/form";

import {
  brandFormSchema,
  BrandFormInput,
  BrandFormData,
} from "./schema";

import {
  useCreateBrandMutation,
  useUpdateBrandMutation,
} from "@/redux/services/brand";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;

  isEdit?: boolean;

  brandId?: number;

  initialData?: Partial<BrandFormData>;
};

export default function BrandForm({
  open,
  onOpenChange,
  isEdit = false,
  brandId,
  initialData,
}: Props) {
  const [createBrand, { isLoading: creating }] =
    useCreateBrandMutation();

  const [updateBrand, { isLoading: updating }] =
    useUpdateBrandMutation();

  const isSubmitting = creating || updating;

  const form = useForm<
    BrandFormInput,
    undefined,
    BrandFormData
  >({
    resolver: zodResolver(brandFormSchema),

    defaultValues: {
      name: "",
    },
  });

  useEffect(() => {
        if (!initialData) {
        form.reset({
            name: ""
        });

        return;
    }

    form.reset({
      name: initialData.name ?? ""
    });
    
  }, [form, initialData]);

  const onSubmit = async (
    values: BrandFormData
  ) => {
    try {
      const payload = {
        name: values.name
      };

      if (isEdit && brandId) {
        await updateBrand({
          id: brandId,
          body: payload,
        }).unwrap();

        toast.success("Brand updated successfully.");
      } else {
        await createBrand(payload).unwrap();

        toast.success("Brand created successfully.");
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
                      ? "Edit Brand"
                      : "Add Brand"}
                  </SheetTitle>

                  <SheetDescription>
                    {isEdit
                      ? "Update brand information."
                      : "Add a new brand."}
                  </SheetDescription>
                </div>
              </FormSheetHeader>

              <FormSheetBody>
                <div className="space-y-8">

                    <FormTextInput
                      control={form.control}
                      name="name"
                      label="Brand Name"
                      placeholder="Brand Name"
                    />

                </div>
              </FormSheetBody>

              <FormSheetFooter>
                <FormSubmitButton
                  isPending={isSubmitting}
                  className="w-full"
                >
                  {isEdit ? "Update Brand" : "Create Brand"}
                </FormSubmitButton>
              </FormSheetFooter>

            </FormSheetContent>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}