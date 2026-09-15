"use client";

import Layout from "../../../components/layout/Layout";

export default function Warranty() {
    return (
        <Layout parent="Home" sub="Warranty">
            <div className="page-content pt-50 pb-80">
                <div className="container">
                    <div className="warranty-content">
                        <p>
                            We guarantee zone hardy varieties of the following nursery stock:
                        </p>

                        <ul className="warranty-list" style={{ marginLeft: "20px", marginBottom: "35px" }}>
                            <li>Shrubs and Roses</li>
                            <li>Trees and Fruit trees</li>
                            <li>Evergreens</li>
                            <li>Perennials</li>
                            <li>Grasses</li>
                        </ul>

                        <p>
                            This is providing the plant has been properly maintained and
                            planted in the ground (click here for planting instructions)
                            and the original purchase has been paid in full.
                        </p>

                        <p>
                            <strong>
                                Before taking action, please contact us at
                                {" "}905-584-9973{" "}
                                or email at
                                {" "}gardencentre@glenecho.com{" "}
                                for expert advice.
                            </strong>
                        </p>

                        <p>
                            Glen Echo Nurseries is not responsible for loss or damage due
                            to insects, animals or severe weather such as wind, snow,
                            ice, hail and flooding etc., or neglect.
                        </p>

                        <p>
                            <strong>
                                Warranty will be in the form of a credit note, NOT as a
                                refund. This will only be offered one time within 2 years
                                from the original purchase date for the maximum value of
                                the original purchase price.
                            </strong>
                        </p>

                        <p>
                            Original receipt is mandatory as proof of purchase.
                            <strong>
                                {" "}There will be no credit note issued without proof of
                                purchase.
                            </strong>
                        </p>

                        <p>
                            The credit note can be used anytime to purchase any nursery
                            item available, at the full listed price. No discounts will
                            apply to the new purchase unless advertised.
                        </p>

                        <p>
                            The following plant material is
                            <strong> NOT </strong>
                            covered under the warranty policy:
                        </p>

                        <ul className="warranty-list" style={{ marginLeft: "20px", marginBottom: "35px" }}>
                            <li>Annuals and mums</li>
                            <li>Tropical plants</li>
                            <li>Succulents</li>
                            <li>Sod</li>
                        </ul>

                        <p>
                            <strong>
                                The delivery charge is not covered under the warranty
                                policy.
                            </strong>
                        </p>

                        <p>
                            <strong>
                                In the case of replacement of plants under warranty that
                                were planted by Glen Echo Nurseries, the labour charges
                                will be shared 50/50 between the customer &amp; Glen Echo
                                Nurseries, plus delivery.
                            </strong>
                        </p>

                    </div>

                </div>
            </div> 
        </Layout>
    );
}