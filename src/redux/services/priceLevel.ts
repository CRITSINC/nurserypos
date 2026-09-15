import { api } from "./api";

export interface PriceLevel {
  id: number;
  priceLevelID: number;
  name: string;
  archived: boolean;
  canBeArchived: boolean;
  type: string;
  Calculation: string;
  createTime: string | null;
  timeStamp: string | null;

  lightspeed_price_level_id?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface PriceLevelsResponse {
  success: boolean;
  data: PriceLevel[];
}

export interface PriceLevelResponse {
  success: boolean;
  data: PriceLevel;
}

export interface GetPriceLevelsParams {
  search?: string;
  sort?: "asc" | "desc";
  page?: number;
  limit?: number;
  pagination?: boolean;
}

export const priceLevelApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getPriceLevels: builder.query<
      PriceLevelsResponse,
      GetPriceLevelsParams | void
    >({
      query: (params) => ({
        url: "price-level",
        method: "GET",
        params: {
          ...(params?.search && {
            search: params.search,
          }),
          ...(params?.sort && {
            sort: params.sort,
          }),
          ...(params?.page && {
            page: params.page,
          }),
          ...(params?.limit && {
            limit: params.limit,
          }),
          pagination: params?.pagination ?? false,
        },
      }),

      providesTags: ["PriceLevel"],
    }),

    getPriceLevel: builder.query<
      PriceLevelResponse,
      number
    >({
      query: (id) => ({
        url: `price-level/${id}`,
        method: "GET",
      }),

      providesTags: (_result, _error, id) => [
        {
          type: "PriceLevel",
          id,
        },
      ],
    }),
  }),

  overrideExisting: false,
});

export const {
  useGetPriceLevelsQuery,
  useGetPriceLevelQuery,
} = priceLevelApi;