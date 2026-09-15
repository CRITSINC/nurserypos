"use client"

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { updateProductFilters } from "../../../redux/slices/productFilter.slice";
import CheckBox from "./Checkbox";

const ContitionFilter = ({ updateProductFilters }:any) => {
    // console.log(updateProductFilters);

    const [sizes, setSizeCheckbox] = useState<any>([
        { value: "new" },
        { value: "refurbished " },
        { value: "used" },
    ]);

    const searchParams = useSearchParams();
    const searchTerm = searchParams.get("search");

    const [selectedSizes, setSizes] = useState([]);

    useEffect(() => {
        const filters = {
            condition: selectedSizes,
        };

        updateProductFilters(filters);
    }, [sizes, searchTerm]);

    const handleCheckBox = (
        event:any,
        filters:any,
        updatefilters:any,
        selectFilter:any,
        text:any
    ) => {
        const value = event.target.value;
        const updateSizes = filters;

        updateSizes.forEach((item:any) => {
            if (item.value === value) {
                if (item.checked) {
                    item.checked = false;
                    const newsize = text.filter((item:any) => item !== value);
                    selectFilter([...newsize]);
                } else {
                    item.checked = true;
                    const newsize = text.includes(value)
                        ? text
                        : [...text, value];
                    selectFilter([...newsize]);
                }
            }
        });

        updatefilters([...updateSizes]);
    };

    return (
        <>
            <div className="custome-checkbox">
                <CheckBox
                    heading="Select Size"
                    filters={sizes}
                    handleCheckBox={(e:any) => {
                        handleCheckBox(
                            e,
                            sizes,
                            setSizeCheckbox,
                            setSizes,
                            selectedSizes
                        );
                    }}
                />
            </div>
        </>
    );
};

const mapStateToProps = (state:any) => ({
    products: state.products.items,
});

const mapDidpatchToProps = {
    updateProductFilters,
};

export default connect(mapStateToProps, mapDidpatchToProps)(ContitionFilter);
