"use client";

import { Control, FieldPath, FieldValues } from "react-hook-form";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/admin/ui/form";

import PasswordInput from "@/components/common/PasswordInput";

interface Props<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>
> {
  control: Control<TFieldValues>;
  name: TName;
  label: string;
  placeholder?: string;
}

function FormPasswordInput<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>
>({
  control,
  name,
  label,
  placeholder,
}: Props<TFieldValues, TName>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>

          <FormControl>
            <PasswordInput
              value={field.value}
              onChange={field.onChange}
              placeholder={placeholder}
            />
          </FormControl>

          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export default FormPasswordInput;