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
  tagFormSchema,
  TagFormInput,
  TagFormData,
} from "./schema";

import {
  useCreateTagMutation,
  useUpdateTagMutation,
} from "@/redux/services/tag";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;

  isEdit?: boolean;

  tagId?: number;

  initialData?: Partial<TagFormData>;
};

export default function TagForm({
  open,
  onOpenChange,
  isEdit = false,
  tagId,
  initialData,
}: Props) {
  const [createTag, { isLoading: creating }] =
    useCreateTagMutation();

  const [updateTag, { isLoading: updating }] =
    useUpdateTagMutation();

  const isSubmitting = creating || updating;

  const form = useForm<
    TagFormInput,
    undefined,
    TagFormData
  >({
    resolver: zodResolver(tagFormSchema),

    defaultValues: {
      name: ""
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
    values: TagFormData
  ) => {
    try {
      const payload = {
        name: values.name
      };

      if (isEdit && tagId) {
        await updateTag({
          id: tagId,
          body: payload,
        }).unwrap();

        toast.success("Tag updated successfully.");
      } else {
        await createTag(payload).unwrap();

        toast.success("Tag created successfully.");
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
                      ? "Edit Tag"
                      : "Add Tag"}
                  </SheetTitle>

                  <SheetDescription>
                    {isEdit
                      ? "Update tag information."
                      : "Add a new tag."}
                  </SheetDescription>
                </div>
              </FormSheetHeader>

              <FormSheetBody>
                <div className="space-y-8">

                    <FormTextInput
                      control={form.control}
                      name="name"
                      label="Tag Name"
                      placeholder="Tag Name"
                    />

                </div>
              </FormSheetBody>

              <FormSheetFooter>
                <FormSubmitButton
                  isPending={isSubmitting}
                  className="w-full"
                >
                  {isEdit ? "Update Tag" : "Create Tag"}
                </FormSubmitButton>
              </FormSheetFooter>

            </FormSheetContent>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}