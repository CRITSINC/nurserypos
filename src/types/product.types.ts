export interface Product {
  id: number;

  lightspeed_item_id: string;

  product_matrix_id: number | null;

  brand_id: number | null;

  category_id: number | null;

  system_sku: string | null;

  custom_sku: string | null;

  upc: string | null;

  ean: string | null;

  manufacturer_sku: string | null;

  description: string | null;

  item_type: string;

  price: number;

  msrp: number;

  online_price: number;

  default_cost: number;

  avg_cost: number;

  qoh: number;

  discountable: boolean;

  taxable: boolean;

  tax_class_id:
    | number
    | string
    | null;

  tax_class_name?: string | null;

  publish_to_ecom: boolean;

  serialized: boolean;

  attribute_1_value: string | null;

  attribute_2_value: string | null;

  attribute_3_value: string | null;

  note: string | null;

  display_note: boolean;

  archived: boolean;

  tsv_search?: string;

  createdAt: string;

  updatedAt: string;

  deletedAt: string | null;

  category: ProductCategory | null;

  brand: ProductBrand | null;

  matrix: ProductMatrix | null;

  tags: ProductTag[];

  images: ProductImage[];

  inventories: ProductInventory[];

  productVendors: ProductVendor[];

  itemID: number;

  systemID: string;

  customSKU: string | null;

  manufacturerSKU: string | null;

  createTime: string;

  timeStamp: string;

  lightspeed_sync_info: ProductSyncInfo;
}

export interface ProductCategory {
  id: number;
  lightspeed_category_id: string;
  parent_id: number | null;
  name: string;
  full_path_name: string;
  node_depth: number;

  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface ProductBrand {
  id: number;
  lightspeed_brand_id: string;
  name: string;

  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface ProductMatrix {
  id: number;
  lightspeed_matrix_id: string;
  description: string;

  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface ProductInventory {
  id: number;

  product_id: number;

  shop_id: number;

  unit_cost: number;

  qoh: number;

  sellable: number;

  reserved: number;

  layaway: number;

  special_order: number;

  workorder: number;

  total_value: number;

  total_sale_value: number;

  reorder_point: number;

  reorder_level: number;

  lightspeed_item_shop_id: string;

  createdAt: string;

  updatedAt: string;

  deletedAt: string | null;

  shop: ProductShop;
}

export interface ProductShop {
  id: number;
  lightspeed_shop_id: string;
  name: string;
  archived: boolean;

  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface ProductTag {
  id: number;
  name: string;
}

export interface ProductImage {
  id: number;
  product_id: number;

  lightspeed_image_id: string;
  lightspeed_url: string;
  local_path: string;

  filename: string;
  is_featured: boolean;
  download_status: string;

  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface ProductSyncInfo {
  entity_map_id: number;
  lightspeed_id: string;
  local_id: number;
  last_sync: string;
  hash: string;
}

export interface ProductMutationResponse {
    success: boolean;
    data:  Product;
}

export type ProductSort =
    | "relevance"
    | "price_asc"
    | "price_desc"
    | "name_asc"
    | "name_desc";

export interface CategoryProductsQuery {
  id: number;

  page?: number;
  limit?: number;
  pagination?: boolean;

  subcategory_ids?: string;
  brandId?: string;
  vendorId?: string;

  minPrice?: number;
  maxPrice?: number;

  sort?: string;
  order?: "asc" | "desc";
}

export interface CategoryProductsResponse {
  success: boolean;

  data: {
    category: ProductCategory;
    subcategories: ProductCategory[];
    products: Product[];
  };

  count: number;
  error: any;
}

export interface ProductVendor {
  id: number;

  product_id: number;

  vendor_id: number;

  vendor_cost: number;

  lightspeed_item_vendor_num_id: string | null;

  vendor_sku: string | null;

  is_primary: boolean;

  lead_time: number;

  minimum_order_qty: number;

  createdAt: string;

  updatedAt: string;

  vendor: ProductVendorDetails | null;
}

export interface ProductVendorDetails {
  id: number;

  lightspeed_vendor_id: string;

  name: string;

  archived: boolean;

  account_number: string | null;

  price_level: string | null;

  update_price: boolean;

  update_cost: boolean;

  update_description: boolean;

  share_sell_through?: boolean;

  b2b_seller_uid?: string | null;

  purchasing_currency_rate?: number;

  purchasing_currency_code: string | null;

  purchasing_currency_symbol: string | null;

  rep_first_name: string | null;

  rep_last_name: string | null;

  address_1: string | null;

  address_2: string | null;

  city: string | null;

  state: string | null;

  state_code: string | null;

  zip: string | null;

  country: string | null;

  country_code: string | null;

  phone: string | null;

  email: string | null;

  website: string | null;

  createdAt: string;

  updatedAt: string;

  deletedAt: string | null;
}