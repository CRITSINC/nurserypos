"use client";

interface Vendor {
    id: number;
    name: string;
    count?: number;
}

interface VendorFilterProps {
    vendors: Vendor[];

    selectedVendors: string[];

    onChange: (
        ids: string[]
    ) => void;
}

export default function VendorFilter({
    vendors,
    selectedVendors,
    onChange,
}: VendorFilterProps) {

    const toggleVendor = (
        id: number
    ) => {

        const value = String(id);

        if (
            selectedVendors.includes(value)
        ) {
            onChange(
                selectedVendors.filter(
                    (item) => item !== value
                )
            );
        } else {
            onChange([
                ...selectedVendors,
                value,
            ]);
        }
    };

    return (
        <div className="custome-checkbox">

            {vendors.length === 0 && (
                <p className="text-muted">
                    No vendors available.
                </p>
            )}

            {vendors.map((vendor) => (
                <div
                    key={vendor.id}
                    className="form-check mb-10"
                >
                    <input
                        type="checkbox"
                        className="form-check-input"
                        id={`vendor-${vendor.id}`}
                        checked={selectedVendors.includes(
                            String(vendor.id)
                        )}
                        onChange={() =>
                            toggleVendor(vendor.id)
                        }
                    />

                    <label
                        className="form-check-label"
                        htmlFor={`vendor-${vendor.id}`}
                    >
                        {vendor.name}

                        {vendor.count !== undefined && (
                            <span className="ml-5 text-muted">
                                ({vendor.count})
                            </span>
                        )}
                    </label>
                </div>
            ))}

        </div>
    );
}