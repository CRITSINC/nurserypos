import { api } from "./api";

import {
  CategoryProductsQuery,
  CategoryProductsResponse,
  Product,
  ProductMutationResponse,
} from "@/types/product.types";

interface ProductResponse {
  success: boolean;
  data: Product[];
  count: number;
  error: any;
}

export interface ProductQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  pagination?: boolean;

  category_id?: string;
  brand_id?: string;
  vendor_id?: string;
  tag_id?: string;

  minPrice?: number;
  maxPrice?: number;

  publish_to_ecom?: boolean;
  archived?: boolean;

  sort?: string;
  order?: "asc" | "desc";

  sort_by?:
    | "relevance"
    | "price_asc"
    | "price_desc"
    | "name_asc"
    | "name_desc";

  [key: string]: any;
}

export interface SearchProductsResponse {
  success: boolean;
  data: {
    products: Product[];

    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };

    facets: {
      brands: {
        id: number;
        name: string;
        count: number;
      }[];

      categories: {
        id: number;
        name: string;
        count: number;
      }[];

      tags: {
        id: number;
        name: string;
        count: number;
      }[];

      priceRange: {
        min: number;
        max: number;
      };
    };
  };
}

interface LandingSectionsResponse {
  success: boolean;

  data: {
    recentlyAdded: Product[];
    topSelling: Product[];
    trending: Product[];
    popular: Product[];
  };

  error: any;
}

export interface ProductSearchQuery {
  q?: string;

  page?: number;
  limit?: number;

  sort?: string;
  order?: "asc" | "desc";

  brandId?: string;
  categoryId?: string;
  vendorId?: string;

  minPrice?: number;
  maxPrice?: number;

  tagId?: string;
}

export const productApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query<
      ProductResponse,
      ProductQueryParams
    >({
      query: ({
        page = 1,
        limit = 10,
        pagination = true,
        ...params
      }) => ({
        url: "product",
        method: "GET",
        params: {
          page,
          limit,
          pagination,
          ...params,
        },
      }),

      providesTags: ["Products"],
    }),

    searchProducts: builder.query<
      SearchProductsResponse,
      ProductSearchQuery
    >({
      query: ({
        page = 1,
        limit = 10,
        ...params
      }) => ({
        url: "product/search",
        method: "GET",
        params: {
          page,
          limit,
          ...params,
        },
      }),

      providesTags: ["Products"],
    }),

    createProduct: builder.mutation<
      any,
      Record<string, any>
    >({
      query: (body) => ({
        url: "product",
        method: "POST",
        body,
      }),

      invalidatesTags: ["Products"],
    }),

    updateProduct: builder.mutation<
      any,
      {
        id: number;
      } & Record<string, any>
    >({
      query: ({ id, ...body }) => ({
        url: `product/${id}`,
        method: "PUT",
        body,
      }),

      invalidatesTags: ["Products"],
    }),

    deleteProduct: builder.mutation<
      any,
      {
        id: number;
      }
    >({
      query: ({ id }) => ({
        url: `product/${id}`,
        method: "DELETE",
      }),

      invalidatesTags: ["Products"],
    }),

    updateStatusProduct: builder.mutation<
      any,
      {
        id: number;
        archived: boolean;
      }
    >({
      query: ({ id, archived }) => ({
        url: `product/${id}`,
        method: "PUT",
        body: {
          archived,
        },
      }),

      invalidatesTags: ["Products"],
    }),

    getProductById: builder.query<
      ProductMutationResponse,
      number
    >({
      query: (id) => ({
        url: `product/${id}`,
        method: "GET",
      }),

      providesTags: (_result, _error, id) => [
        {
          type: "Products",
          id,
        },
      ],
    }),

    categoryProducts: builder.query<
      CategoryProductsResponse,
      CategoryProductsQuery
    >({
      query: ({
        id,
        page = 1,
        limit = 10,
        pagination = true,
        ...params
      }) => ({
        url: `category/${id}/products`,
        method: "GET",
        params: {
          page,
          limit,
          pagination,
          ...params,
        },
      }),

      providesTags: ["Products"],
    }),

    addProductImages: builder.mutation<
      any,
      {
        id: number;
        images: File[];
      }
    >({
      query: ({ id, images }) => {
        const formData = new FormData();

        images.forEach((image) => {
          formData.append("images", image);
        });

        return {
          url: `product/${id}/images`,
          method: "POST",
          body: formData,
        };
      },

      invalidatesTags: ["Products"],
    }),

    deleteProductImage: builder.mutation<
      any,
      {
        id: number;
        imageId: number;
      }
    >({
      query: ({ id, imageId }) => ({
        url: `product/${id}/images/${imageId}`,
        method: "DELETE",
      }),

      invalidatesTags: ["Products"],
    }),

    getOrdersStock: builder.query<
      any,
      {
        ids: string;
      }
    >({
      query: ({ ids }) => ({
        url: "product/stock",
        method: "GET",
        params: {
          ids,
        },
      }),

      providesTags: ["Products"],
    }),

    getLandingSections: builder.query<
      LandingSectionsResponse,
      void
    >({
      query: () => ({
        url: "product/landing-sections",
        method: "GET",
      }),

      providesTags: ["Products"],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useSearchProductsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useUpdateStatusProductMutation,
  useGetProductByIdQuery,
  useCategoryProductsQuery,
  useAddProductImagesMutation,
  useDeleteProductImageMutation,
  useGetOrdersStockQuery,
  useGetLandingSectionsQuery,
} = productApi;