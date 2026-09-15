export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  is_read: boolean;
  published: boolean;
  created_at: string;
  image_url?: string;
  type?: string;
}