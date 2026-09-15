import { api } from "./api";
import { ApiResponse } from "@/types/api.types";

import {
  DashboardResponse,
  OAuthUrlResponse,
  ReadOnlyResponse,
  ActionResponse,
  QueueJob,
} from "@/types/lightspeed.types";

export const lightspeedApi = api.injectEndpoints({
  overrideExisting: false,

  endpoints: (builder) => ({
    dashboard: builder.query<ApiResponse<DashboardResponse>, void>({
      query: () => ({
        url: "lightspeed/dashboard",
      }),

      providesTags: ["LightspeedDashboard"],
    }),

    queue: builder.query<
      ApiResponse<QueueJob[]>,
      {
        page: number;
        limit: number;
      }
    >({
      query: ({ page, limit }) => ({
        url: "lightspeed/queue",
        params: {
          page,
          limit,
        },
      }),

      providesTags: ["LightspeedQueue"],
    }),

    retryJob: builder.mutation<ApiResponse<ActionResponse>, string>({
      query: (jobId) => ({
        url: `lightspeed/queue/retry/${jobId}`,
        method: "POST",
      }),

      invalidatesTags: [
        "LightspeedDashboard",
        "LightspeedQueue",
      ],
    }),

    manualSync: builder.mutation<ApiResponse<ActionResponse>, void>({
      query: () => ({
        url: "lightspeed/sync",
        method: "POST",
      }),

      invalidatesTags: [
        "LightspeedDashboard",
        "LightspeedQueue",
      ],
    }),

    bootstrapSync: builder.mutation<ApiResponse<ActionResponse>, void>({
      query: () => ({
        url: "lightspeed/sync/bootstrap",
        method: "POST",
      }),

      invalidatesTags: [
        "LightspeedDashboard",
        "LightspeedQueue",
      ],
    }),

    readOnlyStatus: builder.query<ApiResponse<ReadOnlyResponse>, void>({
      query: () => ({
        url: "lightspeed/read-only",
      }),

      providesTags: ["LightspeedReadOnly"],
    }),

    toggleReadOnly: builder.mutation<
      ApiResponse<ActionResponse>,
      boolean
    >({
      query: (readOnly) => ({
        url: "lightspeed/read-only",
        method: "PATCH",
        body: {
          read_only_mode: readOnly,
        },
      }),

      invalidatesTags: ["LightspeedReadOnly"],
    }),

    authUrl: builder.query<ApiResponse<OAuthUrlResponse>, void>({
      query: () => ({
        url: "lightspeed/auth/url",
      }),
    }),
  }),
});

export const {
  useDashboardQuery,
  useQueueQuery,
  useRetryJobMutation,
  useManualSyncMutation,
  useBootstrapSyncMutation,
  useReadOnlyStatusQuery,
  useToggleReadOnlyMutation,
  useLazyAuthUrlQuery,
} = lightspeedApi;