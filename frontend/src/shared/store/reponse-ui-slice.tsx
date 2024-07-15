import { createSlice } from "@reduxjs/toolkit";

const responseUISlice = createSlice({
  name: "response",
  initialState: {
    error: null,
    responseMsg: null,
    isLoading: false,
  },
  reducers: {
    setErrorHandler(state, action) {
      state.error = action.payload;
    },

    setResponseHandler(state, action) {
      state.responseMsg = action.payload;
    },

    isLoadingHandler(state, action) {
      state.isLoading = action.payload;
    },

    clearResponse(state) {
      state.isLoading = false;
      state.error = null;
      state.responseMsg = null;
    },
  },
});

export const responseUIAction = responseUISlice.actions;

export default responseUISlice;
