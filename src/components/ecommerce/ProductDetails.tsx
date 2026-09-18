"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import { RootState } from "@/redux/store";

import {
    addToCart,
    deleteFromCart,
    decreaseQuantity,
    increaseQuantity,
} from "@/redux/slices/cart.slice";

import {
    addToWishlist,
    deleteFromWishlist,
} from "@/redux/slices/wishlist.slice";

import ProductTab from "../elements/ProductTab";
import RelatedSlider from "../sliders/Related";
import ThumbSlider from "../sliders/Thumb";

import {
    useCategoryProductsQuery,
} from "@/redux/services/product";

interface ProductDetailsProps {
    product: any;
    quickView?: any;
}

export default function ProductDetails({
    product,
    quickView,
}: ProductDetailsProps) {
    const dispatch = useDispatch();
    const router = useRouter();

    const user = useSelector(
        (state: RootState) =>
            state.auth.user
    );

    const isNormalUser =
        user?.roles?.role === "User";

    const cartItems = useSelector(
        (state: RootState) =>
            state.cart.items
    );

    const wishlistItems = useSelector(
        (state: RootState) =>
            state.wishlist.items
    );

    const [quantity, setQuantity] =
        useState(1);

    const inCart = (cartItems || []).find(
        (item: any) =>
            item.id === product.id
    );

    const inWishlist = (wishlistItems || []).some(
        (item: any) =>
            item.id === product.id
    );

    const isAddedToCart = Boolean(
        isNormalUser && inCart
    );

    const isAddedToWishlist = Boolean(
        isNormalUser && inWishlist
    );

    const totalStock = useMemo(() => {
        return Number(product?.qoh ?? 0);
    }, [product?.qoh]);

    const handleCart = () => {
        // Guest user
        if (!user) {
            sessionStorage.setItem(
                "pendingAction",
                JSON.stringify({
                    type: "cart",
                    product: product,
                    quantity: quantity,
                    redirectTo: window.location.pathname,
                    createdAt: Date.now(),
                })
            );

            router.push(
                "/login?pendingAction=1"
            );

            return;
        }

        // Only normal User can use cart
        if (!isNormalUser) {
            return;
        }

        // Remove product from cart
        if (inCart) {
            dispatch(
                deleteFromCart(product.id)
            );

            toast(
                "Product removed from cart."
            );

            return;
        }

        // Add product to cart
        dispatch(
            addToCart({
                ...product,
                quantity: quantity,
            })
        );

        toast(
            "Product added to cart."
        );
    };

    const handleWishlist = () => {
        // Guest user
        if (!user) {
            sessionStorage.setItem(
                "pendingAction",
                JSON.stringify({
                    type: "wishlist",
                    product: product,
                    redirectTo: window.location.pathname,
                    createdAt: Date.now(),
                })
            );

            router.push(
                "/login?pendingAction=1"
            );

            return;
        }

        // Only normal User can use wishlist
        if (!isNormalUser) {
            return;
        }

        // Remove from wishlist
        if (inWishlist) {
            dispatch(
                deleteFromWishlist(product.id)
            );

            toast(
                "Removed from wishlist."
            );

            return;
        }

        // Add to wishlist
        dispatch(
            addToWishlist(product)
        );

        toast(
            "Added to wishlist."
        );
    };

    const {
        data: relatedProductsData,
        isLoading,
        isFetching,
        isError,
    } = useCategoryProductsQuery(
        {
            id: product.category_id,
            limit: 5,
            pagination: true,
        },
        {
            skip:
                !product?.category_id,
        }
    );

    const relatedProducts =
        relatedProductsData?.data?.products
            ?.filter(
                (item) =>
                    item.id !== product.id
            ) ?? [];

    return (
        <section className="mt-50 mb-50">
            <div className="container">
                <div className="row flex-row-reverse">
                    <div className="col-xl-10 col-lg-12 m-auto">
                        <div className="product-detail accordion-detail">

                            <div className="row mb-50 mt-30">

                                <div className="col-md-6">

                                    <div className="detail-gallery">
                                        <div className="product-image-slider">
                                            <ThumbSlider
                                                product={product}
                                            />
                                        </div>
                                    </div>

                                </div>

                                <div className="col-md-6">

                                    <div className="detail-info pr-30 pl-30">

                                        <span
                                            className={`stock-status ${
                                                totalStock > 0
                                                    ? "in-stock"
                                                    : "out-stock"
                                            }`}
                                        >
                                            {totalStock > 0
                                                ? "In Stock"
                                                : "Out Of Stock"}
                                        </span>

                                        <h2 className="title-detail">
                                            {product.description}
                                        </h2>

                                        <div className="clearfix product-price-cover">

                                            <div className="product-price primary-color float-left">

                                                <span className="current-price text-brand">
                                                    $
                                                    {Number(
                                                        product.price || 0
                                                    ).toFixed(2)}
                                                </span>

                                            </div>

                                        </div>

                                        {product.brand?.name && (
                                            <div className="mb-3">
                                                <strong>
                                                    Brand:
                                                </strong>{" "}
                                                {product.brand?.name || "-"}
                                            </div>
                                        )}

                                        <div className="mb-3">
                                            <strong>
                                                Category:
                                            </strong>{" "}
                                            {product.category?.name || "-"}
                                        </div>

                                        {/* <div className="mb-3">
                                            <strong>
                                                Availability:
                                            </strong>{" "}
                                            <span className="text-success">
                                                {totalStock} in stock
                                            </span>
                                        </div> */}

                                        <div className="bt-1 border-color-1 mt-30 mb-30"></div>

                                        {totalStock > 0 && (
                                            <div className="detail-extralink">

                                                <div className="detail-qty border radius">

                                                    <a
                                                        className="qty-down"
                                                        onClick={() => {
                                                            if (
                                                                quantity > 1
                                                            ) {
                                                                setQuantity(
                                                                    quantity - 1
                                                                );
                                                            }
                                                        }}
                                                    >
                                                        <i className="fi-rs-angle-small-down"></i>
                                                    </a>

                                                    <span className="qty-val">
                                                        {quantity}
                                                    </span>

                                                    <a
                                                        className="qty-up"
                                                        onClick={() => {
                                                            if (
                                                                quantity <
                                                                totalStock
                                                            ) {
                                                                setQuantity(
                                                                    quantity + 1
                                                                );
                                                            }
                                                        }}
                                                    >
                                                        <i className="fi-rs-angle-small-up"></i>
                                                    </a>

                                                </div>

                                                <div className="product-extra-link2">

                                                    <button
                                                        type="button"
                                                        className="button button-add-to-cart"
                                                        disabled={
                                                            totalStock === 0 ||
                                                            (!!user &&
                                                                !isNormalUser)
                                                        }
                                                        onClick={
                                                            handleCart
                                                        }
                                                    >
                                                        <i
                                                            className={
                                                                isAddedToCart
                                                                    ? "fi-rs-check"
                                                                    : "fi-rs-shopping-cart"
                                                            }
                                                        ></i>

                                                        {isAddedToCart
                                                            ? "Remove from cart"
                                                            : "Add to cart"}
                                                    </button>

                                                    <a
                                                        className="action-btn hover-up"
                                                        onClick={
                                                            handleWishlist
                                                        }
                                                    >
                                                        <i
                                                            className={
                                                                isAddedToWishlist
                                                                    ? "fi-rs-check"
                                                                    : "fi-rs-heart"
                                                            }
                                                        ></i>
                                                    </a>

                                                </div>

                                            </div>
                                        )}

                                        {/* {!quickView && (
                                            <ul className="product-meta font-xs color-grey mt-40">
                                                <li className="mb-10">
                                                    SKU:
                                                    <span className="ml-5">
                                                        {product.system_sku ||
                                                            product.custom_sku ||
                                                            product.manufacturer_sku ||
                                                            "-"}
                                                    </span>
                                                </li>

                                                <li className="mb-10">
                                                    Category:
                                                    <span className="ml-5">
                                                        {product.category?.name ||
                                                            "-"}
                                                    </span>
                                                </li>

                                                <li>
                                                    Tags:
                                                    <span className="ml-5">
                                                        {product.tags?.length
                                                            ? product.tags
                                                                .map(
                                                                    (
                                                                        tag: any
                                                                    ) =>
                                                                        tag.name
                                                                )
                                                                .join(", ")
                                                            : "-"}
                                                    </span>
                                                </li>
                                            </ul>
                                        )} */}

                                    </div>

                                </div>

                            </div>

                            {!quickView && (
                                <div className="product-info">
                                    <ProductTab
                                        product={product}
                                    />
                                </div>
                            )}

                            {!quickView && (
                                <div className="row mt-60">

                                    <div className="col-12">

                                        <h3 className="section-title style-1 mb-30">
                                            Related Products
                                        </h3>

                                        {isLoading ||
                                        isFetching ? (

                                            <div className="text-center">

                                                <img
                                                    src="/assets/imgs/theme/loading.gif"
                                                    alt="Loading Products"
                                                    width={100}
                                                    height={100}
                                                />

                                                <p className="mt-15 text-muted">
                                                    Loading Products...
                                                </p>

                                            </div>

                                        ) : isError ? (

                                            <div className="col-12 text-center py-5">

                                                <div
                                                    className="d-flex align-items-center justify-content-center"
                                                    style={{
                                                        minHeight: "400px",
                                                    }}
                                                >

                                                    <div className="text-center">

                                                        <p className="mt-15 text-muted">
                                                            Unable to load products.
                                                        </p>

                                                    </div>

                                                </div>

                                            </div>

                                        ) : relatedProducts.length > 0 ? (

                                            <RelatedSlider
                                                products={
                                                    relatedProducts
                                                }
                                            />

                                        ) : (

                                            <div className="col-12 text-center py-5">

                                                <div
                                                    className="d-flex align-items-center justify-content-center"
                                                    style={{
                                                        minHeight: "400px",
                                                    }}
                                                >

                                                    <div className="text-center">

                                                        <p className="mt-15 text-muted">
                                                            No related products found.
                                                        </p>

                                                    </div>

                                                </div>

                                            </div>

                                        )}

                                    </div>

                                </div>
                            )}

                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}