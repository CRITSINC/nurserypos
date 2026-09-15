import { api } from "./api";

export interface CreatePaymentIntentRequest {
    userId?: number;

    email: string;
    firstName: string;
    lastName: string;
    phone: string;

    shippingAddress: {
        firstName: string;
        lastName: string;
        address1: string;
        address2?: string;
        city: string;
        state: string;
        zip: string;
        country: string;
        countryCode: string;
        shipNote?: string;
    };

    billingAddress: {
        firstName: string;
        lastName: string;
        address1: string;
        address2?: string;
        city: string;
        state: string;
        zip: string;
        country: string;
        countryCode: string;
    };

    items: {
        productId: number;
        quantity: number;
    }[];
}


export interface CreatePaymentIntentResponse {
    success: boolean;

    data: {
        clientSecret: string;
        orderId: string;
        total: string;
    };

    error: string | null;
}

export interface Order {
    id: number;

    order_uuid: string;

    user_id: number | null;

    status: string;

    total_amount: string;

    subtotal_amount: string;

    tax_amount: string;

    shipping_amount: string;

    stripe_payment_intent: string | null;

    lightspeed_sale_id: string | null;

    lightspeed_ship_to_id: string | null;

    shipped_locally: boolean;

    shipped_at: string | null;

    carrier: string | null;

    tracking_number: string | null;

    estimated_delivery: string | null;

    shipping_address: {
        firstName: string;
        lastName: string;
        address1: string;
        address2?: string;
        city: string;
        state: string;
        zip: string;
        country: string;
        countryCode: string;
        shipNote?: string;
    };

    billing_address: {
        firstName: string;
        lastName: string;
        address1: string;
        address2?: string;
        city: string;
        state: string;
        zip: string;
        country: string;
        countryCode: string;
    };

    createdAt: string;

    updatedAt: string;

    deletedAt: string | null;

    items: {
        id: number;

        order_id: number;

        product_id: number;

        quantity: number;

        price: string;

        discount: string;

        product?: {
            id: number;
            description: string;
            price: number;
            qoh: number;
        };
    }[];
}


export interface OrderResponse {
    success: boolean;

    data: Order;

    error: string | null;
}

export const checkoutApi = api.injectEndpoints({
    endpoints: (builder) => ({

        createPaymentIntent: builder.mutation<
            CreatePaymentIntentResponse,
            CreatePaymentIntentRequest
        >({
            query: (body) => ({
                url: "checkout/create-intent",
                method: "POST",
                body,
            }),
        }),

        getOrder: builder.query<
            OrderResponse,
            string
        >({
            query: (orderId) => ({
                url: `orders/${orderId}`,
                method: "GET",
            }),

            providesTags: (
                _result,
                _error,
                orderId
            ) => [
                {
                    type: "Orders",
                    id: orderId,
                },
            ],
        }),

    }),
});


export const {
    useCreatePaymentIntentMutation,
    useGetOrderQuery,
} = checkoutApi;