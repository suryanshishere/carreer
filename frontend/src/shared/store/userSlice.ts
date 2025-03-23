import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IRole } from "admin/db";
import { merge } from "lodash";
import {
  ITagKey,
  IUserAccountMode,
  IUserData,
  RecursivePartial,
} from "users/db";

interface IUserSlice extends IUserData {
  isNavAuthClicked: boolean;
  isOtpSent: boolean;
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
      none: true,
    },
  },
  token: "",
  tokenExpiration: "",
  isEmailVerified: false,
  role: "none",
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
        tokenExpiration: string;
        role: IRole;
        mode: IUserAccountMode;
      }>
    ) {
      const { token, tokenExpiration, isEmailVerified, role, mode } =
        action.payload;

      state.mode = merge({}, state.mode, mode);
      state.tokenExpiration = new Date(tokenExpiration).toISOString();
      state.token = token;
      state.isEmailVerified = isEmailVerified;
      state.role = role ?? state.role;
      state.isOtpSent = true;
      if (isEmailVerified) {
        state.isNavAuthClicked = false;
        // window.location.reload();
      }
    },

    logout() {
      return initialState;
    },

    updateUserData(state, action: PayloadAction<RecursivePartial<IUserData>>) {
      return merge(state, action.payload);
    },

    updateMode(
      state,
      action: PayloadAction<RecursivePartial<IUserAccountMode>>
    ) {
      const tags = action.payload.tags;
      state.mode = merge({}, state.mode, action.payload);

      if (tags) {
        if (tags.none) {
          Object.keys(state.mode.tags).forEach((key) => {
            if (key !== "none") {
              state.mode.tags[key as ITagKey] = false;
            }
          });
        } else {
          const anyOtherTrue = Object.entries(state.mode.tags).some(
            ([key, value]) => key !== "none" && value === true
          );
          state.mode.tags.none = !anyOtherTrue;
        }
      }
    },

    handleAccountDeactivatedAt(
      state,
      action: PayloadAction<string | undefined>
    ) {
      state.deactivatedAt = action.payload;
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
