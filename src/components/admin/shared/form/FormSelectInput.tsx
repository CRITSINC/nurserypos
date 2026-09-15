import { Control, FieldValues, Path } from "react-hook-form";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/admin/ui/form";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/admin/ui/select";

type Option = {
  label: string;
  value: string | number | null;
};

type FormSelectInputProps<TFormData extends FieldValues> = {
  control: Control<TFormData>;
  name: Path<TFormData>;
  label: string;
  placeholder?: string;
  options: Option[];
  disabled?: boolean;
};

function FormSelectInput<TFormData extends FieldValues>({
  control,
  name,
  label,
  placeholder = "Select",
  options,
  disabled,
}: FormSelectInputProps<TFormData>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-col md:flex-row md:gap-x-4 md:space-y-0">
          <FormLabel className="md:flex-shrink-0 md:w-1/4 md:mt-2 leading-snug">
            {label}
          </FormLabel>

          <div className="space-y-2 w-full">
            <FormControl>
              <Select
                disabled={disabled}
                value={
                  field.value !== null &&
                  field.value !== undefined
                    ? String(field.value)
                    : ""
                }
                onValueChange={(value) => {
                  field.onChange(Number(value));
                }}
              >
                <SelectTrigger className="h-12 w-full">
                  <SelectValue placeholder={placeholder} />
                </SelectTrigger>

                <SelectContent>
                  {options.map((option) => (
                    <SelectItem
                      key={option.value}
                      value={String(option.value)}
                    >
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormControl>

            <FormMessage />
          </div>
        </FormItem>
      )}
    />
  );
}

export default FormSelectInput;