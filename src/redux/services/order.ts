import { api } from "./api";

import {
  GetOrdersParams,
  OrdersResponse,
  Order,
  UpdateOrderRequest,
} from "@/types/order.types";

export const OrdersApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getOrders: builder.query<
      OrdersResponse,
      GetOrdersParams
    >({
      query: ({
        page = 1,
        limit = 10,
        pagination = true,
        search,
        status,
        user_id,
        ...rest
      }) => ({
        url: "orders",
        method: "GET",
        params: {
          pagination,
          page,
          limit,
          ...(search ? { search } : {}),
          ...(status ? { status } : {}),
          ...(user_id !== undefined
            ? { user_id }
            : {}),
          ...rest,
        },
      }),
      providesTags: ["Orders"],
    }),


    updateOrder: builder.mutation<
    OrdersResponse,
    {
        id: number;
        body: UpdateOrderRequest;
    }
    >({
    query: ({ id, body }) => ({
        url: `orders/${id}`,
        method: "PUT",
        body,
    }),
    invalidatesTags: ["Orders"],
    }),
    }),
});

export const {
  useGetOrdersQuery,
  useUpdateOrderMutation
} = OrdersApi;