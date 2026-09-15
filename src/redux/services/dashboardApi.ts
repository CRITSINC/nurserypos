import { api } from "./api";

export type DashboardSource = "all" | "web" | "pos";

interface DashboardResponse {
  success: boolean;
  data: {
    collections: {
      today: number;
      yesterday: number;
      weekly: number;
      thisMonth: number;
      lastMonth: number;
      allTime: number;
      breakdown: {
        web: {
          today: number;
          yesterday: number;
          weekly: number;
          thisMonth: number;
          lastMonth: number;
          allTime: number;
        };
        pos: {
          today: number;
          yesterday: number;
          weekly: number;
          thisMonth: number;
          lastMonth: number;
          allTime: number;
        };
      };
    };

    orders: {
      today: number;
      total: number;
      pending: number;
      processing: number;
      completed: number;
      cancelled: number;
      breakdown: {
        web: {
          today: number;
          total: number;
          pending: number;
          processing: number;
          completed: number;
          cancelled: number;
        };
        pos: {
          today: number;
          total: number;
          pending: number;
          processing: number;
          completed: number;
          cancelled: number;
        };
      };
    };

    weeklySales: {
      date: string;
      label: string;
      dayOfWeek: string;
      sales: number;
      orders: number;
    }[];

    topSellingProducts: {
      productId: number;
      name: string;
      sku: string | null;
      unitsSold: number;
      totalRevenue: number;
      percentage: number;
      imageUrl: string;
    }[];

    meta: {
      source: DashboardSource;
      generatedAt: string;
    };
  };

  error: any;
}

export const dashboardApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getDashboard: builder.query<DashboardResponse, DashboardSource>({
      query: (source) => ({
        url: "dashboard",
        method: "GET",
        params: {
          source,
        },
      }),
    }),
  }),
});

export const {
  useGetDashboardQuery,
} = dashboardApi;