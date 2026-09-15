"use client";

import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";

import Layout from "../../../components/layout/Layout";

import { RootState } from "@/redux/store";
import { useAppSelector } from "@/redux/hooks";
import { isAuthenticated } from "@/redux/slices/auth.slice";

import {
    useCreatePaymentIntentMutation,
} from "@/redux/services/checkout";

import PaymentWrapper from "@/components/ecommerce/checkout/PaymentWrapper";
import StripePayment from "@/components/ecommerce/checkout/StripePayment";

import { countriesList } from "@/constants/countries";

import { toasterError } from "@/components/core/Toaster";


interface CheckoutFormData {
    firstName: string;
    lastName: string;

    country: string;

    address: string;
    address2?: string;

    city: string;
    state: string;
    zipcode: string;

    phone: string;
    email: string;

    shipNote?: string;

    password?: string;

    billingFirstName?: string;
    billingLastName?: string;
    billingCountry?: string;
    billingAddress?: string;
    billingAddress2?: string;
    billingCity?: string;
    billingState?: string;
    billingZipcode?: string;
}


const Checkout = () => {

    const router = useRouter();

    const authenticated =
        useAppSelector(isAuthenticated);

    const user = useAppSelector(
        (state) => state.auth.user
    );
    const cart = useSelector(
        (state: RootState) =>
            state.cart
    );

    const cartItems =
        cart?.items ?? [];


    const [
        createPaymentIntent,
        {
            isLoading:
            creatingPaymentIntent,
        },
    ] =
        useCreatePaymentIntentMutation();


    const [
        clientSecret,
        setClientSecret,
    ] =
        useState<string | null>(null);


    const [
        orderId,
        setOrderId,
    ] =
        useState<string | null>(null);


    const [
        paymentTotal,
        setPaymentTotal,
    ] =
        useState<number | null>(null);

    const [
        differentAddress,
        setDifferentAddress,
    ] =
        useState(false);

    const [
        provinces,
        setProvinces,
    ] = useState<
        {
            name: string;
        }[]
    >([]);


    const [
        createAccount,
        setCreateAccount,
    ] =
        useState(false);

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: {
            errors,
        },
    } =
        useForm<CheckoutFormData>({
            defaultValues: {

                firstName: "",
                lastName: "",

                country: "",

                address: "",
                address2: "",

                city: "",
                state: "",
                zipcode: "",

                phone: "",
                email: "",

                shipNote: "",

                password: "",

                billingFirstName: "",
                billingLastName: "",
                billingCountry: "",
                billingAddress: "",
                billingAddress2: "",
                billingCity: "",
                billingState: "",
                billingZipcode: "",
            },
        });

    const selectedCountry = watch("country");
    const selectedBillingCountry =
        watch("billingCountry");

    const getProvinces = async () => {
        try {
            const response = await fetch(
                "https://countriesnow.space/api/v0.1/countries/states/q?country=Canada"
            );

            const result = await response.json();

            if (!result.error) {
                setProvinces(
                    result.data.states
                );
            }
        } catch (error) {
            console.error(
                "Failed to fetch provinces:",
                error
            );
        }
    };

    useEffect(() => {
        if (selectedCountry === "Canada") {
            if (!provinces.length) {
                getProvinces();
            }
        } else {
            setValue("state", "");
        }
    }, [
        selectedCountry,
        setValue,
        provinces.length,
    ]);

    useEffect(() => {
        if (
            selectedBillingCountry !==
            "Canada"
        ) {
            setValue(
                "billingState",
                ""
            );
        }
    }, [
        selectedBillingCountry,
        setValue,
    ]);

    const subtotal = useMemo(() => {

        return cartItems.reduce(
            (
                total: number,
                item: any
            ) => {

                return (
                    total +
                    Number(
                        item.price || 0
                    ) *
                    Number(
                        item.quantity || 0
                    )
                );

            },
            0
        );

    }, [cartItems]);


    const hstTax = 13;

    const hstAmount =
        subtotal *
        (hstTax / 100);


    const estimatedTotal =
        subtotal +
        hstAmount;

    const onSubmit = async (
        values: CheckoutFormData
    ) => {

        if (!cartItems.length) {

            toasterError(
                "Your cart is empty."
            );

            return;
        }

        if (clientSecret) {
            return;
        }


        try {

            const selectedShippingCountry =
                countriesList.find(
                    (country) =>
                        country.name === values.country
                );

            const shippingAddress = {
                firstName: values.firstName,
                lastName: values.lastName,

                address1: values.address,

                address2:
                    values.address2?.trim() ||
                    undefined,

                city: values.city,
                state: values.state,
                zip: values.zipcode,

                country: values.country,

                countryCode:
                    selectedShippingCountry?.code || "",

                shipNote:
                    values.shipNote?.trim() ||
                    undefined,
            };

            const selectedBillingCountry =
                differentAddress
                    ? countriesList.find(
                        (country) =>
                            country.name ===
                            values.billingCountry
                    )
                    : null;

            const billingAddress = differentAddress
                ? {
                    firstName:
                        values.billingFirstName!,

                    lastName:
                        values.billingLastName!,

                    address1:
                        values.billingAddress!,

                    address2:
                        values.billingAddress2?.trim() ||
                        undefined,

                    city:
                        values.billingCity!,

                    state:
                        values.billingState!,

                    zip:
                        values.billingZipcode!,

                    country:
                        values.billingCountry!,

                    countryCode:
                        selectedBillingCountry?.code ||
                        "",
                }
                : {
                    ...shippingAddress,
                };
            const items = cartItems.map(
                (item: any) => ({
                    productId: Number(item.id),
                    quantity: Number(item.quantity),
                })
            );

            const response =
                await createPaymentIntent({
                    email: values.email,
                    firstName: values.firstName,
                    lastName: values.lastName,
                    userId: user?.id,
                    phone: values.phone,

                    shippingAddress,

                    billingAddress,

                    items,
                }).unwrap();

            console.log("Payment Intent Response:", response);

            setClientSecret(
                response.data.clientSecret
            );

            setOrderId(
                response.data.orderId
            );

            setPaymentTotal(
                Number(response.data.total)
            );

        } catch (error: any) {

            console.error(
                "Create payment intent error:",
                error
            );


            toasterError(
                error?.data?.error ||
                error?.data?.message ||
                "Unable to initialize payment."
            );
        }
    };

    if (!cartItems.length) {

        return (

            <Layout
                parent="Home"
                sub="Shop"
                subChild="Checkout"
            >

                <section className="mt-50 mb-50">

                    <div className="container">

                        <div className="text-center py-50">

                            <h2 className="mb-20">
                                Your cart is empty
                            </h2>

                            <p className="mb-30">
                                There are no products
                                available for checkout.
                            </p>

                            <a
                                href="/products"
                                className="btn btn-fill-out"
                            >
                                Continue Shopping
                            </a>

                        </div>

                    </div>

                </section>

            </Layout>
        );
    }

    return (

        <Layout
            parent="Checkout"
            parent_link="/shop-checkout"
        >

            <section className="mt-50 mb-50">

                <div className="container">

                    <div className="row">

                        <div className="col-lg-8 mb-40">

                            <h1 className="heading-2 mb-10">
                                Checkout
                            </h1>

                            <div className="d-flex justify-content-between">

                                <h6 className="text-body">
                                    Carefully check the
                                    information before
                                    checkout
                                </h6>

                            </div>

                        </div>

                    </div>


                    <form
                        onSubmit={
                            handleSubmit(
                                onSubmit
                            )
                        }
                    >

                        <div className="row">

                            <div className="col-lg-7">

                                <div className="row">

                                    {!authenticated && (

                                        <div className="col-lg-6 mb-sm-15 mb-lg-0 mb-md-3">

                                            <div className="toggle_info">

                                                <span>

                                                    <i className="fi-rs-user mr-10"></i>

                                                    <span className="text-muted font-lg">
                                                        Already have an
                                                        account?
                                                    </span>{" "}

                                                    <a
                                                        href="/login"
                                                        className="collapsed font-lg"
                                                    >
                                                        Click here to
                                                        login
                                                    </a>

                                                </span>

                                            </div>

                                        </div>

                                    )}
                                </div>

                                <div className="mb-25">

                                    <h4>
                                        Shipping Address
                                    </h4>

                                </div>

                                <div className="form-group">

                                    <div className="custom_select">

                                        <select
                                            className="form-control select-active"
                                            {...register(
                                                "country",
                                                {
                                                    required:
                                                        "Country is required",
                                                }
                                            )}
                                        >

                                            <option value="">
                                                Select Country
                                            </option>

                                            {countriesList.map(
                                                (
                                                    country
                                                ) => (

                                                    <option
                                                        key={
                                                            country.name
                                                        }
                                                        value={
                                                            country.name
                                                        }
                                                    >
                                                        {
                                                            country.name
                                                        }
                                                    </option>

                                                )
                                            )}

                                        </select>

                                    </div>


                                    {errors.country && (

                                        <span className="text-danger">
                                            {
                                                errors
                                                    .country
                                                    .message
                                            }
                                        </span>

                                    )}

                                </div>

                                <div className="form-group">

                                    <input
                                        type="text"
                                        {...register(
                                            "address",
                                            {
                                                required:
                                                    "Address is required",
                                            }
                                        )}
                                        placeholder="Address *"
                                    />

                                    {errors.address && (

                                        <span className="text-danger">
                                            {
                                                errors
                                                    .address
                                                    .message
                                            }
                                        </span>

                                    )}

                                </div>

                                <div className="form-group">

                                    <input
                                        type="text"
                                        {...register(
                                            "address2"
                                        )}
                                        placeholder="Address line 2"
                                    />

                                </div>

                                <div className="form-group">

                                    <input
                                        type="text"
                                        {...register(
                                            "city",
                                            {
                                                required:
                                                    "City is required",
                                            }
                                        )}
                                        placeholder="City / Town *"
                                    />

                                    {errors.city && (

                                        <span className="text-danger">
                                            {
                                                errors
                                                    .city
                                                    .message
                                            }
                                        </span>

                                    )}

                                </div>

                                <div className="form-group">

                                    {selectedCountry === "Canada" ? (
                                        <div className="custom_select">
                                            <select
                                                className="form-control select-active"
                                                {...register(
                                                    "state",
                                                    {
                                                        required:
                                                            "Province is required",
                                                    }
                                                )}
                                            >
                                                <option value="">
                                                    Select Province
                                                </option>

                                                {provinces.map(
                                                    (province) => (
                                                        <option
                                                            key={
                                                                province.name
                                                            }
                                                            value={
                                                                province.name
                                                            }
                                                        >
                                                            {province.name}
                                                        </option>
                                                    )
                                                )}
                                            </select>
                                        </div>
                                    ) : (
                                        <input
                                            type="text"
                                            {...register(
                                                "state",
                                                {
                                                    required:
                                                        "State is required",
                                                }
                                            )}
                                            placeholder="State / County *"
                                        />
                                    )}

                                    {errors.state && (
                                        <span className="text-danger">
                                            {errors.state.message}
                                        </span>
                                    )}

                                </div>

                                <div className="form-group">

                                    <input
                                        type="text"
                                        {...register(
                                            "zipcode",
                                            {
                                                required:
                                                    "Postcode / ZIP is required",
                                            }
                                        )}
                                        placeholder="Postcode / ZIP *"
                                    />

                                    {errors.zipcode && (

                                        <span className="text-danger">
                                            {
                                                errors
                                                    .zipcode
                                                    .message
                                            }
                                        </span>

                                    )}

                                </div>

                                <div className="form-group">

                                    <textarea
                                        rows={4}
                                        {...register(
                                            "shipNote"
                                        )}
                                        placeholder="Shipping note (optional)"
                                    />

                                </div>

                                <div className="ship_detail">

                                    <div className="form-group">

                                        <div className="chek-form">

                                            <div className="custome-checkbox">

                                                <input
                                                    className="form-check-input"
                                                    type="checkbox"
                                                    id="differentaddress"
                                                    checked={
                                                        differentAddress
                                                    }
                                                    onChange={(
                                                        event
                                                    ) =>
                                                        setDifferentAddress(
                                                            event
                                                                .target
                                                                .checked
                                                        )
                                                    }
                                                />

                                                <label
                                                    className="form-check-label label_info"
                                                    htmlFor="differentaddress"
                                                >

                                                    <span>
                                                        Billing to a
                                                        different
                                                        address?
                                                    </span>

                                                </label>

                                            </div>

                                        </div>

                                    </div>


                                    {differentAddress && (

                                        <div className="different_address">

                                            <div className="mb-25">

                                                <h4>
                                                    Billing Address
                                                </h4>

                                            </div>

                                            <div className="form-group">

                                                <input
                                                    type="text"
                                                    {...register(
                                                        "billingFirstName",
                                                        {
                                                            required:
                                                                "First name is required",
                                                        }
                                                    )}
                                                    placeholder="First name *"
                                                />

                                                {errors.billingFirstName && (

                                                    <span className="text-danger">
                                                        {
                                                            errors
                                                                .billingFirstName
                                                                .message
                                                        }
                                                    </span>

                                                )}

                                            </div>

                                            <div className="form-group">

                                                <input
                                                    type="text"
                                                    {...register(
                                                        "billingLastName",
                                                        {
                                                            required:
                                                                "Last name is required",
                                                        }
                                                    )}
                                                    placeholder="Last name *"
                                                />

                                                {errors.billingLastName && (

                                                    <span className="text-danger">
                                                        {
                                                            errors
                                                                .billingLastName
                                                                .message
                                                        }
                                                    </span>

                                                )}

                                            </div>

                                            <div className="form-group">

                                                <div className="custom_select">

                                                    <select
                                                        className="form-control select-active"
                                                        {...register(
                                                            "billingCountry",
                                                            {
                                                                required:
                                                                    "Country is required",
                                                            }
                                                        )}
                                                    >

                                                        <option value="">
                                                            Select Country
                                                        </option>

                                                        {countriesList.map(
                                                            (
                                                                country
                                                            ) => (

                                                                <option
                                                                    key={
                                                                        country.name
                                                                    }
                                                                    value={
                                                                        country.name
                                                                    }
                                                                >
                                                                    {
                                                                        country.name
                                                                    }
                                                                </option>

                                                            )
                                                        )}

                                                    </select>

                                                </div>


                                                {errors.billingCountry && (

                                                    <span className="text-danger">
                                                        {
                                                            errors
                                                                .billingCountry
                                                                .message
                                                        }
                                                    </span>

                                                )}

                                            </div>

                                            <div className="form-group">

                                                <input
                                                    type="text"
                                                    {...register(
                                                        "billingAddress",
                                                        {
                                                            required:
                                                                "Address is required",
                                                        }
                                                    )}
                                                    placeholder="Address *"
                                                />

                                                {errors.billingAddress && (

                                                    <span className="text-danger">
                                                        {
                                                            errors
                                                                .billingAddress
                                                                .message
                                                        }
                                                    </span>

                                                )}

                                            </div>

                                            <div className="form-group">

                                                <input
                                                    type="text"
                                                    {...register(
                                                        "billingAddress2"
                                                    )}
                                                    placeholder="Address line 2"
                                                />

                                            </div>

                                            <div className="form-group">

                                                <input
                                                    type="text"
                                                    {...register(
                                                        "billingCity",
                                                        {
                                                            required:
                                                                "City is required",
                                                        }
                                                    )}
                                                    placeholder="City / Town *"
                                                />

                                                {errors.billingCity && (

                                                    <span className="text-danger">
                                                        {
                                                            errors
                                                                .billingCity
                                                                .message
                                                        }
                                                    </span>

                                                )}

                                            </div>

                                            <div className="form-group">

                                                {selectedBillingCountry === "Canada" ? (
                                                    <div className="custom_select">
                                                        <select
                                                            className="form-control select-active"
                                                            {...register(
                                                                "billingState",
                                                                {
                                                                    required:
                                                                        "Province is required",
                                                                }
                                                            )}
                                                        >
                                                            <option value="">
                                                                Select Province
                                                            </option>

                                                            {provinces.map(
                                                                (province) => (
                                                                    <option
                                                                        key={
                                                                            province.name
                                                                        }
                                                                        value={
                                                                            province.name
                                                                        }
                                                                    >
                                                                        {province.name}
                                                                    </option>
                                                                )
                                                            )}
                                                        </select>
                                                    </div>
                                                ) : (
                                                    <input
                                                        type="text"
                                                        {...register(
                                                            "billingState",
                                                            {
                                                                required:
                                                                    "State is required",
                                                            }
                                                        )}
                                                        placeholder="State / County *"
                                                    />
                                                )}

                                                {errors.billingState && (
                                                    <span className="text-danger">
                                                        {errors.billingState.message}
                                                    </span>
                                                )}

                                            </div>

                                            <div className="form-group">

                                                <input
                                                    type="text"
                                                    {...register(
                                                        "billingZipcode",
                                                        {
                                                            required:
                                                                "Postcode / ZIP is required",
                                                        }
                                                    )}
                                                    placeholder="Postcode / ZIP *"
                                                />

                                                {errors.billingZipcode && (

                                                    <span className="text-danger">
                                                        {
                                                            errors
                                                                .billingZipcode
                                                                .message
                                                        }
                                                    </span>

                                                )}

                                            </div>

                                        </div>

                                    )}

                                </div>

                                <div className="mb-25 mt-40">

                                    <h4>
                                        Contact Details
                                    </h4>

                                </div>

                                <div className="form-group">

                                    <input
                                        type="text"
                                        {...register(
                                            "firstName",
                                            {
                                                required:
                                                    "First name is required",
                                            }
                                        )}
                                        placeholder="First name *"
                                    />

                                    {errors.firstName && (

                                        <span className="text-danger">
                                            {
                                                errors
                                                    .firstName
                                                    .message
                                            }
                                        </span>

                                    )}

                                </div>

                                <div className="form-group">

                                    <input
                                        type="text"
                                        {...register(
                                            "lastName",
                                            {
                                                required:
                                                    "Last name is required",
                                            }
                                        )}
                                        placeholder="Last name *"
                                    />

                                    {errors.lastName && (

                                        <span className="text-danger">
                                            {
                                                errors
                                                    .lastName
                                                    .message
                                            }
                                        </span>

                                    )}

                                </div>

                                <div className="form-group">

                                    <input
                                        type="text"
                                        {...register(
                                            "phone",
                                            {
                                                required:
                                                    "Phone is required",
                                            }
                                        )}
                                        placeholder="Phone *"
                                    />

                                    {errors.phone && (

                                        <span className="text-danger">
                                            {
                                                errors
                                                    .phone
                                                    .message
                                            }
                                        </span>

                                    )}

                                </div>

                                <div className="form-group">

                                    <input
                                        type="email"
                                        {...register(
                                            "email",
                                            {
                                                required:
                                                    "Email address is required",

                                                pattern:
                                                {
                                                    value:
                                                        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,

                                                    message:
                                                        "Enter a valid email address",
                                                },
                                            }
                                        )}
                                        placeholder="Email address *"
                                    />

                                    {errors.email && (

                                        <span className="text-danger">
                                            {
                                                errors
                                                    .email
                                                    .message
                                            }
                                        </span>

                                    )}

                                </div>

                            </div>

                            <div className="col-lg-5">

                                <div className="border p-40 cart-totals ml-30 mb-50">

                                    <div className="d-flex align-items-end justify-content-between mb-30">

                                        <h4>
                                            Your Order
                                        </h4>

                                        <h6 className="text-muted">
                                            Subtotal
                                        </h6>

                                    </div>


                                    <div className="divider-2 mb-30"></div>

                                    <div className="table-responsive order_table">

                                        <table className="table no-border">

                                            <tbody>

                                                {cartItems.map(
                                                    (
                                                        item: any
                                                    ) => (

                                                        <tr
                                                            key={
                                                                item.id
                                                            }
                                                        >

                                                            <td className="image product-thumbnail">

                                                                <img
                                                                    src={
                                                                        item
                                                                            .images
                                                                            ?.length
                                                                            ? item
                                                                                .images[0]
                                                                                .local_path ||
                                                                            item
                                                                                .images[0]
                                                                                .lightspeed_url
                                                                            : "/assets/no-image.jpg"
                                                                    }
                                                                    alt={
                                                                        item.description ||
                                                                        "Product"
                                                                    }
                                                                />

                                                            </td>


                                                            <td>

                                                                <h6 className="w-160 mb-5">

                                                                    {
                                                                        item.description
                                                                    }

                                                                </h6>

                                                            </td>


                                                            <td>

                                                                <h6 className="text-muted pl-20 pr-20">

                                                                    x{" "}

                                                                    {
                                                                        item.quantity
                                                                    }

                                                                </h6>

                                                            </td>


                                                            <td>

                                                                <h4 className="text-brand">

                                                                    $

                                                                    {(
                                                                        Number(
                                                                            item.price ||
                                                                            0
                                                                        ) *
                                                                        Number(
                                                                            item.quantity ||
                                                                            0
                                                                        )
                                                                    ).toFixed(
                                                                        2
                                                                    )}

                                                                </h4>

                                                            </td>

                                                        </tr>

                                                    )
                                                )}

                                            </tbody>

                                        </table>

                                    </div>

                                    <div className="bt-1 border-color-1 mt-30 mb-30"></div>


                                    <div className="d-flex justify-content-between mb-20">

                                        <h6>
                                            Subtotal
                                        </h6>

                                        <h6>
                                            $
                                            {subtotal.toFixed(
                                                2
                                            )}
                                        </h6>

                                    </div>


                                    <div className="d-flex justify-content-between mb-20">

                                        <h6>
                                            Ontario HST (
                                            {hstTax}
                                            %)
                                        </h6>

                                        <h6>
                                            $
                                            {hstAmount.toFixed(
                                                2
                                            )}
                                        </h6>

                                    </div>


                                    <div className="bt-1 border-color-1 pt-20 mb-30"></div>


                                    <div className="d-flex justify-content-between mb-30">

                                        <h4>
                                            Total Payment
                                        </h4>

                                        <h4 className="text-brand">

                                            $
                                            {paymentTotal !== null
                                                ? Number(paymentTotal)?.toFixed(
                                                    2
                                                )
                                                : Number(estimatedTotal).toFixed(
                                                    2
                                                )}

                                        </h4>

                                    </div>

                                    {!clientSecret ? (

                                        <button
                                            type="submit"
                                            className="btn btn-fill-out btn-block mt-30"
                                            disabled={
                                                creatingPaymentIntent
                                            }
                                        >

                                            {creatingPaymentIntent
                                                ? "Preparing Payment..."
                                                : "Place Order"}

                                        </button>

                                    ) : (

                                        <div className="mt-30">

                                            <div className="mb-20">

                                                <h5 className="mb-5">
                                                    Payment Details
                                                </h5>

                                                <p className="text-muted mb-0">
                                                    Enter your payment
                                                    information below.
                                                </p>

                                            </div>


                                            <PaymentWrapper
                                                clientSecret={
                                                    clientSecret
                                                }
                                            >

                                                <StripePayment
                                                    returnUrl={
                                                        `${window.location.origin}/payment-success?orderId=${orderId}`
                                                    }
                                                />

                                            </PaymentWrapper>

                                        </div>

                                    )}

                                </div>

                            </div>

                        </div>

                    </form>

                </div>

            </section>

        </Layout>
    );
};


export default Checkout;