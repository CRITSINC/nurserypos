import { Profile, UpdateProfileRequest, UpdateProfileResponse } from "@/types/profile.types";
import { api } from "./api";

import { ApiResponse } from "@/types/api.types";



export const profileApi = api.injectEndpoints({
  overrideExisting: false,

  endpoints: (builder) => ({
    updateProfile: builder.mutation<
      ApiResponse<UpdateProfileResponse>,
      UpdateProfileRequest
    >({
      query: (body) => ({
        url: "auth/profile",
        method: "PUT",
        body,
      }),

      invalidatesTags: ["Profile"],
    }),
  }),
});

export const {
  useUpdateProfileMutation,
} = profileApi;