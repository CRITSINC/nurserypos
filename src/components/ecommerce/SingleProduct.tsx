import Link from "next/link";
import React from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import {
    addToCart,
    deleteFromCart,
} from "../../redux/slices/cart.slice";
import { addToCompare } from "../../redux/slices/compare.slice";
import { openQuickView } from "../../redux/slices/quickView.slice";
import {
    addToWishlist,
    deleteFromWishlist,
} from "../../redux/slices/wishlist.slice";
import { Product } from "@/types/product.types";
import { useRouter } from "next/navigation";
import { isAuthenticated } from "@/redux/slices/auth.slice";
import { useAppSelector } from "@/redux/hooks";

interface Props {
    product: Product;
}
const SingleProduct = ({
    product
}: Props) => {
    const dispatch = useDispatch();
    const router = useRouter();

    const authenticated = useAppSelector(isAuthenticated);

    const cartItems = useAppSelector(
        (state) => state.cart.items
    );

    const wishlistItems = useAppSelector(
        (state) => state.wishlist.items
    );

    const inCart = (cartItems || []).some(
        (item: any) => item.id === product.id
    );

    const inWishlist = (wishlistItems || []).some(
        (item: any) => item.id === product.id
    );

    const handleCart = (product: Product) => {
        if (!authenticated) {
            sessionStorage.setItem(
                "pendingAction",
                JSON.stringify({
                    type: "cart",
                    product: product,
                    redirectTo: window.location.pathname,
                })
            );

            router.push("/login");
            return;
        }

        if (inCart) {
            dispatch(deleteFromCart(product.id));
            toast.success("Product removed from cart");
            return;
        }

        dispatch(addToCart(product));
        toast.success("Product added to cart");
    };

    const handleWishlist = (product: Product) => {
        if (!authenticated) {
            sessionStorage.setItem(
                "pendingAction",
                JSON.stringify({
                    type: "wishlist",
                    product: product,
                    redirectTo: window.location.pathname,
                })
            );

            router.push("/login");
            return;
        }

        if (inWishlist) {
            dispatch(deleteFromWishlist(product.id));
            toast.success("Removed from Wishlist");
            return;
        }

        dispatch(addToWishlist(product));
        toast.success("Added to Wishlist");
    };
    return (
        <>
            <div className="product-cart-wrap mb-30">
                <div className="product-img-action-wrap">
                    <div className="product-img product-img-zoom">
                        <Link href={`/products/${product.id}`}>
                            <div
                                style={{
                                    height: "260px",
                                    width: "100%",
                                    position: "relative",
                                    overflow: "hidden",
                                    borderRadius: "15px",
                                }}
                            >
                                <img
                                    className="default-img"
                                    src={
                                        product.images?.length
                                            ? product.images[0]?.local_path ||
                                            product.images[0]?.lightspeed_url
                                            : "/assets/not-available.png"
                                    }
                                    alt={product.description || ""}
                                    style={{
                                        width: "100%",
                                        height: "100%",
                                        objectFit: "cover",
                                    }}
                                />

                                <img
                                    className="hover-img"
                                    src={
                                        product.images?.length > 1
                                            ? product.images[1]?.local_path ||
                                            product.images[1]?.lightspeed_url
                                            : product.images?.length
                                                ? product.images[0]?.local_path ||
                                                product.images[0]?.lightspeed_url
                                                : "/assets/not-available.png"
                                    }
                                    alt={product.description || ""}
                                    style={{
                                        width: "100%",
                                        height: "100%",
                                        objectFit: "cover",
                                    }}
                                />
                            </div>
                        </Link>
                    </div>
                    <div className="product-action-1">
                        <a aria-label="Quick view" className="action-btn hover-up" data-bs-toggle="modal" onClick={(e) => dispatch(openQuickView(product))}>
                            <i className="fi-rs-eye"></i>
                        </a>
                        <button
                            type="button"
                            aria-label={
                                inWishlist
                                    ? "Remove From Wishlist"
                                    : "Add To Wishlist"
                            }
                            className="action-btn hover-up"
                            onClick={() =>
                                handleWishlist(product)
                            }
                        >
                            <i
                                className={
                                    authenticated && inWishlist
                                        ? "fi-rs-check"
                                        : "fi-rs-heart"
                                }
                            ></i>
                        </button>
                    </div>

                    {/* <div className="product-badges product-badges-position product-badges-mrg">
                        {product.trending && <span className="hot">Hot</span>}
                        {product.created && <span className="new">New</span>}
                        {product.totalSell > 100 && <span className="best">Best Sell</span>}
                        {product.discount.isActive && <span className="sale">Sale</span>}
                        {product.discount.percentage >= 5 && <span className="hot">{product.discount.percentage}%</span>}
                    </div> */}
                </div>
                <div className="product-content-wrap">
                    <div className="product-category">
                        <Link href="/products">{product.brand?.name}</Link>
                    </div>
                    <h2>
                        <Link href={`/products/${product.id}`}>
                            {product.description}
                        </Link>
                    </h2>

                    {/* <div className="product-rate-cover">
                        <div className="product-rate d-inline-block">
                            <div className="product-rating" style={{ width: "90%" }}></div>
                        </div>
                    </div> */}

                    {/* <div>
                        <span className="font-small text-muted">
                            By <Link href="/vendor/1">NestFood</Link>
                        </span>
                    </div> */}

                    <div className="product-card-bottom">
                        <div className="product-price">
                            <span>${product.price} </span>
                        </div>
                        {product?.qoh > 0 ? (
                            <div className="add-cart">
                                <a
                                    className="add"
                                    onClick={() =>
                                        handleCart(product)
                                    }
                                >
                                    <i
                                        className={
                                            authenticated && inCart
                                                ? "fi-rs-check mr-5"
                                                : "fi-rs-shopping-cart mr-5"
                                        }
                                    ></i>

                                    {authenticated && inCart
                                        ? "Remove"
                                        : "Add"}
                                </a>
                            </div>
                        ) :
                            (
                                <div className="add-cart mt-2">
                                    Out of Stock
                                </div>
                            )
                        }
                    </div>
                </div>
            </div>
        </>
    );
};

export default SingleProduct;