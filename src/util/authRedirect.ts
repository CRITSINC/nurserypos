import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { User } from "@/types/auth.types";

export const redirectUser = (
  router: AppRouterInstance,
  user: User
) => {
  const role = user.roles?.role;

  switch (role) {
    case "Admin":
      router.replace("/admin");
      break;

    default:
      router.replace("/");
  }
};