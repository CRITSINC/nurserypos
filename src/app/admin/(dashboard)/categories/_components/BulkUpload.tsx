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


type CategoryRow = {
  name: string;
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
    fileName,
    setFileName,
  ] = useState("");

  const [
    jsonData,
    setJsonData,
  ] = useState<CategoryRow[]>([]);

  const [
    isReading,
    setIsReading,
  ] = useState(false);

  const fileInputRef =
    useRef<HTMLInputElement>(null);

  const handleDownloadTemplate = () => {
    const worksheet =
      XLSX.utils.aoa_to_sheet([
        ["Name"],
      ]);

    worksheet["!cols"] = [
      {
        wch: 40,
      },
    ];

    const workbook =
      XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      "Categories"
    );

    XLSX.writeFile(
      workbook,
      "category-bulk-upload.xlsx"
    );
  };

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
        >(worksheet, {
          defval: "",
          raw: false,
        });


      if (!rows.length) {
        toast.error(
          "The Excel file is empty."
        );

        setJsonData([]);

        return;
      }


      /*
       * Find Name column.
       */
      const nameKey =
        Object.keys(
          rows[0]
        ).find(
          (key) =>
            key
              .trim()
              .toLowerCase() ===
            "name"
        );


      if (!nameKey) {
        toast.error(
          'The Excel file must contain a "Name" column.'
        );

        setJsonData([]);

        return;
      }


      /*
       * Convert to API format.
       */
      const parsedData =
        rows
          .map((row) => ({
            name: String(
              row[nameKey] ?? ""
            ).trim(),
          }))
          .filter(
            (row) =>
              row.name.length > 0
          );


      if (!parsedData.length) {
        toast.error(
          "No category names were found."
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
        `${parsedData.length} categories loaded successfully.`
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


  /*
   * ==========================================
   * FILE INPUT
   * ==========================================
   */
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


  /*
   * ==========================================
   * DRAG & DROP
   * ==========================================
   */
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


  /*
   * ==========================================
   * CLEAR
   * ==========================================
   */
  const handleClear = () => {
    setFileName("");
    setJsonData([]);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };


  /*
   * ==========================================
   * SAVE
   * ==========================================
   */
  const handleSave = async () => {
    if (!jsonData.length) {
      toast.error(
        "Please upload an Excel file first."
      );

      return;
    }

    /*
     * Connect bulk API here.
     */
    console.log(
      "Bulk category JSON:",
      jsonData
    );

    toast.success(
      `${jsonData.length} categories ready to upload.`
    );
  };


  /*
   * ==========================================
   * CLOSE
   * ==========================================
   */
  const handleOpenChange = (
    value: boolean
  ) => {
    if (!value) {
      handleClear();
    }

    onOpenChange(value);
  };


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

          {/* ==================================================
              HEADER
          ================================================== */}
          <FormSheetHeader>
            <div>
              <SheetTitle className="text-lg">
                Bulk Upload Categories
              </SheetTitle>

              <SheetDescription>
                Add multiple categories at once
                using an Excel file.
              </SheetDescription>
            </div>
          </FormSheetHeader>


          {/* ==================================================
              BODY
          ================================================== */}
          <FormSheetBody>
            <div className="space-y-7">

              {/* =================================================
                  STEP 1 — EXCEL TEMPLATE
              ================================================= */}
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
                      Start with the provided template.
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
                      Category Import Template
                    </p>

                    <p className="mt-0.5 text-xs text-muted-foreground">
                      Excel file with a Name column
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


              {/* =================================================
                  DIVIDER
              ================================================= */}
              <div className="border-t" />


              {/* =================================================
                  STEP 2 — UPLOAD
              ================================================= */}
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


                {/* ----------------------------------------------
                    DROPZONE
                ---------------------------------------------- */}
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
                      transition
                      group-hover:bg-green-100
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


                {/* ----------------------------------------------
                    SELECTED FILE
                ---------------------------------------------- */}
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

                          {jsonData.length} categories
                          detected
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


              {/* =================================================
                  STEP 3 — PREVIEW
              ================================================= */}
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
                            Review the categories before saving.
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


                    {/* ------------------------------------------
                        TABLE
                    ------------------------------------------ */}
                    <div
                      className="
                        overflow-hidden
                        rounded-lg
                        border
                      "
                    >

                      {/* Header */}
                      <div
                        className="
                          grid
                          grid-cols-[70px_minmax(0,1fr)]
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
                        <div>
                          #
                        </div>

                        <div>
                          Category Name
                        </div>
                      </div>


                      {/* Rows */}
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
                                grid-cols-[70px_minmax(0,1fr)]
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
                            </div>
                          )
                        )}

                      </div>

                    </div>


                    {/* JSON representation */}
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
                          max-h-[200px]
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

          <FormSheetFooter>
{/* 
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() =>
                handleOpenChange(false)
              }
            >
              Cancel
            </Button> */}


            <FormSubmitButton
              isPending={false}
              disabled={
                !jsonData.length ||
                isReading
              }
              onClick={
                handleSave
              }
              className="w-full"
            >
              Save Categories
            </FormSubmitButton>

          </FormSheetFooter>

        </FormSheetContent>
      </SheetContent>
    </Sheet>
  );
}