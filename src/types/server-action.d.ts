import { Product } from "@/services/products/types";
import { Category } from "@/services/categories/types";
import { Coupon } from "@/services/coupons/types";
import { Customer } from "@/services/customers/types";
import { Staff } from "@/services/staff/types";

type ValidationErrorsResponse = {
  validationErrors: Record<string, string>;
};

type DbErrorResponse = {
  dbError: string;
};

type SuccessResponse = {
  success: boolean;
};

export type ServerActionResponse = DbErrorResponse | SuccessResponse;

export type VServerActionResponse =
  | ValidationErrorsResponse
  | ServerActionResponse;

export type ProductServerActionResponse =
  | ValidationErrorsResponse
  | DbErrorResponse
  | (SuccessResponse & {
      product: Product;
    });

export type CategoryServerActionResponse =
  | ValidationErrorsResponse
  | DbErrorResponse
  | (SuccessResponse & {
      category: Category;
    });

export type CouponServerActionResponse =
  | ValidationErrorsResponse
  | DbErrorResponse
  | (SuccessResponse & {
      coupon: Coupon;
    });

export type CustomerServerActionResponse =
  | ValidationErrorsResponse
  | DbErrorResponse
  | (SuccessResponse & {
      customer: Customer;
    });

export type StaffServerActionResponse =
  | ValidationErrorsResponse
  | DbErrorResponse
  | (SuccessResponse & {
      staff: Staff;
    });

export type ProfileServerActionResponse =
  | ValidationErrorsResponse
  | DbErrorResponse
  | SuccessResponse;
