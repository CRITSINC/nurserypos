import Cookies from "js-cookie";

const ROLE_KEY = "role";

export const setRoleCookie = (role: string) => {
  Cookies.set(ROLE_KEY, role, {
    expires: 7,
    sameSite: "strict",
    path: "/",
  });
};

export const getRoleCookie = () => Cookies.get(ROLE_KEY);

export const removeRoleCookie = () => {
  Cookies.remove(ROLE_KEY, {
    path: "/",
  });
};