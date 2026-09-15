import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import storage from "@/util/localStorage";
import { deleteProduct, findProductIndexById } from "@/util/util";

export interface CompareItem {
  id: number;
  [key: string]: any;
}

interface CompareState {
  modal: boolean;
  items: CompareItem[];
}

const initialState: CompareState = {
  modal: false,
  items: [],
};

const compareSlice = createSlice({
  name: "compare",
  initialState,

  reducers: {
    initCompare(state, action: PayloadAction<CompareItem[]>) {
      state.items = action.payload;
    },

    openCompare(state) {
      state.modal = true;
    },

    closeCompare(state) {
      state.modal = false;
    },

    addToCompare(state, action: PayloadAction<CompareItem>) {
      const index = findProductIndexById(
        state.items,
        action.payload.id
      );

      if (index !== -1) return;

      state.items.push(action.payload);

      storage.set("glenecho_compare", state.items);
    },

    deleteFromCompare(
      state,
      action: PayloadAction<number>
    ) {
      state.items = deleteProduct(
        state.items,
        action.payload
      );

      storage.set("glenecho_compare", state.items);
    },

    clearCompare(state) {
      state.items = [];
      storage.set("glenecho_compare", []);
    },
  },
});

export const {
  initCompare,
  openCompare,
  closeCompare,
  addToCompare,
  deleteFromCompare,
  clearCompare,
} = compareSlice.actions;

export default compareSlice.reducer;