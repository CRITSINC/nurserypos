import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import filterProductList from "@/util/filterProduct";
import searchItemsByText from "@/util/searchItemsByText";
import { deleteProduct, findProductIndexById } from "@/util/util";

declare global {
  interface Window {
    products?: unknown;
  }
}

export interface Product {
  id: number;
  [key: string]: any;
}

interface ProductState {
  items: Product[];
  loading: boolean;
  error: string | null;
}

const initialState: ProductState = {
  items: [],
  loading: false,
  error: null,
};

export const fetchProduct = createAsyncThunk(
  "product/fetchProduct",
  async (
    {
      searchTerm,
      url,
      filters,
    }: {
      searchTerm: string;
      url: string;
      filters: Record<string, any>;
    },
    thunkAPI
  ) => {
    try {
      const response = await fetch(url);
      const data = await response.json();

      if (typeof window !== "undefined") {
        window.products = data;
      }

      const searchedItems = searchItemsByText(searchTerm, data);

      return filterProductList(searchedItems, filters);
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

export const fetchMoreProduct = createAsyncThunk(
  "product/fetchMoreProduct",
  async (
    {
      url,
      total,
    }: {
      url: string;
      total: number;
    },
    thunkAPI
  ) => {
    try {
      const response = await fetch(url);
      const data = await response.json();

      return {
        products: data,
        total,
      };
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

const productSlice = createSlice({
  name: "product",

  initialState,

  reducers: {
    addProduct(state, action: PayloadAction<Product>) {
      state.items.push(action.payload);
    },

    deleteProductById(
      state,
      action: PayloadAction<number>
    ) {
      state.items = deleteProduct(
        state.items,
        action.payload
      );
    },

    updateProduct(state, action: PayloadAction<Product>) {
      const index = findProductIndexById(
        state.items,
        action.payload.id
      );

      if (index !== -1) {
        state.items[index] = action.payload;
      }
    },
  },

  extraReducers: (builder) => {
    builder

      .addCase(fetchProduct.pending, (state) => {
        state.loading = true;
      })

      .addCase(fetchProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })

      .addCase(fetchProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(fetchMoreProduct.fulfilled, (state, action) => {
        const merged = [
          ...state.items,
          ...action.payload.products,
        ];

        state.items =
          action.payload.total &&
          merged.length > action.payload.total
            ? merged.slice(0, action.payload.total)
            : merged;
      });
  },
});

export const {
  addProduct,
  deleteProductById,
  updateProduct,
} = productSlice.actions;

export default productSlice.reducer;