import { CreateBrandRequest, Brand } from "@/types/brand.types";
import { api } from "./api";

interface BrandResponse {
  success: boolean;
  data: Brand[];
  count: number;
  error: any;
}

export interface BrandQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  pagination?: boolean;

  archived?: boolean;

  // Allow any future query params
  [key: string]: any;
}

export const BrandApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getBrands: builder.query<
      BrandResponse,
      BrandQueryParams
    >({
      query: ({ page = 1, limit = 10, search = "",    pagination = true }) => ({
        url: "brand",
        method: "GET",
        params: {
          // archived: false,
          pagination: true,
          page,
          limit,
          ...(search ? { search } : {}),
        },
      }),

      providesTags: ["Brands"],
    }),

    createBrand: builder.mutation<any, CreateBrandRequest>({
      query: (body) => ({
        url: "brand",
        method: "POST",
        body,
      }),

      invalidatesTags: ["Brands"],
    }),    

    updateBrand: builder.mutation<
      any,
      {
        id: number;
        body: any;
      }
    >({
      query: ({ id, body }) => ({
        url: `brand/${id}`,
        method: "PUT",
        body,
      }),

      invalidatesTags: ["Brands"],
    }),

    updateStatusBrand: builder.mutation<
      any,
      {
        id: number;
        archived: boolean;
      }
    >({
      query: ({ id, archived }) => ({
        url: `brand/${id}`,
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

      invalidatesTags: ["Brands"],
    }),  
    
    deleteBrand: builder.mutation<
      any,
      {
        id: number;
      }
    >({
      query: ({ id }) => ({
        url: `brand/${id}`,
        method: "DELETE",
      }),

      invalidatesTags: ["Brands"],
    }),
  }),
});

export const { useGetBrandsQuery, useCreateBrandMutation, useUpdateBrandMutation, useUpdateStatusBrandMutation, useDeleteBrandMutation } = BrandApi;