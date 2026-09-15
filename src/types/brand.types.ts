export interface Brand {
  id: number;
  lightspeed_brand_id: string;
  name: string;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
  manufacturerID: number | null;
  createTime?: string;
  timeStamp?: string;
}

export interface CreateBrandRequest {
  name: string;
}