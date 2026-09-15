import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { AuthState, User } from "@/types/auth.types";

const getStoredUser = (): User | null => {
  if (typeof window === "undefined") return null;

  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

const initialState: AuthState = {
  accessToken:
    typeof window !== "undefined"
      ? localStorage.getItem("accessToken")
      : null,

  user: getStoredUser(),
};

const authSlice = createSlice({
  name: "auth",

  initialState,

  reducers: {
    setCredentials(
      state,
      action: PayloadAction<{
        accessToken: string;
        user: User;
      }>
    ) {
      state.accessToken = action.payload.accessToken;
      state.user = action.payload.user;

      if (typeof window !== "undefined") {
        localStorage.setItem(
          "accessToken",
          action.payload.accessToken
        );

        localStorage.setItem(
          "user",
          JSON.stringify(action.payload.user)
        );
      }
    },

    updateUser(
      state,
      action: PayloadAction<User>
    ) {
      state.user = action.payload;

      if (typeof window !== "undefined") {
        localStorage.setItem(
          "user",
          JSON.stringify(action.payload)
        );
      }
    },

    updateAccessToken(
      state,
      action: PayloadAction<string>
    ) {
      state.accessToken = action.payload;

      if (typeof window !== "undefined") {
        localStorage.setItem(
          "accessToken",
          action.payload
        );
      }
    },

    clearAuth(state) {
      state.accessToken = null;
      state.user = null;

      if (typeof window !== "undefined") {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");
      }
    },
  },
});

export const {
  setCredentials,
  updateUser,
  updateAccessToken,
  clearAuth,
} = authSlice.actions;

export const isAuthenticated = (state: RootState) =>
  !!state.auth.accessToken;

export default authSlice.reducer;