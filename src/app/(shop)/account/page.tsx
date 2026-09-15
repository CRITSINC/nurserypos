"use client"

import Layout from "../../../components/layout/Layout";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { updateUser } from "@/redux/slices/auth.slice";
import useLogout from "@/hooks/useLogout";
import { useGetOrdersQuery } from "@/redux/services/order";

interface AccountForm {
    first_name: string;
    last_name: string;
    display_name: string;
    email: string;

    current_password: string;
    new_password: string;
    confirm_password: string;
}

function Account() {
    const [activeIndex, setActiveIndex] = useState(1);

    const logout = useLogout();
    const dispatch = useAppDispatch();

    const user = useAppSelector(
        (state) => state.auth.user
    );

    const [accountForm, setAccountForm] =
        useState<AccountForm>({
            first_name: "",
            last_name: "",
            display_name: "",
            email: "",

            current_password: "",
            new_password: "",
            confirm_password: "",
        });

    const [isSaving, setIsSaving] = useState(false);

    const [orderPage, setOrderPage] = useState(1);
    const orderLimit = 10;
    const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
    const {
        data: ordersResponse,
        isLoading: ordersLoading,
        isError: ordersError,
    } = useGetOrdersQuery(
        {
            page: orderPage,
            limit: orderLimit,
            pagination: true,
            user_id: user?.id,
        },
        {
            skip: !user?.id || activeIndex !== 1,
            refetchOnMountOrArgChange: true,
        }
    );

    const orders = ordersResponse?.data ?? [];
    const totalOrders = ordersResponse?.count ?? 0;
    const totalOrderPages = Math.ceil(
        totalOrders / orderLimit
    );

    const handleOnClick = (index: number) => {
        setActiveIndex(index);

        if (index !== 1) {
            setOrderPage(1);
        }
    };

    useEffect(() => {
        if (!user) return;

        setAccountForm((prev) => ({
            ...prev,

            first_name:
                user.first_name || "",

            last_name:
                user.last_name || "",

            email:
                user.email || "",

            // Never populate passwords
            current_password: "",
            new_password: "",
            confirm_password: "",
        }));
    }, [user]);

    const handleAccountChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const { name, value } = e.target;

        setAccountForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleAccountSubmit = async (
        e: React.FormEvent<HTMLFormElement>
    ) => {
        e.preventDefault();

        if (!user?.id) {
            toast.error("You must be logged in.");
            return;
        }

        const isChangingPassword =
            accountForm.current_password.trim() !== "" ||
            accountForm.new_password.trim() !== "" ||
            accountForm.confirm_password.trim() !== "";

        if (isChangingPassword) {
            if (
                !accountForm.current_password.trim()
            ) {
                toast.error(
                    "Please enter your current password."
                );
                return;
            }

            if (!accountForm.new_password.trim()) {
                toast.error(
                    "Please enter a new password."
                );
                return;
            }

            if (
                accountForm.new_password !==
                accountForm.confirm_password
            ) {
                toast.error(
                    "New passwords do not match."
                );
                return;
            }

            if (
                accountForm.new_password.length < 6
            ) {
                toast.error(
                    "New password must be at least 6 characters."
                );
                return;
            }
        }

        setIsSaving(true);

        try {
            const profilePayload = {
                first_name:
                    accountForm.first_name.trim(),

                last_name:
                    accountForm.last_name.trim(),

                display_name:
                    accountForm.display_name.trim(),

                email:
                    accountForm.email.trim(),
            };

            if (isChangingPassword) {
                const passwordPayload = {
                    current_password:
                        accountForm.current_password,

                    new_password:
                        accountForm.new_password,

                    confirm_password:
                        accountForm.confirm_password,
                };
            }

            const updatedUser = {
                ...user,
                first_name:
                    accountForm.first_name.trim(),

                last_name:
                    accountForm.last_name.trim(),

                display_name:
                    accountForm.display_name.trim(),

                email:
                    accountForm.email.trim(),
            };

            dispatch(updateUser(updatedUser));

            setAccountForm((prev) => ({
                ...prev,

                current_password: "",
                new_password: "",
                confirm_password: "",
            }));

            toast.success(
                "Account details updated successfully."
            );
        } catch (error) {
            console.error(
                "Failed to update account:",
                error
            );

            toast.error(
                "Failed to update account details."
            );
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <>
            <Layout parent="Home" sub="Account">
                <div className="page-content pt-150 pb-150">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-10 m-auto">
                                <div className="row">
                                    <div className="col-md-3">
                                        <div className="dashboard-menu">
                                            <ul className="nav flex-column" role="tablist">
                                                <li className="nav-item">
                                                    <a className={activeIndex === 1 ? "nav-link active" : "nav-link"} onClick={() => handleOnClick(1)}><i className="fi-rs-shopping-bag mr-10"></i>Orders</a>
                                                </li>
                                                <li className="nav-item">
                                                    <a className={activeIndex === 2 ? "nav-link active" : "nav-link"} onClick={() => handleOnClick(2)}><i className="fi-rs-marker mr-10"></i>My Address</a>
                                                </li>
                                                <li className="nav-item">
                                                    <a className={activeIndex === 3 ? "nav-link active" : "nav-link"} onClick={() => handleOnClick(3)}><i className="fi-rs-user mr-10"></i>Account details</a>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                    <div className="col-md-9">
                                        <div className="tab-content account dashboard-content pl-50">
                                            <div
                                                className={
                                                    activeIndex === 1
                                                        ? "tab-pane fade active show"
                                                        : "tab-pane fade"
                                                }
                                            >
                                                {!selectedOrder ? (
                                                    <div className="card">
                                                        <div className="card-header">
                                                            <h3 className="mb-0">Your Orders</h3>
                                                        </div>

                                                        <div className="card-body">
                                                            <div className="table-responsive">
                                                                <table className="table">
                                                                    <thead>
                                                                        <tr>
                                                                            <th>Order</th>
                                                                            <th>Date</th>
                                                                            <th>Status</th>
                                                                            <th>Total</th>
                                                                            <th>Actions</th>
                                                                        </tr>
                                                                    </thead>

                                                                    <tbody>
                                                                        {ordersLoading ? (
                                                                            <tr>
                                                                                <td
                                                                                    colSpan={5}
                                                                                    className="text-center"
                                                                                >
                                                                                    Loading orders...
                                                                                </td>
                                                                            </tr>
                                                                        ) : ordersError ? (
                                                                            <tr>
                                                                                <td
                                                                                    colSpan={5}
                                                                                    className="text-center text-danger"
                                                                                >
                                                                                    Unable to load orders.
                                                                                </td>
                                                                            </tr>
                                                                        ) : orders.length === 0 ? (
                                                                            <tr>
                                                                                <td
                                                                                    colSpan={5}
                                                                                    className="text-center"
                                                                                >
                                                                                    No orders found.
                                                                                </td>
                                                                            </tr>
                                                                        ) : (
                                                                            orders.map((order) => (
                                                                                <tr key={order.id}>
                                                                                    <td>
                                                                                        #
                                                                                        {order.ticket_number ||
                                                                                            order.order_uuid}
                                                                                    </td>

                                                                                    <td>
                                                                                        {order.createdAt
                                                                                            ? new Date(
                                                                                                order.createdAt
                                                                                            ).toLocaleDateString()
                                                                                            : "-"}
                                                                                    </td>

                                                                                    <td>
                                                                                        <span className="badge bg-light text-dark">
                                                                                            {order.status
                                                                                                ? order.status
                                                                                                    .charAt(0)
                                                                                                    .toUpperCase() +
                                                                                                order.status.slice(1)
                                                                                                : "-"}
                                                                                        </span>
                                                                                    </td>

                                                                                    <td>
                                                                                        $
                                                                                        {Number(
                                                                                            order.total_amount
                                                                                        ).toFixed(2)}
                                                                                    </td>

                                                                                    <td>
                                                                                        <button
                                                                                            type="button"
                                                                                            className="btn-small d-block"
                                                                                            onClick={() =>
                                                                                                setSelectedOrder(order)
                                                                                            }
                                                                                        >
                                                                                            View
                                                                                        </button>
                                                                                    </td>
                                                                                </tr>
                                                                            ))
                                                                        )}
                                                                    </tbody>
                                                                </table>
                                                            </div>

                                                            {totalOrderPages > 1 && (
                                                                <div className="d-flex justify-content-center align-items-center mt-30">
                                                                    <button
                                                                        type="button"
                                                                        className="btn btn-sm mr-10"
                                                                        disabled={orderPage === 1}
                                                                        onClick={() =>
                                                                            setOrderPage((page) =>
                                                                                Math.max(1, page - 1)
                                                                            )
                                                                        }
                                                                    >
                                                                        Previous
                                                                    </button>

                                                                    <span className="mx-3">
                                                                        Page {orderPage} of {totalOrderPages}
                                                                    </span>

                                                                    <button
                                                                        type="button"
                                                                        className="btn btn-sm"
                                                                        disabled={
                                                                            orderPage === totalOrderPages
                                                                        }
                                                                        onClick={() =>
                                                                            setOrderPage((page) =>
                                                                                Math.min(
                                                                                    totalOrderPages,
                                                                                    page + 1
                                                                                )
                                                                            )
                                                                        }
                                                                    >
                                                                        Next
                                                                    </button>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                ) : (
                                                    /* ================= ORDER DETAILS ================= */
                                                    <div>
                                                        <button
                                                            type="button"
                                                            className="btn btn-sm mb-20"
                                                            onClick={() => setSelectedOrder(null)}
                                                        >
                                                            ← Back to Orders
                                                        </button>

                                                        {/* Order Summary */}
                                                        <div className="card mb-20">
                                                            <div className="card-header d-flex justify-content-between align-items-center">
                                                                <div>
                                                                    <h3 className="mb-5">
                                                                        Order #
                                                                        {selectedOrder.ticket_number ||
                                                                            selectedOrder.order_uuid}
                                                                    </h3>

                                                                    <p className="text-muted mb-0">
                                                                        {selectedOrder.createdAt
                                                                            ? new Date(
                                                                                selectedOrder.createdAt
                                                                            ).toLocaleDateString()
                                                                            : "-"}
                                                                    </p>
                                                                </div>

                                                                <span className="badge bg-light text-dark">
                                                                    {selectedOrder.status
                                                                        ? selectedOrder.status
                                                                            .charAt(0)
                                                                            .toUpperCase() +
                                                                        selectedOrder.status.slice(1)
                                                                        : "-"}
                                                                </span>
                                                            </div>

                                                            <div className="card-body">
                                                                <div className="row">
                                                                    <div className="col-md-4">
                                                                        <p className="text-muted mb-5">
                                                                            Subtotal
                                                                        </p>
                                                                        <h5>
                                                                            $
                                                                            {Number(
                                                                                selectedOrder.subtotal_amount
                                                                            ).toFixed(2)}
                                                                        </h5>
                                                                    </div>

                                                                    <div className="col-md-4">
                                                                        <p className="text-muted mb-5">
                                                                            Shipping
                                                                        </p>
                                                                        <h5>
                                                                            $
                                                                            {Number(
                                                                                selectedOrder.shipping_amount
                                                                            ).toFixed(2)}
                                                                        </h5>
                                                                    </div>

                                                                    <div className="col-md-4">
                                                                        <p className="text-muted mb-5">
                                                                            HST
                                                                        </p>
                                                                        <h5>
                                                                            $
                                                                            {Number(
                                                                                selectedOrder.tax_amount
                                                                            ).toFixed(2)}
                                                                        </h5>
                                                                    </div>
                                                                </div>

                                                                <hr />

                                                                <div className="d-flex justify-content-between">
                                                                    <h4>Total</h4>

                                                                    <h4 className="text-brand">
                                                                        $
                                                                        {Number(
                                                                            selectedOrder.total_amount
                                                                        ).toFixed(2)}
                                                                    </h4>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Ordered Items */}
                                                        <div className="card mb-20">
                                                            <div className="card-header">
                                                                <h4 className="mb-0">Items</h4>
                                                            </div>

                                                            <div className="card-body">
                                                                {selectedOrder.items?.map(
                                                                    (item: any) => {
                                                                        const product = item.product;

                                                                        const itemTotal =
                                                                            Number(item.price || 0) *
                                                                            Number(item.quantity || 0);

                                                                        return (
                                                                            <div
                                                                                key={item.id}
                                                                                className="border-bottom pb-20 mb-20"
                                                                            >
                                                                                <div className="row align-items-center">
                                                                                    <div className="col-md-8">
                                                                                        <h5 className="mb-5">
                                                                                            {product?.description ||
                                                                                                "Product"}
                                                                                        </h5>

                                                                                        <p className="text-muted mb-5">
                                                                                            Quantity:{" "}
                                                                                            {item.quantity}
                                                                                        </p>

                                                                                        <p className="text-muted mb-0">
                                                                                            $
                                                                                            {Number(
                                                                                                item.price
                                                                                            ).toFixed(2)}{" "}
                                                                                            each
                                                                                        </p>
                                                                                    </div>

                                                                                    <div className="col-md-4 text-md-right">
                                                                                        <h5 className="text-brand">
                                                                                            $
                                                                                            {itemTotal.toFixed(
                                                                                                2
                                                                                            )}
                                                                                        </h5>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        );
                                                                    }
                                                                )}
                                                            </div>
                                                        </div>

                                                        {/* Shipping Address */}
                                                        <div className="card mb-20">
                                                            <div className="card-header">
                                                                <h4 className="mb-0">
                                                                    Shipping Information
                                                                </h4>
                                                            </div>

                                                            <div className="card-body">
                                                                {selectedOrder.shipping_address && (
                                                                    <address className="mb-0">
                                                                        <strong>
                                                                            {
                                                                                selectedOrder
                                                                                    .shipping_address
                                                                                    .firstName
                                                                            }{" "}
                                                                            {
                                                                                selectedOrder
                                                                                    .shipping_address
                                                                                    .lastName
                                                                            }
                                                                        </strong>
                                                                        <br />

                                                                        {
                                                                            selectedOrder.shipping_address
                                                                                .address1
                                                                        }

                                                                        {selectedOrder.shipping_address
                                                                            .address2 && (
                                                                                <>
                                                                                    <br />
                                                                                    {
                                                                                        selectedOrder
                                                                                            .shipping_address
                                                                                            .address2
                                                                                    }
                                                                                </>
                                                                            )}

                                                                        <br />

                                                                        {
                                                                            selectedOrder.shipping_address
                                                                                .city
                                                                        }
                                                                        ,{" "}
                                                                        {
                                                                            selectedOrder.shipping_address
                                                                                .state
                                                                        }
                                                                        <br />

                                                                        {
                                                                            selectedOrder.shipping_address
                                                                                .zip
                                                                        }
                                                                        ,{" "}
                                                                        {
                                                                            selectedOrder.shipping_address
                                                                                .country
                                                                        }
                                                                    </address>
                                                                )}

                                                                {selectedOrder.shipping_address?.shipNote && (
                                                                    <p className="text-muted mt-15 mb-0">
                                                                        <strong>Shipping note:</strong>{" "}
                                                                        {
                                                                            selectedOrder.shipping_address
                                                                                .shipNote
                                                                        }
                                                                    </p>
                                                                )}
                                                            </div>
                                                        </div>

                                                        {/* Shipping Status */}
                                                        <div className="card">
                                                            <div className="card-header">
                                                                <h4 className="mb-0">
                                                                    Shipping Status
                                                                </h4>
                                                            </div>

                                                            <div className="card-body">
                                                                <h5 className="mb-10">
                                                                    {selectedOrder.status
                                                                        ? selectedOrder.status
                                                                            .charAt(0)
                                                                            .toUpperCase() +
                                                                        selectedOrder.status.slice(1)
                                                                        : "-"}
                                                                </h5>

                                                                {selectedOrder.shipped_at && (
                                                                    <p className="mb-5">
                                                                        Shipped on:{" "}
                                                                        {new Date(
                                                                            selectedOrder.shipped_at
                                                                        ).toLocaleDateString()}
                                                                    </p>
                                                                )}

                                                                {selectedOrder.carrier && (
                                                                    <p className="mb-5">
                                                                        Carrier:{" "}
                                                                        {selectedOrder.carrier}
                                                                    </p>
                                                                )}

                                                                {selectedOrder.tracking_number && (
                                                                    <p className="mb-5">
                                                                        Tracking number:{" "}
                                                                        {selectedOrder.tracking_number}
                                                                    </p>
                                                                )}

                                                                {selectedOrder.estimated_delivery && (
                                                                    <p className="mb-0">
                                                                        Estimated delivery:{" "}
                                                                        {new Date(
                                                                            selectedOrder.estimated_delivery
                                                                        ).toLocaleDateString()}
                                                                    </p>
                                                                )}

                                                                {!selectedOrder.shipped_at &&
                                                                    !selectedOrder.tracking_number && (
                                                                        <p className="text-muted mb-0">
                                                                            Tracking information will be
                                                                            available once your order ships.
                                                                        </p>
                                                                    )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                            <div className={activeIndex === 2 ? "tab-pane fade active show" : "tab-pane fade "} >
                                                <div className="row">
                                                    <div className="col-lg-6">
                                                        <div className="card mb-3 mb-lg-0">
                                                            <div className="card-header">
                                                                <h3 className="mb-0">Billing Address</h3>
                                                            </div>
                                                            <div className="card-body">
                                                                <address>
                                                                    3522 Interstate<br />
                                                                    75 Business Spur,<br />
                                                                    Sault Ste. <br />Marie, MI 49783
                                                                </address>
                                                                <p>New York</p>
                                                                <a href="#" className="btn-small">Edit</a>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-lg-6">
                                                        <div className="card">
                                                            <div className="card-header">
                                                                <h5 className="mb-0">Shipping Address</h5>
                                                            </div>
                                                            <div className="card-body">
                                                                <address>
                                                                    4299 Express Lane<br />
                                                                    Sarasota, <br />FL 34249 USA <br />Phone: 1.941.227.4444
                                                                </address>
                                                                <p>Sarasota</p>
                                                                <a href="#" className="btn-small">Edit</a>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div
                                                className={
                                                    activeIndex === 3
                                                        ? "tab-pane fade active show"
                                                        : "tab-pane fade"
                                                }
                                            >
                                                <div className="card">

                                                    <div className="card-header">
                                                        <h5 className="mb-0">
                                                            Account Details
                                                        </h5>
                                                    </div>

                                                    <div className="card-body">

                                                        {!user?.id && (
                                                            <p>
                                                                Already have an account?{" "}
                                                                <Link href="/page-login">
                                                                    Log in instead!
                                                                </Link>
                                                            </p>
                                                        )}

                                                        {user?.id && (
                                                            <form
                                                                method="post"
                                                                name="account-form"
                                                                onSubmit={handleAccountSubmit}
                                                            >
                                                                <div className="row">

                                                                    <div className="col-md-12 mb-20">
                                                                        <h5>
                                                                            Personal Information
                                                                        </h5>
                                                                    </div>

                                                                    <div className="form-group col-md-6">
                                                                        <label>
                                                                            First Name{" "}
                                                                            <span className="required">
                                                                                *
                                                                            </span>
                                                                        </label>

                                                                        <input
                                                                            required
                                                                            className="form-control"
                                                                            name="first_name"
                                                                            type="text"
                                                                            value={
                                                                                accountForm.first_name
                                                                            }
                                                                            onChange={
                                                                                handleAccountChange
                                                                            }
                                                                        />
                                                                    </div>

                                                                    <div className="form-group col-md-6">
                                                                        <label>
                                                                            Last Name{" "}
                                                                            <span className="required">
                                                                                *
                                                                            </span>
                                                                        </label>

                                                                        <input
                                                                            required
                                                                            className="form-control"
                                                                            name="last_name"
                                                                            type="text"
                                                                            value={
                                                                                accountForm.last_name
                                                                            }
                                                                            onChange={
                                                                                handleAccountChange
                                                                            }
                                                                        />
                                                                    </div>

                                                                    <div className="form-group col-md-12">
                                                                        <label>
                                                                            Email Address{" "}
                                                                            <span className="required">
                                                                                *
                                                                            </span>
                                                                        </label>

                                                                        <input
                                                                            required
                                                                            className="form-control"
                                                                            name="email"
                                                                            type="email"
                                                                            value={
                                                                                accountForm.email
                                                                            }
                                                                            onChange={
                                                                                handleAccountChange
                                                                            }
                                                                        />
                                                                    </div>

                                                                    <div className="col-md-12 mt-20 mb-20">
                                                                        <hr />

                                                                        <h5 className="mt-20">
                                                                            Change Password
                                                                        </h5>

                                                                        <p className="text-muted">
                                                                            Leave these fields empty
                                                                            if you don't want to
                                                                            change your password.
                                                                        </p>
                                                                    </div>

                                                                    <div className="form-group col-md-12">
                                                                        <label>
                                                                            Current Password
                                                                        </label>

                                                                        <input
                                                                            className="form-control"
                                                                            name="current_password"
                                                                            type="password"
                                                                            value={
                                                                                accountForm.current_password
                                                                            }
                                                                            onChange={
                                                                                handleAccountChange
                                                                            }
                                                                            placeholder="Enter current password"
                                                                            autoComplete="current-password"
                                                                        />
                                                                    </div>

                                                                    <div className="form-group col-md-6">
                                                                        <label>
                                                                            New Password
                                                                        </label>

                                                                        <input
                                                                            className="form-control"
                                                                            name="new_password"
                                                                            type="password"
                                                                            value={
                                                                                accountForm.new_password
                                                                            }
                                                                            onChange={
                                                                                handleAccountChange
                                                                            }
                                                                            placeholder="Enter new password"
                                                                            autoComplete="new-password"
                                                                        />
                                                                    </div>

                                                                    <div className="form-group col-md-6">
                                                                        <label>
                                                                            Confirm New Password
                                                                        </label>

                                                                        <input
                                                                            className="form-control"
                                                                            name="confirm_password"
                                                                            type="password"
                                                                            value={
                                                                                accountForm.confirm_password
                                                                            }
                                                                            onChange={
                                                                                handleAccountChange
                                                                            }
                                                                            placeholder="Confirm new password"
                                                                            autoComplete="new-password"
                                                                        />
                                                                    </div>

                                                                    <div className="col-md-12 mt-20">

                                                                        <button
                                                                            type="submit"
                                                                            className="btn btn-fill-out submit font-weight-bold"
                                                                            disabled={isSaving}
                                                                        >
                                                                            {isSaving
                                                                                ? "Saving..."
                                                                                : "Save Changes"}
                                                                        </button>

                                                                    </div>

                                                                </div>
                                                            </form>
                                                        )}

                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Layout>
        </>
    );
}

export default Account;
