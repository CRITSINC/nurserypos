export interface Tag {
  id: number;
  lightspeed_tag_id: string;
  name: string;
  archived: boolean;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
  tagID: number | null;
  createTime?: string;
  timeStamp?: string;
}

export interface CreateTagRequest {
  name: string;
}