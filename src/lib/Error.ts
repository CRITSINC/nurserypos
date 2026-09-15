import { getErrorMessage } from "./errorMessages";

export interface IErrorHandler {
  refresh?: boolean;
  toast?: string;
  snackBar?: string;
  validation?: boolean;
  signOut?: boolean;
}

const refresh = (): IErrorHandler => ({
  refresh: true,
});

const signOut = (): IErrorHandler => ({
  signOut: true,
});

const toast = (message: string): IErrorHandler => ({
  toast: message,
});

export const errorCodes: Record<string, IErrorHandler> = {
  /*
   * Token Errors
   */
  ERR_INVALID_TOKEN: refresh(),
  ERR_AUTH_TOKEN_MISSING: refresh(),
  ERR_ACCESS_TOKEN_MISSING: refresh(),
  ERR_ACCESS_TOKEN_EXPIRED: refresh(),
  ERR_AUTH_TOKEN_EXPIRED: refresh(),
  ERR_INVALID_ACCESS_TOKEN: refresh(),

  /*
   * Refresh Token Errors
   */
  ERR_AUTH_WRONG_REFRESH_TOKEN: signOut(),
  ERR_AUTH_REFRESH_EXPIRED: signOut(),

  /*
   * Authentication Errors
   */
  ERR_AUTH_WRONG_EMAIL: toast(
    getErrorMessage("ERR_AUTH_WRONG_EMAIL")
  ),

  ERR_AUTH_WRONG_PASSWORD: toast(
    getErrorMessage("ERR_AUTH_WRONG_PASSWORD")
  ),

  ERR_AUTH_WRONG_USERNAME_OR_PASSWORD: toast(
    getErrorMessage("ERR_AUTH_WRONG_USERNAME_OR_PASSWORD")
  ),

  ERR_AUTH_USER_NOT_ACTIVE: toast(
    getErrorMessage("ERR_AUTH_USER_NOT_ACTIVE")
  ),

  /*
   * User / Account Errors
   */
  ERR_AUTH_USERNAME_OR_EMAIL_ALREADY_EXIST: toast(
    getErrorMessage("ERR_AUTH_USERNAME_OR_EMAIL_ALREADY_EXIST")
  ),

  /*
   * Password Reset Errors
   */
  ERR_AUTH_PASSWORD_RESET_WRONG_EMAIL: toast(
    getErrorMessage("ERR_AUTH_PASSWORD_RESET_WRONG_EMAIL")
  ),

  ERR_AUTH_WRONG_PASSWORD_RESET_TOKEN: toast(
    getErrorMessage("ERR_AUTH_WRONG_PASSWORD_RESET_TOKEN")
  ),

  ERR_AUTH_RESET_TOKEN_INVALID: toast(
    getErrorMessage("ERR_AUTH_RESET_TOKEN_INVALID")
  ),

  /*
   * Other Errors
   */
  ERR_NOT_AUTHORIZED: toast("Not authorized"),

  ERR_PAYMENT_FAILED: toast("Payment failed"),

  ERR_WRONG_COUPON: toast("Coupon is invalid"),

  ERR_VALIDATION: toast("Validation Error"),
};

/**
 * Gets the actual API payload.
 *
 * RTK Query error:
 *
 * {
 *   status: 400,
 *   data: {
 *     success: false,
 *     data: null,
 *     error: {
 *       code: "ERR_AUTH_WRONG_PASSWORD"
 *     }
 *   }
 * }
 */
function getApiPayload(res: any): any {
  // RTK Query response
  if (res?.data?.error?.code) {
    return res.data;
  }

  // Direct API response
  if (res?.error?.code) {
    return res;
  }

  return null;
}

function handle(res: any): IErrorHandler {
  const apiPayload = getApiPayload(res);

  if (!apiPayload?.error?.code) {
    return {
      toast: "Something went wrong.",
    };
  }

  const errorCode = apiPayload.error.code;

  /*
   * Validation errors
   *
   * Example:
   *
   * {
   *   success: false,
   *   data: {
   *     errors: [
   *       {
   *         msg: "Password must be at least 6 characters long"
   *       }
   *     ]
   *   },
   *   error: {
   *     code: "ERR_VALIDATION_FAILED"
   *   }
   * }
   */
  if (errorCode === "ERR_VALIDATION_FAILED") {
    const validationErrors = apiPayload?.data?.errors;

    if (
      Array.isArray(validationErrors) &&
      validationErrors.length > 0
    ) {
      const message = validationErrors
        .map((error: any) => error?.msg)
        .filter(Boolean)
        .join(", ");

      if (message) {
        return {
          toast: message,
          validation: true,
        };
      }
    }

    return {
      toast: getErrorMessage(errorCode),
      validation: true,
    };
  }

  /*
   * Known error code
   */
  const action = errorCodes[errorCode];

  if (action) {
    return action;
  }

  /*
   * Unknown error code
   */
  return {
    toast: getErrorMessage(errorCode),
  };
}

export default {
  handle,
};