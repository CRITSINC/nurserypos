"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  useForm,
} from "react-hook-form";

import {
  zodResolver,
} from "@hookform/resolvers/zod";

import {
  toast,
} from "sonner";

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
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/admin/ui/form";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/admin/ui/select";

import {
  FormSheetBody,
  FormSheetContent,
  FormSheetFooter,
  FormSheetHeader,
} from "@/components/admin/shared/form/FormSheet";

import {
  FormTextInput,
  FormPriceInput,
  FormSelectInput,
} from "@/components/admin/shared/form";

import {
  FormSubmitButton,
} from "@/components/admin/shared/form/FormSubmitButton";

import {
  productFormSchema,
  ProductFormData,
  ProductFormInput,
} from "./schema";

import {
  useCreateProductMutation,
  useUpdateProductMutation,
  useAddProductImagesMutation,
  useDeleteProductImageMutation,
} from "@/redux/services/product";

import type {
  ProductImage,
} from "@/types/product.types";

import {
  useGetCategoriesQuery,
} from "@/redux/services/category";

import {
  useGetBrandsQuery,
} from "@/redux/services/brand";

import {
  useGetVendorsQuery,
} from "@/redux/services/vendor";

import {
  useGetTagsQuery,
} from "@/redux/services/tag";

import {
  useGetTaxClassesQuery,
} from "@/redux/services/taxClass";

type Props = {
  open: boolean;

  onOpenChange: (
    open: boolean
  ) => void;

  isEdit?: boolean;

  productId?: number;

  initialData?: Partial<ProductFormData>;

  images?: ProductImage[];

  editStats?: ProductEditStats;
};


type ProductEditStats = {
  available?: number;
  reserved?: number;
  avgCost?: number;
  totalValue?: number;
  totalSaleValue?: number;
  margin?: number;

  layaway?: number;
  specialOrder?: number;
  workorder?: number;

  onOrder?: number;
  pendingSpecialOrder?: number;
  pendingReturn?: number;

  salesDay?: number;
  salesWeek?: number;
  salesMonth?: number;
  salesYear?: number;
  salesAll?: number;
};

const productTypeOptions = [
  {
    value: "default",
    label: "Single",
  },
  {
    value: "box",
    label: "Box",
  },
  {
    value: "assembly",
    label: "Assembly",
  },
  {
    value: "non_inventory",
    label: "Non-Inventory",
  },
];

export default function ProductForm({
  open,
  onOpenChange,
  isEdit = false,
  productId,
  initialData,
  images = [],
  editStats,
}: Props) {

  const [
    createProduct,
    {
      isLoading: creating,
    },
  ] =
    useCreateProductMutation();

  const [
    updateProduct,
    {
      isLoading: updating,
    },
  ] =
    useUpdateProductMutation();

  const isSubmitting =
    creating ||
    updating;

  const [
    imageUploaderOpen,
    setImageUploaderOpen,
  ] = useState(false);


  const [
    productImages,
    setProductImages,
  ] = useState<ProductImage[]>(images);

  useEffect(() => {
    if (open) {
      setProductImages(images);
    }
  }, [open, productId]);

  const {
    data: categoriesResponse,
    isLoading: categoriesLoading,
  } = useGetCategoriesQuery({});

  const {
    data: brandsResponse,
    isLoading: brandsLoading,
  } = useGetBrandsQuery({});

  const {
    data: vendorsResponse,
    isLoading: vendorsLoading,
  } = useGetVendorsQuery({});

  const {
    data: tagsResponse,
    isLoading: tagsLoading,
  } = useGetTagsQuery(
    {
      page: 1,
      limit: 1000,
    },
    {
      skip: !open,
    }
  );

  const [
    addProductImages,
    { isLoading: uploadingImages },
  ] = useAddProductImagesMutation();

  const [
    deleteProductImage,
    { isLoading: deletingImage },
  ] = useDeleteProductImageMutation();

  const {
    data: taxClassesResponse,
    isLoading: taxClassesLoading,
  } = useGetTaxClassesQuery();

  const taxClassOptions = [
    ...(taxClassesResponse?.data ?? []).map((taxClass) => ({
      value: taxClass.id,
      label: taxClass.name,
    })),
  ];

  const categoryOptions = [
    {
      value: null,
      label: "None",
    },

    ...(categoriesResponse?.data ?? []).map(
      (category) => ({
        value: category.id,
        label: category.full_path_name
          ? category.full_path_name
          : category.name,
      })
    ),
  ];

  const brandOptions = [
    {
      value: null,
      label: "None",
    },

    ...(brandsResponse?.data ?? []).map(
      (brand) => ({
        value: brand.id,
        label: brand.name,
      })
    ),
  ];

  const vendorOptions = [
    {
      value: null,
      label: "None",
    },

    ...(vendorsResponse?.data ?? []).map(
      (vendor) => ({
        value: vendor.id,
        label: vendor.name,
      })
    ),
  ];

  const tags = tagsResponse?.data ?? [];

  const uniqueTags = Array.from(
    new Map(
      tags
        .filter((tag) => tag.name)
        .map((tag) => [tag.name, tag])
    ).values()
  );

  const fileInputRef =
    useRef<HTMLInputElement | null>(
      null
    );

  const defaultValues:
    ProductFormInput = {
    description: "",

    item_type: "default",

    serialized: false,

    qoh: 0,

    system_sku: "",

    upc: "",

    ean: "",

    custom_sku: "",

    manufacturer_sku: "",

    category_id: null,

    brand_id: null,

    tags: "",

    price: 0,

    msrp: 0,

    online_price: 0,

    discountable: true,

    taxable: true,

    tax_class_id: null,

    default_cost: 0,

    // vendor_cost: 0,

    vendor_id: null,

    vendor_sku: "",

    reorder_point: 0,

    reorder_level: 0,

    publish_to_ecom: false,

    attribute_1_value: "",

    attribute_2_value: "",

    attribute_3_value: "",

    note: "",

    display_note: false,
  };

  const form =
    useForm<
      ProductFormInput,
      undefined,
      ProductFormData
    >({

      resolver:
        zodResolver(
          productFormSchema
        ),

      defaultValues: {
        ...defaultValues,
        ...initialData,
      },
    });

  useEffect(() => {

    if (!open) {
      return;
    }

    form.reset({
      ...defaultValues,
      ...initialData,
    });

    setProductImages(images);
    setImageUploaderOpen(false);

  }, [
    open,
    isEdit,
    productId,
  ]);

  const addImageFiles = async (
    files: FileList | File[]
  ) => {
    const fileArray = Array.from(files);

    const validFiles = fileArray.filter((file) =>
      file.type.startsWith("image/")
    );

    if (validFiles.length === 0) {
      toast.error("Please select valid image files.");
      return;
    }

    if (!productId) {
      toast.error("Unable to determine product.");
      return;
    }

    try {
      const response =
        await addProductImages({
          id: productId,
          images: validFiles,
        }).unwrap();

      /*
       * The image endpoint may return either:
       *
       * response.data.images
       * response.data.product.images
       * response.images
       * response.data.image
       * or a single image object in response.data.
       *
       * Use the returned server records whenever available
       * because they contain the database image ID required
       * by the delete endpoint.
       */
      const returnedImages: ProductImage[] =
        Array.isArray(response?.data?.images)
          ? response.data.images
          : Array.isArray(
            response?.data?.product?.images
          )
            ? response.data.product.images
            : Array.isArray(response?.images)
              ? response.images
              : response?.data?.image
                ? [response.data.image]
                : response?.data?.id &&
                  (
                    response.data.local_path ||
                    response.data.lightspeed_url
                  )
                  ? [response.data]
                  : [];

      if (returnedImages.length > 0) {
        setProductImages(
          (currentImages) => {
            const existingIds = new Set(
              currentImages
                .map((image) => image.id)
                .filter(
                  (id): id is number =>
                    id !== undefined &&
                    id !== null
                )
            );

            const newImages =
              returnedImages.filter(
                (image) =>
                  !image.id ||
                  !existingIds.has(image.id)
              );

            return [
              ...currentImages,
              ...newImages,
            ];
          }
        );
      }

      toast.success(
        validFiles.length === 1
          ? "Image uploaded successfully."
          : "Images uploaded successfully."
      );
    } catch (error: any) {
      toast.error(
        error?.data?.message ??
        error?.data?.error?.message ??
        "Unable to upload image."
      );
    }
  };

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files) {
      void addImageFiles(event.target.files);
    }

    event.target.value = "";
  };

  const handleDrop = (
    event: React.DragEvent<HTMLDivElement>
  ) => {
    event.preventDefault();
    event.stopPropagation();

    if (event.dataTransfer.files) {
      void addImageFiles(event.dataTransfer.files);
    }
  };

  const handleDeleteImage = async (
    imageId: number
  ) => {
    if (!productId) {
      toast.error("Unable to determine product.");
      return;
    }

    try {
      await deleteProductImage({
        id: productId,
        imageId,
      }).unwrap();

      /*
       * Remove the image from the local list only after
       * the server confirms that the delete succeeded.
       */
      setProductImages(
        (currentImages) =>
          currentImages.filter(
            (image) => image.id !== imageId
          )
      );

      toast.success("Image deleted successfully.");
    } catch (error: any) {
      toast.error(
        error?.data?.message ??
        error?.data?.error?.message ??
        "Unable to delete image."
      );
    }
  };

  const onSubmit = async (
    values: ProductFormData
  ) => {

    try {
      const payload = {
        ...values,
        product_matrix_id:
          (initialData as any)?.product_matrix_id ?? null,
        tax_class_name:
          taxClassOptions.find(
            (option) => option.value === values.tax_class_id
          )?.label ??
          (initialData as any)?.tax_class_name ??
          null,
        tags:
          typeof values.tags === "string"
            ? values.tags.split(",").map((tag) => tag.trim()).filter(Boolean)
            : values.tags,
      };
      console.log("payload---------", payload)
      if (
        isEdit &&
        productId
      ) {

        await updateProduct({
          id: productId,
          ...payload,
        }).unwrap();

        toast.success(
          "Product updated successfully."
        );

      } else {

        await createProduct(
          payload
        ).unwrap();

        toast.success(
          "Product created successfully."
        );
      }


      form.reset();

      setImageUploaderOpen(false);

      onOpenChange(false);

    } catch (
    error: any
    ) {

      toast.error(
        error?.data?.message ??
        error?.message ??
        "Something went wrong."
      );
    }
  };

  return (
    <Sheet
      open={open}
      onOpenChange={
        onOpenChange
      }
    >

      <SheetContent
        className="
          w-full
          sm:max-w-[1500px]
          p-0
        "
      >

        <Form
          {...form}
        >

          <form
            onSubmit={
              form.handleSubmit(
                onSubmit
              )
            }

            className="
              flex
              h-full
              flex-col
            "
          >

            <FormSheetContent>
              <FormSheetHeader>

                <div>

                  <SheetTitle>
                    {isEdit
                      ? "Edit Product"
                      : "Add Product"}
                  </SheetTitle>

                  <SheetDescription>
                    {isEdit
                      ? "Update product information."
                      : "Add a new product."}
                  </SheetDescription>

                </div>

              </FormSheetHeader>

              <FormSheetBody>

                <div
                  className="
                    space-y-6
                  "
                >

                  <ProductSection
                    title="Basic Information"
                  >

                    <div
                      className="
                        grid
                        grid-cols-1
                        gap-6
                        lg:grid-cols-[minmax(0,1fr)_220px_auto]
                        lg:items-end
                      "
                    >

                      <FormTextInput
                        control={
                          form.control
                        }

                        name="description"

                        label="Description"

                        placeholder="Description"
                      />


                      <FormField
                        control={form.control}
                        name="item_type"
                        render={({ field }) => (
                          <FormItem className="flex items-center gap-3 space-y-0">
                            <FormLabel className="mb-0 shrink-0 whitespace-nowrap">
                              Type
                            </FormLabel>

                            <FormControl className="flex-1">
                              <Select
                                value={field.value || ""}
                                onValueChange={field.onChange}
                              >
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="Select Type" />
                                </SelectTrigger>

                                <SelectContent>
                                  {productTypeOptions.map((option) => (
                                    <SelectItem
                                      key={option.value}
                                      value={option.value}
                                    >
                                      {option.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </FormControl>

                            <FormMessage className="absolute mt-14" />
                          </FormItem>
                        )}
                      />


                      <CheckboxField
                        id="serialized"
                        label="Serialized"
                        register={
                          form.register(
                            "serialized"
                          )
                        }
                      />

                    </div>

                  </ProductSection>

                  {isEdit && (
                    <ProductSection
                      title="Images"
                    >

                      <ProductImages
                        images={productImages}
                        imageUploaderOpen={imageUploaderOpen}
                        setImageUploaderOpen={setImageUploaderOpen}
                        fileInputRef={fileInputRef}
                        handleDrop={handleDrop}
                        handleFileChange={handleFileChange}
                        onDeleteImage={handleDeleteImage}
                        deletingImage={deletingImage}
                        uploadingImages={uploadingImages}
                      />

                    </ProductSection>
                  )}

                  {isEdit ? (

                    <div
                      className="
                        grid
                        grid-cols-1
                        gap-6
                        xl:grid-cols-[minmax(0,1.15fr)_minmax(400px,0.85fr)_285px]
                      "
                    >
                      <div
                        className="
                          space-y-6
                        "
                      >

                        <ProductSection
                          title="IDs"
                        >

                          <IdFields
                            form={
                              form
                            }

                            isEdit={
                              isEdit
                            }
                          />

                        </ProductSection>


                        <ProductSection
                          title="Organize"
                        >

                          <OrganizeFields
                            form={form}
                            categoryOptions={categoryOptions}
                            brandOptions={brandOptions}
                            tags={uniqueTags}
                            tagsLoading={tagsLoading}
                          />

                        </ProductSection>


                        {/* <ProductSection
                          title="eCommerce (E-Series)"
                        >

                          <EcommerceButtons />

                        </ProductSection> */}

                      </div>

                      <div
                        className="
                          space-y-6
                        "
                      >

                        <PricingSection
                          form={
                            form
                          }

                          isEdit={
                            isEdit
                          }

                          taxClassOptions={
                            taxClassOptions
                          }

                          taxClassesLoading={
                            taxClassesLoading
                          }
                        />


                        <InventoryDefaultsSection
                          form={
                            form
                          }

                          isEdit={
                            isEdit
                          }

                          vendorOptions={vendorOptions}
                        />


                        <ReorderingSection
                          form={
                            form
                          }
                        />


                        {/* <DemandForecastingSection /> */}

                      </div>

                      <EditStatsSidebar
                        stats={
                          editStats
                        }
                      />

                    </div>

                  ) : (
                    <div
                      className="
                        grid
                        grid-cols-1
                        gap-6
                        xl:grid-cols-[minmax(0,1.15fr)_minmax(400px,0.85fr)]
                      "
                    >
                      <div
                        className="
                          space-y-6
                        "
                      >

                        <ProductSection
                          title="Add Inventory"
                        >

                          <FormTextInput
                            control={
                              form.control
                            }

                            name="qoh"

                            label="Add Qty."

                            placeholder="0"

                            type="number"
                          />

                        </ProductSection>


                        <ProductSection
                          title="IDs"
                        >

                          <IdFields
                            form={
                              form
                            }

                            isEdit={
                              false
                            }
                          />

                        </ProductSection>


                        <ProductSection
                          title="Organize"
                        >

                          <OrganizeFields
                            form={form}
                            categoryOptions={categoryOptions}
                            brandOptions={brandOptions}
                            tags={uniqueTags}
                            tagsLoading={tagsLoading}
                          />
                        </ProductSection>


                        {/* <ProductSection
                          title="eCommerce (E-Series)"
                        >

                          <EcommerceButtons />

                        </ProductSection> */}


                        <ProductSection
                          title="Notes"
                        >

                          <NotesSection
                            form={
                              form
                            }
                          />

                        </ProductSection>

                      </div>

                      <div
                        className="
                          space-y-6
                        "
                      >

                        <PricingSection
                          form={
                            form
                          }

                          isEdit={
                            false
                          }

                          taxClassOptions={
                            taxClassOptions
                          }

                          taxClassesLoading={
                            taxClassesLoading
                          }
                        />


                        <InventoryDefaultsSection
                          form={
                            form
                          }

                          isEdit={
                            false
                          }
                          vendorOptions={vendorOptions}
                        />


                        <ReorderingSection
                          form={
                            form
                          }
                        />


                        {/* <DemandForecastingSection /> */}

                      </div>

                    </div>
                  )}

                  {isEdit && (
                    <ProductSection
                      title="Notes"
                    >

                      <NotesSection
                        form={
                          form
                        }

                      />

                    </ProductSection>
                  )}

                </div>

              </FormSheetBody>

              <FormSheetFooter
                className="
                  gap-4
                  border-t
                  px-5
                  py-4
                "
              >
                <FormSubmitButton
                  isPending={
                    isSubmitting
                  }

                  className="
                    h-11
                    w-full
                  "
                >
                  {isEdit
                    ? "Update Product"
                    : "Create Product"}
                </FormSubmitButton>

              </FormSheetFooter>

            </FormSheetContent>

          </form>

        </Form>

      </SheetContent>

    </Sheet>
  );
}

function IdFields({
  form,
  isEdit,
}: {
  form: any;
  isEdit: boolean;
}) {

  return (
    <div
      className="
        space-y-5
      "
    >

      <FormTextInput
        control={
          form.control
        }

        name="system_sku"

        label="System ID"

        placeholder="System ID"

        disabled
      />


      <FormTextInput
        control={
          form.control
        }

        name="upc"

        label="UPC"

        placeholder="UPC"
      />


      <FormTextInput
        control={
          form.control
        }

        name="ean"

        label="EAN"

        placeholder="EAN"
      />


      <FormTextInput
        control={
          form.control
        }

        name="custom_sku"

        label="Custom SKU"

        placeholder="Custom SKU"
      />


      <FormTextInput
        control={
          form.control
        }

        name="manufacturer_sku"

        label="Manufact. SKU"

        placeholder="Manufact. SKU"
      />

    </div>
  );
}

function OrganizeFields({
  form,
  categoryOptions,
  brandOptions,
  tags,
  tagsLoading,
}: {
  form: any;
  categoryOptions: {
    value: number | null;
    label: string;
  }[];
  brandOptions: {
    value: number | null;
    label: string;
  }[];
  tags: {
    id: number;
    name: string;
  }[];
  tagsLoading: boolean;
}) {
  return (
    <div className="space-y-5">
      <FormSelectInput
        control={form.control}
        name="category_id"
        label="Category"
        placeholder="None"
        options={categoryOptions}
      />

      <FormSelectInput
        control={form.control}
        name="brand_id"
        label="Brand"
        placeholder="Select or Enter a Brand"
        options={brandOptions}
      />

      <FormField
        control={form.control}
        name="tags"
        render={({ field }) => {
          const selectedTags =
            typeof field.value === "string"
              ? field.value
                .split(",")
                .map((tag: string) => tag.trim())
                .filter(Boolean)
              : [];

          const toggleTag = (tagName: string) => {
            const nextTags = selectedTags.includes(tagName)
              ? selectedTags.filter(
                (tag: string) => tag !== tagName
              )
              : [...selectedTags, tagName];

            field.onChange(nextTags.join(", "));
          };

          return (
            <FormItem className="space-y-0">
              <FormLabel>Tags</FormLabel>

              <FormControl>
                <Select
                  value=""
                  onValueChange={toggleTag}
                  disabled={tagsLoading}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue
                      placeholder={
                        selectedTags.length > 0
                          ? selectedTags.join(", ")
                          : tagsLoading
                            ? "Loading tags..."
                            : "Select tags"
                      }
                    />
                  </SelectTrigger>

                  <SelectContent>
                    {tags.map((tag) => {
                      const isSelected =
                        selectedTags.includes(tag.name);

                      return (
                        <SelectItem
                          key={tag.name}
                          value={tag.name}
                        >
                          {isSelected
                            ? `✓ ${tag.name}`
                            : tag.name}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </FormControl>

              <FormMessage />
            </FormItem>
          );
        }}
      />
    </div>
  );
}

function EcommerceButtons() {

  return (
    <div
      className="
        flex
        flex-wrap
        gap-3
      "
    >

      <button
        type="button"

        className="
          rounded-md
          border
          px-4
          py-2.5
          text-sm
          font-medium
          text-primary
          transition-colors
          hover:bg-muted
        "
      >
        Manage Online Details ↗
      </button>


      <button
        type="button"

        className="
          rounded-md
          border
          px-4
          py-2.5
          text-sm
          font-medium
          text-primary
          transition-colors
          hover:bg-muted
        "
      >
        View in Online Store ↗
      </button>

    </div>
  );
}

function PricingSection({
  form,
  isEdit,
  taxClassOptions,
  taxClassesLoading,
}: {
  form: any;
  isEdit: boolean;
  taxClassOptions: {
    value: number | null;
    label: string;
  }[];
  taxClassesLoading: boolean;
}) {

  return (
    <ProductSection
      title="Pricing"
    >

      <div
        className="
          space-y-5
        "
      >

        <PriceRow
          form={
            form
          }

          name="price"

          label="Default"

          isEdit={
            isEdit
          }
        />


        <PriceRow
          form={
            form
          }

          name="msrp"

          label="MSRP"

          isEdit={
            isEdit
          }
        />


        <PriceRow
          form={
            form
          }

          name="online_price"

          label="Online"

          isEdit={
            isEdit
          }
        />


        <CheckboxField
          id="discountable"
          label="Discounts Allowed"
          register={
            form.register(
              "discountable"
            )
          }
        />


        <div
          className="
            grid
            grid-cols-1
            gap-5
            sm:grid-cols-[minmax(0,1fr)_180px]
            sm:items-end
          "
        >

          <CheckboxField
            id="taxable"
            label="Taxable"
            register={
              form.register(
                "taxable"
              )
            }
          />


          <FormSelectInput
            control={form.control}
            name="tax_class_id"
            label="Tax Class"
            placeholder={
              taxClassesLoading
                ? "Loading..."
                : "Tax Class"
            }
            options={taxClassOptions}
          />

        </div>

      </div>

    </ProductSection>
  );
}

function PriceRow({
  form,
  name,
  label,
  isEdit,
}: {
  form: any;

  name:
  | "price"
  | "msrp"
  | "online_price";

  label: string;

  isEdit: boolean;
}) {

  return (
    <div
      className="
        grid
        grid-cols-1
        gap-3
        md:grid-cols-[minmax(100px,0.8fr)_minmax(180px,1fr)]
        md:items-end
      "
    >

      <FormPriceInput
        control={
          form.control
        }

        name={
          name
        }

        label={
          label
        }

        placeholder="0.00"
      />


      {isEdit && (
        <div
          className="
            hidden
            md:grid
            md:grid-cols-2
            md:gap-4
            md:pb-1
          "
        >

          <PricingMetric
            label="Markup"
            value="—"
          />

          <PricingMetric
            label="Margin"
            value="—"
          />

        </div>
      )}

    </div>
  );
}

function PricingMetric({
  label,
  value,
}: {
  label: string;
  value: string;
}) {

  return (
    <div>

      <div
        className="
          text-xs
          uppercase
          tracking-wide
          text-muted-foreground
        "
      >
        {label}
      </div>

      <div
        className="
          mt-1
          text-sm
          text-muted-foreground
        "
      >
        {value}
      </div>

    </div>
  );
}

function InventoryDefaultsSection({
  form,
  isEdit,
  vendorOptions,
}: {
  form: any;
  isEdit: boolean;
  vendorOptions: {
    value: number | null;
    label: string;
  }[];
}) {

  return (
    <ProductSection
      title="Inventory Defaults"
    >

      <div
        className="
          space-y-5
        "
      >

        <FormPriceInput
          control={
            form.control
          }

          name="default_cost"

          label="Default Cost"

          placeholder="0.00"
        />

  


        <FormSelectInput
          control={
            form.control
          }

          name="vendor_id"

          label="Vendor"

          placeholder="None"

          options={
            vendorOptions
          }
        />


        <FormTextInput
          control={
            form.control
          }

          name="vendor_sku"

          label="Vendor ID"

          placeholder="Vendor ID"
        />

      </div>

    </ProductSection>
  );
}

function ReorderingSection({
  form,
}: {
  form: any;
}) {

  return (
    <ProductSection
      title="Inventory Reordering"
    >

      <div
        className="
          space-y-5
        "
      >

        <FormTextInput
          control={
            form.control
          }

          name="reorder_point"

          label="Reorder Point"

          placeholder="0"

          type="number"
        />


        <FormTextInput
          control={
            form.control
          }

          name="reorder_level"

          label="Desired Inventory Level"

          placeholder="0"

          type="number"
        />

      </div>

    </ProductSection>
  );
}

function DemandForecastingSection() {

  return (
    <ProductSection
      title="Demand forecasting"
    >

      <div
        className="
          rounded-lg
          bg-muted/30
          p-5
        "
      >

        <div
          className="
            space-y-5
          "
        >

          <ForecastRow
            label="Suggested point"
          />


          <ForecastRow
            label="Suggested level"
          />


          <ForecastRow
            label="Suggested need"
          />

        </div>


        <button
          type="button"

          className="
            mt-5
            rounded-md
            border
            px-4
            py-2.5
            text-sm
            font-medium
            transition-colors
            hover:bg-muted
          "
        >
          Generate demand forecast
        </button>

      </div>

    </ProductSection>
  );
}

function NotesSection({
  form,
}: {
  form: any;
}) {

  return (
    <div
      className="
        space-y-4
      "
    >

      <CheckboxField
        id="display-note"
        label="Display Note On Sales and Receipts"
        register={
          form.register(
            "display_note"
          )
        }
      />


      <textarea
        {...form.register(
          "note"
        )}

        placeholder="Don't enter sensitive information like login or credit card details"

        className="
          min-h-[220px]
          w-full
          resize-y
          rounded-md
          border
          border-input
          bg-background
          px-4
          py-3
          text-sm
          leading-6
          outline-none
          placeholder:text-muted-foreground
          focus-visible:border-ring
          focus-visible:ring-2
          focus-visible:ring-ring/20
        "
      />

    </div>
  );
}

function ProductImages({
  images,
  imageUploaderOpen,
  setImageUploaderOpen,
  fileInputRef,
  handleDrop,
  handleFileChange,
  onDeleteImage,
  deletingImage,
  uploadingImages,
}: {
  images: ProductImage[];

  imageUploaderOpen: boolean;

  setImageUploaderOpen: (
    value: boolean
  ) => void;

  fileInputRef: React.RefObject<
    HTMLInputElement | null
  >;

  handleDrop: (
    event: React.DragEvent<HTMLDivElement>
  ) => void;

  handleFileChange: (
    event: React.ChangeEvent<HTMLInputElement>
  ) => void;

  onDeleteImage: (
    imageId: number
  ) => void;

  deletingImage: boolean;

  uploadingImages: boolean;
}) {
  const hasImages = images.length > 0;

  return (
    <div>
      {hasImages && (
        <div>
          <div
            className="
              grid
              grid-cols-2
              gap-4
              sm:grid-cols-3
              lg:grid-cols-4
            "
          >
            {images.map((image, index) => {
              const imageUrl =
                image.local_path ||
                image.lightspeed_url;

              return (
                <div
                  key={
                    image.id ??
                    `${imageUrl}-${index}`
                  }
                  className="
                    group
                    relative
                    overflow-hidden
                    rounded-lg
                    border
                    bg-background
                  "
                >
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={
                        image.filename ||
                        `Product image ${index + 1}`
                      }
                      className="
                        aspect-square
                        w-full
                        object-contain
                      "
                    />
                  ) : (
                    <div
                      className="
                        flex
                        aspect-square
                        items-center
                        justify-center
                        text-sm
                        text-muted-foreground
                      "
                    >
                      No preview
                    </div>
                  )}

                  {image.id && (
                    <button
                      type="button"
                      onClick={() =>
                        onDeleteImage(image.id!)
                      }
                      disabled={deletingImage}
                      className="
                        absolute
                        right-2
                        top-2
                        z-10
                        flex
                        h-7
                        w-7
                        items-center
                        justify-center
                        rounded-full
                        bg-destructive
                        text-sm
                        font-medium
                        text-white
                        shadow-sm
                        transition-opacity
                        hover:opacity-90
                        disabled:cursor-not-allowed
                        disabled:opacity-50
                      "
                      aria-label="Delete image"
                      title="Delete image"
                    >
                      ×
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          <div
            className="
              mt-3
              flex
              items-center
              justify-center
              gap-8
              text-sm
            "
          >
            <span
              className="
                text-muted-foreground
              "
            >
              {images.length}{" "}
              {images.length === 1
                ? "Image"
                : "Images"}
            </span>

            <button
              type="button"
              onClick={() =>
                setImageUploaderOpen(true)
              }
              className="
                text-primary
                hover:underline
              "
            >
              View & Manage Images
            </button>
          </div>
        </div>
      )}

      {(!imageUploaderOpen && images.length === 0) && (
        <button
          type="button"
          onClick={() => setImageUploaderOpen(true)}
          className="
          mt-5
          flex
          w-full
          items-center
          justify-center
          rounded-md
          border
          border-dashed
          px-4
          py-3
          text-sm
          font-medium
          text-primary
          transition-colors
          hover:bg-muted
        "
        >
          + Add Images

        </button>
      )}

      {imageUploaderOpen && (
        <ImageUploader
          fileInputRef={fileInputRef}
          handleDrop={handleDrop}
          handleFileChange={handleFileChange}
          onHide={() => setImageUploaderOpen(false)}
          uploadingImages={uploadingImages}
        />
      )}
    </div>
  );
}

function ImageUploader({
  fileInputRef,
  handleDrop,
  handleFileChange,
  onHide,
  uploadingImages,
}: {
  fileInputRef: React.RefObject<
    HTMLInputElement | null
  >;

  handleDrop: (
    event: React.DragEvent<HTMLDivElement>
  ) => void;

  handleFileChange: (
    event: React.ChangeEvent<HTMLInputElement>
  ) => void;

  onHide: () => void;

  uploadingImages: boolean;
}) {

  return (
    <div
      className="
        relative
        mt-5
        rounded-lg
        border-2
        border-dashed
        border-muted-foreground/30
        bg-muted/10
        p-10
      "

      onDragOver={(event) =>
        event.preventDefault()
      }

      onDrop={
        handleDrop
      }
    >

      <button
        type="button"

        onClick={
          onHide
        }

        className="
          absolute
          right-3
          top-3
          rounded-md
          bg-primary
          px-3
          py-1.5
          text-xs
          font-medium
          text-primary-foreground
        "
      >
        × Hide
      </button>


      <div
        className="
          flex
          flex-col
          items-center
          justify-center
          gap-4
          text-center
        "
      >

        <p
          className="
            text-sm
            font-medium
          "
        >
          Drag and drop files
          <br />
          here to upload
        </p>


        <button
          type="button"

          onClick={() =>
            fileInputRef.current?.click()
          }

          disabled={uploadingImages}

          className="
            rounded-md
            bg-primary
            px-4
            py-2
            text-sm
            font-medium
            text-primary-foreground
          "
        >
          {uploadingImages
            ? "Uploading..."
            : "Browse Files"}
        </button>


        <p
          className="
            text-xs
            text-muted-foreground
          "
        >
          Select one or more image files.
        </p>

      </div>


      <input
        ref={
          fileInputRef
        }

        type="file"

        accept="image/*"

        multiple

        disabled={uploadingImages}

        className="
          hidden
        "

        onChange={
          handleFileChange
        }
      />

    </div>
  );
}

function EditStatsSidebar({
  stats,
}: {
  stats?: ProductEditStats;
}) {

  return (
    <aside
      className="
        space-y-3
      "
    >

      <InfoPanel
        title="Stock"
        rows={[
          [
            "Available",
            stats?.available ?? 0,
          ],
          [
            "Reserved",
            stats?.reserved ?? 0,
          ],
          [
            "Avg. Cost",
            formatCurrency(
              stats?.avgCost
            ),
          ],
          [
            "Total Value",
            formatCurrency(
              stats?.totalValue
            ),
          ],
          [
            "Total Sale Value",
            formatCurrency(
              stats?.totalSaleValue
            ),
          ],
          [
            "Margin",
            formatPercent(
              stats?.margin
            ),
          ],
        ]}
      />


      <InfoPanel
        title="Reservations"
        rows={[
          [
            "Layaway",
            stats?.layaway ?? 0,
          ],
          [
            "Special Order",
            stats?.specialOrder ?? 0,
          ],
          [
            "Workorder",
            stats?.workorder ?? 0,
          ],
        ]}
      />


      <InfoPanel
        title="Orders"
        rows={[
          [
            "On Order",
            stats?.onOrder ?? 0,
          ],
          [
            "Pending Special Order",
            stats?.pendingSpecialOrder ?? 0,
          ],
          [
            "Pending Return",
            stats?.pendingReturn ?? 0,
          ],
        ]}
      />


      <InfoPanel
        title="Sales History"
        rows={[
          [
            "Day",
            stats?.salesDay ?? 0,
          ],
          [
            "Week",
            stats?.salesWeek ?? 0,
          ],
          [
            "Month",
            stats?.salesMonth ?? 0,
          ],
          [
            "Year",
            stats?.salesYear ?? 0,
          ],
          [
            "All",
            stats?.salesAll ?? 0,
          ],
        ]}
      />

    </aside>
  );
}

function InfoPanel({
  title,
  rows,
}: {
  title: string;

  rows: [
    string,
    string | number
  ][];
}) {

  return (
    <section
      className="
        overflow-hidden
        rounded-md
        border
        bg-background
      "
    >

      <div
        className="
          border-b
          bg-muted/50
          px-4
          py-2.5
        "
      >

        <h3
          className="
            text-sm
            font-semibold
          "
        >
          {title}
        </h3>

      </div>


      <div>

        {rows.map(
          (
            [
              label,
              value,
            ],
            index
          ) => (

            <div
              key={
                `${label}-${index}`
              }

              className="
                flex
                items-center
                justify-between
                gap-3
                border-b
                px-3
                py-2.5
                text-sm
                last:border-b-0
              "
            >

              <span>
                {label}
              </span>


              <span
                className="
                  font-medium
                "
              >
                {value}
              </span>

            </div>

          )
        )}

      </div>

    </section>
  );
}

function ProductSection({
  title,
  children,
}: {
  title: string;

  children: React.ReactNode;
}) {

  return (
    <section
      className="
        overflow-hidden
        rounded-lg
        border
        bg-background
        shadow-sm
      "
    >

      <div
        className="
          border-b
          bg-muted/50
          px-5
          py-3
        "
      >

        <h3
          className="
            text-sm
            font-semibold
          "
        >
          {title}
        </h3>

      </div>


      <div
        className="
          p-5
          lg:p-6
        "
      >
        {children}
      </div>

    </section>
  );
}

function CheckboxField({
  id,
  label,
  register,
}: {
  id: string;

  label: string;

  register: any;
}) {

  return (
    <label
      htmlFor={
        id
      }

      className="
        flex
        min-h-10
        cursor-pointer
        items-center
        gap-2.5
        select-none
      "
    >

      <input
        id={
          id
        }

        type="checkbox"

        {...register}

        className="
          h-4
          w-4
          shrink-0
          cursor-pointer
          accent-primary
        "
      />


      <span
        className="
          text-sm
          leading-5
        "
      >
        {label}
      </span>

    </label>
  );
}

function ForecastRow({
  label,
}: {
  label: string;
}) {

  return (
    <div
      className="
        flex
        items-center
        justify-between
        gap-4
      "
    >

      <span
        className="
          text-sm
        "
      >
        {label}
      </span>


      <span
        className="
          text-sm
          text-muted-foreground
        "
      >
        —
      </span>

    </div>
  );
}

function formatCurrency(
  value?: number
) {

  if (
    value === undefined ||
    value === null
  ) {
    return "—";
  }

  return `$${value.toFixed(2)}`;
}


function formatPercent(
  value?: number
) {

  if (
    value === undefined ||
    value === null
  ) {
    return "—";
  }

  return `${value.toFixed(2)}%`;
}