import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import storage from "@/util/localStorage";

export interface CartItem {
  id: number;
  quantity?: number;
  [key: string]: any;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  userId: number | string | null;
}

const initialState: CartState = {
  items: [],
  isOpen: false,
  userId: null,
};

const getCartKey = (userId: number | string) =>
  `glenecho_cart_${userId}`;

const persistCart = (
  userId: number | string | null,
  items: CartItem[]
) => {
  if (userId === null || userId === undefined) return;
  storage.set(getCartKey(userId), items);
};

const cartSlice = createSlice({
  name: "cart",
  initialState,

  reducers: {
    initCart(
      state,
      action: PayloadAction<
        | CartItem[]
        | {
            userId: number | string;
            items: CartItem[];
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

    setCartUserId(
      state,
      action: PayloadAction<number | string | null>
    ) {
      state.userId = action.payload;
    },

    resetCart(state) {
      state.items = [];
      state.userId = null;
    },

    openCart(state) {
      state.isOpen = true;
    },

    closeCart(state) {
      state.isOpen = false;
    },

    addToCart(state, action: PayloadAction<CartItem>) {
      const index = state.items.findIndex(
        (item) => item.id === action.payload.id
      );

      if (index >= 0) {
        state.items[index].quantity =
          (state.items[index].quantity ?? 1) + 1;
      } else {
        state.items.push({
          ...action.payload,
          quantity: action.payload.quantity ?? 1,
        });
      }

      persistCart(state.userId, state.items);
    },

    deleteFromCart(state, action: PayloadAction<number>) {
      state.items = state.items.filter(
        (item) => item.id !== action.payload
      );

      persistCart(state.userId, state.items);
    },

    increaseQuantity(state, action: PayloadAction<number>) {
      const item = state.items.find(
        (item) => item.id === action.payload
      );

      if (!item) return;

      item.quantity = (item.quantity ?? 1) + 1;

      persistCart(state.userId, state.items);
    },

    decreaseQuantity(state, action: PayloadAction<number>) {
      const index = state.items.findIndex(
        (item) => item.id === action.payload
      );

      if (index === -1) return;

      if ((state.items[index].quantity ?? 1) > 1) {
        state.items[index].quantity!--;
      } else {
        state.items.splice(index, 1);
      }

      persistCart(state.userId, state.items);
    },

    clearCart(state) {
      state.items = [];
      persistCart(state.userId, state.items);
    },
  },
});

export const {
  initCart,
  setCartUserId,
  resetCart,
  openCart,
  closeCart,
  addToCart,
  deleteFromCart,
  increaseQuantity,
  decreaseQuantity,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;
