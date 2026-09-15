import { Notification } from "@/types/notifications.types";


export const demoNotifications: Notification[] = [
  {
    id: "1",
    user_id: "1",
    title: "New Order",
    message: "A new order #INV-1001 has been placed.",
    is_read: false,
    published: true,
    created_at: "2026-06-30T09:30:00Z",
  },
  {
    id: "2",
    user_id: "1",
    title: "Product Updated",
    message: "iPhone 16 stock has been updated.",
    is_read: true,
    published: true,
    created_at: "2026-06-29T14:00:00Z",
  },
];