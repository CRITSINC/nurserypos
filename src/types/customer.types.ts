export interface Customer {
  id: number;

  lightspeed_customer_id: string | null;

  first_name: string;
  last_name: string;
  dob: string | null;

  title: string | null;

  company: string | null;
  company_registration_number: string | null;
  vat_number: string | null;

  customer_type_id: number | null;
  discount_id: number | null;
  tax_category_id: number | null;

  credit_account_id: number | null;

  address_1: string | null;
  address_2: string | null;
  city: string | null;
  state: string | null;
  state_code: string | null;
  zip: string | null;
  country: string | null;
  country_code: string | null;

  phone_mobile: string | null;
  phone_home: string | null;
  phone_work: string | null;
  phone_pager: string | null;
  phone_fax: string | null;

  email_primary: string | null;
  email_secondary: string | null;

  website: string | null;

  custom: string | null;

  tags: string[];

  no_email: boolean;
  no_phone: boolean;
  no_mail: boolean;

  note: string | null;
  note_is_public: boolean;

  archived: boolean;

  contact_id: string | null;

  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;

  customerType?: CustomerType | null;

  creditAccount?: CreditAccount | null;

  discount?: Discount | null;

  taxCategory?: TaxCategory | null;

  customerID?: number;
  systemID?: string;
  createTime?: string;
  timeStamp?: string;

  lightspeed_sync_info?: CustomerSyncInfo | null;
}


export interface CustomerType {
  id: number;
  lightspeed_customer_type_id: string;
  name: string;

  tax_category_id?: number | null;
  discount_id?: number | null;

  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}


export interface CreditAccount {
  id: number;
  lightspeed_credit_account_id: string;
  account_number: string;
  name: string;

  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}


export interface Discount {
  id: number;
  lightspeed_discount_id: string;

  name: string;

  discount_amount: number;
  discount_percent: number;

  require_customer: boolean;
  archived: boolean;

  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}


export interface TaxCategory {
  id: number;
  lightspeed_tax_category_id: string;

  tax_1_rate: number;
  tax_2_rate: number;

  is_tax_inclusive: boolean;

  tax_1_name: string | null;
  tax_2_name: string | null;

  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}


export interface CustomerSyncInfo {
  entity_map_id: number;
  lightspeed_id: string;
  local_id: number;
  last_sync: string;
  hash: string;
}


export interface CustomerMutationResponse {
  success: boolean;
  data: Customer;
}