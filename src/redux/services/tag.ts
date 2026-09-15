import { CreateTagRequest, Tag } from "@/types/tag.types";
import { api } from "./api";

interface TagResponse {
  success: boolean;
  data: Tag[];
  count: number;
  error: any;
}

export const TagApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getTags: builder.query<
      TagResponse,
      {
        page?: number;
        limit?: number;
        search?: string;
        archived?: boolean,
      }
    >({
      query: ({ page = 1, limit = 10, search = "", archived }) => ({
        url: "tag",
        method: "GET",
        params: {
          // archived: false,
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

      providesTags: ["Tags"],
    }),

    createTag: builder.mutation<any, CreateTagRequest>({
      query: (body) => ({
        url: "tag",
        method: "POST",
        body,
      }),

      invalidatesTags: ["Tags"],
    }),      

    updateTag: builder.mutation<
      any,
      {
        id: number;
        body: any;
      }
    >({
      query: ({ id, body }) => ({
        url: `tag/${id}`,
        method: "PUT",
        body,
      }),

      invalidatesTags: ["Tags"],
    }),
    
    updateStatusTag: builder.mutation<
      any,
      {
        id: number;
        archived: boolean;
      }
    >({
      query: ({ id, archived }) => ({
        url: `tag/${id}`,
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

      invalidatesTags: ["Tags"],
    }),  
    
    deleteTag: builder.mutation<
      any,
      {
        id: number;
      }
    >({
      query: ({ id }) => ({
        url: `tag/${id}`,
        method: "DELETE",
      }),

      invalidatesTags: ["Tags"],
    }),
  }),
});

export const { useGetTagsQuery, useCreateTagMutation, useUpdateTagMutation, useUpdateStatusTagMutation, useDeleteTagMutation } = TagApi;