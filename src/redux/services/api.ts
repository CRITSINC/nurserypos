import {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
  createApi,
  fetchBaseQuery,
} from "@reduxjs/toolkit/query/react";

import type { RootState } from "../store";

import { clearAuth, updateAccessToken } from "../slices/auth.slice";
import Error from "@/lib/Error";
import { toasterError } from "@/components/core/Toaster";
import { removeRoleCookie } from "@/lib/cookies";

const baseUrl =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/";

const baseQuery = fetchBaseQuery({
  baseUrl,
  credentials: "include",

prepareHeaders: (headers, { getState, endpoint }) => {
  const token = (getState() as RootState).auth.accessToken;

  if (token) {
    headers.set("Authorization", `Bearer ${token}`); 
  } 

  return headers;
}
});

const baseQueryWithReAuth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (!result.error) {
    return result;
  }

  const errorData: any = result.error.data;

  if (!errorData?.error?.code) {
    return result;
  }

  const action = await Error.handle(errorData);

  /**
   * Show Toast
   */
  if (action?.toast) {
    toasterError(action.toast);
  }

  /**
   * Refresh Access Token
   */
  if (action?.refresh) {
    const refreshResult = await baseQuery(
      {
        url: "auth/refresh-access",
        method: "POST",
      },
      api,
      extraOptions
    );

    if (refreshResult.data) {
      const response: any = refreshResult.data;

      api.dispatch(
        updateAccessToken(response.data.accessToken)
      );

      // Retry original request
      result = await baseQuery(args, api, extraOptions);

      return result;
    } 
    else{
      api.dispatch(clearAuth());
    }


    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }

    return refreshResult;
  }

  /**
   * Logout
   */
  if (action?.signOut) {
    api.dispatch(clearAuth());

    if (typeof window !== "undefined") {
      removeRoleCookie();

      window.location.href = "/login";
    }
  }

  return result;
};

export const api = createApi({
  reducerPath: "api",

  baseQuery: baseQueryWithReAuth,

  tagTypes: [
    "Auth",
    "Products",
    "Categories",
    "Orders",
    "Customers",
    "Dashboard",
    "Users",
    "Vendors",
    "Tags",
    "Brands",
    "LightspeedDashboard",
    "LightspeedQueue",
    "LightspeedReadOnly",
    "Profile",
    "Inventories",
    "HomepageBanners",
    "CurrencyRate",
    "PriceLevel",
    "TaxClass"
  ],

  endpoints: (builder) => ({
    dynamicRequest: builder.mutation<
      any,
      {
        method: string;
        url: string;
        body?: any;
      }
    >({
      query: ({ method, url, body }) => ({
        url,
        method,
        body,
      }),
    }),
  }),
});

export const { useDynamicRequestMutation } = api;