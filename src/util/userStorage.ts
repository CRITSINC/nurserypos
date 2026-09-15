import storage from "@/util/localStorage";
import { CartItem } from "@/redux/slices/cart.slice";
import { Product } from "@/types/product.types";

export const getUserStorageKey = (
  type: "cart" | "wishlist",
  userId: number | string
) => {
  return type === "cart"
    ? `glenecho_cart_${userId}`
    : `glenecho_wishlist_${userId}`;
};

export const getUserCart = (
  userId: number | string
): CartItem[] => {
  const key = getUserStorageKey("cart", userId);

  const cart = storage.get(key);

  return Array.isArray(cart) ? cart : [];
};

export const getUserWishlist = (
  userId: number | string
): Product[] => {
  const key = getUserStorageKey("wishlist", userId);

  const wishlist = storage.get(key);

  return Array.isArray(wishlist) ? wishlist : [];
};

export const saveUserCart = (
  userId: number | string,
  items: CartItem[]
) => {
  const key = getUserStorageKey("cart", userId);

  storage.set(key, items);
};

export const saveUserWishlist = (
  userId: number | string,
  items: Product[]
) => {
  const key = getUserStorageKey("wishlist", userId);

  storage.set(key, items);
};

export const removeUserCart = (
  userId: number | string
) => {
  const key = getUserStorageKey("cart", userId);

//   storage.remove(key);
};

export const removeUserWishlist = (
  userId: number | string
) => {
  const key = getUserStorageKey("wishlist", userId);

//   storage.remove(key);
};