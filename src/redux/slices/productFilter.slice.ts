import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface ProductFilterState {
  category: string;
  rating?: number | null;
  [key: string]: any;
}

const initialState: ProductFilterState = {
  category: "",
  rating: null,
};

const productFilterSlice = createSlice({
  name: "productFilter",

  initialState,

  reducers: {
    updateProductFilters(
      state,
      action: PayloadAction<Record<string, any>>
    ) {
      Object.assign(state, action.payload);
    },

    updateProductCategory(
      state,
      action: PayloadAction<string>
    ) {
      state.category = action.payload;
    },

    updateRating(
      state,
      action: PayloadAction<number | null>
    ) {
      state.rating = action.payload;
    },

    clearFilters() {
      return initialState;
    },
  },
});

export const {
  updateProductFilters,
  updateProductCategory,
  updateRating,
  clearFilters,
} = productFilterSlice.actions;

export default productFilterSlice.reducer;