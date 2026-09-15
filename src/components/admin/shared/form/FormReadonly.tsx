import React from "react";

type FormReadonlyProps = {
    label: string;
    value: string;
};

function FormReadonly({
    label,
    value,
}: FormReadonlyProps) {
    return (
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-x-6">

            {/* Label */}
            <div className="w-full md:w-1/4 shrink-0">
                <label className="text-sm font-medium text-slate-700">
                    {label}
                </label>
            </div>

            {/* Value */}
            <div className="w-full md:w-3/4">
                <div
                    className="
                        flex
                        min-h-12
                        w-full
                        items-center
                        rounded-md
                        border
                        border-input
                        bg-muted/40
                        px-3
                        py-2
                        text-sm
                        text-slate-700
                    "
                >
                    {value || "-"}
                </div>
            </div>

        </div>
    );
}

export default FormReadonly;