import { createSlice } from "@reduxjs/toolkit";

const dataStatusUISlice = createSlice({
  name: "response",
  initialState: {
    error: null,
    responseMsg: null,
    jsxResponseMsg: null,
    isLoading: false,
  },
  reducers: {
    setErrorHandler(state, action) {
      state.error = action.payload;
    },

    setResponseHandler(state, action) {
      state.responseMsg = action.payload;
    },

    setJsxResponseHandler(state, action) {
      state.jsxResponseMsg = action.payload;
    },

    isLoadingHandler(state, action) {
      state.isLoading = action.payload;
    },

    clearResponse(state) {
      state.responseMsg = null;
    },
  },
});

export const dataStatusUIAction = dataStatusUISlice.actions;

export default dataStatusUISlice;
