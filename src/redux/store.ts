import { configureStore } from "@reduxjs/toolkit";

import { api } from "./services/api";

import authReducer from "./slices/auth.slice";
import cartReducer from "./slices/cart.slice";
import wishlistReducer from "./slices/wishlist.slice";
import compareReducer from "./slices/compare.slice";
import productReducer from "./slices/product.slice";
import productFilterReducer from "./slices/productFilter.slice";
import quickViewReducer from "./slices/quickView.slice";

export const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,

    auth: authReducer,

    cart: cartReducer,
    wishlist: wishlistReducer,
    compare: compareReducer,
    products: productReducer,
    productFilters: productFilterReducer,
    quickView: quickViewReducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),

  devTools: process.env.NODE_ENV !== "production",
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;