"use client";

import {
    useSearchParams,
    useRouter,
} from "next/navigation";

import {
    useEffect,
    useRef,
} from "react";

import {
    useDispatch,
} from "react-redux";

import {
    clearCart,
} from "@/redux/slices/cart.slice";

import {
    useGetOrderQuery,
} from "@/redux/services/checkout";


export default function PaymentSuccess() {

    const searchParams =
        useSearchParams();

    const router =
        useRouter();

    const dispatch =
        useDispatch();

    const orderId =
        searchParams.get("orderId");

    const cartCleared =
        useRef(false);

    const {
        data,
        isLoading,
        isError,
    } =
        useGetOrderQuery(
            orderId as string,
            {
                skip: !orderId,

                pollingInterval: 3000,
            }
        );


    const order =
        data?.data;

    const status =
        order?.status;

    useEffect(() => {

        if (
            status === "synced" &&
            !cartCleared.current
        ) {

            dispatch(
                clearCart()
            );

            cartCleared.current = true;
        }

    }, [
        status,
        dispatch,
    ]);


    if (!orderId) {

        return (
            <section className="mt-80 mb-80">

                <div className="container">

                    <div className="text-center">

                        <h1 className="heading-2 mb-20">
                            Invalid Order
                        </h1>

                        <p className="text-muted mb-30">
                            We could not find your order.
                        </p>

                        <button
                            type="button"
                            className="btn btn-fill-out"
                            onClick={() =>
                                router.push("/")
                            }
                        >
                            Continue Shopping
                        </button>

                    </div>

                </div>

            </section>
        );
    }


    if (isError) {

        return (
            <section className="mt-80 mb-80">

                <div className="container">

                    <div className="text-center">

                        <h1 className="heading-2 mb-20">
                            Unable to Check Order
                        </h1>

                        <p className="text-muted mb-30">
                            We could not retrieve the
                            current status of your order.
                        </p>

                        <button
                            type="button"
                            className="btn btn-fill-out"
                            onClick={() =>
                                router.push("/")
                            }
                        >
                            Continue Shopping
                        </button>

                    </div>

                </div>

            </section>
        );
    }

    if (
        isLoading ||
        (
            status !== "synced" &&
            status !== "cancelled" &&
            status !== "failed"
        )
    ) {

        return (
            <section className="mt-80 mb-80">

                <div className="container">

                    <div className="text-center">

                        <h1 className="heading-2 mb-20">
                            Processing Your Order
                        </h1>

                        <p className="text-muted mb-20">
                            Your payment was received
                            successfully.
                        </p>

                        <p className="text-muted mb-30">
                            We are completing your order.
                            Please do not close this page.
                        </p>

                        <p>
                            Order ID:{" "}
                            <strong>
                                {orderId}
                            </strong>
                        </p>

                    </div>

                </div>

            </section>
        );
    }

    if (
        status === "cancelled" ||
        status === "failed"
    ) {

        return (
            <section className="mt-80 mb-80">

                <div className="container">

                    <div className="text-center">

                        <h1 className="heading-2 mb-20">
                            Order Could Not Be Completed
                        </h1>

                        <p className="text-muted mb-30">
                            Unfortunately, we were unable
                            to complete your order.
                        </p>

                        <p className="mb-30">
                            Order ID:{" "}
                            <strong>
                                {orderId}
                            </strong>
                        </p>

                        <button
                            type="button"
                            className="btn btn-fill-out"
                            onClick={() =>
                                router.push(
                                    "/products"
                                )
                            }
                        >
                            Continue Shopping
                        </button>

                    </div>

                </div>

            </section>
        );
    }

    if (status === "synced") {

        return (
            <section className="mt-80 mb-80">

                <div className="container">

                    <div className="text-center">

                        <h1 className="heading-2 mb-20">
                            Order Confirmed
                        </h1>

                        <p className="text-muted mb-20">
                            Your payment has been
                            successfully processed and
                            your order has been completed.
                        </p>

                        <p className="mb-30">
                            Order ID:{" "}
                            <strong>
                                {orderId}
                            </strong>
                        </p>

                        <button
                            type="button"
                            className="btn btn-fill-out"
                            onClick={() =>
                                router.push("/")
                            }
                        >
                            Continue Shopping
                        </button>

                    </div>

                </div>

            </section>
        );
    }


    return null;
}