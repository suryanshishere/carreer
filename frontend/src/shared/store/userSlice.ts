import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { merge } from "lodash";
import { IRole } from "admin/db";
import { IUserAccountMode, IUserData, RecursivePartial } from "users/db";

interface IUserSlice {
  isNavAuthClicked: boolean;
  isOtpSent: boolean;
  userData: IUserData;
  mode: IUserAccountMode;
}

const AUTH_TOKEN_EXPIRY = process.env.REACT_APP_AUTH_TOKEN_EXPIRY || 15;
// const NAV_ACCOUNT_DEFAULT_DP =
//   process.env.REACT_APP_NAV_ACCOUNT_DEFAULT_DP ||
//   "https://img.freepik.com/free-photo/background_53876-32170.jpg?t=st=1732070280~exp=1732073880~hmac=f3b7e7a5ee6cef8bc932b0f3595f7d90864f64a12871da125d205ef3559a0208&w=996";

const initialState: IUserSlice = {
  isNavAuthClicked: false,
  isOtpSent: false,
  mode: {
    max: false,
    tags: {
      live: false,
      upcoming: false,
      released: false,
      expiring: false,
      visited: false,
    },
  },
  userData: {
    token: "",
    isEmailVerified: false,
    role: "none",
  },
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    handleAuthClick(state, action: PayloadAction<boolean>) {
      state.isNavAuthClicked = action.payload;
    },

    login(
      state,
      action: PayloadAction<{
        token: string;
        isEmailVerified: boolean;
        tokenExpiration?: string;
        role: IRole;
        mode: IUserAccountMode;
      }>
    ) {
      const { token, tokenExpiration, isEmailVerified, role, mode } =
        action.payload;

      if (!token && isEmailVerified === undefined) return;

      const localTokenExpiration = tokenExpiration
        ? new Date(tokenExpiration)
        : new Date(
            new Date().getTime() + 1000 * 60 * Number(AUTH_TOKEN_EXPIRY)
          );

      state.isOtpSent = true;
      state.mode = merge({}, state.mode, mode);
      //this just update the required (same as updateUserData)
      state.userData = merge({}, state.userData, {
        token,
        isEmailVerified,
        tokenExpiration: localTokenExpiration.toISOString(),
        role: role ?? state.userData.role,
      });

      if (isEmailVerified) {
        state.isNavAuthClicked = false;
        // window.location.reload();
      }
    },

    logout(state) {
      state.isNavAuthClicked = false;
      state.mode = {
        max: false,
        tags: {
          live: false,
          upcoming: false,
          released: false,
          expiring: false,
          visited: false,
        },
      };
      state.userData = {
        token: "",
        isEmailVerified: false,
        tokenExpiration: undefined,
        role: "none",
        deactivatedAt: undefined,
        sessionExpireMsg: undefined,
      };
      // window.location.reload();
    },

    updateUserData(state, action: PayloadAction<RecursivePartial<IUserData>>) {
      state.userData = merge({}, state.userData, action.payload);
    },

    updateMode(
      state,
      action: PayloadAction<RecursivePartial<IUserAccountMode>>
    ) {
      state.mode = merge({}, state.mode, action.payload);
    },

    handleAccountDeactivatedAt(
      state,
      action: PayloadAction<string | undefined>
    ) {
      state.userData.deactivatedAt = action.payload;
    },
  },
});

export const {
  handleAuthClick,
  login,
  logout,
  updateUserData,
  updateMode,
  handleAccountDeactivatedAt,
} = userSlice.actions;

export default userSlice.reducer;
