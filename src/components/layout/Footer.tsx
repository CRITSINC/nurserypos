import React from "react";
import Link from "next/link"
import { useRouter } from "next/navigation";

const Footer = () => {
    const router = useRouter();
    return (
        <>
            <footer className="main">
                <section className="newsletter mb-15  wow animate__animated animate__fadeIn">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-12">
                                <div className="position-relative newsletter-inner">
                                    <div className="newsletter-content">
                                        <h2 className="mb-20 text-[#255853]">
                                            Stay home & get your daily <br />
                                            needs from our shop
                                        </h2>
                                        <p className="mb-45">
                                            Start Your Shopping with{" "}
                                            <span className="text-brand">
                                                Glen Echo Nurseries
                                            </span>
                                        </p>
                                       
                                            <button className="btn" style={{ borderRadius: '50px'}} type="button" onClick={()=> router.push("/products") }>
                                                Shop Now!
                                            </button>
                                    
                                    </div>
                                    <img
                                        src="/assets/imgs/banner/Mask-Group.png"
                                        alt="newsletter"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="section-padding footer-mid">
                    <div className="container pt-15 pb-20">
                        <div className="row">
                            <div className="col">
                                <div
                                    className="widget-about font-md mb-md-3 mb-lg-3 mb-xl-0  wow animate__animated animate__fadeInUp"
                                    data-wow-delay="0"
                                >
                                    <div className="logo  mb-30">
                                        <Link href="/" className="mb-15">
                                            <img
                                                src="/assets/imgs/theme/LOGO-GEN.svg"
                                                alt="logo"
                                            />
                                        </Link>
                                    </div>
                                    <ul className="contact-infor">
                                        <li>
                                            <img
                                                src="/assets/imgs/theme/icons/icon-location.svg"
                                                alt="nest"
                                            />
                                            <strong>Address: </strong>{" "}
                                            <span>
                                                15070 Airport Road Caledon,
                                                Ontario Canada L7C 2W7
                                            </span>
                                        </li>
                                        <li>
                                            <img
                                                src="/assets/imgs/theme/icons/icon-contact.svg"
                                                alt="nest"
                                            />
                                            <strong>Call Us:</strong>
                                            <span> 905-584-9973</span>
                                        </li>
                                        <li>
                                            <img
                                                src="/assets/imgs/theme/icons/icon-email-2.svg"
                                                alt="nest"
                                            />
                                            <strong>Email:</strong>
                                            <span> gardencentre@glenecho.com</span>
                                        </li>
                                        <li>
                                            <img
                                                src="/assets/imgs/theme/icons/icon-clock.svg"
                                                alt="nest"
                                            />
                                             <strong>Hours:</strong>
                                            <a href="/hours"> Hours</a>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <div
                                className="footer-link-widget col  wow animate__animated animate__fadeInUp"
                                data-wow-delay=".1s"
                            >
                                <h4 className="widget-title">Quick Links</h4>
                                <ul className="footer-list  mb-sm-5 mb-md-0">
                                    <li>
                                        <Link href="/about">About Us</Link>
                                    </li>
                                    {/* <li>
                                        <a href="#">Delivery Information</a>
                                    </li> */}
                                    <li>
                                        <a href="/privacy-policy">Privacy Policy</a>
                                    </li>
                                    <li>
                                        <a href="/terms">Terms &amp; Conditions</a>
                                    </li>
                                    <li>
                                        <a href="/contact">Contact Us</a>
                                    </li>
                                    <li>
                                        <a href="/warranty">Our Warranty</a>
                                    </li>                                    
                                    <li>
                                        <a href="/careers">Careers</a>
                                    </li>
                                </ul>
                            </div>
                            <div
                                className="footer-link-widget col  wow animate__animated animate__fadeInUp"
                                data-wow-delay=".2s"
                            >
                                <h4 className="widget-title ">Account</h4>
                                <ul className="footer-list  mb-sm-5 mb-md-0">
                                    <li>
                                        <Link href="/login">Sign In</Link>
                                    </li>
                                    {/* <li>
                                        <a href="#">Track My Order</a>
                                    </li>
                                    <li>
                                        <a href="#">Help Ticket</a>
                                    </li>                            */}
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>
                <div
                    className="container pb-30  wow animate__animated animate__fadeInUp"
                    data-wow-delay="0"
                >
                    <div className="row align-items-center">
                        <div className="col-12 mb-30">
                            <div className="footer-bottom"></div>
                        </div>
                        <div className="col-xl-4 col-lg-6 col-md-6">
                            <p className="font-sm mb-0">
                                Copyright &copy; 2026,{" "}
                                Glen Echo Nurseries.
                                All rights reserved
                            </p>
                        </div>
                        <div className="col-xl-4 col-lg-6 text-center d-none d-xl-block">
                            <div className="hotline d-lg-inline-flex mr-30">
                                <img
                                    src="/assets/imgs/theme/icons/phone-call.svg"
                                    alt="hotline"
                                />
                                <p>
                                    905-584-9973
                                </p>
                            </div>
                        </div>
                        <div className="col-xl-4 col-lg-6 col-md-6 text-end d-none d-md-block">
                            <div className="mobile-social-icon">
                                <h6>Follow Us</h6>
                                <a href="https://www.facebook.com/glenechonurseries" target="_blank" rel="noopener noreferrer">
                                    <img
                                        src="/assets/imgs/theme/icons/icon-facebook-white.svg"
                                        alt="nest"
                                    />
                                </a>
                                <a href="https://twitter.com/glenechocaledon" target="_blank" rel="noopener noreferrer">
                                    <img
                                        src="/assets/imgs/theme/icons/icon-twitter-white.svg"
                                        alt="nest"
                                    />
                                </a>
                                <a href="https://www.instagram.com/glenechonurseries/?hl=en" target="_blank" rel="noopener noreferrer">
                                    <img
                                        src="/assets/imgs/theme/icons/icon-instagram-white.svg"
                                        alt="nest"
                                    />
                                </a>
                            </div>  
                        </div>
                    </div>
                </div>
            </footer>
        </>
    );
};

export default Footer;
