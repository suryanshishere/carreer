import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IRole } from "admin/db";
import {
  ITagKey,
  IUserAccountMode,
  IUserData,
  RecursivePartial,
} from "users/db";

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
      none: true,
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

      console.log(mode);

      if (mode) {
        state.mode = {
          ...state.mode,
          ...(mode.max !== undefined && { max: mode.max }),
          ...(mode.tags && {
            tags: {
              ...state.mode.tags,
              ...mode.tags,
            },
          }),
        };
      }

      state.userData = {
        ...state.userData,
        ...(token && { token }),
        ...(isEmailVerified !== undefined && { isEmailVerified }),
        tokenExpiration: localTokenExpiration.toISOString(),
        role: role ?? state.userData.role,
      };

      if (!isEmailVerified) {
        state.isOtpSent = true;
        state.isNavAuthClicked = true;
      }
    },

    logout(state) {
      state.isNavAuthClicked = false;
      // state.mode = {
      //   max: false,
      //   tags: {
      //     live: false,
      //     upcoming: false,
      //     released: false,
      //     expiring: false,
      //     none: true,
      //   },
      // };
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
      state.userData = { ...state.userData, ...action.payload };
    },

    updateMode(
      state,
      action: PayloadAction<RecursivePartial<IUserAccountMode>>
    ) {
      const { max, tags } = action.payload;

      // Ensure at least one valid key exists in the payload
      if (max === undefined && (!tags || Object.keys(tags).length === 0)) {
        return; // Ignore empty updates
      }

      // Create a new mode object merging only provided values
      state.mode = {
        ...state.mode,
        ...(max !== undefined && { max }), // Update max only if provided
        ...(tags && { tags: { ...state.mode.tags, ...tags } }), // Update tags only if provided
      };

      // Preserve `none` logic after merging updates
      if (tags) {
        if (tags.none) {
          // If "none" is explicitly set to true, force all other tags to false
          Object.keys(state.mode.tags).forEach((key) => {
            if (key !== "none") {
              state.mode.tags[key as ITagKey] = false;
            }
          });
        } else {
          // If any other tag is true, set "none" to false
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
