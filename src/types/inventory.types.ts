export interface Inventory {
  unit_cost: number;
  total_value: number;
  total_sale_value: number;
  id: number;
  product_id: number;
  shop_id: number;
  qoh: number;
  reorder_point: number;
  reorder_level: number;
  lightspeed_item_shop_id: string;
  reserved: number;
  layaway: number;
  special_order: number;
  workorder: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;

  product: InventoryProduct;
  shop: InventoryShop;

  // Lightspeed API camelCase fields
  unitCost: number;
  reorderPoint: number;
  reorderLevel: number;
  lightspeedItemShopID: string;
  totalValue: number;
  totalSaleValue: number;
  specialOrder: number;
  createTime: string;
  timeStamp: string;
}

export interface InventoryProduct {
  price: number;
  msrp: number;
  online_price: number;
  default_cost: number;
  avg_cost: number;
  id: number;
  lightspeed_item_id: string;
  product_matrix_id: number | null;
  brand_id: number | null;
  category_id: number;
  system_sku: string;
  custom_sku: string | null;
  upc: string | null;
  ean: string | null;
  manufacturer_sku: string | null;
  description: string;
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
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface InventoryShop {
  id: number;
  lightspeed_shop_id: string;
  name: string;
  archived: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface CreateInventoryRequest {
  name: string;
}