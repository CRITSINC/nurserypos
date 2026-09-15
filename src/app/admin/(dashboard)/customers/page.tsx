"use client";

import {
  useState,
} from "react";

import PageTitle from "@/components/admin/shared/PageTitle";

import CustomersTable from "./_components/CustomersTable";
import CustomerFilter from "./_components/CustomerFilter";
import CustomerForm from "./_components/CustomerForm";
import BulkUpload from "./_components/BulkUpload";

import {
  Button,
} from "@/components/admin/ui/button";

import {
  Plus,
  SquarePen,
} from "lucide-react";

import {
  CustomerFormData,
} from "./_components/schema";

import {
  Customer,
} from "@/types/customer.types";


export type CustomerStatus =
  | "all"
  | "active"
  | "archived";


export default function CustomersPage() {

  const [
    status,
    setStatus,
  ] = useState<CustomerStatus>(
    "active"
  );


  const [
    appliedStatus,
    setAppliedStatus,
  ] = useState<CustomerStatus>(
    "active"
  );

  const [
    open,
    setOpen,
  ] = useState(false);


  const [
    bulkOpen,
    setBulkOpen,
  ] = useState(false);


  const [
    selectedCustomer,
    setSelectedCustomer,
  ] = useState<Customer | null>(
    null
  );

  const handleAdd = () => {

    setSelectedCustomer(
      null
    );

    setOpen(true);
  };

  const handleEdit = (
    customer: Customer
  ) => {

    setSelectedCustomer(
      customer
    );

    setOpen(true);
  };

  const handleClose = (
    value: boolean
  ) => {

    setOpen(value);

    if (!value) {

      setSelectedCustomer(
        null
      );
    }
  };

  const handleBulkAdd = () => {

    setBulkOpen(true);
  };

  const handleApplyFilter = (
    selectedStatus: CustomerStatus
  ) => {

    setAppliedStatus(
      selectedStatus
    );
  };

  const handleResetFilter = () => {

    setStatus(
      "active"
    );

    setAppliedStatus(
      "active"
    );
  };

const mapCustomerToForm = (
  customer: Customer
): Partial<CustomerFormData> => {
  return {
    type:
      customer.customer_type_id != null
        ? String(customer.customer_type_id)
        : "none",

    created:
      customer.createdAt
        ? new Date(
            customer.createdAt
          ).toLocaleDateString()
        : "",

    discount:
      customer.discount_id != null
        ? String(customer.discount_id)
        : "default",

    salesTax:
      customer.tax_category_id != null
        ? String(customer.tax_category_id)
        : "default",

    first_name:
      customer.first_name ?? "",

    last_name:
      customer.last_name ?? "",

    title:
      customer.title ?? "",

    company:
      customer.company ?? "",

    dob:
      customer.dob
        ? String(customer.dob).split("T")[0]
        : "",

    address_1:
      customer.address_1 ?? "",

    address_2:
      customer.address_2 ?? "",

    city:
      customer.city ?? "",

    state:
      customer.state ?? "",

    zip:
      customer.zip ?? "",

    country:
      customer.country ?? "",

    country_code:
      customer.country_code ?? "",

    phone_home:
      customer.phone_home ?? "",

    phone_work:
      customer.phone_work ?? "",

    phone_mobile:
      customer.phone_mobile ?? "",

    phone_pager:
      customer.phone_pager ?? "",

    phone_fax:
      customer.phone_fax ?? "",

    email_primary:
      customer.email_primary ?? "",

    email_secondary:
      customer.email_secondary ?? "",

    website:
      customer.website ?? "",

    custom:
      customer.custom ?? "",

    tags:
      Array.isArray(customer.tags)
        ? customer.tags.join(", ")
        : customer.tags ?? "",

    no_email:
      customer.no_email ?? false,

    no_phone:
      customer.no_phone ?? false,

    no_mail:
      customer.no_mail ?? false,

    contact_consent:
      false,

    note:
      customer.note ?? "",

    note_is_public:
      customer.note_is_public ?? false,
  };
};


  return (
    <section>

      <PageTitle>
        Customers
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

          Add Customer
        </Button>

      </div>

      <CustomerFilter

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

      <CustomersTable

        status={
          appliedStatus
        }

        onEdit={
          handleEdit
        }

      />

      <CustomerForm

        open={
          open
        }

        onOpenChange={
          handleClose
        }

        isEdit={
          !!selectedCustomer
        }

        customerId={
          selectedCustomer?.id
        }

        initialData={
          selectedCustomer
            ? mapCustomerToForm(
                selectedCustomer
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