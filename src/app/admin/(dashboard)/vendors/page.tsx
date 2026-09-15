"use client";

import { useState } from "react";

import PageTitle from "@/components/admin/shared/PageTitle";

import VendorsTable from "./_components/VendorsTable";
import VendorFilter from "./_components/VendorFilter";
import VendorForm from "./_components/VendorForm";
import BulkUpload from "./_components/BulkUpload";

import { Button } from "@/components/admin/ui/button";

import {
  Plus,
  SquarePen,
} from "lucide-react";

import { Vendor } from "@/types/vendor.types";

import { VendorFormData } from "./_components/schema";

export type VendorStatus =
  | "all"
  | "active"
  | "archived";


export default function VendorsPage() {

  const [open, setOpen] =
    useState(false);

  const [bulkOpen, setBulkOpen] =
    useState(false);

  const [selectedVendor, setSelectedVendor] =
    useState<Vendor | null>(null);

  const [
    status,
    setStatus,
  ] = useState<VendorStatus>(
    "active"
  );


  const [
    appliedStatus,
    setAppliedStatus,
  ] = useState<VendorStatus>(
    "active"
  );

  const handleAdd = () => {
    setSelectedVendor(null);
    setOpen(true);
  };

  const handleEdit = (
    vendor: Vendor
  ) => {
    setSelectedVendor(vendor);
    setOpen(true);
  };

  const handleClose = (
    value: boolean
  ) => {

    setOpen(value);

    if (!value) {
      setSelectedVendor(null);
    }
  };

  const handleBulkAdd = () => {
    setBulkOpen(true);
  };

  const handleResetFilter = () => {

    setStatus(
      "active"
    );

    setAppliedStatus(
      "active"
    );
  };


  const handleApplyFilter = (
    selectedStatus: VendorStatus
  ) => {

    setAppliedStatus(
      selectedStatus
    );
  };


  function mapVendorToFormData(vendor: any): VendorFormData {
    const phones = vendor.Contact?.Phones?.ContactPhone ?? [];

    const workPhone =
      phones.find((phone: any) => phone.useType === "Work")?.number ??
      vendor.phone ??
      "";

    const mobilePhone =
      phones.find((phone: any) => phone.useType === "Mobile")?.number ??
      vendor.phone_mobile ??
      "";

    const faxPhone =
      phones.find((phone: any) => phone.useType === "Fax")?.number ??
      vendor.phone_fax ??
      "";

    return {
      name:
        vendor.name ??
        "",

      accountNumber:
        vendor.account_number ??
        vendor.accountNumber ??
        "",

      currencyCode:
        vendor.purchasing_currency_code ??
        vendor.purchasingCurrency?.code ??
        "",

      enabled:
        vendor.archived === false,

      catalog:
        "",

      priceLevel:
        vendor.price_level ??
        vendor.priceLevel ??
        "",

      updatePrice:
        vendor.update_price ??
        vendor.updatePrice ??
        false,

      updateCost:
        vendor.update_cost ??
        vendor.updateCost ??
        false,

      updateDescription:
        vendor.update_description ??
        vendor.updateDescription ??
        false,

      repFirstName:
        vendor.rep_first_name ??
        vendor.Reps?.VendorRep?.firstName ??
        "",

      repLastName:
        vendor.rep_last_name ??
        vendor.Reps?.VendorRep?.lastName ??
        "",

      // Phone
      phone:
        workPhone,

      // Mobile
      mobile:
        mobilePhone,

      // Fax
      fax:
        faxPhone,

      country:
        vendor.country ??
        vendor.Contact?.Addresses?.ContactAddress?.country ??
        "",

      address1:
        vendor.address_1 ??
        vendor.Contact?.Addresses?.ContactAddress?.address1 ??
        "",

      address2:
        vendor.address_2 ??
        vendor.Contact?.Addresses?.ContactAddress?.address2 ??
        "",

      city:
        vendor.city ??
        vendor.Contact?.Addresses?.ContactAddress?.city ??
        "",

      province:
        vendor.state ??
        vendor.Contact?.Addresses?.ContactAddress?.state ??
        "",

      postalCode:
        vendor.zip ??
        vendor.Contact?.Addresses?.ContactAddress?.zip ??
        "",

      website:
        vendor.website ??
        vendor.Contact?.Websites ??
        "",

      email1:
        vendor.email ??
        vendor.Contact?.Emails?.ContactEmail?.address ??
        "",

      email2:
        vendor.email_secondary ??
        "",

      custom:
        vendor.custom ??
        "",

      notes:
        "",
    };
  }


  return (
    <section>

      <PageTitle>
        Vendors
      </PageTitle>


      <div
        className="
          mb-6
          flex
          items-center
          justify-end
          gap-3
        "
      >

        {/* <Button
          variant="outline"
          onClick={
            handleBulkAdd
          }
        >
          <SquarePen
            className="mr-2 h-4 w-4"
          />

          Bulk Upload
        </Button> */}


        <Button
          onClick={
            handleAdd
          }
        >
          <Plus
            className="mr-2 h-4 w-4"
          />

          Add Vendor
        </Button>

      </div>


      <VendorFilter
        status={
          status
        }

        onStatusChange={
          setStatus
        }

        onFilter={
          handleApplyFilter
        }

        onReset={
          handleResetFilter
        }
      />

      <VendorsTable
        status={appliedStatus}
        onEdit={handleEdit}
      />


      <VendorForm

        open={
          open
        }

        onOpenChange={
          handleClose
        }

        isEdit={
          !!selectedVendor
        }

        vendorId={
          selectedVendor?.id
        }

        initialData={
          selectedVendor
            ? mapVendorToFormData(
              selectedVendor
            )
            : undefined
        }

      />


      <BulkUpload

        open={
          bulkOpen
        }

        onOpenChange={
          setBulkOpen
        }

      />

    </section>
  );
}