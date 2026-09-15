import { api } from "./api";

export interface ContactRequest {
    firstName: string;
    email: string;
    phone: string;
    subject: string;
    message: string;
}

export interface ContactResponse {
    success: boolean;
    message: string;
    data?: any;
    error?: any;
}

export const contactApi = api.injectEndpoints({
    endpoints: (builder) => ({
        submitContact: builder.mutation<
            ContactResponse,
            ContactRequest
        >({
            query: (body) => ({
                url: "contact",
                method: "POST",
                body,
            }),
        }),
    }),
});

export const {
    useSubmitContactMutation,
} = contactApi;