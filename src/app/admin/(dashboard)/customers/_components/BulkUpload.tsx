"use client";

import {
  ChangeEvent,
  DragEvent,
  useRef,
  useState,
} from "react";

import * as XLSX from "xlsx";

import {
  Download,
  FileSpreadsheet,
  UploadCloud,
  Trash2,
  CheckCircle2,
  FileCheck2,
} from "lucide-react";

import { toast } from "sonner";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
} from "@/components/admin/ui/sheet";

import {
  FormSheetBody,
  FormSheetContent,
  FormSheetFooter,
  FormSheetHeader,
} from "@/components/admin/shared/form/FormSheet";

import { FormSubmitButton } from "@/components/admin/shared/form/FormSubmitButton";

import { Button } from "@/components/admin/ui/button";

import { Input } from "@/components/admin/ui/input";

import {
  useCreateCustomerMutation,
} from "@/redux/services/customer";

import { vendorCurrencies } from "@/constants/currencies";

import { countriesList } from "@/constants/countries";

type VendorRow = {
  name: string;

  accountNumber: string;

  currencyCode: string;

  priceLevel: string;

  repFirstName: string;

  repLastName: string;

  phone: string;

  country: string;

  address1: string;

  address2: string;

  city: string;

  province: string;

  postalCode: string;

  website: string;

  email1: string;

  updatePrice: boolean;

  updateCost: boolean;

  updateDescription: boolean;
};


type Props = {
  open: boolean;

  onOpenChange: (
    open: boolean
  ) => void;
};

export default function UploadBulk({
  open,
  onOpenChange,
}: Props) {

  const [
    createCustomer,
    {
      isLoading: creating,
    },
  ] = useCreateCustomerMutation();


  const [
    fileName,
    setFileName,
  ] = useState("");


  const [
    jsonData,
    setJsonData,
  ] = useState<VendorRow[]>([]);


  const [
    isReading,
    setIsReading,
  ] = useState(false);


  const fileInputRef =
    useRef<HTMLInputElement>(null);


  /* ==========================================================
     EXCEL TEMPLATE
  ========================================================== */

  const handleDownloadTemplate = () => {

    const headers = [
      "Name",
      "Account Number",
      "Currency",
      "Pricing Level",
      "First Name",
      "Last Name",
      "Phone",
      "Country",
      "Address",
      "Address 2",
      "City",
      "Province",
      "Postal Code",
      "Website",
      "Email 1",
      "Update Price",
      "Update Cost",
      "Update Description",
    ];


    const worksheet =
      XLSX.utils.aoa_to_sheet([
        headers,
      ]);


    worksheet["!cols"] = [
      { wch: 30 }, // Name
      { wch: 20 }, // Account Number
      { wch: 15 }, // Currency
      { wch: 20 }, // Pricing Level
      { wch: 20 }, // First Name
      { wch: 20 }, // Last Name
      { wch: 20 }, // Phone
      { wch: 25 }, // Country
      { wch: 30 }, // Address
      { wch: 30 }, // Address 2
      { wch: 20 }, // City
      { wch: 20 }, // Province
      { wch: 15 }, // Postal Code
      { wch: 30 }, // Website
      { wch: 35 }, // Email
      { wch: 18 }, // Update Price
      { wch: 18 }, // Update Cost
      { wch: 22 }, // Update Description
    ];


    const workbook =
      XLSX.utils.book_new();


    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      "Vendors"
    );


    XLSX.writeFile(
      workbook,
      "vendor-bulk-upload.xlsx"
    );
  };


  /* ==========================================================
     HELPERS
  ========================================================== */

  const normalizeBoolean = (
    value: unknown
  ): boolean => {

    const normalized =
      String(value ?? "")
        .trim()
        .toLowerCase();

    return [
      "true",
      "yes",
      "1",
      "on",
    ].includes(normalized);
  };


  const normalizeCurrency = (
    value: unknown
  ): string => {

    const input =
      String(value ?? "")
        .trim()
        .toLowerCase();

    if (!input) {
      return "";
    }

    const currency =
      vendorCurrencies.find(
        (item) =>
          item.code.toLowerCase() ===
            input ||
          item.name.toLowerCase() ===
            input
      );

    return (
      currency?.code ??
      String(value).trim()
    );
  };


  const normalizeCountry = (
    value: unknown
  ): string => {

    const input =
      String(value ?? "")
        .trim()
        .toLowerCase();

    if (!input) {
      return "";
    }

    const country =
      countriesList.find(
        (item) =>
          item.code.toLowerCase() ===
            input ||
          item.name.toLowerCase() ===
            input
      );

    return (
      country?.name ??
      String(value).trim()
    );
  };


  /* ==========================================================
     PROCESS FILE
  ========================================================== */

  const processFile = async (
    file: File
  ) => {

    setIsReading(true);

    try {

      const extension =
        file.name
          .substring(
            file.name.lastIndexOf(".")
          )
          .toLowerCase();


      if (
        ![
          ".xlsx",
          ".xls",
          ".csv",
        ].includes(extension)
      ) {

        toast.error(
          "Please upload an Excel or CSV file."
        );

        return;
      }


      const buffer =
        await file.arrayBuffer();


      const workbook =
        XLSX.read(buffer, {
          type: "array",
        });


      const sheetName =
        workbook.SheetNames[0];


      if (!sheetName) {

        toast.error(
          "No worksheet found in the uploaded file."
        );

        return;
      }


      const worksheet =
        workbook.Sheets[
          sheetName
        ];


      const rows =
        XLSX.utils.sheet_to_json<
          Record<string, unknown>
        >(
          worksheet,
          {
            defval: "",
            raw: false,
          }
        );


      if (!rows.length) {

        toast.error(
          "The Excel file is empty."
        );

        setJsonData([]);

        return;
      }


      /* ======================================================
         HEADER FINDER
      ====================================================== */

      const getValue = (
        row: Record<string, unknown>,
        header: string
      ) => {

        const key =
          Object.keys(row).find(
            (item) =>
              item
                .trim()
                .toLowerCase() ===
              header
                .trim()
                .toLowerCase()
          );

        return key
          ? row[key]
          : "";
      };


      /* ======================================================
         NAME VALIDATION
      ====================================================== */

      const hasNameColumn =
        Object.keys(rows[0]).some(
          (key) =>
            key
              .trim()
              .toLowerCase() ===
            "name"
        );


      if (!hasNameColumn) {

        toast.error(
          'The Excel file must contain a "Name" column.'
        );

        setJsonData([]);

        return;
      }


      /* ======================================================
         PARSE DATA
      ====================================================== */

      const parsedData =
        rows
          .map((row) => {

            const name =
              String(
                getValue(
                  row,
                  "Name"
                )
              ).trim();


            return {
              name,

              accountNumber:
                String(
                  getValue(
                    row,
                    "Account Number"
                  )
                ).trim(),

              currencyCode:
                normalizeCurrency(
                  getValue(
                    row,
                    "Currency"
                  )
                ),

              priceLevel:
                String(
                  getValue(
                    row,
                    "Pricing Level"
                  )
                ).trim()
                .toLowerCase(),

              repFirstName:
                String(
                  getValue(
                    row,
                    "First Name"
                  )
                ).trim(),

              repLastName:
                String(
                  getValue(
                    row,
                    "Last Name"
                  )
                ).trim(),

              phone:
                String(
                  getValue(
                    row,
                    "Phone"
                  )
                ).trim(),

              country:
                normalizeCountry(
                  getValue(
                    row,
                    "Country"
                  )
                ),

              address1:
                String(
                  getValue(
                    row,
                    "Address"
                  )
                ).trim(),

              address2:
                String(
                  getValue(
                    row,
                    "Address 2"
                  )
                ).trim(),

              city:
                String(
                  getValue(
                    row,
                    "City"
                  )
                ).trim(),

              province:
                String(
                  getValue(
                    row,
                    "Province"
                  )
                ).trim(),

              postalCode:
                String(
                  getValue(
                    row,
                    "Postal Code"
                  )
                ).trim(),

              website:
                String(
                  getValue(
                    row,
                    "Website"
                  )
                ).trim(),

              email1:
                String(
                  getValue(
                    row,
                    "Email 1"
                  )
                ).trim(),

              updatePrice:
                normalizeBoolean(
                  getValue(
                    row,
                    "Update Price"
                  )
                ),

              updateCost:
                normalizeBoolean(
                  getValue(
                    row,
                    "Update Cost"
                  )
                ),

              updateDescription:
                normalizeBoolean(
                  getValue(
                    row,
                    "Update Description"
                  )
                ),
            };
          })
          .filter(
            (row) =>
              row.name.length > 0
          );


      if (!parsedData.length) {

        toast.error(
          "No customer names were found."
        );

        setJsonData([]);

        return;
      }


      setFileName(
        file.name
      );


      setJsonData(
        parsedData
      );


      toast.success(
        `${parsedData.length} customers loaded successfully.`
      );

    } catch (error) {

      console.error(
        "Excel parsing error:",
        error
      );

      toast.error(
        "Unable to read the Excel file."
      );

      setJsonData([]);

    } finally {

      setIsReading(false);

    }
  };


  /* ==========================================================
     FILE INPUT
  ========================================================== */

  const handleFileChange = async (
    event: ChangeEvent<HTMLInputElement>
  ) => {

    const file =
      event.target.files?.[0];


    if (!file) {
      return;
    }


    await processFile(file);
  };


  /* ==========================================================
     DRAG & DROP
  ========================================================== */

  const handleDrop = async (
    event: DragEvent<HTMLDivElement>
  ) => {

    event.preventDefault();


    const file =
      event.dataTransfer.files?.[0];


    if (!file) {
      return;
    }


    await processFile(file);
  };


  /* ==========================================================
     CLEAR
  ========================================================== */

  const handleClear = () => {

    setFileName("");

    setJsonData([]);


    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };


  /* ==========================================================
     SAVE customerS
  ========================================================== */

const handleSave = async () => {
  if (!jsonData.length) {
    toast.error(
      "Please upload an Excel file first."
    );

    return;
  }

  console.log(
    "Bulk customer JSON:",
    JSON.stringify(jsonData, null, 2)
  );

  toast.success(
    `${jsonData.length} customers ready for bulk upload.`
  );
};


  /* ==========================================================
     CLOSE
  ========================================================== */

  const handleOpenChange = (
    value: boolean
  ) => {

    if (!value) {
      handleClear();
    }

    onOpenChange(value);
  };


  /* ==========================================================
     UI
  ========================================================== */

  return (
    <Sheet
      open={open}
      onOpenChange={
        handleOpenChange
      }
    >
      <SheetContent
        className="
          w-full
          sm:max-w-4xl
          p-0
        "
      >

        <FormSheetContent>

          {/* HEADER */}

          <FormSheetHeader>

            <div>

              <SheetTitle className="text-lg">
                Bulk Upload Customers
              </SheetTitle>

              <SheetDescription>
                Add multiple customers at once
                using an Excel file.
              </SheetDescription>

            </div>

          </FormSheetHeader>


          {/* BODY */}

          <FormSheetBody>

            <div className="space-y-7">

              {/* ==========================================
                  TEMPLATE
              ========================================== */}

              <section className="space-y-3">

                <div className="flex items-center gap-2">

                  <div
                    className="
                      flex
                      h-8
                      w-8
                      items-center
                      justify-center
                      rounded-md
                      bg-green-50
                      text-green-600
                    "
                  >
                    <FileSpreadsheet className="h-4 w-4" />
                  </div>

                  <div>

                    <h3 className="text-sm font-semibold">
                      Excel Template
                    </h3>

                    <p className="text-xs text-muted-foreground">
                      Download the template and
                      enter customer information.
                    </p>

                  </div>

                </div>


                <div
                  className="
                    flex
                    items-center
                    justify-between
                    rounded-lg
                    border
                    bg-muted/20
                    px-4
                    py-3
                  "
                >

                  <div>

                    <p className="text-sm font-medium">
                      Customer Import Template
                    </p>

                    <p className="mt-0.5 text-xs text-muted-foreground">
                      Contains all supported customer fields.
                    </p>

                  </div>


                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={
                      handleDownloadTemplate
                    }
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download Template
                  </Button>

                </div>

              </section>


              <div className="border-t" />


              {/* ==========================================
                  UPLOAD
              ========================================== */}

              <section className="space-y-3">

                <div className="flex items-center gap-2">

                  <div
                    className="
                      flex
                      h-8
                      w-8
                      items-center
                      justify-center
                      rounded-md
                      bg-green-50
                      text-green-600
                    "
                  >
                    <UploadCloud className="h-4 w-4" />
                  </div>

                  <div>

                    <h3 className="text-sm font-semibold">
                      Upload Excel
                    </h3>

                    <p className="text-xs text-muted-foreground">
                      Upload .xlsx, .xls or .csv file.
                    </p>

                  </div>

                </div>


                {/* DROPZONE */}

                <div
                  onDragOver={(event) =>
                    event.preventDefault()
                  }
                  onDrop={
                    handleDrop
                  }
                  onClick={() =>
                    fileInputRef.current?.click()
                  }
                  className="
                    group
                    cursor-pointer
                    rounded-lg
                    border-2
                    border-dashed
                    border-muted-foreground/20
                    bg-muted/10
                    px-6
                    py-8
                    text-center
                    transition
                    hover:border-green-500/50
                    hover:bg-green-50/40
                  "
                >

                  <Input
                    ref={fileInputRef}
                    type="file"
                    accept=".xlsx,.xls,.csv"
                    onChange={
                      handleFileChange
                    }
                    disabled={isReading}
                    className="hidden"
                  />


                  <div
                    className="
                      mx-auto
                      flex
                      h-12
                      w-12
                      items-center
                      justify-center
                      rounded-full
                      bg-green-50
                      text-green-600
                    "
                  >
                    <UploadCloud className="h-6 w-6" />
                  </div>


                  <p className="mt-3 text-sm font-medium">

                    {isReading
                      ? "Reading file..."
                      : "Click to upload or drag and drop"}

                  </p>


                  <p className="mt-1 text-xs text-muted-foreground">
                    XLSX, XLS or CSV
                  </p>

                </div>


                {/* SELECTED FILE */}

                {fileName && (

                  <div
                    className="
                      flex
                      items-center
                      justify-between
                      rounded-lg
                      border
                      border-green-200
                      bg-green-50/60
                      px-4
                      py-3
                    "
                  >

                    <div className="flex items-center gap-3">

                      <div
                        className="
                          flex
                          h-9
                          w-9
                          items-center
                          justify-center
                          rounded-md
                          bg-white
                          text-green-600
                          shadow-sm
                        "
                      >
                        <FileCheck2 className="h-5 w-5" />
                      </div>


                      <div>

                        <p className="text-sm font-medium">
                          {fileName}
                        </p>

                        <div className="mt-0.5 flex items-center gap-1 text-xs text-green-700">

                          <CheckCircle2 className="h-3.5 w-3.5" />

                          {jsonData.length} customers detected

                        </div>

                      </div>

                    </div>


                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={
                        handleClear
                      }
                    >
                      <Trash2 className="h-4 w-4 text-muted-foreground" />
                    </Button>

                  </div>

                )}

              </section>


              {/* ==========================================
                  PREVIEW
              ========================================== */}

              {jsonData.length > 0 && (

                <>

                  <div className="border-t" />


                  <section className="space-y-3">

                    <div className="flex items-center justify-between">

                      <div className="flex items-center gap-2">

                        <div
                          className="
                            flex
                            h-8
                            w-8
                            items-center
                            justify-center
                            rounded-md
                            bg-green-50
                            text-green-600
                          "
                        >
                          <FileCheck2 className="h-4 w-4" />
                        </div>


                        <div>

                          <h3 className="text-sm font-semibold">
                            Data Preview
                          </h3>

                          <p className="text-xs text-muted-foreground">
                            Review customers before saving.
                          </p>

                        </div>

                      </div>


                      <div
                        className="
                          rounded-full
                          bg-green-50
                          px-3
                          py-1
                          text-xs
                          font-medium
                          text-green-700
                        "
                      >
                        {jsonData.length} Records
                      </div>

                    </div>


                    {/* TABLE */}

                    <div className="overflow-hidden rounded-lg border">

                      <div
                        className="
                          grid
                          grid-cols-[60px_1fr_140px_140px]
                          border-b
                          bg-muted/40
                          px-4
                          py-2.5
                          text-xs
                          font-semibold
                          uppercase
                          tracking-wide
                          text-muted-foreground
                        "
                      >
                        <div>#</div>

                        <div>Customer Name</div>

                        <div>Currency</div>

                        <div>Pricing Level</div>
                      </div>


                      <div className="max-h-[300px] overflow-y-auto">

                        {jsonData.map(
                          (
                            item,
                            index
                          ) => (

                            <div
                              key={`${item.name}-${index}`}
                              className="
                                grid
                                grid-cols-[60px_1fr_140px_140px]
                                border-b
                                px-4
                                py-2.5
                                text-sm
                                last:border-b-0
                              "
                            >

                              <div className="text-muted-foreground">
                                {index + 1}
                              </div>


                              <div className="font-medium">
                                {item.name}
                              </div>


                              <div>
                                {item.currencyCode || "-"}
                              </div>


                              <div>
                                {item.priceLevel || "-"}
                              </div>

                            </div>

                          )
                        )}

                      </div>

                    </div>


                    {/* JSON */}

                    <details className="rounded-lg border">

                      <summary
                        className="
                          cursor-pointer
                          px-4
                          py-2.5
                          text-xs
                          font-medium
                          text-muted-foreground
                          hover:text-foreground
                        "
                      >
                        View JSON
                      </summary>


                      <div
                        className="
                          max-h-[250px]
                          overflow-auto
                          border-t
                          bg-muted/20
                          p-4
                        "
                      >
                        <pre className="text-xs">
                          {JSON.stringify(
                            jsonData,
                            null,
                            2
                          )}
                        </pre>
                      </div>

                    </details>

                  </section>

                </>
              )}

            </div>

          </FormSheetBody>


          {/* FOOTER */}

          <FormSheetFooter>

            <FormSubmitButton
              isPending={creating}
              disabled={
                !jsonData.length ||
                isReading ||
                creating
              }
              onClick={
                handleSave
              }
              className="w-full"
            >
              {creating
                ? "Saving Customers..."
                : "Save Customers"}
            </FormSubmitButton>

          </FormSheetFooter>

        </FormSheetContent>
      </SheetContent>
    </Sheet>
  );
}


/* ============================================================
   CURRENCY SYMBOL
============================================================ */

function getCurrencySymbol(
  code?: string
) {
  switch (
    code?.toUpperCase()
  ) {

    case "USD":
      return "$";

    case "CAD":
      return "$";

    case "EUR":
      return "€";

    case "GBP":
      return "£";

    case "AUD":
      return "$";

    default:
      return "";
  }
}