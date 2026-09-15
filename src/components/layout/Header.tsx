import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import Search from "../ecommerce/Search";
import useLogout from "@/hooks/useLogout";
import { useAppSelector } from "@/redux/hooks";
import CategoryDropdown from "../ecommerce/Filter/CategoryDropdown";
import { usePathname, useRouter } from "next/navigation";

const Header = ({ toggleClick, headerStyle = "", isToggled = false }: any) => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [scroll, setScroll] = useState(false);
    const [mounted, setMounted] = useState(false);
    const categoryDropdownRef = useRef<HTMLDivElement>(null);
    const logout = useLogout();
    const user = useAppSelector((state) => state.auth.user);
    const cartItems = useAppSelector((state) => state.cart.items);
    const wishlistItems = useAppSelector((state) => state.wishlist.items);

    const totalCartItems = cartItems.length;
    const totalWishlistItems = wishlistItems.length;
    const pathname = usePathname();
    const router = useRouter();

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                categoryDropdownRef.current &&
                !categoryDropdownRef.current.contains(
                    event.target as Node
                )
            ) {
                setMobileMenuOpen(false);
            }
        };

        document.addEventListener(
            "mousedown",
            handleClickOutside
        );

        return () => {
            document.removeEventListener(
                "mousedown",
                handleClickOutside
            );
        };
    }, []);

    useEffect(() => {
        setMounted(true);
        if (typeof window === 'undefined') return;

        const handleScroll = () => {
            const scrollCheck = window.scrollY >= 100;
            setScroll(scrollCheck);
        };

        handleScroll();

        document.addEventListener("scroll", handleScroll);

        return () => {
            document.removeEventListener("scroll", handleScroll);
        };
    }, []);

    const handleToggle = () => setMobileMenuOpen((prev) => !prev);

    // --------------------------------------------------
    // CART / WISHLIST
    // --------------------------------------------------
    // Guests must log in before accessing Cart/Wishlist.
    // Logged-in users go directly to the relevant page.

    const handleProtectedNavigation = (
        e: React.MouseEvent<HTMLAnchorElement>,
        path: "/shop-cart" | "/shop-wishlist"
    ) => {
        e.preventDefault();

        if (!user) {
            router.push("/login");
            return;
        }

        router.push(path);
    };

    return (
        <>
            <header className="header-area header-style-1 header-height-2">
                <div className="header-top header-top-ptb-1 d-none d-xl-block">
                    <div className="container">
                        <div className="header-wrap">
                            <div className="logo logo-width-1">
                                <Link href="/">
                                    <img src="/assets/imgs/theme/LOGO-GEN.svg" alt="logo" />
                                </Link>
                            </div>
                            <div className="header-right">
                                <div className="search-style-2">
                                    <Search />
                                </div>
                                <div className="header-action-right">
                                    <div className="header-action-2">
                                        <div className="header-action-icon-2">
                                            <Link
                                                href="/shop-wishlist"
                                                onClick={(e) =>
                                                    handleProtectedNavigation(e, "/shop-wishlist")
                                                }
                                            >
                                                <img
                                                    className="svgInject"
                                                    alt="Wishlist"
                                                    src="/assets/imgs/theme/icons/icon-heart.svg"
                                                />
                                                {user && (
                                                    <span className="pro-count blue">
                                                        {totalWishlistItems}
                                                    </span>
                                                )}
                                            </Link>
                                            <Link
                                                href="/shop-wishlist"
                                                onClick={(e) =>
                                                    handleProtectedNavigation(e, "/shop-wishlist")
                                                }
                                            >
                                                <span className="lable">Wishlist</span>
                                            </Link>
                                        </div>
                                        <div className="header-action-icon-2">
                                            <Link
                                                href="/shop-cart"
                                                className="mini-cart-icon"
                                                onClick={(e) =>
                                                    handleProtectedNavigation(e, "/shop-cart")
                                                }
                                            >
                                                <img
                                                    alt="Cart"
                                                    src="/assets/imgs/theme/icons/icon-cart.svg"
                                                />
                                                {user && (
                                                    <span className="pro-count blue">
                                                        {totalCartItems}
                                                    </span>
                                                )}
                                            </Link>
                                            <Link
                                                href="/shop-cart"
                                                onClick={(e) =>
                                                    handleProtectedNavigation(e, "/shop-cart")
                                                }
                                            >
                                                <span className="lable">Cart</span>
                                            </Link>
                                        </div>

                                        <div className="header-action-icon-2">
                                            {user ? (
                                                <>
                                                    <Link href="/">
                                                        <img
                                                            className="svgInject"
                                                            alt="User"
                                                            src="/assets/imgs/theme/icons/icon-user.svg"
                                                        />
                                                    </Link>

                                                    <Link href="/">
                                                        <span className="lable ml-0">Account</span>
                                                    </Link>

                                                    <div className="cart-dropdown-wrap cart-dropdown-hm2 account-dropdown">
                                                        <ul>
                                                            <li>
                                                                <Link href="/account">
                                                                    <i className="fi fi-rs-user mr-10"></i>
                                                                    My Account
                                                                </Link>
                                                            </li>

                                                            <li>
                                                                <Link
                                                                    href="/shop-wishlist"
                                                                    onClick={(e) =>
                                                                        handleProtectedNavigation(
                                                                            e,
                                                                            "/shop-wishlist"
                                                                        )
                                                                    }
                                                                >
                                                                    <i className="fi fi-rs-heart mr-10"></i>
                                                                    My Wishlist
                                                                </Link>
                                                            </li>

                                                            <li>
                                                                <div
                                                                    onClick={logout}
                                                                    style={{ cursor: "pointer" }}
                                                                >
                                                                    <i className="fi fi-rs-sign-out mr-10"></i>
                                                                    Sign Out
                                                                </div>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                </>
                                            ) : (
                                                <>
                                                    <Link href="/login">
                                                        <img
                                                            className="svgInject"
                                                            alt="User"
                                                            src="/assets/imgs/theme/icons/icon-user.svg"
                                                        />
                                                    </Link>

                                                    <Link href="/login">
                                                        <span className="lable ml-0">
                                                            Login / Register
                                                        </span>
                                                    </Link>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={mounted && scroll ? "header-bottom header-bottom-bg-color sticky-bar stick" : "header-bottom header-bottom-bg-color sticky-bar"}>
                    <div className="container">
                        <div className="header-wrap header-space-between position-relative">
                            <div className="logo logo-width-1 d-block d-xl-none">
                                <Link href="/">
                                    <img src="/assets/imgs/theme/LOGO-GEN.svg" alt="logo" />
                                </Link>
                            </div>
                            <div className="header-nav d-none d-xl-flex">
                                <div
                                    className="main-categori-wrap d-none d-xl-block"
                                    ref={categoryDropdownRef}
                                >
                                    <a className="categories-button-active" onClick={handleToggle}>
                                        <span className="fi-rs-apps"></span>
                                        All Categories
                                        <i className="fi-rs-angle-down"></i>
                                    </a>

                                    <div className={mobileMenuOpen ? "categories-dropdown-wrap categories-dropdown-active-large font-heading open" : "categories-dropdown-wrap categories-dropdown-active-large font-heading"}>
                                        <div className="categori-dropdown-inner">
                                            <CategoryDropdown />
                                        </div>
                                        <div className="more_slide_open" style={{ display: "none" }}>
                                            <div className="d-flex categori-dropdown-inner">
                                                <ul>
                                                    <li>
                                                        <Link href="/products">
                                                            <img src="/assets/imgs/theme/icons/icon-1.svg" alt="nest" />
                                                            Milks and Dairies
                                                        </Link>
                                                    </li>
                                                    <li>
                                                        <Link href="/products">
                                                            <img src="/assets/imgs/theme/icons/icon-2.svg" alt="nest" />
                                                            Clothing & beauty
                                                        </Link>
                                                    </li>
                                                </ul>
                                                <ul className="end">
                                                    <li>
                                                        <Link href="/products">
                                                            <img src="/assets/imgs/theme/icons/icon-3.svg" alt="nest" />
                                                            Wines & Drinks
                                                        </Link>
                                                    </li>
                                                    <li>
                                                        <Link href="/products">
                                                            <img src="/assets/imgs/theme/icons/icon-4.svg" alt="nest" />
                                                            Fresh Seafood
                                                        </Link>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="main-menu main-menu-padding-1 main-menu-lh-2 d-none d-lg-block  font-heading">
                                    <nav>
                                        <ul>
                                            <li>
                                                <Link href="/" className={pathname === "/" ? "active" : ""}>

                                                    Home
                                                </Link>
                                            </li>
                                            <li>
                                                <Link href="/products" className={pathname === "/products" ? "active" : ""}>
                                                    Products
                                                </Link>

                                            </li>

                                            <li>
                                                <Link href="/vendors" className={pathname === "/vendors" ? "active" : ""}>
                                                    Vendors
                                                </Link>

                                            </li>

                                            <li>
                                                <Link href="/brands" className={pathname === "/brands" ? "active" : ""}>
                                                    Brands
                                                </Link>

                                            </li>
                                            <li>
                                                <Link href="/about" className={pathname === "/about" ? "active" : ""}>
                                                    About
                                                </Link>
                                            </li>
                                            <li>
                                                <Link href="/contact" className={pathname === "/contact" ? "active" : ""}>
                                                    Contact
                                                </Link>
                                            </li>
                                        </ul>
                                    </nav>
                                </div>
                            </div>

                            <div className="header-action-icon-2 d-block d-xl-none">
                                <div className="burger-icon burger-icon-white" onClick={toggleClick}>
                                    <span className="burger-icon-top"></span>
                                    <span className="burger-icon-mid"></span>
                                    <span className="burger-icon-bottom"></span>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </header>
        </>
    );
};

export default Header;
