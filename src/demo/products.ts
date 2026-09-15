import { Product } from "@/services/products/types";

export const demoProducts: Product[] = [
  {
    id: "1",
    name: "iPhone 16",
    description: "Latest Apple smartphone",
    cost_price: 800,
    selling_price: 999,
    stock: 25,
    min_stock_threshold: 5,
    category_id: "1",
    image_url: "/demo/iphone.jpg",
    slug: "iphone-16",
    sku: "IPHONE16",
    published: true,
    created_at: "2026-01-01T10:00:00Z",
    updated_at: "2026-01-01T10:00:00Z",
    categories: {
      name: "Electronics",
      slug: "electronics",
    },
  },
];