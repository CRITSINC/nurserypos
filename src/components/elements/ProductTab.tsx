"use client";

import { useState } from "react";

interface Props {
    product: any;
}

export default function ProductTab({ product }: Props) {
    const [active, setActive] = useState("description");

    return (
        <div className="product-info">

            <div className="custom-product-tabs">

                <ul 
                className="custom-tabs-list">
                    <li>
                        <button
                            className={`custom-tab-btn ${active === "description" ? "active" : ""
                                }`}
                            onClick={() => setActive("description")}
                        >
                            Description
                        </button>
                    </li>

                    <li>
                        <button
                            className={`custom-tab-btn ${active === "additional" ? "active" : ""
                                }`}
                            onClick={() => setActive("additional")}
                        >
                            Additional Info
                        </button>
                    </li>
                </ul>

            </div>

            <div className="tab-content shop_info_tab mt-30">

                {active === "description" && (

                    <div>

                        <p>

                            {product.long_description ||
                                product.description ||
                                "No description available."}

                        </p>

                    </div>

                )}

                {active === "additional" && (

                    <table className="table table-bordered">

                        <tbody>

                            <tr>
                                <th>SKU</th>
                                <td>
                                    {product.system_sku ||
                                        product.custom_sku ||
                                        product.manufacturer_sku ||
                                        "-"}
                                </td>
                            </tr>

                            <tr>
                                <th>UPC</th>
                                <td>{product.upc || "-"}</td>
                            </tr>

                            <tr>
                                <th>Brand</th>
                                <td>
                                    {product.brand?.name || "-"}
                                </td>
                            </tr>

                            <tr>
                                <th>Category</th>
                                <td>
                                    {product.category?.name ||
                                        "-"}
                                </td>
                            </tr>

                            <tr>
                                <th>Price</th>
                                <td>
                                    $
                                    {Number(
                                        product.price || 0
                                    ).toFixed(2)}
                                </td>
                            </tr>

                            <tr>
                                <th>Cost</th>
                                <td>
                                    $
                                    {Number(
                                        product.price ||
                                        0
                                    ).toFixed(2)}
                                </td>
                            </tr>

                            <tr>
                                <th>Status</th>
                                <td>
                                    {product.archived
                                        ? "Archived"
                                        : "Active"}
                                </td>
                            </tr>

                        </tbody>

                    </table>

                )}

            </div>

        </div>
    );
}