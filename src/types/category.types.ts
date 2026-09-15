export interface CategoryParent {
  id: number;
  name: string;
  full_path_name: string;
  node_depth: number;
  lightspeed_category_id: string;
}

export interface CategoryChild {
  id: number;
  name: string;
  full_path_name?: string | null;
  node_depth?: number;
  lightspeed_category_id?: string;
}

export interface Category {
  id: number;
  lightspeed_category_id: string;
  parent_id: number | null;
  name: string;
  full_path_name: string | null;
  node_depth: number;

  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;

  parent: CategoryParent | null;
  children: CategoryChild[];

  // Legacy/duplicate API fields
  categoryID?: number;
  nodeDepth?: string;
  fullPathName?: string;
  leftNode?: number;
  rightNode?: number;
  createTime?: string;
  timeStamp?: string;
  parentID?: number | null;
}

export interface CreateCategoryRequest {
  name: string;
  parent_id?: number;
  full_path_name?: string;
}

export interface UpdateCategoryRequest {
  name: string;
}