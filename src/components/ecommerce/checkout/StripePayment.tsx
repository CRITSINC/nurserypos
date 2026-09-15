"use client";

import {
    PaymentElement,
    useElements,
    useStripe,
} from "@stripe/react-stripe-js";

import {
    useState,
} from "react";

interface StripePaymentProps {
    returnUrl: string;
}

export default function StripePayment({
    returnUrl,
}: StripePaymentProps) {
    const stripe = useStripe();
    const elements = useElements();

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState<string | null>(null);

    const handlePayment = async () => {
        if (!stripe || !elements) {
            return;
        }

        setLoading(true);
        setError(null);

        const { error } =
            await stripe.confirmPayment({
                elements,

                confirmParams: {
                    return_url: returnUrl,
                },
            });

        /*
         * If Stripe redirects successfully,
         * this code will normally not continue.
         *
         * If there is an immediate validation/payment
         * error, display it here.
         */
        if (error) {
            setError(
                error.message ??
                    "Payment failed."
            );

            setLoading(false);
        }
    };

    return (
        <div className="stripe-payment">
            <PaymentElement />

            {error && (
                <div className="text-danger mt-15">
                    {error}
                </div>
            )}

            <button
                type="button"
                className="btn btn-fill-out btn-block mt-30"
                disabled={
                    !stripe ||
                    !elements ||
                    loading
                }
                onClick={
                    handlePayment
                }
            >
                {loading
                    ? "Processing Payment..."
                    : "Pay Now"}
            </button>

        </div>
    );
}