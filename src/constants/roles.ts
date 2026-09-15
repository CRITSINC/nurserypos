export const ROLES = {
  USER: "User",
  ADMIN: "Admin"
} as const;

export type Role =
  (typeof ROLES)[keyof typeof ROLES];