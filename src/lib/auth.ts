import { User } from "@/types/auth.types";
import { ROLES } from "@/constants/roles";

export function isAdmin(user?: User | null) {
  const role = user?.roles?.role;

  return (
    role === ROLES.ADMIN
  );
}

export function isUser(user?: User | null) {
  return user?.roles?.role === ROLES.USER;
}