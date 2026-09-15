"use client";

import Slider from "rc-slider";
import "rc-slider/assets/index.css";

interface PriceRangeSliderProps {
    min: number;
    max: number;

    value: {
        min: number;
        max: number;
    };

    onChange: (
        min: number,
        max: number
    ) => void;
}

export default function PriceRangeSlider({
    min,
    max,
    value,
    onChange,
}: PriceRangeSliderProps) {

    return (
        <>
            <Slider
                range
                allowCross={false}
                min={min}
                max={max}
                value={[
                    value.min,
                    value.max,
                ]}
                onChange={(values) => {

                    if (
                        Array.isArray(values)
                    ) {
                        onChange(
                            values[0],
                            values[1]
                        );
                    }
                }}
            />

            <div className="d-flex justify-content-between mt-10">
                <span>
                    {min}
                </span>

                <span>
                    {max}
                </span>
            </div>
        </>
    );
}