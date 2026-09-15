import { useState } from "react";
import { connect } from "react-redux";
import { updateProductCategory } from "../../../redux/slices/productFilter.slice";

const CategoryFilter = ({ updateProductCategory }:any) => {
    const [active, setActive] = useState(0);

    const selectCategory = (i:any, category:any) => {
        // e.preventDefault();
        updateProductCategory(category);
        // router.push('/')
        setActive(active == i ? 0 : i);
    };

    const categories = [
        { title: "" },
        { title: "jeans" },
        { title: "shoe" },
        { title: "jacket" },
        { title: "trousers" },
        { title: "accessories" },
    ];

    return (
        <>
            <ul className="categor-list">
                {categories.map((item, i) => (
                    <li onClick={() => selectCategory(i, item.title)}>
                        <a
                            className={
                                active == i
                                    ? "cat-item text-danger"
                                    : "cat-item text-muted"
                            }
                        >
                            {i == 0 ? "All" : `${item.title}`}
                        </a>
                    </li>
                ))}
            </ul>
        </>
    );
};

export default connect(null, { updateProductCategory })(CategoryFilter);
