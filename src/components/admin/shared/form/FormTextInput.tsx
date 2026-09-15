import { Control, FieldValues, Path } from "react-hook-form";

import {
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormControl,
} from "@/components/admin/ui/form";
import { Input } from "@/components/admin/ui/input";
import { cn } from "@/lib/utils";

type FormTextInputProps<TFormData extends FieldValues> = {
  control: Control<TFormData>;
  name: Path<TFormData>;
  label: string;
  placeholder: string;
  type?: React.HTMLInputTypeAttribute;
  className?: string;
  required?: boolean;
  disabled?: boolean;
};

function FormTextInput<TFormData extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  type,
  className,
  required,
  disabled
}: FormTextInputProps<TFormData>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
          <FormItem
            className={cn(
              "flex flex-col md:flex-row md:gap-x-4 md:space-y-0",
              className
            )}
          >
          <FormLabel className="md:flex-shrink-0 md:w-1/4 md:mt-2 leading-snug">
            {label}
            {required &&
              <span className="ml-1 text-red-500">
                  *
              </span>
            }
          </FormLabel>

          <div className="space-y-2 w-full">
            <FormControl>
              <Input
                className="h-12"
                type={type}
                placeholder={placeholder}
                onFocus={
                  type === "number" ? (e) => e.target.select() : undefined
                }
                disabled={disabled}
                {...field}
              />
            </FormControl>

            <FormMessage />
          </div>
        </FormItem>
      )}
    />
  );
}

export default FormTextInput;
