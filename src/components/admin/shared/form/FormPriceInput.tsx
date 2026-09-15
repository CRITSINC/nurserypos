import { Control, FieldValues, Path } from "react-hook-form";

import {
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormControl,
} from "@/components/admin/ui/form";
import { Input } from "@/components/admin/ui/input";

type FormPriceInputProps<TFormData extends FieldValues> = {
  control: Control<TFormData>;
  name: Path<TFormData>;
  label: string;
  placeholder: string;
};

function FormPriceInput<TFormData extends FieldValues>({
  control,
  name,
  label,
  placeholder,
}: FormPriceInputProps<TFormData>) {
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
            <div
              className="
                flex
                h-12
                overflow-hidden
                rounded-md
                border
                border-input
                bg-background
                focus-within:ring-2
                focus-within:ring-ring
                focus-within:ring-offset-2
              "
            >
              <div
                className="
                  flex
                  w-12
                  items-center
                  justify-center
                  border-r
                  bg-muted
                "
              >
                $
              </div>

              <Input
                type="text"
                inputMode="decimal"
                className="
                  h-full
                  flex-1
                  border-0
                  rounded-none
                  shadow-none
                  px-4
                  focus-visible:ring-0
                  focus-visible:ring-offset-0
                "
                {...field}
              />
            </div>
            </FormControl>

            <FormMessage />
          </div>
        </FormItem>
      )}
    />
  );
}

export default FormPriceInput;
