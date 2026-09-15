import { api } from "./api";
import { CreateVendorRequest, Vendor, VendorMutationResponse } from "@/types/vendor.types";

interface VendorResponse {
  success: boolean;
  data: Vendor[];
  count: number;
  error: any;
}

export const vendorApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getVendors: builder.query<
      VendorResponse,
      {
        page?: number;
        limit?: number;
        search?: string;
        archived?: boolean,
      }
    >({
      query: ({ page = 1, limit = 10, search = "", archived }) => ({
        url: "vendor",
        method: "GET",
        params: {
          pagination: true,
          page,
          limit,
          ...(search ? { search } : {}),
          ...(archived !== undefined
            ? {
              archived,
            }
            : {}),
        },
      }),

      providesTags: ["Vendors"],
    }),

    createVendor: builder.mutation<any, CreateVendorRequest>({
      query: (body) => ({
        url: "vendor",
        method: "POST",
        body,
      }),

      invalidatesTags: ["Vendors"],
    }),

    updateVendor: builder.mutation<
      any,
      {
        id: number;
        body: any;
      }
    >({
      query: ({ id, body }) => ({
        url: `vendor/${id}`,
        method: "PUT",
        body,
      }),

      invalidatesTags: ["Vendors"],
    }),

    updateStatusVendor: builder.mutation<
      any,
      {
        id: number;
        archived: boolean;
      }
    >({
      query: ({ id, archived }) => ({
        url: `vendor/${id}`,
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
        } catch { }
      },

      invalidatesTags: ["Vendors"],
    }),

    getVendorById: builder.query<VendorMutationResponse, number>({
      query: (id) => ({
        url: `vendor/${id}`,
        method: "GET",
      }),

      providesTags: (_result, _error, id) => [
        { type: "Vendors", id },
      ],
    }),

    deleteVendor: builder.mutation<
      any,
      {
        id: number;
      }
    >({
      query: ({ id }) => ({
        url: `vendor/${id}`,
        method: "DELETE",
      }),

      invalidatesTags: ["Vendors"],
    }),

  }),
});

export const { useGetVendorsQuery, useCreateVendorMutation, useUpdateVendorMutation, useUpdateStatusVendorMutation, useGetVendorByIdQuery, useDeleteVendorMutation } = vendorApi;