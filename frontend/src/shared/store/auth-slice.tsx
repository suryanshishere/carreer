import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IUserData } from "models/userModel/IUserData";

interface IAuthSlice {
  isNavAuthClicked: boolean;
  isOtpSent: boolean;
  userData: IUserData;
}

const AUTH_TOKEN_EXPIRY = process.env.REACT_APP_AUTH_TOKEN_EXPIRY || 15;

const initialState: IAuthSlice = {
  isNavAuthClicked: false,
  isOtpSent: false,
  userData: {
    email: "",
    userId: "",
    token: "",
    isEmailVerified: false,
    tokenExpiration: undefined,
    sessionExpireMsg: undefined,
  },
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    handleAuthClick(state, action: PayloadAction<boolean>) {
      state.isNavAuthClicked = action.payload;
    },

    login(
      state,
      action: PayloadAction<{
        email: string;
        userId: string;
        token: string;
        tokenExpiration?: string;
        isEmailVerified: boolean;
      }>
    ) {
      const { email, userId, token, tokenExpiration, isEmailVerified } =
        action.payload;

      if (!email && !userId && !token && isEmailVerified === undefined) return;

      const newTokenExpirationDate = tokenExpiration
        ? new Date(tokenExpiration)
        : new Date(
            new Date().getTime() + 1000 * 60 * Number(AUTH_TOKEN_EXPIRY)
          );

      state.isOtpSent = true;
      state.userData = {
        email,
        userId,
        token,
        tokenExpiration: newTokenExpirationDate.toISOString(),
        isEmailVerified,
      };

      if (isEmailVerified) {
        state.isNavAuthClicked = false;
      }
    },

    logout(state) {
      localStorage.removeItem("userData");
      state.isNavAuthClicked = false;
      state.userData = {
        email: "",
        userId: "",
        token: "",
        isEmailVerified: false,
        tokenExpiration: undefined,
        sessionExpireMsg: undefined,
      };
    },

    updateUserData(state, action: PayloadAction<Partial<IUserData>>) {
      const updatedData = action.payload;
      state.userData = { ...state.userData, ...updatedData };
    },
  },
});

export const { handleAuthClick, login, logout, updateUserData } = authSlice.actions;
export default authSlice.reducer;
