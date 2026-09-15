import { api } from "./api";

import {
    BannerQueryParams,
    BannerResponse,
    HomepageBanner,
    SingleBannerResponse,
} from "@/types/banner.types";

export const bannerApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getBanners: builder.query<
            BannerResponse,
            BannerQueryParams
        >({
            query: ({
                page = 1,
                limit = 10,
                search = "",
                sort = "desc",
                pagination = true,
            }) => ({
                url: "homepage-banners/admin",
                method: "GET",
                params: {
                    page,
                    limit,
                    sort,
                    pagination,
                    ...(search
                        ? { search }
                        : {}),
                },
            }),

            providesTags: ["HomepageBanners"],
        }),

        getHomePageBanners: builder.query<
            BannerResponse,
            BannerQueryParams
        >({
            query: () => ({
                url: "homepage-banners",
                method: "GET",             
            }),

            providesTags: ["HomepageBanners"],
        }),

        getBannerById: builder.query<
            SingleBannerResponse,
            number
        >({
            query: (id) => ({
                url: `homepage-banners/${id}`,
                method: "GET",
            }),

            providesTags: (_result, _error, id) => [
                {
                    type: "HomepageBanners",
                    id,
                },
            ],
        }),


        createBanner: builder.mutation<
            SingleBannerResponse,
            FormData
        >({
            query: (formData) => ({
                url: "homepage-banners",
                method: "POST",
                body: formData,
            }),

            invalidatesTags: ["HomepageBanners"],
        }),

        updateBanner: builder.mutation<
            SingleBannerResponse,
            {
                id: number;
                body: FormData;
            }
        >({
            query: ({ id, body }) => ({
                url: `homepage-banners/${id}`,
                method: "PUT",
                body,
            }),

            invalidatesTags: ["HomepageBanners"],
        }),

        updateStatusBanner: builder.mutation<
            SingleBannerResponse,
            {
                id: number;
                is_active: boolean;
            }
        >({
            query: ({ id, is_active }) => ({
                url: `homepage-banners/${id}`,
                method: "PUT",
                body: {
                    is_active,
                },
            }),

            invalidatesTags: ["HomepageBanners"],
        }),  
        

        deleteBanner: builder.mutation<
            any,
            number
        >({
            query: (id) => ({
                url: `homepage-banners/${id}`,
                method: "DELETE",
            }),

            invalidatesTags: ["HomepageBanners"],
        }),

    }),
});

export const {
    useGetBannersQuery,
    useGetHomePageBannersQuery,
    useGetBannerByIdQuery,
    useCreateBannerMutation,
    useUpdateBannerMutation,
    useUpdateStatusBannerMutation,
    useDeleteBannerMutation,
} = bannerApi;