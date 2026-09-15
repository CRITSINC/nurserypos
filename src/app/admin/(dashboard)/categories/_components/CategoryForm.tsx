"use client";

import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Plus } from "lucide-react";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
} from "@/components/admin/ui/sheet";

import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/admin/ui/form";

import { Input } from "@/components/admin/ui/input";

import {
  FormSheetBody,
  FormSheetContent,
  FormSheetFooter,
  FormSheetHeader,
} from "@/components/admin/shared/form/FormSheet";

import { FormSubmitButton } from "@/components/admin/shared/form/FormSubmitButton";

import { Button } from "@/components/admin/ui/button";

import {
  categoryFormSchema,
  CategoryFormInput,
  CategoryFormData,
} from "./schema";

import {
  useGetCategoryQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
} from "@/redux/services/category";

import { Category } from "@/types/category.types";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isEdit?: boolean;
  categoryId?: number;
  initialData?: Category;
};

export default function CategoryForm({
  open,
  onOpenChange,
  isEdit = false,
  categoryId,
  initialData,
}: Props) {
  const [
    createCategory,
    { isLoading: creating },
  ] = useCreateCategoryMutation();

  const [
    updateCategory,
    { isLoading: updating },
  ] = useUpdateCategoryMutation();

  const {
    data,
    isLoading,
    isError,
  } = useGetCategoryQuery(Number(categoryId), {
    skip: !categoryId,
  });

  const category = data?.data;

  const [
    newSubcategory,
    setNewSubcategory,
  ] = useState("");

  const isSubmitting = creating || updating;

  const form = useForm<
    CategoryFormInput,
    undefined,
    CategoryFormData
  >({
    resolver: zodResolver(categoryFormSchema),

    defaultValues: {
      name: "",
    },
  });

  const categoryName = useWatch({
    control: form.control,
    name: "name",
  });

  const isCategoryNameChanged =
    isEdit &&
    categoryName?.trim() !==
      (initialData?.name ?? "").trim();

  useEffect(() => {
    if (!open) {
      return;
    }

    form.reset({
      name: initialData?.name ?? "",
    });

    setNewSubcategory("");
  }, [
    open,
    initialData,
    form,
  ]);

  const onSubmit = async (
    values: CategoryFormData
  ) => {
    try {
      const categoryName =
        values.name.trim();

      const payload: {
        name: string;
        parent_id?: number;
        full_path_name?: string;
      } = {
        name: categoryName,
      };

      if (initialData?.parent) {
        payload.parent_id =
          initialData.parent.id;

        payload.full_path_name =
          `${initialData.parent.name} / ${categoryName}`;
      }

      if (
        isEdit &&
        categoryId
      ) {
        await updateCategory({
          id: categoryId,
          body: payload,
        }).unwrap();

        toast.success(
          "Category updated successfully."
        );
      }

      else {
        await createCategory(
          payload
        ).unwrap();

        toast.success(
          "Category created successfully."
        );
      }

      form.reset();

      onOpenChange(false);
    } catch (error: any) {
      toast.error(
        error?.data?.message ??
          error?.data?.error?.message ??
          "Something went wrong."
      );
    }
  };

  const handleAddSubcategory = async () => {
    const name =
      newSubcategory.trim();

    if (!name) {
      return;
    }

    if (!categoryId) {
      toast.error(
        "Unable to determine parent category."
      );
      return;
    }

    const parentName =
      category?.name ||
      initialData?.name;

    if (!parentName) {
      toast.error(
        "Unable to determine parent category."
      );
      return;
    }

    const payload = {
      name,
      parent_id: categoryId,
      full_path_name:
        `${parentName} / ${name}`,
    };

    try {
      await createCategory(
        payload
      ).unwrap();

      toast.success(
        "Subcategory added successfully."
      );

      setNewSubcategory("");
    } catch (error: any) {
      toast.error(
        error?.data?.message ??
          error?.data?.error?.message ??
          "Unable to add subcategory."
      );
    }
  };

  const parentValue =
    initialData?.parent
      ? (
          initialData.fullPathName ||
          initialData.full_path_name ||
          "None"
        )
      : "None";

  return (
    <Sheet
      open={open}
      onOpenChange={onOpenChange}
    >
      <SheetContent
        className="
          sm:max-w-4xl
          p-0
        "
      >
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(
              onSubmit
            )}
            className="h-full"
          >
            <FormSheetContent>

              <FormSheetHeader>
                <div>
                  <SheetTitle>
                    {isEdit
                      ? "Edit Category"
                      : "Add Category"}
                  </SheetTitle>

                  <SheetDescription>
                    {isEdit
                      ? "Update category information."
                      : "Add a new category."}
                  </SheetDescription>
                </div>
              </FormSheetHeader>

              <FormSheetBody>
                <div className="space-y-6">

                  <FormField
                    control={form.control}
                    name="name"
                    render={({
                      field,
                    }) => (
                      <FormItem>
                        <div
                          className="
                            grid
                            grid-cols-[160px_minmax(0,1fr)]
                            items-center
                            gap-x-4
                          "
                        >
                          <div className="text-sm">
                            Category Name
                          </div>

                          <FormControl>
                            <Input
                              {...field}
                              placeholder="Category Name"
                              className="h-10"
                            />
                          </FormControl>
                        </div>

                        <FormMessage
                          className="
                            ml-[176px]
                          "
                        />
                      </FormItem>
                    )}
                  />

                  {isEdit && (
                    <div
                      className="
                        grid
                        grid-cols-[160px_minmax(0,1fr)]
                        items-center
                        gap-x-4
                      "
                    >
                      <div className="text-sm">
                        Parent
                      </div>

                      <div
                        className="
                          text-sm
                          text-primary
                        "
                      >
                        {parentValue}
                      </div>
                    </div>
                  )}

                  {isEdit && (
                    <div className="space-y-0">

                      <div
                        className="
                          border
                          border-b-0
                          bg-muted
                          px-2
                          py-2
                        "
                      >
                        <span className="text-sm font-semibold">
                          Add Subcategory
                        </span>
                      </div>

                      <div
                        className="
                          grid
                          grid-cols-[160px_minmax(0,1fr)_300px]
                          border
                        "
                      >
                        <div
                          className="
                            flex
                            items-center
                            border-r
                            px-2
                            text-sm
                          "
                        >
                          Name
                        </div>

                        <div
                          className="
                            flex
                            items-center
                            border-r
                            px-2
                          "
                        >
                          <Input
                            value={
                              newSubcategory
                            }
                            onChange={(
                              event
                            ) =>
                              setNewSubcategory(
                                event.target
                                  .value
                              )
                            }
                            placeholder="Name"
                            className="
                              h-8
                              border-0
                              px-1
                              shadow-none
                              focus-visible:ring-0
                            "
                          />
                        </div>

                        <div className="p-1">
                          <Button
                            type="button"
                            onClick={
                              handleAddSubcategory
                            }
                            disabled={
                              !newSubcategory.trim() ||
                              creating
                            }
                            className="
                              h-8
                              w-full
                            "
                          >
                            <Plus
                              className="
                                mr-1
                                h-4
                                w-4
                              "
                            />

                            {creating
                              ? "Adding..."
                              : "Add Subcategory"}
                          </Button>
                        </div>
                      </div>

                    </div>
                  )}

                  {isEdit && (
                    <div className="space-y-2">

                      <h3
                        className="
                          text-base
                          font-semibold
                        "
                      >
                        Subcategories
                      </h3>

                      <div
                        className="
                          overflow-hidden
                          border
                        "
                      >

                        <div
                          className="
                            border-b
                            bg-muted/20
                            px-4
                            py-2
                            text-sm
                          "
                        >
                          NAME
                        </div>

                        {category?.children
                          ?.length ? (

                          category.children.map(
                            (child) => (
                              <div
                                key={child.id}
                                className="
                                  border-b
                                  px-10
                                  py-2
                                  text-sm
                                  last:border-b-0
                                "
                              >
                                <span
                                  className="
                                    mr-1
                                    text-primary
                                  "
                                >
                                  →
                                </span>

                                <span
                                  className="
                                    text-primary
                                  "
                                >
                                  {child.name}
                                </span>
                              </div>
                            )
                          )

                        ) : (
                          <div
                            className="
                              px-4
                              py-6
                              text-center
                              text-sm
                              text-muted-foreground
                            "
                          >
                            No subcategories found.
                          </div>
                        )}

                      </div>
                    </div>
                  )}

                </div>
              </FormSheetBody>

              <FormSheetFooter>
                <FormSubmitButton
                  isPending={isSubmitting}
                  disabled={
                    isEdit &&
                    !isCategoryNameChanged
                  }
                  className="w-full"
                >
                  {isEdit
                    ? "Update Category"
                    : "Create Category"}
                </FormSubmitButton>
              </FormSheetFooter>

            </FormSheetContent>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}