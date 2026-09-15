import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { updateProductFilters } from "../../../redux/slices/productFilter.slice";

const ColorFilter = ({ updateProductFilters }:any) => {
    const colors:any = [
        { value: "" },
        { value: "red" },
        { value: "yellow" },
        { value: "white" },
        { value: "orange" },
        { value: "cyan" },
        { value: "green" },
        { value: "purple" },
    ];

    const [selectedColor, setColor] = useState<any>([]);
    const [active, setActive] = useState<any>(0);

    useEffect(() => {
        const filters = {
            color: selectedColor,
        };

        updateProductFilters(filters);
    }, [selectedColor]);

    const handleClick = (i:any, target:any) => {
        setColor(target);
        setActive(active == i ? 0 : i);
    };

    return (
        <>
            <ul className="list-filter color-filter">
                {colors?.map((tag:any, i:number) => (
                    <li
                        className={active === i ? "active" : ""}
                        onClick={() => handleClick(i, tag.value)}
                    >
                        <a>
                            {i == 0 ? (
                                "All"
                            ) : (
                                <span
                                    className={`product-color-${tag.value}`}
                                ></span>
                            )}
                        </a>
                    </li>
                ))}
            </ul>
        </>
    );
};

const mapDidpatchToProps = {
    updateProductFilters,
};

export default connect(null, mapDidpatchToProps)(ColorFilter);
