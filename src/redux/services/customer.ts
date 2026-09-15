import { api } from "./api";

import {
  Customer,
  CustomerMutationResponse,
} from "@/types/customer.types";

export interface CustomerTypeOption {
  id: number;
  name: string;
}

export interface DiscountOption {
  id: number;
  name: string;
}

export interface TaxCategoryOption {
  id: number;
  tax_1_name: string;
}

interface LookupResponse<T> {
  success: boolean;
  data: T[];
  count?: number;
  error?: any;
}

interface CustomerResponse {
  success: boolean;
  data: Customer[];
  count: number;
  error: any;
}

export interface CustomerQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  archived?: boolean;
}


export const customerApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getCustomers: builder.query<
      CustomerResponse,
      CustomerQueryParams
    >({
      query: ({
        page = 1,
        limit = 10,
        search = "",
        archived,
      }) => ({
        url: "customer",

        method: "GET",

        params: {
          pagination: true,

          page,

          limit,

          ...(search
            ? {
                search,
              }
            : {}),

          ...(archived !== undefined
            ? {
                archived,
              }
            : {}),
        },
      }),

      providesTags: [
        "Customers",
      ],
    }),

    getCustomerTypes: builder.query<
      LookupResponse<CustomerTypeOption>,
      void
    >({
      query: () => ({
        url: "customer-type",
        method: "GET",
        params: {
          sort: "asc",
        },
      }),
    }),

    getDiscounts: builder.query<
      LookupResponse<DiscountOption>,
      void
    >({
      query: () => ({
        url: "discount",
        method: "GET",
        params: {
          archived: false,
        },
      }),
    }),

    getTaxCategories: builder.query<
      LookupResponse<TaxCategoryOption>,
      void
    >({
      query: () => ({
        url: "tax-category",
        method: "GET",
        params: {
          sort: "asc",
        },
      }),
    }),

    createCustomer: builder.mutation<
      any,
      Record<string, any>
    >({
      query: (body) => ({
        url: "customer",
        method: "POST",
        body,
      }),

      invalidatesTags: ["Customers"],
    }),

    updateCustomer: builder.mutation<
      any,
      {
        id: number;
        body: Record<string, any>;
      }
    >({
      query: ({ id, body }) => ({
        url: `customer/${id}`,
        method: "PUT",
        body,
      }),

      invalidatesTags: ["Customers"],
    }),

    deleteCustomer: builder.mutation<
      any,
      number
    >({
      query: (id) => ({
        url: `customer/${id}`,
        method: "DELETE",
      }),
    }),

    updateStatusCustomer: builder.mutation<
      any,
      {
        id: number;
        archived: boolean;
      }
    >({
      query: ({
        id,
        archived,
      }) => ({
        url: `customer/${id}`,
        method: "PUT",
        body: {
          archived,
        },
      }),

      invalidatesTags: ["Customers"],
    }),

    getCustomerById: builder.query<
      CustomerMutationResponse,
      number
    >({
      query: (id) => ({
        url: `customer/${id}`,
        method: "GET",
      }),

      providesTags: (
        _result,
        _error,
        id
      ) => [
        {
          type: "Customers",
          id,
        },
      ],
    }),

  }),
});


export const {
  useGetCustomersQuery,

  useGetCustomerTypesQuery,
  useGetDiscountsQuery,
  useGetTaxCategoriesQuery,

  useCreateCustomerMutation,
  useUpdateCustomerMutation,
  useDeleteCustomerMutation,
  useUpdateStatusCustomerMutation,
  useGetCustomerByIdQuery,

} = customerApi;