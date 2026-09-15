"use client";

import { ReactNode } from "react";
import {
    Elements,
} from "@stripe/react-stripe-js";
import {
    loadStripe,
} from "@stripe/stripe-js";

const stripePromise = loadStripe(
    process.env
        .NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

interface PaymentWrapperProps {
    clientSecret: string;
    children: ReactNode;
}

export default function PaymentWrapper({
    clientSecret,
    children,
}: PaymentWrapperProps) {
    return (
        <Elements
            stripe={stripePromise}
            options={{
                clientSecret,

                appearance: {
                    theme: "stripe",
                },
            }}
        >
            {children}
        </Elements>
    );
}