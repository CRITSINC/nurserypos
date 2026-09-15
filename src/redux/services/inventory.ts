import { CreateInventoryRequest, Inventory } from "@/types/inventory.types";
import { api } from "./api";

interface InventoryResponse {
  success: boolean;
  data: Inventory[];
  count: number;
  error: any;
}

export const InventoryApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getInventories: builder.query<
      InventoryResponse,
      {
        page?: number;
        limit?: number;
        search?: string;
      }
    >({
      query: ({ page = 1, limit = 10, search = "" }) => ({
        url: "inventory",
        method: "GET",
        params: {
          // archived: false,
          pagination: true,
          page,
          limit,
          ...(search ? { search } : {}),
        },
      }),

      providesTags: ["Inventories"],
    }),

    createInventory: builder.mutation<any, CreateInventoryRequest>({
      query: (body) => ({
        url: "inventory",
        method: "POST",
        body,
      }),

      invalidatesTags: ["Inventories"],
    }),      

    updateInventory: builder.mutation<
      any,
      {
        id: number;
        body: any;
      }
    >({
      query: ({ id, body }) => ({
        url: `inventory/${id}`,
        method: "PUT",
        body,
      }),

      invalidatesTags: ["Inventories"],
    }),
    
    updateStatusInventory: builder.mutation<
      any,
      {
        id: number;
        archived: boolean;
      }
    >({
      query: ({ id, archived }) => ({
        url: `inventory/${id}`,
        method: "PUT",
        body: {
          archived,
        },
      }),

      async onQueryStarted(
        { id, archived },
        { dispatch, queryFulfilled }
      ) {
        try {
          await queryFulfilled;
        } catch {}
      },

      invalidatesTags: ["Inventories"],
    }),    
  }),
});

export const { useGetInventoriesQuery, useCreateInventoryMutation, useUpdateInventoryMutation, useUpdateStatusInventoryMutation } = InventoryApi;