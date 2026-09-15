"use client";

import { useState } from "react";
import { toast } from "react-toastify";

import Layout from "../../../components/layout/Layout";

import { useAppDispatch, useAppSelector } from "@/redux/hooks";

import {
  clearWishlist,
  deleteFromWishlist,
} from "@/redux/slices/wishlist.slice";

import { addToCart } from "@/redux/slices/cart.slice";
import Link from "next/link";

const Wishlist = () => {
  const dispatch = useAppDispatch();

  const wishlist = useAppSelector((state) => state.wishlist);

  const handleCart = (product: any) => {
    dispatch(addToCart(product));
    dispatch(deleteFromWishlist(product.id));
    toast.success("Product added to cart!");
  };

  return (
    <Layout parent="Home" sub="Wishlist">
      <section className="mt-50 mb-50">
        <div className="container">
          <div className="row">
            <div className="col-xl-10 col-lg-12 m-auto">

              {wishlist.items.length > 0 ? (
                <>
                  <div className="table-responsive shopping-summery">
                    <table className="table table-wishlist">
                      <thead>
                        <tr className="main-heading">
                          <th
                            className="custome-checkbox start pl-30"
                            colSpan={2}
                          >
                            Product
                          </th>

                          <th>Price</th>

                          <th>Stock Status</th>

                          <th>Action</th>

                          <th className="end">Remove</th>
                        </tr>
                      </thead>

                      <tbody>
                        {wishlist.items.map((product: any) => (
                          <tr key={product.id}>
                            <td className="image product-thumbnail pt-40">
                              <img
                                src={
                                  product.images?.length
                                    ? product.images[0]?.local_path || product.images[0]?.lightspeed_url
                                    : "/assets/not-available.png"
                                }
                                alt={product.description}
                                className="img-fluid"
                              />
                            </td>

                            <td className="product-des product-name">
                              <h6 className="product-name mb-10">
                                {product.description}
                              </h6>
                            </td>

                            <td data-title="Price">
                              <h3 className="text-brand">
                                ${product.price ?? 0}
                              </h3>
                            </td>

                            <td
                              className="text-center detail-info"
                              data-title="Stock"
                            >
                              {(product.qoh ??
                                product.inventories?.reduce(
                                  (sum: number, inv: any) =>
                                    sum + (inv.qoh || 0),
                                  0
                                )) > 0 ? (
                                <span className="stock-status in-stock mb-0">
                                  In Stock
                                </span>
                              ) : (
                                <span className="stock-status out-stock mb-0">
                                  Out of Stock
                                </span>
                              )}
                            </td>

                            <td data-title="Cart">
                              {(product.qoh ??
                                product.inventories?.reduce(
                                  (sum: number, inv: any) =>
                                    sum + (inv.qoh || 0),
                                  0
                                )) > 0 ? (
                                <button
                                  className="btn btn-sm"
                                  onClick={() => handleCart(product)}
                                >
                                  Add to Cart
                                </button>
                              ) : (
                                <button className="btn btn-sm btn-secondary">
                                  Contact Us
                                </button>
                              )}
                            </td>

                            <td
                              className="action"
                              data-title="Remove"
                            >
                              <a
                                style={{ cursor: "pointer" }}
                                onClick={() =>
                                  dispatch(deleteFromWishlist(product.id))
                                }
                              >
                                <i className="fi-rs-trash"></i>
                              </a>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="text-right">
                    <span
                      className="clear-btn"
                      style={{ cursor: "pointer" }}
                      onClick={() => dispatch(clearWishlist())}
                    >
                      Clear All
                    </span>
                  </div>
                </>
              ) : (
                <div className="text-center py-5">
                  <h3>Your Wishlist is empty</h3>

                  <p className="text-muted mb-4">
                    Looks like you haven't wishlisted any products yet.
                  </p>

                  <Link
                    href="/products"
                    className="btn btn-heading btn-block"
                  >
                    Continue Shopping
                  </Link>
                </div>
              )}

            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Wishlist;
