export interface HomepageBanner {
    id: number;

    title: string;
    description: string | null;

    color: string | null;

    link_url: string | null;

    button_text: string | null;
    button_color: string | null;
    button_text_color: string | null;

    is_active: boolean;

    sort_order: number;

    // Image returned by the API
    image_url?: string | null;

    createdAt?: string;
    updatedAt?: string;
}

export interface BannerQueryParams {
    page?: number;
    limit?: number;
    search?: string;
    sort?: "asc" | "desc";
    pagination?: boolean;
}

export interface BannerResponse {
    success: boolean;
    data: HomepageBanner[];
    count?: number;

    pagination?: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };

    error?: any;
}

export interface SingleBannerResponse {
    success: boolean;
    data: HomepageBanner;
    error?: any;
}