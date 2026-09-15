"use client";

import Link from "next/link";
import { useState } from "react";
import useClickOutside from "../../util/outsideClick";
import MobileCategoryDropdown from "../ecommerce/Filter/MobileCategoryDropdown";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/redux/hooks";

const MobileMenu = ({ isToggled, toggleClick }: any) => {
    const [isActive, setIsActive] = useState<{
        status: boolean;
        key: string | number;
    }>({
        status: false,
        key: "",
    });

    const router = useRouter();

    const [searchTerm, setSearchTerm] = useState("");
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // --------------------------------------------------
    // AUTH / CART / WISHLIST
    // --------------------------------------------------

    const user = useAppSelector((state) => state.auth.user);

    const cartItems = useAppSelector(
        (state) => state.cart.items
    );

    const wishlistItems = useAppSelector(
        (state) => state.wishlist.items
    );

    const isLoggedIn = Boolean(user);

    const cartCount = cartItems?.length ?? 0;
    const wishlistCount = wishlistItems?.length ?? 0;

    // --------------------------------------------------
    // MENU
    // --------------------------------------------------

    const handleToggle = (key: any) => {
        if (isActive.key === key) {
            setIsActive({
                status: false,
                key: "",
            });
        } else {
            setIsActive({
                status: true,
                key,
            });
        }
    };

    const domNode = useClickOutside<HTMLUListElement>(() => {
        setIsActive({
            status: false,
            key: "",
        });
    });

    const handleToggleMenu = () => {
        setIsMenuOpen((prevIsMenuOpen) => !prevIsMenuOpen);
    };

    // --------------------------------------------------
    // SEARCH
    // --------------------------------------------------

    const handleSearch = () => {
        const query = searchTerm.trim();

        if (!query) return;

        toggleClick?.();

        router.push(
            `/products?search=${encodeURIComponent(query)}`
        );

        setSearchTerm("");
    };

    const handleKeyDown = (
        e: React.KeyboardEvent<HTMLInputElement>
    ) => {
        if (e.key === "Enter") {
            e.preventDefault();
            handleSearch();
        }
    };

    // --------------------------------------------------
    // CART
    // --------------------------------------------------

    const handleCartClick = () => {
        toggleClick?.();

        if (!isLoggedIn) {
            router.push("/login");
            return;
        }

        router.push("/shop-cart");
    };

    const handleWishlistClick = () => {
        toggleClick?.();

        if (!isLoggedIn) {
            router.push("/login");
            return;
        }

        router.push("/shop-wishlist");
    };

    return (
        <>
            <div
                className={
                    isToggled
                        ? "mobile-header-active mobile-header-wrapper-style sidebar-visible"
                        : "mobile-header-active mobile-header-wrapper-style"
                }
            >
                <div className="mobile-header-wrapper-inner">

                    {/* -------------------------------- */}
                    {/* HEADER */}
                    {/* -------------------------------- */}

                    <div className="mobile-header-top">
                        <div className="mobile-header-logo">
                            <Link href="/" onClick={toggleClick}>
                                <img
                                    src="/assets/imgs/theme/LOGO-GEN.svg"
                                    alt="logo"
                                />
                            </Link>
                        </div>

                        <div className="mobile-menu-close close-style-wrap close-style-position-inherit">
                            <button
                                type="button"
                                className="close-style search-close"
                                onClick={toggleClick}
                            >
                                <i className="icon-top"></i>
                                <i className="icon-bottom"></i>
                            </button>
                        </div>
                    </div>

                    {/* -------------------------------- */}
                    {/* CONTENT */}
                    {/* -------------------------------- */}

                    <div className="mobile-header-content-area">

                        {/* -------------------------------- */}
                        {/* SEARCH */}
                        {/* -------------------------------- */}

                        <div className="mobile-search search-style-3 mobile-header-border">
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    handleSearch();
                                }}
                            >
                                <input
                                    type="text"
                                    placeholder="Search products..."
                                    value={searchTerm}
                                    onChange={(e) =>
                                        setSearchTerm(e.target.value)
                                    }
                                    onKeyDown={handleKeyDown}
                                />

                                <button type="submit">
                                    <i className="fi-rs-search"></i>
                                </button>
                            </form>
                        </div>

                        {/* -------------------------------- */}
                        {/* MOBILE MENU */}
                        {/* -------------------------------- */}

                        <div className="mobile-menu-wrap mobile-header-border">

                            {/* ALL CATEGORIES */}

                            <div className="main-categori-wrap mobile-header-border">
                                <Link
                                    href="#"
                                    className="categori-button-active-2"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        handleToggleMenu();
                                    }}
                                >
                                    <span className="fi-rs-apps"></span>{" "}
                                    All Categories
                                </Link>

                                <div
                                    className={`categori-dropdown-wrap categori-dropdown-active-small ${
                                        isMenuOpen ? "active" : ""
                                    }`}
                                >
                                    <MobileCategoryDropdown />
                                </div>
                            </div>

                            <nav>
                                <ul
                                    className="mobile-menu"
                                    ref={domNode}
                                >
                                    {/* HOME */}

                                    <li
                                        className={
                                            isActive.key == 1
                                                ? "menu-item-has-children active"
                                                : "menu-item-has-children"
                                        }
                                    >
                                        <span
                                            className="menu-expand"
                                            onClick={() =>
                                                handleToggle(1)
                                            }
                                        ></span>

                                        <Link
                                            href="/"
                                            onClick={toggleClick}
                                        >
                                            Home
                                        </Link>
                                    </li>

                                    {/* PRODUCTS */}

                                    <li
                                        className={
                                            isActive.key == 2
                                                ? "menu-item-has-children active"
                                                : "menu-item-has-children"
                                        }
                                    >
                                        <span
                                            className="menu-expand"
                                            onClick={() =>
                                                handleToggle(3)
                                            }
                                        ></span>

                                        <Link
                                            href="/products"
                                            onClick={toggleClick}
                                        >
                                            Products
                                        </Link>
                                    </li>

                                    {/* VENDORS */}

                                    <li
                                        className={
                                            isActive.key == 3
                                                ? "menu-item-has-children active"
                                                : "menu-item-has-children"
                                        }
                                    >
                                        <span
                                            className="menu-expand"
                                            onClick={() =>
                                                handleToggle(4)
                                            }
                                        ></span>

                                        <Link
                                            href="/vendors"
                                            onClick={toggleClick}
                                        >
                                            Vendors
                                        </Link>
                                    </li>

                                    {/* BRANDS */}

                                    <li
                                        className={
                                            isActive.key == 4
                                                ? "menu-item-has-children active"
                                                : "menu-item-has-children"
                                        }
                                    >
                                        <span
                                            className="menu-expand"
                                            onClick={() =>
                                                handleToggle(5)
                                            }
                                        ></span>

                                        <Link
                                            href="/brands"
                                            onClick={toggleClick}
                                        >
                                            Brands
                                        </Link>
                                    </li>

                                    {/* ABOUT */}

                                    <li
                                        className={
                                            isActive.key == 5
                                                ? "menu-item-has-children active"
                                                : "menu-item-has-children"
                                        }
                                    >
                                        <span
                                            className="menu-expand"
                                            onClick={() =>
                                                handleToggle(2)
                                            }
                                        ></span>

                                        <Link
                                            href="/about"
                                            onClick={toggleClick}
                                        >
                                            About
                                        </Link>
                                    </li>

                                    {/* CONTACT */}

                                    <li
                                        className={
                                            isActive.key == 6
                                                ? "menu-item-has-children active"
                                                : "menu-item-has-children"
                                        }
                                    >
                                        <span
                                            className="menu-expand"
                                            onClick={() =>
                                                handleToggle(6)
                                            }
                                        ></span>

                                        <Link
                                            href="/contact"
                                            onClick={toggleClick}
                                        >
                                            Contact
                                        </Link>
                                    </li>
                                </ul>
                            </nav>
                        </div>

                        <div className="mobile-header-info-wrap mobile-header-border">

                            <div className="single-mobile-header-info mt-30">
                                <Link
                                    href="/contact"
                                    onClick={toggleClick}
                                >
                                    Our location
                                </Link>
                            </div>

                            {!isLoggedIn && (
                                <>
                                    <div className="single-mobile-header-info">
                                        <Link
                                            href="/register"
                                            onClick={toggleClick}
                                        >
                                            Sign Up
                                        </Link>
                                    </div>

                                    <div className="single-mobile-header-info">
                                        <Link
                                            href="/login"
                                            onClick={toggleClick}
                                        >
                                            Log In
                                        </Link>
                                    </div>
                                </>
                            )}

                            <div className="single-mobile-header-info">
                                <button
                                    type="button"
                                    className="mobile-menu-action"
                                    onClick={handleWishlistClick}
                                >
                                    <span className="mobile-menu-action-left">
                                        <span>Wishlist</span>
                                    </span>

                                    {isLoggedIn && (
                                        <span className="mobile-menu-count">
                                            {wishlistCount}
                                        </span>
                                    )}
                                </button>
                            </div>

                            <div className="single-mobile-header-info">
                                <button
                                    type="button"
                                    className="mobile-menu-action"
                                    onClick={handleCartClick}
                                >
                                    <span className="mobile-menu-action-left">
                                        <span>Cart</span>
                                    </span>

                                    {isLoggedIn && (
                                        <span className="mobile-menu-count">
                                            {cartCount}
                                        </span>
                                    )}
                                </button>
                            </div>

                            <div className="single-mobile-header-info">
                                <Link href="#">
                                    905-584-9973
                                </Link>
                            </div>
                        </div>

                        <div className="mobile-social-icon">
                            <h5 className="mb-15 text-grey-4">
                                Follow Us
                            </h5>

                            <Link
                                href="https://www.facebook.com/glenechonurseries"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <img
                                    src="/assets/imgs/theme/icons/icon-facebook.svg"
                                    alt="facebook"
                                />
                            </Link>

                            <Link
                                href="https://twitter.com/glenechocaledon"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <img
                                    src="/assets/imgs/theme/icons/icon-twitter.svg"
                                    alt="twitter"
                                />
                            </Link>

                            <Link
                                href="https://www.instagram.com/glenechonurseries/?hl=en"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <img
                                    src="/assets/imgs/theme/icons/icon-instagram.svg"
                                    alt="instagram"
                                />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default MobileMenu;