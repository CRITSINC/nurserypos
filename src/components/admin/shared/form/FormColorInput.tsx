"use client";

import {
    Control,
    FieldPath,
    FieldValues,
} from "react-hook-form";

import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/admin/ui/form";

import { Input } from "@/components/admin/ui/input";

type FormColorInputProps<
    TFieldValues extends FieldValues
> = {
    control: Control<TFieldValues>;
    name: FieldPath<TFieldValues>;
    label: string;
    required?: boolean;
};

export default function FormColorInput<
    TFieldValues extends FieldValues
>({
    control,
    name,
    label,
    required
}: FormColorInputProps<TFieldValues>) {
    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => (
                <FormItem>
                    <FormLabel>
                        {label}
                        {required &&
                        <span className="ml-1 text-red-500">
                            *
                        </span>
                        }
                    </FormLabel>

                    <FormControl>
                        <div className="flex items-center gap-3">
                            <Input
                                type="color"
                                value={
                                    field.value ||
                                    "#000000"
                                }
                                onChange={(e) =>
                                    field.onChange(
                                        e.target.value
                                    )
                                }
                                className="h-11 w-16 cursor-pointer p-1"
                            />

                            <Input
                                value={
                                    field.value || ""
                                }
                                readOnly
                                placeholder=""
                                className="h-11 flex-1"
                            />
                        </div>
                    </FormControl>

                    <FormMessage />
                </FormItem>
            )}
        />
    );
}