import { api } from "./api";

export interface CurrencyRate {
  id: number;
  currencyRateID: number;
  currencyCode: string;
  rate: string;
  createTime: string | null;
  timeStamp: string | null;
  lightspeed_currency_rate_id?: string;
  currency_code?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CurrencyRatesResponse {
  success: boolean;
  data: CurrencyRate[];
}

export interface CurrencyRateResponse {
  success: boolean;
  data: CurrencyRate;
}

export interface GetCurrencyRatesParams {
  search?: string;
  sort?: "asc" | "desc";
  page?: number;
  limit?: number;
  pagination?: boolean;
}

export const currencyRateApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getCurrencyRates: builder.query<
      CurrencyRatesResponse,
      GetCurrencyRatesParams | void
    >({
      query: (params) => ({
        url: "currency-rate",
        method: "GET",
        params: {
          ...(params?.search && { search: params.search }),
          ...(params?.sort && { sort: params.sort }),
          ...(params?.page && { page: params.page }),
          ...(params?.limit && { limit: params.limit }),
          pagination: params?.pagination ?? false,
        },
      }),
      providesTags: ["CurrencyRate"],
    }),

    getCurrencyRate: builder.query<CurrencyRateResponse, number>({
      query: (id) => ({
        url: `currency-rate/${id}`,
        method: "GET",
      }),
      providesTags: (_result, _error, id) => [
        { type: "CurrencyRate", id },
      ],
    }),
  }),

  overrideExisting: false,
});

export const {
  useGetCurrencyRatesQuery,
  useGetCurrencyRateQuery,
} = currencyRateApi;