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

import { ImageDropzone } from "@/components/admin/shared/ImageDropzone";

import {
  FormTextInput,
  FormTextarea,
  FormSwitch,
  FormColorInput,
} from "@/components/admin/shared/form";

import {
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/admin/ui/form";

import {
  bannerFormSchema,
  BannerFormData,
} from "./schema";

import {
  useCreateBannerMutation,
  useUpdateBannerMutation,
} from "@/redux/services/banner";


type Props = {
  open: boolean;

  onOpenChange: (
    open: boolean
  ) => void;

  isEdit?: boolean;

  bannerId?: number;

  initialData?: Partial<BannerFormData>;

  imageUrl?: string;
};


export default function BannerForm({
  open,
  onOpenChange,
  isEdit = false,
  bannerId,
  initialData,
  imageUrl,
}: Props) {

  const [
    createBanner,
    {
      isLoading: creating,
    },
  ] = useCreateBannerMutation();


  const [
    updateBanner,
    {
      isLoading: updating,
    },
  ] = useUpdateBannerMutation();


  const isSubmitting =
    creating || updating;


  const form =
    useForm<BannerFormData>({
      resolver:
        zodResolver(
          bannerFormSchema
        ),

      defaultValues: {
        title: "",
        description: "",
        color: "#ffffff",
        link_url: "",

        button_text: "",
        button_color: "",
        button_text_color: "",

        is_active: true,
        sort_order: 1,
        file: undefined,

        ...initialData,
      },
    });

  useEffect(() => {
    // ADD MODE
    if (!initialData) {
      form.reset({
        title: "",
        description: "",
        color: "#ffffff",
        link_url: "",
        button_text: "",
        button_color: "",
        button_text_color: "",
        is_active: true,
        sort_order: 1,
        file: undefined,
      });

      return;
    }

    // EDIT MODE
    form.reset({
      title: initialData.title ?? "",
      description: initialData.description ?? "",

      color: normalizeColor(
        initialData.color,
        "#ffffff"
      ),

      link_url:
        initialData.link_url ?? "",

      button_text:
        initialData.button_text ?? "",

      button_color:
        initialData.button_color
          ? normalizeColor(
            initialData.button_color,
            "#000000"
          )
          : "",

      button_text_color:
        initialData.button_text_color
          ? normalizeColor(
            initialData.button_text_color,
            "#ffffff"
          )
          : "",

      is_active:
        initialData.is_active ?? true,

      sort_order:
        Number(
          initialData.sort_order ?? 1
        ),

      // Never put the previous File here
      file: undefined,
    });
  }, [
    initialData,
    form,
  ]);


const onSubmit = async (
  values: BannerFormData
) => {
  try {
    const hasNewImage =
      values.file instanceof File;

    const hasExistingImage =
      Boolean(imageUrl);

    if (
      !hasNewImage &&
      !hasExistingImage
    ) {
      toast.error(
        "Banner image is required."
      );

      return;
    }

    const formData = new FormData();

    // Required fields
    formData.append(
      "title",
      values.title
    );

    formData.append(
      "description",
      values.description
    );

    formData.append(
      "color",
      values.color
    );

    /*
     * Optional fields
     *
     * ADD:
     * Only send them when they have a value.
     *
     * EDIT:
     * Always send them.
     * Empty string means the existing value
     * should be cleared.
     */
    if (isEdit) {
      formData.append(
        "link_url",
        values.link_url?.trim() || ""
      );

      formData.append(
        "button_text",
        values.button_text?.trim() || ""
      );

      formData.append(
        "button_color",
        values.button_color?.trim() || ""
      );

      formData.append(
        "button_text_color",
        values.button_text_color?.trim() || ""
      );
    } else {
      if (values.link_url?.trim()) {
        formData.append(
          "link_url",
          values.link_url.trim()
        );
      }

      if (values.button_text?.trim()) {
        formData.append(
          "button_text",
          values.button_text.trim()
        );
      }

      if (values.button_color?.trim()) {
        formData.append(
          "button_color",
          values.button_color.trim()
        );
      }

      if (values.button_text_color?.trim()) {
        formData.append(
          "button_text_color",
          values.button_text_color.trim()
        );
      }
    }

    // Required fields
    formData.append(
      "is_active",
      String(values.is_active)
    );

    formData.append(
      "sort_order",
      String(values.sort_order)
    );

    // New image only
    if (
      hasNewImage &&
      values.file instanceof File
    ) {
      formData.append(
        "file",
        values.file
      );
    }

    console.log(
      Object.fromEntries(formData)
    );

    if (
      isEdit &&
      bannerId
    ) {
      await updateBanner({
        id: bannerId,
        body: formData,
      }).unwrap();

      toast.success(
        "Banner updated successfully."
      );
    } else {
      if (!hasNewImage) {
        toast.error(
          "Please select a banner image."
        );

        return;
      }

      await createBanner(
        formData
      ).unwrap();

      toast.success(
        "Banner created successfully."
      );
    }

    form.reset();

    onOpenChange(false);

  } catch (error: any) {
    console.error(
      "Banner error:",
      error
    );

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

      <SheetContent
        className="sm:max-w-4xl p-0"
      >

        <Form {...form}>

          <form
            onSubmit={
              form.handleSubmit(
                onSubmit
              )
            }
            className="h-full"
          >

            <FormSheetContent>

              <FormSheetHeader>

                <div>

                  <SheetTitle>
                    {isEdit
                      ? "Edit Banner"
                      : "Add Banner"}
                  </SheetTitle>

                  <SheetDescription>
                    {isEdit
                      ? "Update homepage banner information."
                      : "Create a new homepage banner."}
                  </SheetDescription>

                </div>

              </FormSheetHeader>

              <FormSheetBody>

                <div className="space-y-8">
                  <div className="rounded-lg border bg-background p-6 space-y-5">

                    <div>

                      <h3 className="text-lg font-semibold">
                        Banner Image
                        <span className="ml-1 text-red-500">
                          *
                        </span>
                      </h3>

                      <p className="mt-1 text-sm text-muted-foreground">
                        Upload the image that will be displayed on the homepage banner.
                      </p>

                    </div>


                    <FormField
                      control={
                        form.control
                      }
                      name="file"
                      render={({
                        field,
                      }) => (

                        <FormItem>

                          <FormControl>

                            <ImageDropzone
                              previewImage={
                                isEdit
                                  ? imageUrl
                                  : undefined
                              }

                              onFileAccepted={(
                                file
                              ) => {

                                field.onChange(
                                  file
                                );

                              }}

                              onFileRemoved={() => {

                                field.onChange(
                                  undefined
                                );

                              }}
                            />

                          </FormControl>

                          <FormMessage />

                        </FormItem>

                      )}
                    />

                  </div>

                  <div className="rounded-lg border bg-background p-6 space-y-6">

                    <h3 className="text-lg font-semibold">
                      Banner Information
                    </h3>

                    <FormTextInput
                      control={
                        form.control
                      }
                      name="title"
                      label="Title"
                      placeholder="Enter Title Here"
                      required={true}
                    />

                    <FormTextarea
                      control={
                        form.control
                      }
                      name="description"
                      label="Description"
                      placeholder="Enter Description Here"
                      required={true}
                    />

                    <FormTextInput
                      control={form.control}
                      name="link_url"
                      label="Link URL"
                      placeholder="Enter Link URL"
                    />

                    <FormTextInput
                      control={form.control}
                      name="button_text"
                      label="Button Text"
                      placeholder="Enter Button Text"
                    />

                    <FormColorInput
                      control={
                        form.control
                      }
                      name="color"
                      label="Banner Text Color"
                      required={true}
                    />

                    <FormColorInput
                      control={form.control}
                      name="button_color"
                      label="Button Color"
                    />

                    <FormColorInput
                      control={form.control}
                      name="button_text_color"
                      label="Button Text Color"
                    />

                    <FormField
                      control={
                        form.control
                      }
                      name="sort_order"
                      render={({
                        field,
                      }) => (

                        <FormItem>

                          <div className="space-y-2">

                            <label className="text-sm font-medium">
                              Sort Order
                              <span className="ml-1 text-red-500">
                                *
                              </span>
                            </label>


                            <FormControl>

                              <input
                                type="number"
                                min="0"
                                value={
                                  field.value ?? ""
                                }
                                onChange={(
                                  e
                                ) => {

                                  const value =
                                    e.target.value;

                                  field.onChange(
                                    value === ""
                                      ? undefined
                                      : Number(
                                        value
                                      )
                                  );

                                }}
                                onBlur={
                                  field.onBlur
                                }
                                name={
                                  field.name
                                }
                                ref={
                                  field.ref
                                }
                                placeholder="Enter Sort Order Here"
                                className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                              />

                            </FormControl>

                          </div>

                          <FormMessage />

                        </FormItem>

                      )}
                    />

                    <FormSwitch
                      control={
                        form.control
                      }
                      name="is_active"
                      label="Active"
                    />

                  </div>

                </div>

              </FormSheetBody>

              <FormSheetFooter>

                <FormSubmitButton
                  isPending={
                    isSubmitting
                  }
                  className="w-full"
                >
                  {isEdit
                    ? "Update Banner"
                    : "Create Banner"}
                </FormSubmitButton>

              </FormSheetFooter>

            </FormSheetContent>

          </form>

        </Form>

      </SheetContent>

    </Sheet>
  );
}

function normalizeColor(
  value: string | undefined,
  fallback: string
): string {

  if (!value) {
    return fallback;
  }

  if (
    /^#[0-9A-Fa-f]{6}$/.test(value)
  ) {
    return value;
  }

  const colors: Record<
    string,
    string
  > = {
    white: "#ffffff",
    black: "#000000",
    red: "#ff0000",
    green: "#008000",
    blue: "#0000ff",
    yellow: "#ffff00",
    gray: "#808080",
    grey: "#808080",
    orange: "#ffa500",
    purple: "#800080",
  };

  return (
    colors[
    value.toLowerCase()
    ] ?? fallback
  );
}