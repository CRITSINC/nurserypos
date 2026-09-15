import { api } from "./api";
import { ApiResponse } from "@/types/api.types";
import { User } from "@/types/auth.types";


export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface ForgotPasswordRequest {
  email: string
}

export interface ResetPasswordRequest {
  token: string;
  password: string;
}

export interface LoginData {
  accessToken: string;
  user: User;
}

export interface RegisterData {
  accessToken: string;
  user: User;
}

export interface ForgotPasswordData {
  message: string;
}

export interface ResetPasswordData {
  message: string;
}

export const authApi = api.injectEndpoints({
  overrideExisting: false,

  endpoints: (builder) => ({
    login: builder.mutation<ApiResponse<LoginData>, LoginRequest>({
      query: (body) => ({
        url: "auth/login",
        method: "POST",
        body,
      }),
    }),

    register: builder.mutation<ApiResponse<RegisterData>, RegisterRequest>({
      query: (body) => ({
        url: "auth/register",
        method: "POST",
        body,
      }),
    }),

    forgotPassword: builder.mutation<
      ApiResponse<ForgotPasswordData>,
      ForgotPasswordRequest
    >({
      query: (body) => ({
        url: "auth/forgot-password",
        method: "POST",
        body,
      }),
    }),
   
    resetPassword: builder.mutation<
      ApiResponse<ResetPasswordData>,
      ResetPasswordRequest
    >({
      query: (body) => ({
        url: "auth/reset-password",
        method: "POST",
        body,
      }),
    }),

    logout: builder.mutation<ApiResponse<{ message: string }>, void>({
      query: () => ({
        url: "auth/logout",
        method: "POST",
      }),
    }),

    refreshAccess: builder.query<ApiResponse<{ accessToken: string }>, void>({
      query: () => ({
        url: "auth/refresh-access",
        method: "POST",
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useLogoutMutation,
  useLazyRefreshAccessQuery,
} = authApi;