import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface QuickViewProduct {
  id: number;
  [key: string]: any;
}

type QuickViewState = QuickViewProduct | null;

const initialState = null as QuickViewState;

const quickViewSlice = createSlice({
  name: "quickView",
  initialState,

  reducers: {
    openQuickView(
      _state,
      action: PayloadAction<QuickViewProduct>
    ) {
      return action.payload;
    },

    closeQuickView() {
      return null;
    },
  },
});

export const {
  openQuickView,
  closeQuickView,
} = quickViewSlice.actions;

export default quickViewSlice.reducer;