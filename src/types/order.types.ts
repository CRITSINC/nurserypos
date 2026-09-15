export type OrderStatus =
  | "pending"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "refunded";

export interface OrderAddress {
  zip: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  address1: string | null;
  lastName: string | null;
  shipNote: string | null;
  firstName: string | null;
  countryCode: string | null;
}

export interface OrderProduct {
  price: number;
  msrp: number;
  online_price: number;
  default_cost: number;
  avg_cost: number;
  id: number;
  lightspeed_item_id: string | null;
  product_matrix_id: number | null;
  brand_id: number | null;
  category_id: number | null;
  system_sku: string | null;
  custom_sku: string | null;
  upc: string | null;
  ean: string | null;
  manufacturer_sku: string | null;
  description: string | null;
  qoh: number;
  discountable: boolean;
  taxable: boolean;
  item_type: string;
  publish_to_ecom: boolean;
  serialized: boolean;
  attribute_1_value: string | null;
  attribute_2_value: string | null;
  attribute_3_value: string | null;
  note: string | null;
  display_note: boolean;
  archived: boolean;
  tsv_search: string | null;
  tax_class_id: string | null;
  tax_class_name: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  quantity: number;
  price: string;
  discount: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  product: OrderProduct;
}

export interface Order {
  id: number;
  order_uuid: string;
  user_id: number;
  status: OrderStatus | string;
  total_amount: string;
  subtotal_amount: string;
  tax_amount: string;
  shipping_amount: string;
  stripe_payment_intent: string | null;
  lightspeed_sale_id: string | null;
  lightspeed_ship_to_id: string | null;
  ticket_number: string | null;
  shipped_locally: boolean;
  shipped_at: string | null;
  carrier: string | null;
  tracking_number: string | null;
  estimated_delivery: string | null;
  shipping_address: OrderAddress | null | undefined;
  billing_address: OrderAddress | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  items: OrderItem[];
}

export interface OrdersResponse {
  success: boolean;
  data: Order[];
  count: number;
  error: unknown;
}

export interface GetOrdersParams {
  page?: number;
  limit?: number;
  pagination?: boolean;
  search?: string;
  status?: string;
  user_id?: number;
  [key: string]: unknown;
}

export interface UpdateOrderRequest {
  order_uuid?: string | null;
  user_id?: number | null;
  status?: string;
  total_amount?: string | null;
  subtotal_amount?: string | null;
  tax_amount?: string | null;
  shipping_amount?: string | null;
  stripe_payment_intent?: string | null;
  lightspeed_sale_id?: string | null;
  lightspeed_ship_to_id?: string | null;
  ticket_number?: string | null;
  shipped_locally?: boolean;
  shipped_at?: string | null;
  carrier?: string | null;
  tracking_number?: string | null;
  estimated_delivery?: string | null;

  shipping_address?: {
    zip: string | null;
    city: string | null;
    state: string | null;
    country: string | null;
    address1: string | null;
    lastName: string | null;
    shipNote: string | null;
    firstName: string | null;
    countryCode: string | null;
  } | null;

  billing_address?: {
    zip: string | null;
    city: string | null;
    state: string | null;
    country: string | null;
    address1: string | null;
    lastName: string | null;
    shipNote: string | null;
    firstName: string | null;
    countryCode: string | null;
  } | null;
}