export interface Vendor {
  id: number;
  lightspeed_vendor_id: string;
  name: string;
  archived: boolean;
  account_number: string | null;
  price_level: string | null;
  update_price: boolean;
  update_cost: boolean;
  update_description: boolean;
  share_sell_through: boolean;
  b2b_seller_uid: string | null;
  purchasing_currency_code: string |null;
  purchasing_currency_symbol: string | null;
  purchasing_currency_rate: number | null;
  rep_first_name: string | null;
  rep_last_name: string | null;
  email: string | null;
  phone: string | null;
}

export interface CreateVendorRequest {
  name: string;

  accountNumber?: string;

  priceLevel?: string;

  updatePrice: boolean;

  updateCost: boolean;

  updateDescription: boolean;

  b2bSellerUID?: string;

  purchasingCurrency?: {
    code?: string;
    symbol?: string;
    rate?: string;
  };

  Reps?: {
    VendorRep?: {
      firstName?: string;
      lastName?: string;
    };
  };

  address_1?: string;

  address_2?: string;

  city?: string;

  state?: string;

  state_code?: string;

  zip?: string;

  country?: string;

  country_code?: string;

  phone?: string;

  email?: string;

  website?: string;
}

export interface VendorMutationResponse {
    success: boolean;
    data:  Vendor;
}