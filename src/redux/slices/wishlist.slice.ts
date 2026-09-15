import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import storage from "@/util/localStorage";
import { Product } from "@/types/product.types";

interface WishlistState {
  modal: boolean;
  items: Product[];
  userId: number | string | null;
}

const initialState: WishlistState = {
  modal: false,
  items: [],
  userId: null,
};

const getWishlistKey = (userId: number | string) =>
  `glenecho_wishlist_${userId}`;

const persistWishlist = (
  userId: number | string | null,
  items: Product[]
) => {
  if (userId === null || userId === undefined) return;
  storage.set(getWishlistKey(userId), items);
};

const wishlistSlice = createSlice({
  name: "wishlist",

  initialState,

  reducers: {
    initWishlist(
      state,
      action: PayloadAction<
        | Product[]
        | {
            userId: number | string;
            items: Product[];
          }
      >
    ) {
      if (Array.isArray(action.payload)) {
        state.items = action.payload;
        return;
      }

      state.userId = action.payload.userId;
      state.items = action.payload.items;
    },

    setWishlistUserId(
      state,
      action: PayloadAction<number | string | null>
    ) {
      state.userId = action.payload;
    },

    resetWishlist(state) {
      state.items = [];
      state.userId = null;
    },

    openWishlist(state) {
      state.modal = true;
    },

    closeWishlist(state) {
      state.modal = false;
    },

    addToWishlist(
      state,
      action: PayloadAction<Product>
    ) {
      const exists = state.items.some(
        (item) => item.id === action.payload.id
      );

      if (!exists) {
        state.items.push(action.payload);
        persistWishlist(state.userId, state.items);
      }
    },

    deleteFromWishlist(
      state,
      action: PayloadAction<number>
    ) {
      state.items = state.items.filter(
        (item) => item.id !== action.payload
      );

      persistWishlist(state.userId, state.items);
    },

    clearWishlist(state) {
      state.items = [];
      persistWishlist(state.userId, state.items);
    },
  },
});

export const {
  initWishlist,
  setWishlistUserId,
  resetWishlist,
  openWishlist,
  closeWishlist,
  addToWishlist,
  deleteFromWishlist,
  clearWishlist,
} = wishlistSlice.actions;

export default wishlistSlice.reducer;
