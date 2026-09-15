
import type { ApiResponse } from "@/types/api.types";
import { api } from "./api";

export interface TaxClass {
  id: number;
  lightspeed_tax_class_id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  lightspeed_sync_info?: {
    entity_map_id: number;
    lightspeed_id: string;
    local_id: number;
    last_sync: string | null;
    hash: string;
  } | null;
}

export type TaxClassResponse = ApiResponse<TaxClass[]>;

export const taxClassApi = api.injectEndpoints({
  overrideExisting: false,

  endpoints: (builder) => ({
    getTaxClasses: builder.query<TaxClassResponse, void>({
      query: () => ({
        url: "/tax-class",
        method: "GET",
      }),
      providesTags: ["TaxClass"],
    }),
  }),
});

export const {
  useGetTaxClassesQuery,
} = taxClassApi;