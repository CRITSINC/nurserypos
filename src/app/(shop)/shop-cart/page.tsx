"use client";

import Link from "next/link";
import { useEffect } from "react";
import Layout from "@/components/layout/Layout";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  deleteFromCart,
  increaseQuantity,
  decreaseQuantity,
  clearCart,
} from "@/redux/slices/cart.slice";
import { useGetOrdersStockQuery } from "@/redux/services/product";
import { toasterInfo } from "@/components/core/Toaster";

const Cart = () => {
  const dispatch = useAppDispatch();

  const cartItems = useAppSelector(
    (state) => state.cart.items
  );

  const productIds = Array.from(
    new Set(
      cartItems
        .map((item: any) => Number(item.id))
        .filter((id: number) => Number.isFinite(id))
    )
  );

  const stockIds = productIds.join(",");

  const {
    data: stockResponse,
    isLoading: stockLoading,
    isFetching: stockFetching,
    isError: stockError,
    refetch: refetchStock,
  } = useGetOrdersStockQuery(
    { ids: stockIds },
    {
      skip: productIds.length === 0,
      refetchOnMountOrArgChange: true,
    }
  );


  const getProductImage = (product: any) => {
    if (product.images?.length) {
      return (
        product.images[0]?.local_path ||
        product.images[0]?.lightspeed_url
      );
    }

    return "/assets/not-available.png";
  };

  const getProductPrice = (product: any) => {
    return product.price ?? 0;
  };

  const subtotal = cartItems.reduce(
    (total: number, item: any) => {
      return (
        total +
        getProductPrice(item) *
          (item.quantity || 1)
      );
    },
    0
  );

  const stockData = Array.isArray(
    stockResponse?.data
  )
    ? stockResponse.data
    : [];

  const stockMap = new Map<number, any>(
    stockData.map((product: any) => [
      Number(
        product.id ?? product.productId
      ),
      product,
    ])
  );

  const getAvailableQuantity = (
    productId: number
  ) => {
    const stock = stockMap.get(
      Number(productId)
    );

    return Number(
      stock?.stockQty ??
        stock?.qoh ??
        0
    );
  };

  const isStockCheckPending =
    stockLoading || stockFetching;

  /**
   * Automatically reduce cart quantity if
   * live stock has become lower than the
   * quantity currently in the cart.
   *
   * Example:
   *
   * Cart quantity: 5
   * Live stock:     3
   *
   * Cart quantity will automatically become 3.
   *
   * If stock becomes 0, the item remains
   * in the cart and "Out of stock" is shown.
   */
  useEffect(() => {
    if (
      isStockCheckPending ||
      stockError ||
      !stockData.length
    ) {
      return;
    }

    cartItems.forEach((item: any) => {
      const stock = stockMap.get(
        Number(item.id)
      );

      if (!stock) {
        return;
      }

      const availableQuantity =
        getAvailableQuantity(item.id);

      const currentQuantity =
        item.quantity || 1;

      if (
        availableQuantity > 0 &&
        currentQuantity > availableQuantity
      ) {
        const quantityToRemove =
          currentQuantity -
          availableQuantity;

        for (
          let i = 0;
          i < quantityToRemove;
          i++
        ) {
          dispatch(
            decreaseQuantity(item.id)
          );
        }
      }
    });
  }, [
    stockResponse,
    stockError,
    isStockCheckPending,
    cartItems,
    dispatch,
  ]);

  /**
   * Handles the + button.
   *
   * The button intentionally remains enabled
   * when the maximum quantity has been reached.
   *
   * This allows us to tell the user why the
   * quantity cannot be increased instead of
   * making the button appear broken/disabled.
   */
  const handleIncreaseQuantity = (
    productId: number,
    currentQuantity: number
  ) => {
    if (isStockCheckPending) {
      return;
    }

    if (stockError) {
      toasterInfo(
        "Unable to verify the current stock. Please try again."
      );

      return;
    }

    const stock = stockMap.get(
      Number(productId)
    );

    if (!stock) {
      toasterInfo(
        "Unable to verify the current stock. Please try again."
      );

      return;
    }

    if (stock.inStock !== true) {
      toasterInfo(
        "This product is currently out of stock."
      );

      return;
    }

    const availableQuantity =
      getAvailableQuantity(productId);

    if (
      availableQuantity <= 0
    ) {
      toasterInfo(
        "This product is currently out of stock."
      );

      return;
    }

    if (
      currentQuantity >=
      availableQuantity
    ) {
      toasterInfo(
        "Maximum available quantity is already added to your cart."
      );

      return;
    }

    dispatch(
      increaseQuantity(productId)
    );
  };

  const hasStockValidationError =
    !isStockCheckPending &&
    !stockError &&
    cartItems.some((item: any) => {
      const stock = stockMap.get(
        Number(item.id)
      );

      if (!stock) {
        return true;
      }

      const availableQuantity =
        getAvailableQuantity(item.id);

      return (
        stock.inStock !== true ||
        (item.quantity || 1) >
          availableQuantity
      );
    });

  const canProceedToCheckout =
    !isStockCheckPending &&
    !stockError &&
    stockData.length ===
      productIds.length &&
    !hasStockValidationError;

  return (
    <Layout
      parent="Home"
      sub="Cart"
    >
      <section className="mt-50 mb-50">
        <div className="container">
          <div className="row">
            <div className="col-12">
              {cartItems.length === 0 ? (
                <div className="text-center py-5">
                  <h3>Your cart is empty</h3>

                  <p className="text-muted mb-4">
                    Looks like you haven't added
                    any products yet.
                  </p>

                  <Link
                    href="/products"
                    className="btn btn-heading btn-block"
                  >
                    Continue Shopping
                  </Link>
                </div>
              ) : (
                <>
                  <div className="table-responsive shopping-summery">
                    <table className="table text-center clean">
                      <thead>
                        <tr className="main-heading">
                          <th scope="col">
                            Image
                          </th>

                          <th scope="col">
                            Product
                          </th>

                          <th scope="col">
                            Price
                          </th>

                          <th scope="col">
                            Quantity
                          </th>

                          <th scope="col">
                            Subtotal
                          </th>

                          <th scope="col">
                            Remove
                          </th>
                        </tr>
                      </thead>

                      <tbody>
                        {cartItems.map(
                          (item: any) => {
                            const price =
                              getProductPrice(
                                item
                              );

                            const stock =
                              stockMap.get(
                                Number(item.id)
                              );

                            const quantity =
                              item.quantity || 1;

                            const availableQuantity =
                              getAvailableQuantity(
                                item.id
                              );

                            const itemOutOfStock =
                              !isStockCheckPending &&
                              !stockError &&
                              !!stock &&
                              stock.inStock !==
                                true;

                            const itemQuantityExceeded =
                              !isStockCheckPending &&
                              !stockError &&
                              !!stock &&
                              availableQuantity >
                                0 &&
                              quantity >
                                availableQuantity;

                            return (
                              <tr
                                key={item.id}
                              >
                                {/* Image */}
                                <td className="image product-thumbnail pt-10">
                                  <img
                                    src={getProductImage(
                                      item
                                    )}
                                    alt={
                                      item.description
                                    }
                                    className="img-fluid"
                                  />
                                </td>

                                {/* Product */}
                                <td className="product-des product-name">
                                  <h5 className="product-name">
                                    <Link
                                      href={`/products/${item.id}`}
                                    >
                                      {
                                        item.description
                                      }
                                    </Link>
                                  </h5>

                                  {item.system_sku && (
                                    <span className="text-muted">
                                      SKU:{" "}
                                      {
                                        item.system_sku
                                      }
                                    </span>
                                  )}

                                  {isStockCheckPending && (
                                    <div className="text-muted mt-1">
                                      Checking live
                                      stock...
                                    </div>
                                  )}

                                  {!isStockCheckPending &&
                                    stockError && (
                                      <div className="text-danger mt-1">
                                        Unable to verify
                                        live stock.
                                      </div>
                                    )}

                                  {!isStockCheckPending &&
                                    !stockError &&
                                    itemOutOfStock && (
                                      <div className="text-danger mt-1">
                                        Out of stock.
                                      </div>
                                    )}

                                  {!isStockCheckPending &&
                                    !stockError &&
                                    itemQuantityExceeded && (
                                      <div className="text-danger mt-1">
                                        Updating cart...
                                      </div>
                                    )}
                                </td>

                                {/* Price */}
                                <td className="price">
                                  <span>
                                    $
                                    {price.toFixed(
                                      2
                                    )}
                                  </span>
                                </td>

                                {/* Quantity */}
                                <td className="text-center">
                                  {isStockCheckPending ? (
                                    <div
                                      className="text-muted"
                                      style={{
                                        minWidth: 100,
                                      }}
                                    >
                                      Checking...
                                    </div>
                                  ) : stockError ? (
                                    <div
                                      className="text-muted"
                                      style={{
                                        minWidth: 100,
                                      }}
                                    >
                                      —
                                    </div>
                                  ) : itemOutOfStock ? (
                                    <span
                                      className="text-danger fw-bold"
                                      style={{
                                        minWidth: 100,
                                        display:
                                          "inline-block",
                                      }}
                                    >
                                      Out of stock
                                    </span>
                                  ) : (
                                    <div
                                      className="d-inline-flex align-items-center border rounded"
                                      style={{
                                        overflow:
                                          "hidden",
                                      }}
                                    >
                                      {/* Decrease */}
                                      <button
                                        type="button"
                                        className="btn btn-sm"
                                        onClick={() =>
                                          dispatch(
                                            decreaseQuantity(
                                              item.id
                                            )
                                          )
                                        }
                                        disabled={
                                          quantity <=
                                          1
                                        }
                                      >
                                        -
                                      </button>

                                      {/* Quantity */}
                                      <span
                                        className="px-3"
                                        style={{
                                          minWidth: 40,
                                        }}
                                      >
                                        {quantity}
                                      </span>

                                      {/* Increase */}
                                      <button
                                        type="button"
                                        className="btn btn-sm"
                                        onClick={() =>
                                          handleIncreaseQuantity(
                                            item.id,
                                            quantity
                                          )
                                        }
                                      >
                                        +
                                      </button>
                                    </div>
                                  )}
                                </td>

                                {/* Subtotal */}
                                <td className="text-right">
                                  <span>
                                    $
                                    {(
                                      price *
                                      quantity
                                    ).toFixed(2)}
                                  </span>
                                </td>

                                {/* Remove */}
                                <td className="action">
                                  <a
                                    style={{
                                      cursor:
                                        "pointer",
                                    }}
                                    onClick={() =>
                                      dispatch(
                                        deleteFromCart(
                                          item.id
                                        )
                                      )
                                    }
                                  >
                                    <i className="fi-rs-trash"></i>
                                  </a>
                                </td>
                              </tr>
                            );
                          }
                        )}
                      </tbody>
                    </table>
                  </div>

                  <div className="divider-2 mb-30"></div>

                  <div className="row">
                    {/* Cart actions */}
                    <div className="col-lg-6 col-md-6">
                      <Link
                        href="/products"
                        className="btn btn-md mr-10 mb-sm-15"
                      >
                        <i className="fi-rs-shopping-bag mr-10"></i>
                        Continue Shopping
                      </Link>

                      <button
                        type="button"
                        className="btn btn-danger btn-md mb-sm-15"
                        onClick={() =>
                          dispatch(
                            clearCart()
                          )
                        }
                      >
                        <i className="fi-rs-trash mr-10"></i>
                        Clear Cart
                      </button>
                    </div>

                    {/* Cart total */}
                    <div className="col-lg-6 col-md-6">
                      <div className="border p-md-4 cart-totals ml-30">
                        <div className="table-responsive">
                          <table className="table no-border">
                            <tbody>
                              <tr>
                                <td className="cart_total_label">
                                  <h6>
                                    Total
                                  </h6>
                                </td>

                                <td className="cart_total_amount">
                                  <h4 className="text-brand">
                                    $
                                    {subtotal.toFixed(
                                      2
                                    )}
                                  </h4>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>

                        {/* Checkout */}
                        {canProceedToCheckout ? (
                          <Link
                            href="/shop-checkout"
                            className="btn mb-20 w-100"
                          >
                            Proceed To Checkout

                            <i className="fi-rs-sign-out ml-15"></i>
                          </Link>
                        ) : (
                          <button
                            type="button"
                            className="btn mb-20 w-100"
                            disabled
                          >
                            {isStockCheckPending
                              ? "Checking Stock..."
                              : stockError
                              ? "Unable to Verify Stock"
                              : "Update Cart Quantity"}
                          </button>
                        )}

                        {/* Retry */}
                        {!isStockCheckPending &&
                          stockError && (
                            <button
                              type="button"
                              className="btn btn-outline-secondary w-100"
                              onClick={() =>
                                refetchStock()
                              }
                            >
                              Retry Stock Check
                            </button>
                          )}
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Cart;