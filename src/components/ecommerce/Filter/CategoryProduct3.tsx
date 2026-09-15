"use client"

import { useRouter } from "next/navigation";
import { connect } from "react-redux";
import { updateProductCategory } from "../../../redux/slices/productFilter.slice";

const CategoryProduct3 = ({ updateProductCategory }:any) => {




    const router = useRouter();

    // const removeSearchTerm = () => {
    //     router.push({
    //         pathname: "/products",
    //     });
    // };

    const selectCategory = (e:any, category:any) => {
        e.preventDefault();
        // removeSearchTerm();
        updateProductCategory(category);
        router.push(category ? `/products?cat=${category}` : "/products");
    };
    return (
        <>
            <ul  className="end">
                <li onClick={(e) => selectCategory(e, "jeans")}>
                    <a>
                        <img
                            src="/assets/imgs/theme/icons/category-1.svg"
                            alt="nest"
                        />
                        Milks & Dairies
                    </a>

                </li>
                <li onClick={(e) => selectCategory(e, "shoe")}>
                    <a>
                        <img
                            src="/assets/imgs/theme/icons/category-2.svg"
                            alt="nest"
                        />
                        Clothing
                    </a>

                </li>
                <li onClick={(e) => selectCategory(e, "jacket")}>
                    <a>
                        <img
                            src="/assets/imgs/theme/icons/category-3.svg"
                            alt="nest"
                        />
                        Pet Foods{" "}
                    </a>

                </li>
                <li onClick={(e) => selectCategory(e, "trousers")}>
                    <a>
                        <img
                            src="/assets/imgs/theme/icons/category-4.svg"
                            alt="nest"
                        />
                        Baking material
                    </a>

                </li>
                <li onClick={(e) => selectCategory(e, "accessories")}>
                    <a>
                        <img
                            src="/assets/imgs/theme/icons/category-5.svg"
                            alt="nest"
                        />
                        Fresh Fruit
                    </a>
                </li>
            </ul>
        </>
    );
};

export default connect(null, { updateProductCategory })(CategoryProduct3);
