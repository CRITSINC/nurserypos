export const getErrorMessage = (errorCode: string): string => {
  switch (errorCode) {
    case "ERR_EMAIL_ALREADY_EXIST":
      return "Sorry, that email address is already used!";

    case "ERR_WRONG_PASSWORD":
      return "Wrong Password";

    case "ERR_AUTH_WRONG_TOKEN":
      return "Token Expired";

    case "ERR_USER_NOT_FOUND":
      return "User not Found";

    case "ERR_ACCOUNT_NOT_VERIFIED":
      return "User not verified yet";

    case "ERR_TOKEN_GENERATE_FAILED":
      return "Token Generation Failed";

    case "User is already activated":
      return "You can Login Direct. Your Account is Verified Already!";

    case "Verification Token is Invalid":
      return "Verification Token is Invalid";

    case "Verification Token is Expired":
      return "Token Expired";

    case "ERR_HANDLE_ALREADY_EXIST":
      return "Handle has already been taken";

    /*
     * Authentication
     */
    case "ERR_AUTH_WRONG_EMAIL":
      return "Email does not exist.";

    case "ERR_AUTH_WRONG_PASSWORD":
      return "Incorrect password.";

    case "ERR_AUTH_USER_NOT_ACTIVE":
      return "Your account is inactive.";

    case "ERR_AUTH_WRONG_USERNAME_OR_PASSWORD":
      return "Wrong email or password.";

    /*
     * User / Account
     */
    case "ERR_AUTH_USERNAME_OR_EMAIL_ALREADY_EXIST":
      return "Email already exists.";

    /*
     * Password Reset
     */
    case "ERR_AUTH_PASSWORD_RESET_WRONG_EMAIL":
      return "Email does not exist.";

    case "ERR_AUTH_WRONG_PASSWORD_RESET_TOKEN":
      return "Password reset token has expired.";

    case "ERR_AUTH_RESET_TOKEN_INVALID":
      return "Password reset token has expired.";

    /*
     * Validation
     */
    case "ERR_VALIDATION_FAILED":
      return "Validation Error";

    default:
      return "An unexpected error occurred. Please try again.";
  }
};