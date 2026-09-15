import { CreateCategoryRequest, Category } from "@/types/category.types";
import { api } from "./api";

interface CategoryResponse {
  success: boolean;
  data: Category[];
  count: number;
  error: any;
}

interface CategoryDetailResponse {
  success: boolean;
  data: Category;
  error: any;
}


export interface CategoryQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  pagination?: boolean;


  publish_to_ecom?: boolean;
  archived?: boolean;

  // Allow any future query params
  [key: string]: any;
}

interface FeaturedCategoryResponse {
  success: boolean;
  data: Category[];
}

export const CategoryApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getCategories: builder.query<
      CategoryResponse,CategoryQueryParams>({
     query: ({
      page = 1,
      limit = 10,
      search = "",
      pagination = true,
    }) => ({
      url: "category",
      method: "GET",
      params: {
        pagination,
        page,
        limit,
        ...(search ? { search } : {}),
          },
      }),

      providesTags: ["Categories"],
    }),

    getCategory: builder.query<
        CategoryDetailResponse,
        number
    >({
        query: (id) => ({
            url: `category/${id}`,
            method: "GET",
        }),

       providesTags: ["Categories"],
    }),

    createCategory: builder.mutation<any, CreateCategoryRequest>({
      query: (body) => ({
        url: "category",
        method: "POST",
        body,
      }),

      invalidatesTags: ["Categories"],
    }),      

    updateCategory: builder.mutation<
      any,
      {
        id: number;
        body: CreateCategoryRequest;
      }
    >({
      query: ({ id, body }) => ({
        url: `category/${id}`,
        method: "PUT",
        body,
      }),
      
      async onQueryStarted(
        { id },
        { dispatch, queryFulfilled }
      ) {
        try {
          await queryFulfilled;
        } catch {}
      },

      invalidatesTags: ["Categories"],
    }),

    getFeaturedCategories: builder.query<
      FeaturedCategoryResponse,
      { limit?: number } | void
    >({
      query: ({ limit = 10 } = {}) => ({
        url: "category/featured",
        method: "GET",
        params: {
          limit,
        },
      }),
      providesTags: ["Categories"],
    }),

    deleteCategory: builder.mutation<
      any,
      {
        id: number;
      }
    >({
      query: ({ id }) => ({
        url: `category/${id}`,
        method: "DELETE",
      }),

      invalidatesTags: ["Categories"],
    }),
    
  }),
});

export const { useGetCategoriesQuery, useGetCategoryQuery, useCreateCategoryMutation, useUpdateCategoryMutation, useGetFeaturedCategoriesQuery, useDeleteCategoryMutation } = CategoryApi;